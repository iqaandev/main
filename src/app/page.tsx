'use client'

import Navbar from '@/components/iqaan/Navbar'
import Hero from '@/components/iqaan/Hero'
import TrustedBy from '@/components/iqaan/TrustedBy'
import Services from '@/components/iqaan/Services'
import Products from '@/components/iqaan/Products'
import Manifesto from '@/components/iqaan/Manifesto'
import Stats from '@/components/iqaan/Stats'
import Process from '@/components/iqaan/Process'
import Testimonials from '@/components/iqaan/Testimonials'
import CTA from '@/components/iqaan/CTA'
import Footer from '@/components/iqaan/Footer'
import { LocaleProvider } from '@/i18n/LocaleProvider'

export default function Home() {
  return (
    <LocaleProvider>
      <div className="paper-grain min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Hero />
          <TrustedBy />
          <Services />
          <Products />
          <Manifesto />
          <Stats />
          <Process />
          <Testimonials />
          <CTA />
        </main>
        <Footer />
      </div>
    </LocaleProvider>
  )
}
