import { whatsappLink } from "@/config/site";
import { Icon } from "./Icon";

export function CTA({
  children,
  context = "main",
  className = "",
}: {
  children: React.ReactNode;
  context?: "main" | "immersion" | "experience";
  className?: string;
}) {
  return (
    <a
      className={`button button-gold ${className}`}
      href={whatsappLink(context)}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
      <Icon name="arrow" />
    </a>
  );
}

export function Eyebrow({
  children,
  light = false,
}: {
  children: React.ReactNode;
  light?: boolean;
}) {
  return (
    <p className={`eyebrow${light ? " eyebrow-light" : ""}`}>
      {children}
    </p>
  );
}
