import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, Mic, Brain, TrendingUp } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">OmniObjections</h1>
          </div>
          <Link href="/dashboard">
            <Button>Acessar Dashboard</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Inteligência em Tempo Real para suas Vendas
        </h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Sistema inteligente que ouve suas videochamadas comerciais e sugere respostas perfeitas
          para cada objeção do cliente.
        </p>
        <Link href="/call">
          <Button size="lg" className="text-lg px-8 py-6">
            <Phone className="mr-2 h-5 w-5" />
            Iniciar Chamada
          </Button>
        </Link>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <Mic className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Transcrição em Tempo Real</CardTitle>
              <CardDescription>
                Converte automaticamente suas conversas em texto, identificando quem fala e quando.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Brain className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Detecção de Objeções</CardTitle>
              <CardDescription>
                IA identifica objeções do cliente instantaneamente usando processamento de linguagem
                natural avançado.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <TrendingUp className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Sugestões Inteligentes</CardTitle>
              <CardDescription>
                Receba respostas contextuais baseadas na base de conhecimento da Clínica Areluna.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* How it Works */}
      <section className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center mb-12">Como Funciona</h3>
        <div className="max-w-3xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>1. Inicie sua chamada</CardTitle>
              <CardDescription>
                Conecte-se com seu lead através da plataforma integrada ou use sua ferramenta
                preferida.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. O sistema escuta e transcreve</CardTitle>
              <CardDescription>
                Nossa IA processa o áudio em tempo real, transcrevendo e analisando cada palavra.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Receba sugestões instantâneas</CardTitle>
              <CardDescription>
                Quando uma objeção é detectada, você recebe sugestões de resposta na hora, com
                informações relevantes da base de conhecimento.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Feche mais vendas</CardTitle>
              <CardDescription>
                Use as sugestões para responder com confiança e converter mais leads em clientes
                satisfeitos.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Card className="max-w-2xl mx-auto bg-primary text-primary-foreground">
          <CardContent className="pt-6">
            <h3 className="text-3xl font-bold mb-4">Pronto para aumentar suas vendas?</h3>
            <p className="text-lg mb-6 opacity-90">
              Junte-se à equipe Areluna e tenha IA trabalhando a seu favor.
            </p>
            <Link href="/call">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                Começar Agora
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 mt-20">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 Grupo Areluna. Todos os direitos reservados.</p>
        </div>
      </footer>
    </main>
  );
}

