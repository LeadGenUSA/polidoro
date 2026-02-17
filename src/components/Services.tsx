import { Droplets, Flame, Wrench, ShieldCheck, ThermometerSun, Fuel } from 'lucide-react';

const services = [
  {
    icon: Droplets,
    title: 'Plumbing Repair',
    description: 'Expert leak detection, pipe repair, and drain cleaning services for residential and commercial properties.',
  },
  {
    icon: Flame,
    title: 'Heating Systems',
    description: 'Boiler installation, furnace repair, and complete heating system maintenance to keep you warm.',
  },
  {
    icon: ThermometerSun,
    title: 'Tankless Water Heaters',
    description: 'Energy-efficient tankless water heater installation with endless hot water and space savings.',
  },
  {
    icon: Fuel,
    title: 'Gas Conversion',
    description: 'Professional gas line installation and conversion services with National Grid & Con Ed rebates.',
  },
  {
    icon: Wrench,
    title: 'Emergency Services',
    description: '24 hour response on plumbing and heating repairs. We\'re here when you need us most.',
  },
  {
    icon: ShieldCheck,
    title: 'Maintenance Plans',
    description: 'Preventive maintenance programs to extend equipment life and prevent costly repairs.',
  },
];

const Services = () => {
  return (
    <section id="services" className="py-20 lg:py-28 subtle-gradient">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-secondary/10 text-secondary font-semibold text-sm mb-4">
            Our Services
          </span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Complete Plumbing & Heating Solutions
          </h2>
          <p className="text-lg text-muted-foreground">
            From routine maintenance to emergency repairs, we provide comprehensive services 
            for all your plumbing and heating needs.
          </p>
        </div>
        
        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="group bg-card p-8 rounded-2xl shadow-card hover:shadow-large transition-all duration-300 hover:-translate-y-1 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
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
  );
};

export default Services;
