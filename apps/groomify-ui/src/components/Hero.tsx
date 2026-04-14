import React from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';
import heroImage from '../static/img/hero.webp';

interface HeroProps {
  onBookNow: () => void;
}

export function Hero({ onBookNow }: HeroProps) {
  return (
    <section id="home" className="relative pt-20 lg:pt-28 pb-16 lg:pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative z-10">
            {/* <div className="inline-block bg-teal-100 text-teal-800 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
              Voted #1 Groomer in Town 🏆
            </div> */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
              Premium Care for Your <span className="text-teal-600">Furry Best Friend</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-lg">
              Experience the best grooming service where safety, comfort, and style come together. We make your pets look and feel their best.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button 
                onClick={onBookNow}
                className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
              >
                Book Appointment <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <a 
                href="#services"
                className="bg-white border-2 border-gray-200 hover:border-teal-600 hover:text-teal-600 text-gray-700 px-8 py-4 rounded-lg font-bold text-lg transition-all flex items-center justify-center"
              >
                View Services
              </a>
            </div>

            {/* <div className="flex items-center gap-6 text-sm text-gray-500 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-teal-500" />
                Certified Groomers
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-teal-500" />
                Organic Shampoos
              </div>
            </div> */}
          </div>

          <div className="relative lg:ml-10">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl transform lg:rotate-2 hover:rotate-0 transition-all duration-500">
              <img 
                src={heroImage}
                alt="Happy fluffy dog" 
                className="w-full h-[500px] object-cover"
              />
              {/* <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-8">
                <p className="text-white font-bold text-xl">"They treat my Max like royalty!"</p>
                <p className="text-gray-200 text-sm">- Sarah T.</p>
              </div> */}
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
