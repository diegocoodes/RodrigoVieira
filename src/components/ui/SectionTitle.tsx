import { AnimatedWords } from "./AnimatedWords";

export function SectionTitle({
  id,
  lines,
  goldFrom = lines.length - 1,
  inline = false,
}: {
  id: string;
  lines: string[];
  goldFrom?: number;
  inline?: boolean;
}) {
  return (
    <h2 id={id}>
      {lines.map((line, i) => (
        <span
          className={i >= goldFrom ? "title-gold" : "title-white"}
          key={line}
        >
          {i > 0 && (inline ? " " : <br />)}
          <AnimatedWords text={line} gold={i >= goldFrom} />
        </span>
      ))}
    </h2>
  );
}
