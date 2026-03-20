import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { Testimonials } from './components/Testimonials';
import { Footer } from './components/Footer';
import { MultiStepFormModal } from './components/MultiStepFormModal';

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="min-h-screen bg-white">
      <Header onBookNow={openModal} />
      
      <main>
        <Hero onBookNow={openModal} />
        <Services />
        
        {/* About Section - Simple enough to keep inline or extract if it grows */}
        <section id="about" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="relative">
                <div className="absolute inset-0 bg-teal-200 rounded-3xl transform rotate-3"></div>
                <img 
                  src="https://images.unsplash.com/photo-1647002380358-fc70ed2f04e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjBzcGElMjBjbGVhbnxlbnwxfHx8fDE3NzA0MDY1NTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" 
                  alt="Our Grooming Salon" 
                  className="relative rounded-3xl shadow-xl z-10 w-full h-[400px] object-cover"
                />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Passionate About Paws</h2>
                <p className="text-lg text-gray-600 mb-6">
                  Founded in 2018, FreshPaws started with a simple mission: to provide a grooming experience that dogs actually enjoy. We believe that grooming shouldn't be a chore or a stressful event for your pet.
                </p>
                <p className="text-lg text-gray-600 mb-8">
                  Our certified groomers are trained in animal behavior and handling, ensuring that even the most nervous pets feel safe and loved in our care. We use only high-quality, hypoallergenic products to keep your pet's skin and coat healthy.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-teal-50 p-4 rounded-lg">
                    <p className="text-3xl font-bold text-teal-600">5k+</p>
                    <p className="text-gray-600">Happy Pets</p>
                  </div>
                  <div className="bg-teal-50 p-4 rounded-lg">
                    <p className="text-3xl font-bold text-teal-600">10+</p>
                    <p className="text-gray-600">Years Exp</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Testimonials />
        
        {/* Contact/CTA Section */}
        <section className="py-20 bg-teal-50">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Ready to Pamper Your Pet?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Book an appointment today and see the FreshPaws difference. Spots fill up fast!
            </p>
            <button 
              onClick={()=>setIsModalOpen(true)}
              className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all"
            >
              Schedule Appointment
            </button>
          </div>
        </section>
      </main>

      <Footer />
      <MultiStepFormModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
}
