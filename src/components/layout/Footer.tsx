import { navigation, whatsappLink } from "@/config/site";
import { copy } from "@/content/copy";
import { CurrentYear } from "@/components/ui/CurrentYear";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-main">
          <p>
            © <CurrentYear buildYear={new Date().getFullYear()} /> Rodrigo
            Vieira. Todos os direitos reservados.
          </p>
          <p>Fale com a equipe para conhecer o programa e as condições.</p>
        </div>
        <nav className="footer-nav" aria-label="Navegação do rodapé">
          {navigation.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
            WhatsApp ↗
          </a>
        </nav>
        <p className="footer-note">{copy.footer.note}</p>
      </div>
    </footer>
  );
}
