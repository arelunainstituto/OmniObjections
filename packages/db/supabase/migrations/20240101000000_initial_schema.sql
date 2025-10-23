-- ============================================
-- OMNI OBJECTIONS - SCHEMA INICIAL
-- Sistema de Suporte a Videochamadas Comerciais
-- Grupo Areluna
-- ============================================

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================
-- TABELA: users
-- ============================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'comercial', 'suporte')),
  avatar TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_role ON public.users(role);

-- ============================================
-- TABELA: calls
-- ============================================
CREATE TABLE IF NOT EXISTS public.calls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  agent_name TEXT NOT NULL,
  lead_name TEXT NOT NULL,
  lead_email TEXT,
  lead_phone TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'cancelled')),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  transcript JSONB DEFAULT '[]'::jsonb,
  summary TEXT,
  suggestions TEXT[] DEFAULT ARRAY[]::TEXT[],
  metrics JSONB,
  outcome TEXT CHECK (outcome IN ('success', 'follow_up', 'rejected', 'no_show')),
  notes TEXT,
  recording_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_calls_agent_id ON public.calls(agent_id);
CREATE INDEX idx_calls_status ON public.calls(status);
CREATE INDEX idx_calls_started_at ON public.calls(started_at DESC);
CREATE INDEX idx_calls_transcript_gin ON public.calls USING GIN (transcript);

-- ============================================
-- TABELA: objections
-- ============================================
CREATE TABLE IF NOT EXISTS public.objections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  keyword TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('price', 'timing', 'competition', 'trust', 'need', 'authority', 'other')),
  patterns TEXT[] NOT NULL,
  default_reply TEXT NOT NULL,
  priority INTEGER DEFAULT 50,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_objections_category ON public.objections(category);
CREATE INDEX idx_objections_keyword ON public.objections USING GIN (keyword gin_trgm_ops);
CREATE INDEX idx_objections_active ON public.objections(active);

