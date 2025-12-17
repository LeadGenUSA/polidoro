import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Clock, Award } from 'lucide-react';
import heroImage from '@/assets/hero-plumbing.jpg';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center hero-gradient overflow-hidden">
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
              <span className="text-gradient block">Heating Solutions</span>
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
          
          {/* Right Image */}
          <div className="relative animate-slide-up animation-delay-200">
            <div className="relative rounded-3xl overflow-hidden shadow-large">
              <img 
                src={heroImage} 
                alt="Professional plumbing and heating services" 
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
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
          <path 
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" 
            fill="hsl(210, 25%, 97%)"
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
