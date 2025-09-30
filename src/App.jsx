import React from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import Features from './components/Features'
import Plans from './components/Plans'
import Testimonials from './components/Testimonials'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <Hero />
        <Features />
        <Plans />
        <Testimonials />
      </main>
      <Footer />
    </div>
  )
}