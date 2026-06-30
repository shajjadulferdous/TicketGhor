import React from 'react';
import { 
  MdSecurity, 
  MdSupportAgent, 
  MdTouchApp, 
  MdSavings,
  MdVerifiedUser
} from 'react-icons/md';

export default function FeaturesSection() {
  const features = [
    {
      id: 1,
      icon: <MdTouchApp size={28} />,
      title: "Seamless Booking",
      description: "Find and book your desired routes in just three clicks. Our intuitive interface makes travel planning effortless."
    },
    {
      id: 2,
      icon: <MdSecurity size={28} />,
      title: "Secure Payments",
      description: "Your transactions are protected by bank-level SSL encryption and processed via Stripe for ultimate peace of mind."
    },
    {
      id: 3,
      icon: <MdSavings size={28} />,
      title: "Best Price Guarantee",
      description: "We partner directly with top-tier vendors to ensure you get the lowest fares without hidden fees or extra charges."
    },
    {
      id: 4,
      icon: <MdSupportAgent size={28} />,
      title: "24/7 Premium Support",
      description: "Need to change a route or cancel a ticket? Our dedicated support team is available around the clock to assist you."
    }
  ];

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#35858E]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#35858E]/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        
        {/* ── Section Header ── */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-2 mb-3">
            <MdVerifiedUser className="text-[#35858E]" size={24} />
            <h2 className="text-sm font-black uppercase tracking-widest text-[#35858E]">
              Why Choose TicketGhor
            </h2>
          </div>
          <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
            Travel With Confidence
          </h3>
          <p className="text-gray-500 font-medium text-base md:text-lg">
            We bridge the gap between you and your next great adventure by providing a platform built on trust, speed, and reliability.
          </p>
        </div>

        {/* ── Features Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div 
              key={feature.id}
              className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/30 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#35858E]/10 transition-all duration-300 group"
            >
              {/* Icon Box */}
              <div className="w-16 h-16 rounded-2xl bg-[#EBF5F6] text-[#35858E] flex items-center justify-center mb-6 group-hover:bg-[#35858E] group-hover:text-white transition-colors duration-300">
                {feature.icon}
              </div>
              
              {/* Text Content */}
              <h4 className="text-xl font-extrabold text-gray-900 mb-3 group-hover:text-[#35858E] transition-colors">
                {feature.title}
              </h4>
              <p className="text-sm font-medium text-gray-500 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* ── Trust Metrics (Optional Bottom Bar) ── */}
        <div className="mt-20 pt-10 border-t border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-black text-gray-900 mb-1">500+</div>
            <div className="text-xs font-bold uppercase tracking-wider text-gray-400">Routes Available</div>
          </div>
          <div>
            <div className="text-3xl font-black text-gray-900 mb-1">50k+</div>
            <div className="text-xs font-bold uppercase tracking-wider text-gray-400">Happy Travelers</div>
          </div>
          <div>
            <div className="text-3xl font-black text-gray-900 mb-1">100%</div>
            <div className="text-xs font-bold uppercase tracking-wider text-gray-400">Secure Payments</div>
          </div>
          <div>
            <div className="text-3xl font-black text-gray-900 mb-1">24/7</div>
            <div className="text-xs font-bold uppercase tracking-wider text-gray-400">Customer Support</div>
          </div>
        </div>

      </div>
    </section>
  );
}