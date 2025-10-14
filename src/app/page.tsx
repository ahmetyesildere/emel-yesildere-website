import HeroSection from '@/components/home/hero-section'
import ServicesSection from '@/components/home/services-section'
import FeaturedCoaches from '@/components/home/featured-coaches'
import HowItWorks from '@/components/home/how-it-works'
import Testimonials from '@/components/home/testimonials'
import StatsSection from '@/components/home/stats-section'

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <ServicesSection />
      <HowItWorks />
      <FeaturedCoaches />
      <StatsSection />
      <Testimonials />
    </div>
  )
}