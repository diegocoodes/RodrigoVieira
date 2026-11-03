import { copy } from "@/content/copy";

export function Wordmark() {
  return (
    <span className="course-wordmark">
      <span className="wordmark-kicker">{copy.hero.eyebrow.toUpperCase()}</span>
      <span className="wordmark-name">
        {copy.hero.title[0]} <strong>{copy.hero.title[1]}</strong>
      </span>
      <span className="wordmark-category">
        {copy.hero.title[2].replace(".", "")}
      </span>
    </span>
  );
}
