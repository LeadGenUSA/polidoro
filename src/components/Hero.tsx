import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Clock, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { useCallback, useEffect, useState } from 'react';
import type { CarouselApi } from '@/components/ui/carousel';
import heroImage from '@/assets/hero-plumbing.jpg';
import nycSkyline from '@/assets/nyc-skyline.png';
import heroVideo from '@/assets/big-city-plumbing-and-heating.mp4';

const Hero = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const slides = [
    { type: 'video' as const, src: heroVideo },
    { type: 'image' as const, src: heroImage, alt: 'Professional plumbing and heating services' },
  ];

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const scrollPrev = useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const scrollNext = useCallback(() => {
    api?.scrollNext();
  }, [api]);

  const scrollTo = useCallback((index: number) => {
    api?.scrollTo(index);
  }, [api]);

  return (
    <section className="relative min-h-screen flex items-center hero-gradient overflow-hidden">
      {/* NYC Skyline Background */}
      <div className="absolute inset-0">
        <img src={nycSkyline} alt="" className="w-full h-full object-cover object-center" />
        {/* Overlay to blend with hero gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/85 to-primary/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-transparent to-primary/70" />
      </div>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-secondary rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 lg:px-8 pt-24 pb-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-primary-foreground animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 backdrop-blur-sm border border-secondary/30 mb-6">
              <Shield className="w-4 h-4 text-secondary" />
              <span className="text-sm font-medium">Licensed & Insured Since 1988</span>
            </div>
            
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Expert Plumbing &
              <span className="text-gradient block py-[7px]">Heating Solutions</span>
            </h1>
            
            <p className="text-lg md:text-xl opacity-90 mb-8 max-w-xl">
              Serving Nassau, Suffolk & NYC with professional plumbing repair, installation, 
              and heating services. Available 24/7 for emergencies.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button variant="hero" size="xl" className="group">
                Get Free Estimate
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="heroOutline" size="xl">
                View Our Services
              </Button>
            </div>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <span className="font-bold text-lg">24/7</span>
                  <p className="text-sm opacity-80">Emergency Service</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
                  <Award className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <span className="font-bold text-lg">35+ Years</span>
                  <p className="text-sm opacity-80">Experience</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <span className="font-bold text-lg">Navien</span>
                  <p className="text-sm opacity-80">Authorized Dealer</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Slideshow */}
          <div className="relative animate-slide-up animation-delay-200">
            <div className="relative rounded-3xl overflow-hidden shadow-large">
              <Carousel
                setApi={setApi}
                opts={{
                  loop: true,
                }}
                plugins={[
                  Autoplay({
                    delay: 15000,
                    stopOnInteraction: false,
                    stopOnMouseEnter: true,
                  }),
                ]}
                className="w-full"
              >
                <CarouselContent>
                  {slides.map((slide, index) => (
                    <CarouselItem key={index}>
                      {slide.type === 'video' ? (
                        <video
                          src={slide.src}
                          autoPlay
                          muted
                          loop
                          playsInline
                          className="w-full h-auto object-cover aspect-video"
                        />
                      ) : (
                        <img
                          src={slide.src}
                          alt={slide.alt}
                          className="w-full h-auto object-cover aspect-video"
                        />
                      )}
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
              
              {/* Navigation Arrows */}
              <button
                onClick={scrollPrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-background transition-colors"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={scrollNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-background transition-colors"
                aria-label="Next slide"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              
              {/* Dot Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {Array.from({ length: count }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => scrollTo(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      index === current
                        ? 'bg-secondary w-6'
                        : 'bg-background/60 hover:bg-background/80'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
              
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent pointer-events-none" />
            </div>
            
            {/* Floating Card */}
            <div className="absolute -bottom-6 -left-6 bg-card p-6 rounded-2xl shadow-large animate-float">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl cta-gradient flex items-center justify-center">
                  <span className="text-secondary-foreground font-heading font-bold text-2xl">5★</span>
                </div>
                <div>
                  <p className="font-heading font-bold text-foreground">Excellent Service</p>
                  <p className="text-sm text-muted-foreground">500+ Happy Customers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="hsl(210, 25%, 97%)" />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
