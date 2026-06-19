import { AboutUsSection } from '../components/home/AboutUsSection';
import { BestProductsSection } from '../components/home/BestProductsSection';
import { HeroSection } from '../components/home/HeroSection';
import { SaleSection } from '../components/home/SaleSection';
import { WhyUsSection } from '../components/home/WhyUsSection';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <BestProductsSection />
      <SaleSection />
      <WhyUsSection />
      <AboutUsSection />
    </div>
  );
}
