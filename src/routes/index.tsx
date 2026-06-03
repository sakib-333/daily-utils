import BuildPrecision from '@/components/build-precision'
import FeaturedUtilities from '@/components/featured-utilities'
import HeroSection from '@/components/hero-section'
import ServicesGrid from '@/components/services-grid'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <HeroSection />
      <FeaturedUtilities />
      <ServicesGrid />
      <BuildPrecision />
    </div>
  )
}
