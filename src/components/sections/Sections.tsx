import Image from "next/image";
import { CTA, Eyebrow } from "@/components/ui/CTA";
import { Icon } from "@/components/ui/Icon";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Wordmark } from "@/components/ui/Wordmark";
import { AnimatedWords } from "@/components/ui/AnimatedWords";
import { Spotlight } from "@/components/ui/21st/Spotlight";
import { copy } from "@/content/copy";
import { photos } from "@/content/photos";
import { whatsappLink } from "@/config/site";
import {
  audienceCards,
  experienceAxes,
  faqs,
  immersionMoments,
  targetAudience,
  testimonials,
} from "@/content/mentorship";

export function AudienceCards() {
  const text = copy.audience;
  return (
    <section
      className="section audience-section"
      id="mentoria"
      aria-labelledby="audience-title"
    >
      <div className="container audience-layout reveal">
        <h2 id="audience-title">
          <AnimatedWords text={text.heading[0]} />
          <br />
          <AnimatedWords text={text.heading[1]} gold />
        </h2>
        <div className="audience-cards reveal-group">
          {audienceCards.map((card) => (
            <article className="audience-card reveal" key={card.title}>
              <Icon name={card.icon} />
              <p>
                <strong>{card.title}.</strong> {card.text}
              </p>
            </article>
          ))}
        </div>
        <a className="audience-program-link text-link" href="#programa">
          Conheça a mentoria por dentro <span aria-hidden="true">↗</span>
        </a>
      </div>
    </section>
  );
}

