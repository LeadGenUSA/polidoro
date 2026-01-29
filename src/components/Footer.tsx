import { Phone, Mail, MapPin, Facebook, Linkedin, Youtube, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '@/assets/big-city-plumbing-and-heating.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="hero-gradient pt-16 pb-8">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img src={logo} alt="Big City Plumbing & Heating" className="w-10 h-10 rounded-xl object-cover" />
              <div className="text-primary-foreground">
                <span className="font-heading font-bold text-lg">Big City</span>
                <span className="font-heading text-sm block -mt-1 opacity-80">Plumbing & Heating</span>
              </div>
            </div>
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              Licensed & insured plumbing and heating professionals serving New York since 1988.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-bold text-primary-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {['Home', 'Services', 'About', 'Testimonials', 'Contact'].map((link) => (
                <li key={link}>
                  <a href={`#${link.toLowerCase()}`} className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Services */}
          <div>
            <h4 className="font-heading font-bold text-primary-foreground mb-4">Services</h4>
            <ul className="space-y-2">
              {['Plumbing Repair', 'Heating Systems', 'Tankless Water Heaters', 'Gas Conversion', 'Emergency Services'].map((service) => (
                <li key={service}>
                  <span className="text-primary-foreground/80 text-sm">{service}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="font-heading font-bold text-primary-foreground mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-primary-foreground/80 text-sm">
                <Phone className="w-4 h-4 text-secondary" />
                631-361-9500
              </li>
              <li className="flex items-center gap-3 text-primary-foreground/80 text-sm">
                <Phone className="w-4 h-4 text-secondary" />
                718-326-5833 (NYC)
              </li>
              <li className="flex items-center gap-3 text-primary-foreground/80 text-sm">
                <MapPin className="w-4 h-4 text-secondary" />
                Nassau, Suffolk & NYC
              </li>
            </ul>
            
            {/* Social Links */}
            <div className="flex gap-3 mt-6">
              {[Facebook, Linkedin, Youtube].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-10 h-10 rounded-lg bg-primary-foreground/10 hover:bg-secondary flex items-center justify-center transition-colors"
                >
                  <Icon className="w-5 h-5 text-primary-foreground" />
                </a>
              ))}
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-foreground/60 text-sm">
            © {currentYear} Big City Plumbing & Heating. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-primary-foreground/60 hover:text-primary-foreground text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-primary-foreground/60 hover:text-primary-foreground text-sm transition-colors">
              Terms of Service
            </a>
            <Link 
              to="/admin/login" 
              className="text-primary-foreground/40 hover:text-primary-foreground/60 text-sm transition-colors flex items-center gap-1"
            >
              <Lock className="w-3 h-3" />
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
