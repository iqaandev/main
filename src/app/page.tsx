'use client'

import Navbar from '@/components/iqaan/Navbar'
import Hero from '@/components/iqaan/Hero'
import TrustedBy from '@/components/iqaan/TrustedBy'
import Services from '@/components/iqaan/Services'
import Products from '@/components/iqaan/Products'
import Stats from '@/components/iqaan/Stats'
import Process from '@/components/iqaan/Process'
import Testimonials from '@/components/iqaan/Testimonials'
import CTA from '@/components/iqaan/CTA'
import Footer from '@/components/iqaan/Footer'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <TrustedBy />
        <Services />
        <Products />
        <Stats />
        <Process />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
