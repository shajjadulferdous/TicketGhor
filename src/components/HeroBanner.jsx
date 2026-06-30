"use client";

import React from "react";
import Link from "next/link";
// Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Swiper modules
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";

// Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

export default function HeroBanner() {
  // Slide data using your provided Unsplash images
  const slides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1569448096483-1114dddb646d",
      title: "Discover Unforgettable Journeys",
      subtitle: "Book premium train and bus tickets to your favorite destinations with just a few clicks.",
      ctaText: "Book Now",
      ctaLink: "/tickets",
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1620629228754-6ed8b519bd0f",
      title: "Travel in Premium Comfort",
      subtitle: "Experience top-tier amenities, spacious seating, and world-class service on every trip.",
      ctaText: "Explore Routes",
      ctaLink: "/tickets",
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1535535112387-56ffe8db21ff",
      title: "Reach Your Dream Destinations",
      subtitle: "From bustling cities to quiet getaways, we connect you to the places you love most.",
      ctaText: "Find Tickets",
      ctaLink: "/tickets",
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1444487233259-dae9d907a740",
      title: "A Seamless Booking Experience",
      subtitle: "Secure payments, instant confirmations, and a hassle-free travel management dashboard.",
      ctaText: "Get Started",
      ctaLink: "/tickets",
    },
  ];

  return (
    <div className="relative w-full h-[70vh] min-h-[500px] max-h-[800px] bg-gray-900 group">
      {/* Custom Tailwind targeting to style the Swiper pagination dots to match your Teal theme 
      */}
      <style dangerouslySetInnerHTML={{__html: `
        .swiper-pagination-bullet { background-color: white !important; opacity: 0.5; }
        .swiper-pagination-bullet-active { background-color: #35858E !important; opacity: 1; transform: scale(1.2); }
        .swiper-button-next, .swiper-button-prev { color: white !important; text-shadow: 0 2px 4px rgba(0,0,0,0.5); transform: scale(0.7); opacity: 0; transition: opacity 0.3s; }
        .group:hover .swiper-button-next, .group:hover .swiper-button-prev { opacity: 0.7; }
        .swiper-button-next:hover, .swiper-button-prev:hover { opacity: 1 !important; }
      `}} />

      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        effect="fade"
        speed={1000}
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        navigation={true}
        className="w-full h-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative w-full h-full">
              {/* Background Image */}
              <img
                src={slide.image}
                alt={slide.title}
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
              
              {/* Gradient Overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/60 to-transparent" />
              <div className="absolute inset-0 bg-black/20" />

              {/* Text Content */}
              <div className="absolute inset-0 flex items-center">
                <div className="max-w-7xl mx-auto px-6 md:px-8 w-full">
                  <div className="max-w-2xl text-white transform translate-y-4 animate-fade-in-up">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 drop-shadow-lg">
                      {slide.title}
                    </h1>
                    <p className="text-lg md:text-xl text-gray-200 font-medium mb-8 drop-shadow-md">
                      {slide.subtitle}
                    </p>
                    <Link
                      href={slide.ctaLink}
                      className="inline-block px-8 py-4 bg-[#35858E] hover:bg-[#256069] text-white font-bold rounded-xl shadow-lg shadow-[#35858E]/40 transition-all duration-300 hover:-translate-y-1"
                    >
                      {slide.ctaText}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}