export function MentorshipIntro() {
  const text = copy.intro;
  return (
    <section
      className="intro-section"
      id="proposta"
      aria-labelledby="intro-title"
    >
      <div className="container intro-layout reveal">
        <div>
          <Eyebrow>{text.eyebrow}</Eyebrow>
          <SectionTitle id="intro-title" lines={text.title} />
        </div>
        <div className="intro-copy">
          {text.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </div>
    </section>
  );
}

export function MentorshipDelivery() {
  return (
    <section className="section delivery-section" aria-labelledby="delivery-title">
      <Spotlight id="delivery" className="delivery-spotlight" />
      <div className="container">
        <div className="delivery-heading reveal">
          <Eyebrow>Da estratégia à operação</Eyebrow>
          <h2 id="delivery-title">
            <AnimatedWords text="Uma mentoria para aprender." />
            <br />
            <span>
              <AnimatedWords text="Uma operação real para viver." gold />
            </span>
          </h2>
          <p>
            Dois momentos que se complementam para transformar conhecimento em
            prática no seu negócio.
          </p>
        </div>
        <div className="delivery-grid">
          <MentorshipExperience />
          <GestconImmersion />
        </div>
      </div>
    </section>
  );
}

function MentorshipExperience() {
  const text = copy.experience;
  return (
    <section
      className="delivery-card experience-section reveal"
      id="acompanhamento"
      aria-labelledby="experience-title"
    >
      <h3 id="experience-title">{text.eyebrow}</h3>
      <p className="delivery-duration">
        <strong>{text.duration}</strong>
        <span>meses de<br />acompanhamento</span>
      </p>
      <p className="delivery-description">{text.description}</p>
      <ul className="delivery-benefits">
        {experienceAxes.map((axis) => (
          <li key={axis}>
            <Icon name="check" />
            {axis}
          </li>
        ))}
      </ul>
      <CTA context="experience">{text.cta}</CTA>
    </section>
  );
}

function GestconImmersion() {
  const text = copy.immersion;
  return (
    <section
      className="delivery-card immersion-section reveal"
      id="imersao"
      aria-labelledby="immersion-title"
    >
      <h3 id="immersion-title">{text.eyebrow}</h3>
      <p className="delivery-duration">
        <strong>{text.duration}</strong>
        <span>dias de imersão<br />na Gestcon</span>
      </p>
      <p className="delivery-description">{text.description}</p>
      <div className="delivery-moments">
        {immersionMoments.map((moment) => (
          <article key={moment.title}>
            <Icon name="check" />
            <div>
              <h4>{moment.title}</h4>
              <p>{moment.text}</p>
            </div>
          </article>
        ))}
      </div>
      <CTA context="immersion">{text.cta}</CTA>
    </section>
  );
}

export function MentorProfile() {
  const text = copy.mentor;
  return (
    <section
      className="section mentor-section"
      id="mentor"
      aria-labelledby="mentor-title"
    >
      <div className="container">
        <div className="mentor-layout">
          <div className="mentor-image reveal reveal-from-left">
            <Image {...photos.mentor} sizes="(max-width: 700px) 100vw, 48vw" />
            <span className="mentor-image-caption">{text.imageCaption}</span>
          </div>
          <div className="mentor-panel reveal reveal-from-right">
            <Eyebrow>{text.eyebrow}</Eyebrow>
            <h2 id="mentor-title">
              <AnimatedWords text="Rodrigo Vieira" />
            </h2>
            {text.summary.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <a
              className="text-link"
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
            >
              {text.cta} <Icon name="arrow" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function TargetAudience() {
  const text = copy.target;
  return (
    <section
      className="section target-section"
      id="para-quem"
      aria-labelledby="target-title"
    >
      <div className="container target-layout">
        <div className="reveal">
          <Eyebrow>{text.eyebrow}</Eyebrow>
          <SectionTitle id="target-title" lines={text.title} />
        </div>
        <div className="target-list reveal">
          {targetAudience.map((item) => (
            <article key={item.title}>
              <Icon name="check" />
              <div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SocialProof() {
  if (!testimonials.length) return null;
  return (
    <section className="section" aria-labelledby="testimonials-title">
      <div className="container">
        <Eyebrow>{copy.proof.eyebrow}</Eyebrow>
        <h2 id="testimonials-title">{copy.proof.title}</h2>
        <div className="testimonials">
          {testimonials.map((item) => (
            <blockquote key={item.name}>
              <p>{item.quote}</p>
              <cite>
                {item.name} · {item.role}
              </cite>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FAQ() {
  const text = copy.faq;
  return (
    <section
      className="section faq-section"
      id="duvidas"
      aria-labelledby="faq-title"
    >
      <div className="container faq-layout">
        <div className="faq-intro reveal">
          <Eyebrow>{text.eyebrow}</Eyebrow>
          <h2 id="faq-title">
            <AnimatedWords text={text.heading[0]} />
            <br />
            <span>
              <AnimatedWords text={text.heading[1]} gold />
            </span>
          </h2>
          <p>{text.description}</p>
          <CTA>{text.cta}</CTA>
        </div>
        <div className="faq-list reveal">
          {faqs.map((item, index) => (
            <details className="faq-item" key={item.question}>
              <summary>
                <span className="faq-question">
                  <span className="faq-number" aria-hidden="true">
                    0{index + 1}
                  </span>
                  {item.question}
                </span>
                <span className="faq-plus" aria-hidden="true" />
              </summary>
              <div className="faq-answer">
                <p>{item.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FinalCTA() {
  const text = copy.final;
  return (
    <section
      className="final-section"
      id="conversa"
      aria-labelledby="final-title"
    >
      <div className="container">
        <div className="final-panel reveal">
          <div className="final-inner">
            <div className="final-copy">
              <h2 id="final-title">
                <Wordmark />
              </h2>
              <p>{text.description}</p>
            </div>
            <div className="final-action">
              <a className="offer-row" href="#programa">
                Conhecer o programa <span aria-hidden="true">↗</span>
              </a>
              <a className="offer-row" href="#duvidas">
                Tirar minhas dúvidas <span aria-hidden="true">↗</span>
              </a>
              <CTA>{text.cta}</CTA>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
