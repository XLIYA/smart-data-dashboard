import { FeatureCard } from './feature-card'
import { getFeatures } from './features-data'

export const Features = () => (
  <section aria-label="Key features" className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
    {getFeatures().map((f, i) => (
      <FeatureCard key={i} icon={f.icon} title={f.title} desc={f.desc} />
    ))}
  </section>
)
