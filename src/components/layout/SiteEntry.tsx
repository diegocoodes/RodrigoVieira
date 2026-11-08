"use client";

import { useCallback, useState } from "react";
import { SiteIntro } from "./SiteIntro";
import { WelcomeVideoModal } from "./WelcomeVideoModal";

export function SiteEntry() {
  const [stage, setStage] = useState<"intro" | "video" | "done">("intro");
  const finishIntro = useCallback((showVideo: boolean) => {
    setStage(showVideo ? "video" : "done");
  }, []);
  const finishVideo = useCallback(() => setStage("done"), []);

  return (
    <div data-site-entry data-entry-stage={stage}>
      <SiteIntro onComplete={finishIntro} />
      {stage === "video" && <WelcomeVideoModal onClose={finishVideo} />}
    </div>
  );
}
