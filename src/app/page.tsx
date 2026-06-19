import { BestProductsSection } from '../components/home/BestProductsSection';
import { HeroSection } from '../components/home/HeroSection';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <BestProductsSection />
    </div>
  );
}
