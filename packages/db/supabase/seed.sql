-- ============================================
-- SEED DATA - OMNI OBJECTIONS
-- ============================================

-- Inserir usuários de exemplo
INSERT INTO public.users (id, email, name, role) VALUES
  ('00000000-0000-0000-0000-000000000001', 'admin@areluna.com', 'Admin Areluna', 'admin'),
  ('00000000-0000-0000-0000-000000000002', 'comercial1@areluna.com', 'João Silva', 'comercial'),
  ('00000000-0000-0000-0000-000000000003', 'comercial2@areluna.com', 'Maria Santos', 'comercial')
ON CONFLICT (id) DO NOTHING;

-- Inserir objeções comuns
INSERT INTO public.objections (keyword, category, patterns, default_reply, priority) VALUES
  (
    'muito caro',
    'price',
    ARRAY['é muito caro', 'está caro', 'preço alto', 'não tenho dinheiro', 'é muito'],
    'Entendo perfeitamente sua preocupação com o investimento. O que poucos sabem é que nossos tratamentos incluem acompanhamento completo e resultados garantidos. Posso mostrar um case de sucesso similar ao seu?',
    100
  ),
  (
    'preciso pensar',
    'timing',
    ARRAY['preciso pensar', 'vou pensar', 'deixa eu ver', 'conversar com', 'não estou pronta'],
    'Claro! É uma decisão importante. Posso esclarecer alguma dúvida específica que te ajudaria a decidir com mais segurança? Muitos clientes tinham a mesma dúvida que você.',
    90
  ),
  (
    'já tenho clínica',
    'competition',
    ARRAY['já faço em outro lugar', 'já tenho clínica', 'já sou cliente de', 'faço na concorrência'],
    'Que bom que você já cuida da sua saúde! Posso perguntar o que você mais valoriza no seu tratamento atual? Nossos diferenciais são [X, Y, Z]. Muitos clientes nos escolhem justamente por isso.',
    85
  ),
  (
    'não conheço',
    'trust',
    ARRAY['não conheço', 'nunca ouvi falar', 'é confiável', 'tem certificação'],
    'Ótima pergunta! A Clínica Areluna está no mercado há X anos, com [certificações]. Temos mais de [número] clientes satisfeitos. Posso compartilhar alguns depoimentos?',
    80
  ),
  (
    'não preciso',
    'need',
    ARRAY['não preciso', 'não tenho esse problema', 'não é pra mim', 'não me interessa'],
    'Entendo. Só para ter certeza que estou te oferecendo a melhor opção: você já teve [problema específico]? Muitos clientes só descobriram a necessidade após uma avaliação gratuita.',
    75
  )
ON CONFLICT DO NOTHING;

-- Inserir itens de conhecimento - Serviços
INSERT INTO public.knowledge_items (type, title, content, metadata) VALUES
  (
    'service',
    'Consulta Dermatológica',
    'Consulta completa com dermatologista especializado. Inclui anamnese detalhada, exame físico, dermatoscopia digital e prescrição personalizada.',
    '{"price": 350.00, "duration": "60 minutos", "category": "Consultas", "tags": ["consulta", "dermatologia", "avaliação"]}'::jsonb
  ),
  (
    'service',
    'Limpeza de Pele Profunda',
    'Limpeza de pele com extração de cravos, esfoliação, máscara calmante e hidratação. Indicado para todos os tipos de pele.',
    '{"price": 180.00, "duration": "90 minutos", "category": "Estética", "tags": ["limpeza", "pele", "estética"]}'::jsonb
  ),
  (
    'service',
    'Peeling Químico',
    'Tratamento de renovação celular com ácidos específicos para cada tipo de pele. Reduz manchas, acne e sinais de envelhecimento.',
    '{"price": 450.00, "duration": "45 minutos", "category": "Tratamentos", "tags": ["peeling", "renovação", "manchas"]}'::jsonb
  )
ON CONFLICT DO NOTHING;

