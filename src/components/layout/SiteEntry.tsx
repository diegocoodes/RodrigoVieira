"use client";

import { useCallback, useEffect, useState } from "react";
import { WelcomeVideoModal } from "./WelcomeVideoModal";

export function SiteEntry() {
  const [stage, setStage] = useState<"pending" | "video" | "done">("pending");
  useEffect(() => {
    const skipVideo = window.location.hash ||
      typeof HTMLDialogElement === "undefined" ||
      !HTMLDialogElement.prototype.showModal;
    setStage(skipVideo ? "done" : "video");
  }, []);
  const finishVideo = useCallback(() => setStage("done"), []);

  return (
    <div data-site-entry data-entry-stage={stage}>
      {stage === "video" && <WelcomeVideoModal onClose={finishVideo} />}
    </div>
  );
}
