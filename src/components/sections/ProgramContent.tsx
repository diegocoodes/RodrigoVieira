import { copy } from "@/content/copy";
import { programCards } from "@/content/mentorship";
import { AnimatedWords } from "@/components/ui/AnimatedWords";

export function ProgramContent() {
  return (
    <section
      className="section program-section program-card-section"
      id="programa"
      aria-labelledby="program-title"
    >
      <div className="container">
        <div className="program-overview-heading reveal">
          <p className="program-eyebrow">{copy.program.eyebrow}</p>
          <h2 id="program-title">
            <AnimatedWords text={copy.program.heading} />{" "}
            <span>
              <AnimatedWords text={copy.program.highlight} gold />
            </span>
          </h2>
        </div>
        <div className="program-cards-grid">
          {programCards.map((card, index) => (
            <details className="program-card reveal" key={card.title}>
              <summary>
                <span className="program-card-number" aria-hidden="true">
                  0{index + 1}
                </span>
                <span className="program-card-title">{card.title}</span>
                <span className="program-card-toggle" aria-hidden="true">
                  +
                </span>
              </summary>
              <div className="program-card-content">
                {card.items.map((item) => (
                  <div className="program-card-topic" key={item.title}>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                ))}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
