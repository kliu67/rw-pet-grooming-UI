import React from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: "Emily Johnson",
    pet: "Cooper (Golden Retriever)",
    text: "The best grooming experience we've ever had! Cooper usually hates baths but he came home happy and smelling amazing.",
    rating: 5
  },
  {
    name: "Michael Chen",
    pet: "Luna (Poodle Mix)",
    text: "FreshPaws did an incredible job with Luna's cut. They listened to exactly what I wanted and she looks perfect.",
    rating: 5
  },
  {
    name: "Sarah Davis",
    pet: "Bella (French Bulldog)",
    text: "Staff is super friendly and professional. You can tell they really love animals. Highly recommended!",
    rating: 5
  }
];

export function Testimonials() {
  return (
    <section id="reviews" className="py-20 bg-teal-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Happy Pets, Happy Owners</h2>
          <div className="flex justify-center items-center gap-2">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-current" />
              ))}
            </div>
            <span className="text-teal-200 font-medium">4.9/5 Average Rating</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-teal-800 rounded-xl p-8 shadow-lg border border-teal-700">
              <div className="flex text-yellow-400 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-teal-100 italic mb-6">"{testimonial.text}"</p>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-teal-600 flex items-center justify-center font-bold text-lg">
                  {testimonial.name.charAt(0)}
                </div>
                <div className="ml-3">
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-teal-300">{testimonial.pet}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
