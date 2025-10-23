/**
 * Respostas de demonstração do Assistente
 * Para testes sem OpenAI API Key
 */

export const DEMO_RESPONSES: Record<string, string> = {
  'muito caro': `Entendo sua preocupação com o investimento! Nossa consulta de R$ 350 inclui não apenas a avaliação completa com dermatologista especializado, mas também dermatoscopia digital de última geração e um plano de tratamento totalmente personalizado. Além disso, oferecemos parcelamento em até 6x sem juros. Muitos pacientes percebem o valor real quando veem o cuidado completo que recebem.`,

  'preço alto': `Eu compreendo perfeitamente! O valor pode parecer alto inicialmente, mas veja só: nossa equipe é composta por dermatologistas com especialização e anos de experiência. Usamos produtos premium certificados pela Anvisa, e você tem acompanhamento completo incluído no valor. Pense como um investimento na sua saúde e autoestima. Além disso, temos condições especiais de pagamento que podem ajudar.`,

  'preciso pensar': `Claro, é uma decisão importante e você deve se sentir seguro! Que tal eu te mandar por WhatsApp alguns resultados de antes e depois de pacientes que fizeram o mesmo tratamento? Também posso agendar uma consulta sem compromisso para você conhecer nossa clínica e tirar todas as suas dúvidas pessoalmente. Ah, e temos uma promoção especial válida até o final desta semana!`,

  'outra clínica': `Ótimo que você está pesquisando! É super importante comparar. A diferença está na qualidade e segurança: nossos equipamentos são de última geração, nossos médicos são especializados e certificados, e todos os produtos são originais e aprovados. Já atendemos mais de 5.000 pacientes com 98% de satisfação. Além disso, oferecemos garantia e acompanhamento completo. Vale muito mais a pena investir com segurança, não é mesmo?`,

  'não consigo pagar': `Entendo perfeitamente sua situação! Temos algumas alternativas que podem ajudar: parcelamento em até 10x sem juros no cartão, desconto de 5% para pagamento à vista no PIX, ou podemos montar um plano personalizado começando com os tratamentos mais prioritários. O importante é cuidar da sua saúde sem comprometer seu orçamento. Que tal conversarmos sobre qual opção funciona melhor para você?`,

  'tenho medo': `É completamente normal ter receio, e eu agradeço por compartilhar isso! Nossos procedimentos são todos minimamente invasivos e realizados por médicos especialistas. Usamos anestesia quando necessário e acompanhamos você em cada etapa. Mais de 95% dos nossos pacientes relatam que o procedimento foi muito mais tranquilo do que imaginavam. Posso agendar uma consulta para você conhecer o médico e a clínica pessoalmente antes de decidir?`,

  'resultado artificial': `Excelente preocupação! Nossa filosofia é exatamente essa: resultados naturais e harmoniosos. Não queremos que você fique com aspecto artificial, queremos realçar sua beleza natural! Trabalhamos com técnicas conservadoras e sutis. Podemos começar com um volume moderado e, se você quiser, aumentar gradualmente nas próximas sessões. O ácido hialurônico que usamos é reversível, então temos total controle do resultado.`,

  'marido não vai gostar': `Entendo sua preocupação! Na verdade, a maioria dos parceiros fica muito satisfeito com os resultados porque eles são naturais e harmoniosos. O objetivo não é mudar quem você é, mas realçar sua beleza e aumentar sua autoconfiança. Que tal mostrar algumas fotos de antes e depois para ele? Muitas vezes quando eles veem os resultados discretos e bonitos, ficam super apoiadores. E no final, o mais importante é você se sentir bem consigo mesma!`,
};

export function getDemoResponse(objectionText: string): string {
  const lowerText = objectionText.toLowerCase();

  // Buscar por palavras-chave
  for (const [keyword, response] of Object.entries(DEMO_RESPONSES)) {
    if (lowerText.includes(keyword)) {
      return response;
    }
  }

  // Resposta padrão
  return `Entendo sua preocupação! É muito importante que você se sinta confortável e seguro com sua decisão. Nossa equipe da Clínica Areluna está aqui para esclarecer todas as suas dúvidas e encontrar a melhor solução para você. Temos mais de 10 anos de experiência, médicos especializados, e mais de 5.000 pacientes satisfeitos. Que tal agendarmos uma consulta sem compromisso para conversarmos pessoalmente?`;
}

export const DEMO_ASSISTANT_INFO = {
  id: 'asst_7RhlVBzVzK2AEKo0i9pPO67N',
  name: 'Assistente Areluna (Modo Demo)',
  model: 'gpt-4-turbo-preview',
  instructions: 'Especialista em vendas da Clínica Areluna...',
  tools: ['retrieval', 'function'],
  mode: 'DEMO',
  message: 'Rodando em modo demonstração. Configure OPENAI_API_KEY para usar a API real.',
};

