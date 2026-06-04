import { Metadata } from 'next';
import { NavigationBar } from '@features/home/components/NavigationBar.client';
import { HeroSection } from '@features/home/components/HeroSection';
import { TrustedCompanies } from '@features/home/components/TrustedCompanies';
import { FeaturedPrograms } from '@features/home/components/FeaturedPrograms';
import { LearningJourney } from '@features/home/components/LearningJourney';
import { SuccessStories } from '@features/home/components/SuccessStories.client';
import { InstructorShowcase } from '@features/home/components/InstructorShowcase';
import { CurriculumPreview } from '@features/home/components/CurriculumPreview.client';
import { CommunitySection } from '@features/home/components/CommunitySection';
import { PricingSection } from '@features/home/components/PricingSection.client';
import { FAQSection } from '@features/home/components/FAQSection.client';
import { FinalCta } from '@features/home/components/FinalCta.client';
import { Footer } from '@features/home/components/Footer';

export const metadata: Metadata = {
  title: 'RiseWithData | Product Leadership Training',
  description: 'Premium SaaS education for product managers, teams, and high-growth careers.',
  openGraph: {
    title: 'RiseWithData | Product Leadership Training',
    description: 'Premium SaaS education for product managers, teams, and high-growth careers.',
    type: 'website'
  }
};

export default function MarketingHomePage() {
  return (
    <div className="bg-white text-slate-900">
      <NavigationBar />
      <main>
        <HeroSection />
        <TrustedCompanies />
        <FeaturedPrograms />
        <LearningJourney />
        <SuccessStories />
        <InstructorShowcase />
        <CurriculumPreview />
        <CommunitySection />
        <PricingSection />
        <FAQSection />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
