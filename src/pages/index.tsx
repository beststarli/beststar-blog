import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import Layout from '@theme/Layout'
import { lazy, Suspense, useState } from 'react'
import Hero from '../components/landing/Hero'
import Particles from '../components/magicui/particles'
import { Analytics } from '@vercel/analytics/react'

// 懒加载首屏以下组件，减少主 JS 包体积
const BlogSection = lazy(() => import('../components/landing/BlogSection'))
const DocsSection = lazy(() => import('../components/landing/DocsSection'))
const FeaturesSection = lazy(() => import('../components/landing/FeaturesSection'))
const ProjectSection = lazy(() => import('../components/landing/ProjectSection'))
const UpdateLog = lazy(() => import('../components/landing/UpdateLog'))
const AiCopilot = lazy(() => import('../components/landing/AiCopilot'))

function SectionFallback() {
  return <div className="h-48 animate-pulse rounded-xl bg-gray-100 dark:bg-zinc-800" />
}

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
        <Suspense fallback={null}>
          {activePanel !== 'copilot' && (
            <UpdateLog isOpen={activePanel === 'update'} onOpenChange={open => setActivePanel(open ? 'update' : null)} />
          )}
          {activePanel !== 'update' && (
            <AiCopilot isOpen={activePanel === 'copilot'} onOpenChange={open => setActivePanel(open ? 'copilot' : null)} />
          )}
        </Suspense>
        <Particles className="absolute inset-0" quantity={100} ease={80} color="#ffffff" refresh />

        <div className="relative">
          <div className="mx-auto max-w-7xl bg-background lg:px-8">
            <Suspense fallback={<SectionFallback />}>
              <DocsSection />
            </Suspense>
            <Suspense fallback={<SectionFallback />}>
              <BlogSection />
            </Suspense>
            <Suspense fallback={<SectionFallback />}>
              <ProjectSection />
            </Suspense>
            <Suspense fallback={<SectionFallback />}>
              <FeaturesSection />
            </Suspense>
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
