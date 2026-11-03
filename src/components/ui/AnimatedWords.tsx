import { Fragment, type CSSProperties } from "react";

// Local implementation inspired by the word-reveal previews on 21st.dev.
// Plain server-rendered text stays readable before JS and with reduced motion.
export function AnimatedWords({
  text,
  gold = false,
}: {
  text: string;
  gold?: boolean;
}) {
  return (
    <span
      className={`animated-words${gold ? " animated-words-gold" : ""}`}
      data-text-reveal
    >
      {text.split(/\s+/).map((word, index) => (
        <Fragment key={`${index}-${word}`}>
          {index > 0 && " "}
          <span
            className="animated-word"
            style={{ "--word-index": index } as CSSProperties}
          >
            {word}
          </span>
        </Fragment>
      ))}
    </span>
  );
}
