import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { 
  Wrench, 
  Flame, 
  Droplets, 
  Fuel, 
  AlertTriangle,
  Phone,
  ArrowRight,
  CheckCircle,
  Shield
} from 'lucide-react';

const services = [
  {
    icon: Flame,
    title: 'Heating Systems',
    slug: 'heating-systems',
    description: 'Expert heating system installation, maintenance, and repair. We specialize in high-efficiency boilers and heating solutions for maximum comfort and energy savings.',
    features: [
      'Boiler installation and repair',
      'Radiant floor heating',
      'Baseboard heating systems',
      'Steam heating systems',
      'Hydronic heating',
      'Annual maintenance programs'
    ],
    link: '/heating-services',
    linkText: 'View Heating Services'
  },
  {
    icon: Wrench,
    title: 'Plumbing Repair',
    slug: 'plumbing-repair',
    description: 'Comprehensive plumbing repair services for residential and commercial properties. From leaky faucets to complete pipe replacements, our licensed plumbers handle it all.',
    features: [
      'Leak detection and repair',
      'Pipe repair and replacement',
      'Fixture installation and repair',
      'Water pressure issues',
      'Sewer line services'
    ],
    link: '/plumbing-services',
    linkText: 'View Plumbing Services'
  },
  {
    icon: Droplets,
    title: 'Tankless Water Heaters',
    slug: 'tankless-water-heaters',
    description: 'As NSS Certified Navien Specialists, we provide expert installation and service of tankless water heaters for endless hot water and improved energy efficiency.',
    features: [
      'Navien tankless installation',
      'System sizing and design',
      'Retrofit and replacement',
      'Maintenance and repair',
      'Commercial multi-unit systems',
      'Energy efficiency upgrades'
    ],
    link: '/heating-services',
    linkText: 'Learn More'
  },
  {
    icon: Fuel,
    title: 'Gas Conversion',
    slug: 'gas-conversion',
    description: 'Professional oil-to-gas conversion services. Upgrade to cleaner, more efficient natural gas heating and reduce your energy costs while helping the environment.',
    features: [
      'Oil to gas boiler conversion',
      'Gas line installation',
      'Utility coordination',
      'Permit acquisition',
      'Safety inspections',
      'Energy rebate assistance'
    ],
    link: '/heating-services',
    linkText: 'Learn More'
  },
  {
    icon: AlertTriangle,
    title: 'Emergency Services',
    slug: 'emergency-services',
    description: '24-hour response time for plumbing and heating emergencies. When disaster strikes, our rapid response team is ready to help protect your property.',
    features: [
      '24-hour response time',
      'Burst pipe repair',
      'No heat emergencies',
      'Gas leak detection',
      'Water damage mitigation',
      'Same-day service available'
    ],
    link: null,
    linkText: null
  }
];

const Services = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1));
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
      }
    }
  }, [location.hash]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title="Our Services - Big City Plumbing and Heating"
        description="Full range of plumbing and heating services for Long Island and NYC. Repairs, installations, oil to gas conversions, radiant heat, and emergency service."
        path="/services"
      />
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="pt-24 pb-16 bg-primary">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 text-primary-foreground font-medium mb-6">
                <Shield className="w-4 h-4" />
                Professional Services
              </div>
              <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
                Our Services
              </h1>
              <p className="text-lg text-primary-foreground/80">
                From routine repairs to complex installations, Big City Plumbing & Heating 
                provides comprehensive plumbing and heating services for residential and commercial properties.
              </p>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="space-y-12">
              {services.map((service, index) => (
                <div 
                  key={service.title}
                  id={service.slug}
                  className={`scroll-mt-24 flex flex-col lg:flex-row gap-8 items-start ${
                    index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  {/* Icon & Title Card */}
                  <div className="w-full lg:w-1/3">
                    <div className="bg-card rounded-2xl p-8 shadow-card h-full">
                      <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                        <service.icon className="w-8 h-8 text-primary" />
                      </div>
                      <h2 className="font-heading text-2xl font-bold text-foreground mb-3">
                        {service.title}
                      </h2>
                      <p className="text-muted-foreground mb-6">
                        {service.description}
                      </p>
                      {service.link ? (
                        <Button asChild className="gap-2">
                          <Link to={service.link}>
                            {service.linkText}
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </Button>
                      ) : (
                        <Button asChild variant="hero" className="gap-2">
                          <a href="tel:631-361-9500">
                            <Phone className="w-4 h-4" />
                            Call Now: 631-361-9500
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="w-full lg:w-2/3">
                    <div className="bg-muted/30 rounded-2xl p-8 h-full">
                      <h3 className="font-heading text-lg font-semibold text-foreground mb-6">
                        What We Offer
                      </h3>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {service.features.map((feature) => (
                          <div key={feature} className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                            <span className="text-foreground">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Contact us today for a free estimate. Our team of licensed professionals 
              is ready to help with all your plumbing and heating needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="xl" asChild>
                <a href="tel:631-361-9500" className="gap-2">
                  <Phone className="w-5 h-5" />
                  Call 631-361-9500
                </a>
              </Button>
              <Button variant="heroOutline" size="xl" asChild>
                <Link to="/free-estimate">
                  Request Estimate
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Services;
