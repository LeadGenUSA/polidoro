import { CheckCircle2 } from 'lucide-react';

const stats = [
  { value: '35+', label: 'Years Experience' },
  { value: '5000+', label: 'Projects Completed' },
  { value: '24/7', label: 'Response Time' },
  { value: '100%', label: 'Satisfaction Rate' },
];

const highlights = [
  'Licensed & Insured Professionals',
  'Authorized Navien Dealer & Installer',
  'National Grid & Con Ed Rebates',
  'Residential & Commercial Services',
  'Free Estimates Available',
  'Serving Nassau, Suffolk & NYC',
];

const About = () => {
  return (
    <section id="about" className="py-20 lg:py-28 bg-card">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div>
            <span className="inline-block px-4 py-2 rounded-full bg-secondary/10 text-secondary font-semibold text-sm mb-4">
              About Us
            </span>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Trusted by New Yorkers
              <span className="text-gradient"> Since 1988</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Big City Plumbing & Heating has been providing reliable, professional plumbing 
              and heating services to homes and businesses across New York for over three decades. 
              Our certified technicians are trained to handle everything from minor repairs to 
              complete system installations.
            </p>
            
            {/* Highlights */}
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {highlights.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0" />
                  <span className="text-foreground font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right Stats */}
          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, index) => (
              <div 
                key={stat.label}
                className="bg-background p-8 rounded-2xl shadow-card text-center animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <span className="font-heading text-4xl lg:text-5xl font-bold text-gradient">
                  {stat.value}
                </span>
                <p className="text-muted-foreground mt-2 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
