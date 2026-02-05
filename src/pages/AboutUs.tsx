import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CheckCircle2, Award, Shield, Building2 } from 'lucide-react';
import michaelPolidoro from '@/assets/michael-polidoro.png';

const credentials = [
  'Master Plumber License since 1988',
  'Member of NYC Master Plumber Association',
  'Licensed in Nassau, Suffolk & all 5 NYC Boroughs',
  'Backflow Prevention Device Tester Certified',
  'Certified WARDFLEX Installer',
  'EPA Certified for Lead-Based Paint Renovation',
  'Valued Plus Plumber with National Grid',
  'Registered with HEAP and HPD',
];

const accomplishments = [
  {
    icon: Building2,
    title: 'DOT Boiler Conversion',
    description: 'Completed boiler conversion project for the Department of Transportation in Riverhead.',
  },
  {
    icon: Building2,
    title: 'Avalon Apartment Complex',
    description: 'Hot water replacement for the prestigious Avalon apartment complex.',
  },
  {
    icon: Award,
    title: '$2 Million Contract',
    description: 'Awarded major contract for the Green Point Men\'s Shelter project.',
  },
  {
    icon: Shield,
    title: 'HPD Panel Member',
    description: 'Served on panels for HPD and worked on the VRAP program under Mayor Dinkins.',
  },
];

const stats = [
  { value: '35+', label: 'Years Experience' },
  { value: '5000+', label: 'Projects Completed' },
  { value: '24/7', label: 'Emergency Service' },
  { value: '100%', label: 'Satisfaction Rate' },
];

const AboutUs = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero-gradient pt-32 pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block px-4 py-2 rounded-full bg-secondary/20 text-secondary font-semibold text-sm mb-4">
              About Us
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
              Trusted by New Yorkers
              <span className="block text-secondary"> Since 1988</span>
            </h1>
            <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
              Big City Plumbing & Heating has been providing reliable, professional plumbing 
              and heating services to homes and businesses across New York for over three decades.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-card -mt-12 relative z-10">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <div 
                key={stat.label}
                className="bg-background p-6 lg:p-8 rounded-2xl shadow-card text-center animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <span className="font-heading text-3xl lg:text-4xl font-bold text-gradient">
                  {stat.value}
                </span>
                <p className="text-muted-foreground mt-2 font-medium text-sm lg:text-base">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Owner Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Image */}
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-card">
                <img 
                  src={michaelPolidoro} 
                  alt="Michael Polidoro - Owner of Big City Plumbing & Heating" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-secondary text-secondary-foreground p-6 rounded-2xl shadow-lg hidden lg:block">
                <p className="font-heading font-bold text-2xl">Master Plumber</p>
                <p className="text-sm opacity-80">Since 1988</p>
              </div>
            </div>

            {/* Content */}
            <div>
              <span className="inline-block px-4 py-2 rounded-full bg-secondary/10 text-secondary font-semibold text-sm mb-4">
                Meet the Owner
              </span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
                Michael Polidoro
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Michael Polidoro has been a Master Plumber since 1988, bringing over 35 years of 
                expertise to every project. Big City Plumbing & Heating Inc. is fully licensed, 
                insured, and bonded, ensuring our customers receive the highest quality service 
                with complete peace of mind.
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                As a member of the NYC Master Plumber Association and licensed across Nassau, 
                Suffolk, and all five NYC boroughs, we have the credentials and experience to 
                handle any plumbing or heating challenge you may face.
              </p>
              
              {/* Mobile badge */}
              <div className="bg-secondary text-secondary-foreground p-4 rounded-xl mb-8 lg:hidden">
                <p className="font-heading font-bold text-xl">Master Plumber License #1285</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Credentials Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 rounded-full bg-secondary/10 text-secondary font-semibold text-sm mb-4">
              Credentials
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
              Licensed & Certified
            </h2>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {credentials.map((credential) => (
              <div 
                key={credential}
                className="bg-background p-6 rounded-xl shadow-card flex items-start gap-3"
              >
                <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                <span className="text-foreground font-medium text-sm">{credential}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Accomplishments Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 rounded-full bg-secondary/10 text-secondary font-semibold text-sm mb-4">
              Our Work
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
              Notable Accomplishments
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {accomplishments.map((item) => (
              <div 
                key={item.title}
                className="bg-card p-8 rounded-2xl shadow-card"
              >
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="font-heading text-xl font-bold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs;
