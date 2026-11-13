"use client";

import { HeroSection } from "@/app/components/HeroSection";
import { EditorialSplitShowcase } from "@/app/components/EditorialSplitShowcase";
import { ServicesSection } from "@/app/components/ServicesSection";
import { ProjectsGallery } from "@/app/components/ProjectsGallery";
import { FaqSection } from "@/app/components/FaqSection";
import { ProjectBannerCta } from "@/app/components/ProjectBannerCta";
import { ContactSplitSection } from "@/app/components/ContactSplitSection";

/**
 * Coordinates the full plumbing landing flow.
 */
export function PlumbingLanding() {
  return (
    <>
      <HeroSection />
      <EditorialSplitShowcase />
      <ServicesSection />
      <ProjectsGallery />
      <FaqSection />
      <ProjectBannerCta />
      <ContactSplitSection />
    </>
  );
}
