import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Enhancements } from "@/components/layout/Enhancements";
import { SiteAtmosphere } from "@/components/layout/SiteAtmosphere";
import { SiteIntro } from "@/components/layout/SiteIntro";
import { Hero, InfoTicker } from "@/components/sections/Hero";
import { ProgramContent } from "@/components/sections/ProgramContent";
import {
  AudienceCards,
  MentorshipIntro,
  MentorshipDelivery,
  MentorProfile,
  TargetAudience,
  SocialProof,
  FAQ,
  FinalCTA,
} from "@/components/sections/Sections";

export default function Home() {
  return (
    <>
      <SiteIntro />
      <Header />
      <main id="conteudo">
        <SiteAtmosphere />
        <Hero />
        <MentorProfile />
        <InfoTicker />
        <AudienceCards />
        <MentorshipIntro />
        <ProgramContent />
        <MentorshipDelivery />
        <TargetAudience />
        <SocialProof />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <Enhancements />
    </>
  );
}
