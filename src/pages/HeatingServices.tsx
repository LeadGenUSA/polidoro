import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Phone, Flame, Thermometer, Fuel, Gauge, Droplets, Zap, Settings, RefreshCw, ThermometerSun, Home, Waves } from 'lucide-react';
import industryLeadingProducts from '@/assets/industry-leading-products.webp';
import navienBoiler from '@/assets/NFB-C-2021-small.png';

const heatingServices = [
  {
    icon: Waves,
    title: 'Radiant Heat Design & Installation',
    description: 'Custom in-floor and wall radiant heating systems for comfortable, efficient warmth throughout your home.',
  },
  {
    icon: Flame,
    title: 'Boiler Repair & Installation',
    description: 'Expert boiler repair, maintenance, and new installation services for all makes and models.',
  },
  {
    icon: Fuel,
    title: 'Oil to Gas Conversions',
    description: 'Convert your heating system from oil to natural gas for improved efficiency and cost savings.',
  },
  {
    icon: Settings,
    title: 'Boiler Troubleshooting',
    description: 'Diagnostic services to identify and resolve boiler and heating system issues quickly.',
  },
  {
    icon: Gauge,
    title: 'Weil-McLain High Efficiency Boilers',
    description: 'Installation and service of premium Weil-McLain high-efficiency boiler systems.',
  },
  {
    icon: Droplets,
    title: 'Indirect Hot Water Heaters',
    description: 'Efficient indirect water heater installation that works with your boiler system.',
  },
  {
    icon: Thermometer,
    title: 'Triangle Tube High Efficiency Boilers',
    description: 'Premium Triangle Tube boiler installation for maximum heating efficiency.',
  },
  {
    icon: Zap,
    title: 'NORITZ Tankless Water Heaters',
    description: 'Energy-efficient tankless water heater installation with endless hot water on demand.',
  },
  {
    icon: ThermometerSun,
    title: 'High Efficiency Systems',
    description: 'Installation of high-efficiency boilers and domestic water heaters to reduce energy costs.',
  },
  {
    icon: RefreshCw,
    title: 'Gas Boiler Replacement',
    description: 'New gas boiler installation and replacement with modern, efficient units.',
  },
  {
    icon: Home,
    title: 'Complete Heating Solutions',
    description: 'Full-service heating system design, installation, and maintenance for your comfort.',
  },
];

const HeatingServices = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero-gradient pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <span className="inline-block px-4 py-2 rounded-full bg-secondary/20 text-secondary font-semibold text-sm mb-6">
              Professional Heating Services
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
              Heating And Boiler Services In The City That Never Sleeps
            </h1>
            <p className="text-xl text-primary-foreground/80 mb-4 max-w-3xl mx-auto">
              There are few things as frustrating as trying to find a heating service company to respond to your emergency needs especially after normal business hours and on weekends. Once you locate a company how do you know that they are qualified, reliable and ethical?
            </p>
            <p className="text-2xl font-heading font-bold text-secondary mb-8">
              Big City Plumbing & Heating Inc. is the name to trust.
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
              Our Heating Services
            </h2>
            <p className="text-lg text-muted-foreground">
              Comprehensive heating solutions backed by decades of experience and trusted brand partnerships.
            </p>
          </div>

          <div className="flex justify-center mb-12">
            <img 
              src={navienBoiler} 
              alt="Navien NFB-C High Efficiency Boiler"
              className="max-w-md w-full h-auto"
            />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {heatingServices.map((service, index) => (
              <div
                key={service.title}
                className="group bg-card p-8 rounded-2xl shadow-card hover:shadow-large transition-all duration-300 hover:-translate-y-1 animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
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
            ))}
          </div>
        </div>
      </section>

      {/* Industry Leading Products Section */}
      <section className="py-16 lg:py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <img 
            src={industryLeadingProducts} 
            alt="Industry Leading Products - Energy Star certified boilers and heating equipment"
            className="w-full h-auto rounded-2xl shadow-card"
          />
        </div>
      </section>

      {/* Gas Conversion Section */}
      <section className="py-20 lg:py-28 bg-card">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center gap-3 justify-center mb-6">
              <Fuel className="w-10 h-10 text-secondary" />
            </div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
              Oil to Gas Conversion
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Make the switch to natural gas and enjoy lower fuel costs, cleaner burning, and reduced maintenance. 
              We handle the complete conversion process including all necessary permits and inspections.
            </p>
            <a href="tel:631-361-9500">
              <Button variant="hero" size="xl">
                <Phone className="w-5 h-5 mr-2" />
                Get a Free Conversion Quote
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
                <Flame className="w-8 h-8 text-secondary" />
                <span className="text-secondary font-bold text-lg">No Heat? We're Here to Help</span>
              </div>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-primary-foreground mb-2">
                Heating Emergency?
              </h2>
              <p className="text-primary-foreground/80">
                Don't get left in the cold. Our technicians are available for urgent heating repairs.
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
    </div>
  );
};

export default HeatingServices;
