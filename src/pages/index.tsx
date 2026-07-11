import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import Layout from '@theme/Layout'
import { useState } from 'react'
import BlogSection from '../components/landing/BlogSection'
import DocsSection from '../components/landing/DocsSection'
import FeaturesSection from '../components/landing/FeaturesSection'
import Hero from '../components/landing/Hero'
import ProjectSection from '../components/landing/ProjectSection'
import UpdateLog from '../components/landing/UpdateLog'
import AiCopilot from '../components/landing/AiCopilot'
import Particles from '../components/magicui/particles'
import { Analytics } from '@vercel/analytics/react'

export default function Home() {
  const {
    siteConfig: { customFields, tagline },
  } = useDocusaurusContext()
  const { description } = customFields as { description: string }
  const [activePanel, setActivePanel] = useState<'update' | 'copilot' | null>(null)

  return (
    <Layout title={tagline} description={description}>
      <main>
        <Hero />
        <Analytics />
        <UpdateLog isOpen={activePanel === 'update'} onOpenChange={open => setActivePanel(open ? 'update' : null)} />
        <AiCopilot isOpen={activePanel === 'copilot'} onOpenChange={open => setActivePanel(open ? 'copilot' : null)} />
        <Particles className="absolute inset-0" quantity={100} ease={80} color="#ffffff" refresh />

        <div className="relative">
          <div className="mx-auto max-w-7xl bg-background lg:px-8">
            <DocsSection />
            <BlogSection />
            <ProjectSection />
            <FeaturesSection />
          </div>
          <div
            className="absolute inset-0 -z-50 bg-grid-slate-50 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.3))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]"
            style={{ backgroundPosition: '10px 10px' }}
          />
        </div>
      </main>
    </Layout>
  )
}
