import HeroSection from '@/components/home/hero-section'
import ServicesSection from '@/components/home/services-section'
import HowItWorks from '@/components/home/how-it-works'
import Testimonials from '@/components/home/testimonials'

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <ServicesSection />
      <HowItWorks />
      <Testimonials />
    </div>
  )
}