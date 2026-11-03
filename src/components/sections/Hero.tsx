import Image from "next/image";
import { CTA } from "@/components/ui/CTA";
import { Wordmark } from "@/components/ui/Wordmark";
import { copy } from "@/content/copy";
import { photos } from "@/content/photos";
import { Spotlight } from "@/components/ui/21st/Spotlight";
import { AnimatedWords } from "@/components/ui/AnimatedWords";

export function Hero() {
  const text = copy.hero;
  return (
    <section className="hero" id="inicio" aria-labelledby="hero-title">
      <Spotlight id="hero" className="hero-spotlight" />
      <div className="hero-visual">
        <div className="hero-photo-wrap">
          <Image
            className="hero-photo"
            {...photos.hero}
            preload
            sizes="(max-width: 600px) 100vw, 550px"
          />
        </div>
      </div>
      <div className="container hero-grid">
        <div className="hero-copy">
          <Wordmark />
          <h1 id="hero-title">
            <span>
              <AnimatedWords text={text.headline.slice(0, 2).join(" ")} />
            </span>
            <span className="gold">
              <AnimatedWords text={text.headline.slice(2).join(" ")} gold />
            </span>
          </h1>
          <p className="hero-description">{text.description}</p>
          <p className="hero-context">{text.context}</p>
          <div className="hero-actions">
            <a className="offer-row" href="#acompanhamento">
              <span className="offer-symbol" aria-hidden="true">
                ↗
              </span>
              <span>
                <strong>6 meses</strong> de acompanhamento
              </span>
              <span className="row-arrow" aria-hidden="true">
                ↗
              </span>
            </a>
            <a className="offer-row" href="#imersao">
              <span className="offer-symbol" aria-hidden="true">
                ◇
              </span>
              <span>
                <strong>3 dias</strong> de imersão presencial
              </span>
              <span className="row-arrow" aria-hidden="true">
                ↗
              </span>
            </a>
            <CTA>{text.cta}</CTA>
          </div>
          <p className="hero-note">
            <span aria-hidden="true">◇</span> Método aplicado na Gestcon.
            Conheça o programa.
          </p>
        </div>
      </div>
    </section>
  );
}

export function InfoTicker() {
  return (
    <div className="info-ticker" aria-label="Pilares da mentoria">
      <div className="ticker-inner">
        {[0, 1].map((group) => (
          <div
            className="ticker-set"
            key={group}
            aria-hidden={group === 1 ? true : undefined}
          >
            {copy.ticker.map((text) => (
              <span key={text}>
                <i aria-hidden="true" />
                {text}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
