export const site = {
  name: "Mentoria Rodrigo Vieira",
  title: "Mentoria Rodrigo Vieira | Do Zero a 50 Administrações",
  description:
    "Conheça a Mentoria Rodrigo Vieira. Seis meses de acompanhamento em gestão de locação e três dias de imersão presencial na Gestcon.",
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || undefined,
  phone: "558192017793",
};

const messages = {
  main: "Olá! Conheci a Mentoria Do Zero a 50 Administrações pelo site e gostaria de saber como participar.",
  immersion:
    "Olá! Gostaria de saber mais sobre a imersão presencial de três dias da Mentoria Rodrigo Vieira.",
  experience:
    "Olá! Quero entender como funcionam os seis meses de acompanhamento da Mentoria Rodrigo Vieira.",
};

export function whatsappLink(context: keyof typeof messages = "main") {
  return `https://wa.me/${site.phone}?text=${encodeURIComponent(messages[context])}`;
}

export const navigation = [
  { label: "A mentoria", href: "#mentoria" },
  { label: "O programa", href: "#programa" },
  { label: "Acompanhamento", href: "#acompanhamento" },
  { label: "Imersão", href: "#imersao" },
  { label: "Seu mentor", href: "#mentor" },
  { label: "Para quem", href: "#para-quem" },
  { label: "Dúvidas", href: "#duvidas" },
];
