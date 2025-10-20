import { Hero } from './hero'
import { UploadSection } from './upload-section'
import { Features } from './features'

const Landing = () => (
  <div className="space-y-16">
    <Hero />
    <UploadSection />
    <Features />
  </div>
)

export default Landing