-- Inserir itens de conhecimento - Tratamentos
INSERT INTO public.knowledge_items (type, title, content, metadata) VALUES
  (
    'treatment',
    'Tratamento para Acne',
    'Protocolo completo com limpeza, medicação tópica/oral, peeling e laser. Resultados visíveis em 3-4 semanas. Indicado para acne leve a severa.',
    '{"duration": "3-6 meses", "sessions": "8-12 sessões", "category": "Dermatologia", "tags": ["acne", "pele oleosa", "tratamento"]}'::jsonb
  ),
  (
    'treatment',
    'Harmonização Facial',
    'Procedimento com ácido hialurônico para volumização e contorno facial. Realizado por médico especializado. Resultados naturais e duradouros.',
    '{"duration": "12-18 meses", "category": "Estética Avançada", "tags": ["harmonização", "preenchimento", "ácido hialurônico"]}'::jsonb
  )
ON CONFLICT DO NOTHING;

-- Inserir FAQs
INSERT INTO public.knowledge_items (type, title, content, metadata) VALUES
  (
    'faq',
    'Quanto tempo dura cada sessão?',
    'O tempo varia de acordo com o procedimento: consultas duram 30-60min, limpezas de pele 90min, e procedimentos estéticos entre 30-120min. Informamos o tempo exato no agendamento.',
    '{"category": "Agendamento", "tags": ["tempo", "duração", "sessão"]}'::jsonb
  ),
  (
    'faq',
    'Vocês aceitam planos de saúde?',
    'Trabalhamos com os principais planos: Unimed, Bradesco Saúde, SulAmérica e Amil. Para procedimentos estéticos, oferecemos parcelamento em até 12x sem juros.',
    '{"category": "Pagamento", "tags": ["plano de saúde", "pagamento", "parcelamento"]}'::jsonb
  ),
  (
    'faq',
    'Preciso de indicação médica?',
    'Para consultas dermatológicas não é necessário. Para procedimentos estéticos, é obrigatória uma avaliação prévia com nosso médico especialista.',
    '{"category": "Requisitos", "tags": ["indicação", "requisitos", "avaliação"]}'::jsonb
  )
ON CONFLICT DO NOTHING;

-- Inserir promoções
INSERT INTO public.knowledge_items (type, title, content, metadata) VALUES
  (
    'promotion',
    'Pacote Verão 2024',
    'Aproveite nosso pacote especial: 3 sessões de limpeza de pele + 1 peeling por R$ 799 (valor normal R$ 990). Válido até 31/03/2024.',
    '{"price": 799.00, "discount": "19%", "effectiveFrom": "2024-01-01", "effectiveUntil": "2024-03-31", "tags": ["promoção", "pacote", "verão"]}'::jsonb
  ),
  (
    'promotion',
    'Primeira Consulta com Desconto',
    'Para novos pacientes: consulta dermatológica + dermatoscopia por R$ 250 (valor normal R$ 350). Use o código BEMVINDO.',
    '{"price": 250.00, "discount": "28%", "code": "BEMVINDO", "tags": ["promoção", "primeira consulta", "novos clientes"]}'::jsonb
  )
ON CONFLICT DO NOTHING;

-- Inserir políticas
INSERT INTO public.knowledge_items (type, title, content, metadata) VALUES
  (
    'policy',
    'Política de Cancelamento',
    'Cancelamentos devem ser feitos com no mínimo 24h de antecedência. Cancelamentos de última hora ou faltas sem aviso prévio serão cobrados 50% do valor da sessão.',
    '{"category": "Cancelamento", "tags": ["cancelamento", "política", "agendamento"]}'::jsonb
  ),
  (
    'policy',
    'Política de Reembolso',
    'Reembolsos são processados em até 7 dias úteis. Para pacotes, o reembolso é proporcional às sessões não utilizadas, respeitando o prazo de validade.',
    '{"category": "Reembolso", "tags": ["reembolso", "devolução", "política"]}'::jsonb
  )
ON CONFLICT DO NOTHING;

-- Verificação
SELECT 'Seed data inserido com sucesso!' as status;
SELECT 'Usuários: ' || COUNT(*)::TEXT FROM public.users;
SELECT 'Objeções: ' || COUNT(*)::TEXT FROM public.objections;
SELECT 'Conhecimento: ' || COUNT(*)::TEXT FROM public.knowledge_items;

