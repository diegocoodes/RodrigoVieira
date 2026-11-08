export const site = {
  name: "Mentoria Rodrigo Vieira",
  title: "Mentoria Rodrigo Vieira | Do Zero a 50 Administrações",
  description:
    "Conheça a Mentoria Rodrigo Vieira. Seis meses de acompanhamento em gestão de locação e três dias de imersão presencial na Gestcon.",
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || undefined,
  whatsappGroupUrl:
    "https://chat.whatsapp.com/LmII1YduewFGVAvKpfpuU3?s=cl&p=a&iam=2",
};

export function whatsappLink() {
  return site.whatsappGroupUrl;
}

export const navigation = [
  { label: "A mentoria", href: "#mentoria" },
  { label: "O programa", href: "#programa" },
  { label: "Acompanhamento", href: "#acompanhamento" },
  { label: "Imersão", href: "#imersao" },
  { label: "Seu mentor", href: "#mentor" },
  { label: "Para quem", href: "#para-quem" },
  { label: "Feedbacks", href: "#feedbacks" },
  { label: "Dúvidas", href: "#duvidas" },
];
