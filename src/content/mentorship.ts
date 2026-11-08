export const audienceCards = [
  {
    icon: "recurring",
    title: "Depende de comissões",
    text: "O faturamento muda todo mês porque ainda não existe uma carteira recorrente consolidada.",
  },
  {
    icon: "target",
    title: "Capta sem método",
    text: "Os imóveis chegam por indicação ou oportunidades isoladas, sem uma estratégia comercial definida.",
  },
  {
    icon: "structure",
    title: "Centraliza a operação",
    text: "Tudo passa pelo proprietário, e o crescimento fica limitado ao tempo disponível.",
  },
  {
    icon: "growth",
    title: "Quer crescer com estrutura",
    text: "Existe vontade de ampliar a carteira, mas faltam processos, equipe e organização para sustentar esse crescimento.",
  },
] as const;

export const program = [
  {
    title: "Gestão e estrutura",
    subtitle: "Uma base sólida para o seu negócio.",
    items: [
      {
        title: "Estruturação de equipe",
        text: "Definição de funções, responsabilidades e organização do time.",
      },
      {
        title: "Missão e visão",
        text: "Direcionamento estratégico para orientar decisões e crescimento.",
      },
      {
        title: "Plano de negócio",
        text: "Planejamento de metas, operação, custos e prioridades.",
      },
    ],
  },
  {
    title: "Processos e segurança",
    subtitle: "Mais clareza na rotina da locação.",
    items: [
      {
        title: "Modelos de contratos",
        text: "Documentos e estruturas que dão suporte à administração de aluguel.",
      },
      {
        title: "Gerenciamento de conflitos",
        text: "Como lidar com situações envolvendo proprietários, inquilinos e equipe.",
      },
      {
        title: "Lei do Inquilinato",
        text: "Fundamentos jurídicos aplicados à rotina da locação.",
      },
    ],
  },
  {
    title: "Comercial e crescimento",
    subtitle: "Uma operação preparada para crescer.",
    items: [
      {
        title: "Estratégia de captação",
        text: "Rotina e posicionamento para conquistar novos imóveis.",
      },
      {
        title: "Ganhos além da taxa",
        text: "Oportunidades de ampliar a receita da carteira administrada.",
      },
      {
        title: "Sistemas para locação",
        text: "Ferramentas e organização para melhorar o controle da operação.",
      },
    ],
  },
];

export const programCards = [
  {
    title: "Equipe e direção do negócio",
    items: [program[0].items[0], program[0].items[1]],
  },
  { title: "Plano de negócio e metas", items: [program[0].items[2]] },
  {
    title: "Contratos e segurança na locação",
    items: [program[1].items[0], program[1].items[2]],
  },
  { title: "Gestão de conflitos e atendimento", items: [program[1].items[1]] },
  {
    title: "Captação com método e novas receitas",
    items: [program[2].items[0], program[2].items[1]],
  },
  {
    title: "Sistemas para uma operação organizada",
    items: [program[2].items[2]],
  },
];

export const experienceAxes = [
  "Direcionamento estratégico",
  "Estruturação da operação",
  "Organização comercial",
  "Padronização de processos",
  "Visão de escala",
  "Aplicação prática no negócio",
];

export const immersionMoments = [
  {
    title: "Estrutura e operação",
    text: "Conheça os setores, a divisão de responsabilidades, os fluxos internos e a organização que mantém a carteira funcionando.",
  },
  {
    title: "Processos e ferramentas",
    text: "Acompanhe a rotina de contratos, vistorias, atendimento, sistemas, cobrança, repasses, manutenção e controles da administração.",
  },
  {
    title: "Comercial e escala",
    text: "Entenda captação, posicionamento, indicadores, oportunidades de receita e decisões necessárias para preparar a empresa para crescer.",
  },
];

export const targetAudience = [
  {
    title: "Corretores de imóveis",
    text: "Para quem deseja iniciar uma carteira de administração e construir uma nova frente de atuação.",
  },
  {
    title: "Gestores de locação",
    text: "Para quem precisa melhorar processos, organizar a rotina e desenvolver a equipe.",
  },
  {
    title: "Donos de imobiliárias",
    text: "Para quem pretende desenvolver receita recorrente e profissionalizar a operação.",
  },
];

export const faqs = [
  {
    question: "Para quem é a mentoria?",
    answer:
      "Para corretores de imóveis, gestores de locação e donos de imobiliárias que desejam estruturar ou melhorar uma operação de administração de aluguel.",
  },
  {
    question: "Quanto tempo dura o acompanhamento?",
    answer:
      "A mentoria possui seis meses de acompanhamento, voltados à aplicação prática dos conhecimentos e à organização do negócio.",
  },
  {
    question: "A mentoria aborda contratos e Lei do Inquilinato?",
    answer:
      "Sim. Modelos de contratos e fundamentos da Lei do Inquilinato fazem parte dos temas trabalhados no programa.",
  },
  {
    question: "Como funciona a imersão presencial?",
    answer:
      "A experiência acontece durante três dias na operação da Gestcon, com foco em estrutura, processos e comercial. Os detalhes logísticos devem ser confirmados com a equipe.",
  },
  {
    question: "A mentoria serve para quem está começando?",
    answer:
      "O programa aborda fundamentos de estruturação da operação e pode ser relevante para quem deseja iniciar uma carteira. A equipe pode orientar sobre a adequação ao seu momento profissional.",
  },
  {
    question: "Como faço para conhecer os valores?",
    answer:
      "Entre no grupo da mentoria no WhatsApp para receber informações sobre investimento e condições de participação.",
  },
];

// Exemplos fictícios solicitados para o layout. A seção identifica esse caráter
// em cada card; os textos não representam falas reais das pessoas retratadas.
export type Testimonial = {
  name: string;
  image: string;
  topic: string;
  quote: string;
};
export const testimonials: Testimonial[] = [
  {
    name: "Anitla",
    image: "/images/anitlacorretora.webp",
    topic: "Captação com método",
    quote:
      "Eu queria ir além das vendas pontuais e construir uma carteira de locação. O olhar do Rodrigo para captação e relacionamento com proprietários me ajudou a enxergar por onde começar, com mais direção e uma rotina comercial organizada.",
  },
  {
    name: "Augusto Simões",
    image: "/images/augustosimoes.webp",
    topic: "Processos e gestão",
    quote:
      "O que mais fez sentido para mim foi conectar estratégia à rotina da imobiliária. Entender como organizar contratos, atendimento e responsabilidades da equipe trouxe clareza para pensar em uma operação que não dependa de improviso.",
  },
  {
    name: "Jana Martinez",
    image: "/images/janamartinez.webp",
    topic: "Visão de crescimento",
    quote:
      "Passei a olhar para a administração de imóveis como um negócio de recorrência. Os temas de planejamento, sistemas e acompanhamento de processos me ajudaram a organizar prioridades e pensar no crescimento da carteira com mais estrutura.",
  },
];
