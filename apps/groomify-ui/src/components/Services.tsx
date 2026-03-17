import React from 'react';
import { Scissors, Droplets, Heart, Sparkles } from 'lucide-react';

const services = [
  {
    title: "Full Groom",
    price: "From $65",
    description: "Bath, blow dry, brush out, haircut, nail trim, and ear cleaning. The full treatment.",
    icon: Scissors,
    image: "https://images.unsplash.com/photo-1703368786305-4e1dcfcfd0db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjBnZXR0aW5nJTIwaGFpcmN1dHxlbnwxfHx8fDE3NzA0MDY0NTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    title: "Bath & Brush",
    price: "From $40",
    description: "Deep cleansing bath, conditioning, blow dry, and thorough brush out to reduce shedding.",
    icon: Droplets,
    image: "https://images.unsplash.com/photo-1680374642577-441d91f91ea5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjBiYXRoJTIwYnViYmxlc3xlbnwxfHx8fDE3NzA0MDY0NTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    title: "Puppy Package",
    price: "From $35",
    description: "Gentle introduction to grooming for puppies under 5 months. Bath, light trim, and lots of cuddles.",
    icon: Heart,
    image: "https://images.unsplash.com/photo-1730403257848-a38a393f1b60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBkb2clMjBncm9vbWVyfGVufDF8fHx8MTc3MDM5NzU5Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    title: "Spa Extras",
    price: "From $10",
    description: "Add-ons like teeth brushing, paw balm, blueberry facials, and nail grinding.",
    icon: Sparkles,
    image: "https://images.unsplash.com/photo-1769025939291-0603d7b76bb5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjBwYXclMjBjYXJlfGVufDF8fHx8MTc3MDQwNjU2NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  }
];

export function Services() {
  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Grooming Services</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We use premium, organic products suited for your pet's specific coat type. Prices vary based on size and coat condition.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-teal-100 rounded-lg text-teal-600">
                    <service.icon className="h-6 w-6" />
                  </div>
                  <span className="bg-gray-100 text-gray-800 text-sm font-semibold px-2.5 py-0.5 rounded">
                    {service.price}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