-- ============================================
-- TABELA: knowledge_items
-- ============================================
CREATE TABLE IF NOT EXISTS public.knowledge_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL CHECK (type IN ('service', 'treatment', 'faq', 'promotion', 'policy')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB,
  search_vector TSVECTOR,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_knowledge_type ON public.knowledge_items(type);
CREATE INDEX idx_knowledge_active ON public.knowledge_items(active);
CREATE INDEX idx_knowledge_search ON public.knowledge_items USING GIN (search_vector);
CREATE INDEX idx_knowledge_title_trgm ON public.knowledge_items USING GIN (title gin_trgm_ops);

-- Trigger para atualizar search_vector automaticamente
CREATE OR REPLACE FUNCTION update_knowledge_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('portuguese', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('portuguese', COALESCE(NEW.content, '')), 'B');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_knowledge_search_vector
BEFORE INSERT OR UPDATE ON public.knowledge_items
FOR EACH ROW
EXECUTE FUNCTION update_knowledge_search_vector();

-- ============================================
-- TABELA: suggestions
-- ============================================
CREATE TABLE IF NOT EXISTS public.suggestions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  call_id UUID NOT NULL REFERENCES public.calls(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('objection_response', 'information', 'next_step', 'warning')),
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  objection TEXT,
  objection_category TEXT,
  suggestion TEXT NOT NULL,
  sources JSONB DEFAULT '[]'::jsonb,
  confidence DECIMAL(3,2) CHECK (confidence >= 0 AND confidence <= 1),
  used BOOLEAN DEFAULT false,
  feedback TEXT CHECK (feedback IN ('helpful', 'not_helpful')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_suggestions_call_id ON public.suggestions(call_id);
CREATE INDEX idx_suggestions_type ON public.suggestions(type);
CREATE INDEX idx_suggestions_timestamp ON public.suggestions(timestamp);
CREATE INDEX idx_suggestions_used ON public.suggestions(used);

-- ============================================
-- FUNÇÕES AUXILIARES
-- ============================================

-- Função para buscar conhecimento por texto
CREATE OR REPLACE FUNCTION search_knowledge(
  search_query TEXT,
  item_type TEXT DEFAULT NULL,
  result_limit INTEGER DEFAULT 10,
  include_inactive BOOLEAN DEFAULT false
)
RETURNS SETOF public.knowledge_items AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM public.knowledge_items
  WHERE 
    (item_type IS NULL OR type = item_type)
    AND (include_inactive OR active = true)
    AND (
      search_vector @@ plainto_tsquery('portuguese', search_query)
      OR title ILIKE '%' || search_query || '%'
      OR content ILIKE '%' || search_query || '%'
    )
  ORDER BY 
    ts_rank(search_vector, plainto_tsquery('portuguese', search_query)) DESC
  LIMIT result_limit;
END;
$$ LANGUAGE plpgsql;

-- Função para obter métricas de um agente
CREATE OR REPLACE FUNCTION get_agent_metrics(agent_uuid UUID)
RETURNS TABLE (
  total_calls BIGINT,
  active_calls BIGINT,
  completed_calls BIGINT,
  average_duration INTERVAL,
  success_rate DECIMAL,
  total_objections BIGINT,
  total_suggestions BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT as total_calls,
    COUNT(*) FILTER (WHERE status = 'active')::BIGINT as active_calls,
    COUNT(*) FILTER (WHERE status = 'completed')::BIGINT as completed_calls,
    AVG(ended_at - started_at) FILTER (WHERE ended_at IS NOT NULL) as average_duration,
    ROUND(
      COUNT(*) FILTER (WHERE outcome = 'success')::DECIMAL / 
      NULLIF(COUNT(*) FILTER (WHERE status = 'completed'), 0),
      2
    ) as success_rate,
    SUM(jsonb_array_length(transcript)) FILTER (WHERE transcript IS NOT NULL)::BIGINT as total_objections,
    SUM(array_length(suggestions, 1)) FILTER (WHERE suggestions IS NOT NULL)::BIGINT as total_suggestions
  FROM public.calls
  WHERE agent_id = agent_uuid;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- RLS (Row Level Security)
-- ============================================

-- Habilitar RLS nas tabelas
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.objections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suggestions ENABLE ROW LEVEL SECURITY;

-- Policies para users
CREATE POLICY "Usuários podem ver seus próprios dados"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins podem ver todos os usuários"
  ON public.users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Policies para calls
CREATE POLICY "Usuários podem ver suas próprias chamadas"
  ON public.calls FOR SELECT
  USING (auth.uid() = agent_id);

CREATE POLICY "Usuários podem criar chamadas"
  ON public.calls FOR INSERT
  WITH CHECK (auth.uid() = agent_id);

CREATE POLICY "Usuários podem atualizar suas próprias chamadas"
  ON public.calls FOR UPDATE
  USING (auth.uid() = agent_id);

-- Policies para objections (todos podem ler)
CREATE POLICY "Todos podem ver objeções ativas"
  ON public.objections FOR SELECT
  USING (active = true);

-- Policies para knowledge_items (todos podem ler)
CREATE POLICY "Todos podem ver conhecimento ativo"
  ON public.knowledge_items FOR SELECT
  USING (active = true);

-- Policies para suggestions
CREATE POLICY "Usuários podem ver sugestões de suas chamadas"
  ON public.suggestions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.calls
      WHERE id = call_id AND agent_id = auth.uid()
    )
  );

-- ============================================
-- TRIGGERS PARA UPDATED_AT
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_calls_updated_at
  BEFORE UPDATE ON public.calls
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_objections_updated_at
  BEFORE UPDATE ON public.objections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_knowledge_updated_at
  BEFORE UPDATE ON public.knowledge_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- COMENTÁRIOS
-- ============================================

COMMENT ON TABLE public.users IS 'Usuários do sistema (admins, comerciais, suporte)';
COMMENT ON TABLE public.calls IS 'Chamadas comerciais com transcrições e métricas';
COMMENT ON TABLE public.objections IS 'Objeções conhecidas e respostas padrão';
COMMENT ON TABLE public.knowledge_items IS 'Base de conhecimento da clínica Areluna';
COMMENT ON TABLE public.suggestions IS 'Sugestões geradas durante as chamadas';

