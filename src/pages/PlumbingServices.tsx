import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Phone, Wrench, Droplets, Flame, ShieldCheck, Clock, FileCheck, Gauge, Bath, Filter, Settings, HelpCircle, Fuel } from 'lucide-react';

const plumbingServices = [
{
  icon: Wrench,
  title: 'Plumbing Repairs & Installation',
  description: 'Complete plumbing repair and installation services for residential and commercial properties.'
},
{
  icon: FileCheck,
  title: 'Permits & Violations Removed',
  description: 'Expert assistance with plumbing permits and violation removal services.'
},
{
  icon: Gauge,
  title: 'RPZ Installation',
  description: 'Professional RPZ (Reduced Pressure Zone) backflow preventer installation and testing.'
},
{
  icon: Flame,
  title: 'Hot Water Heaters',
  description: 'Tank and tankless water heater installation and repair - gas and oil options available.'
},
{
  icon: Bath,
  title: 'Shower Enclosures',
  description: 'Fiberglass one-piece shower enclosure installation for a clean, modern look.'
},
{
  icon: Droplets,
  title: 'Faucets, Sinks & Toilets',
  description: 'Expert repair and installation of faucets, sinks, and toilets.'
},
{
  icon: ShieldCheck,
  title: 'Slab Leak Repairs',
  description: 'Specialized detection and repair of slab leaks to protect your foundation.'
},
{
  icon: Settings,
  title: 'Circulator Pumps',
  description: 'Circulator pump repair and installation for efficient water circulation.'
},
{
  icon: HelpCircle,
  title: 'Consulting Services',
  description: 'Professional plumbing consulting services available for your projects.'
},
{
  icon: Filter,
  title: 'Water Filtration Systems',
  description: 'Installation of water filtration systems for clean, safe drinking water.'
},
{
  icon: Clock,
  title: 'Emergency Service',
  description: '24/7 emergency plumbing services when you need us most.'
},
{
  icon: Fuel,
  title: 'Gas Line Services',
  description: 'Gas line repairs and installations by licensed professionals.'
}];


const plumbingServiceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Plumbing",
  "provider": {
    "@type": "Plumber",
    "name": "Big City Plumbing and Heating",
    "telephone": ["631-361-9500", "718-326-5833"],
    "url": "https://www.bigcityplumbing.com"
  },
  "areaServed": ["Long Island", "Nassau County", "Suffolk County", "Queens", "Brooklyn", "Manhattan", "Bronx"],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Plumbing Services",
    "itemListElement": plumbingServices.map((s) => ({
      "@type": "Offer",
      "itemOffered": { "@type": "Service", "name": s.title, "description": s.description }
    }))
  }
};

const PlumbingServices = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="Plumbing Services - Big City Plumbing and Heating"
        description="Expert residential and commercial plumbing services in Long Island and NYC. Repairs, installations, permits, backflow testing, and 24-hour emergency plumbing."
        path="/plumbing-services"
        jsonLd={plumbingServiceSchema} />

      <Navbar />
      
      {/* Hero Section */}
      <section className="hero-gradient pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <span className="inline-block px-4 py-2 rounded-full bg-secondary/20 text-secondary font-semibold text-sm mb-6">
              Professional Plumbing Services
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
              Expert Plumbing Solutions
            </h1>
            <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              From repairs to installations, our licensed plumbers deliver quality workmanship 
              for all your residential and commercial plumbing needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="tel:631-361-9500">
                <Button variant="hero" size="xl" className="w-full sm:w-auto">
                  <Phone className="w-5 h-5 mr-2" />
                  Call 631-361-9500
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 lg:py-28 subtle-gradient">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Our Plumbing Services
            </h2>
            <p className="text-lg text-muted-foreground">
              Comprehensive plumbing solutions backed by decades of experience and a commitment to excellence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {plumbingServices.map((service, index) =>
            <div
              key={service.title}
              className="group bg-card p-8 rounded-2xl shadow-card hover:shadow-large transition-all duration-300 hover:-translate-y-1 animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}>

                <div className="w-14 h-14 rounded-xl cta-gradient flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <service.icon className="w-7 h-7 text-secondary-foreground" />
                </div>
                <h3 className="font-heading text-xl font-bold text-foreground mb-3">
                  {service.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Cost/Estimate Section */}
      <section className="py-20 lg:py-28 bg-card">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
              Worried About Cost?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              We understand that plumbing work can be a significant investment. That's why we provide 
              <span className="text-secondary font-semibold"> free written estimates</span> before any work begins, 
              so you know exactly what to expect—no surprises, no hidden fees.
            </p>
            <div className="bg-secondary/10 border border-secondary/20 rounded-2xl p-8 mb-8">
              <h3 className="font-heading text-2xl font-bold text-foreground mb-4">
                Our Guarantee
              </h3>
              <p className="text-muted-foreground">
                Every job comes with a written estimate. We won't start work until you approve the price, 
                and the final cost won't exceed our estimate unless additional work is required and approved by you.
              </p>
            </div>
            <a href="tel:631-361-9500">
              <Button variant="hero" size="xl">
                <Phone className="w-5 h-5 mr-2" />
                Get Your Free Estimate
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Emergency CTA */}
      <section className="hero-gradient py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <div className="flex items-center gap-3 justify-center md:justify-start mb-4">
                <Clock className="w-8 h-8 text-secondary" />
                <span className="text-secondary font-bold text-lg">24-Hour Response Time </span>
              </div>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-primary-foreground mb-2">
                Plumbing Emergency?
              </h2>
              <p className="text-primary-foreground/80">
                We're available around the clock for urgent plumbing issues.
              </p>
            </div>
            <a href="tel:631-361-9500">
              <Button variant="hero" size="xl" className="whitespace-nowrap">
                <Phone className="w-5 h-5 mr-2" />
                Call Now: 631-361-9500
              </Button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>);

};

export default PlumbingServices;