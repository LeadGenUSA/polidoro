import { Phone, MapPin, Facebook, Linkedin, Youtube, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '@/assets/big-city-plumbing-and-heating-logo-2.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="hero-gradient pt-16 pb-8">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img src={logo} alt="Big City Plumbing & Heating" className="w-24 h-24 rounded-full object-cover" />
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
              <li>
                <Link to="/" className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/plumbing-services" className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/about-us" className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm">
                  About
                </Link>
              </li>
              <li>
                <Link to="/testimonials" className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm">
                  Reviews
                </Link>
              </li>
              <li>
                <a href="/#contact" className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm">
                  Contact
                </a>
              </li>
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
            <div className="flex flex-wrap gap-3 mt-6">
              <a
                href="http://www.facebook.com/bigcityplumbing?ref=tn_tnmn%20/bigcityplumbing.heating"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-primary-foreground/10 hover:bg-secondary flex items-center justify-center transition-colors"
              >
                <Facebook className="w-5 h-5 text-primary-foreground" />
              </a>
              <a
                href="https://x.com/bigcityplumbing"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-primary-foreground/10 hover:bg-secondary flex items-center justify-center transition-colors"
              >
                <svg className="w-5 h-5 text-primary-foreground" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/profile/view?id=AAkAAAUWvLUB1msy7omBhpMetwl7zMHANsC8wzs"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-primary-foreground/10 hover:bg-secondary flex items-center justify-center transition-colors"
              >
                <Linkedin className="w-5 h-5 text-primary-foreground" />
              </a>
              <a
                href="http://www.yelp.com/biz/big-city-plumbing-and-heating-centereach"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-primary-foreground/10 hover:bg-secondary flex items-center justify-center transition-colors"
              >
                <svg className="w-5 h-5 text-primary-foreground" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.16 12.594l-4.995 1.433c-.96.276-1.74-.8-1.176-1.63l2.905-4.308a1.072 1.072 0 0 1 1.596-.206 9.194 9.194 0 0 1 2.364 3.252 1.073 1.073 0 0 1-.694 1.459zm-3.397 5.906a1.073 1.073 0 0 1-.94 1.418 9.19 9.19 0 0 1-3.97-.39 1.073 1.073 0 0 1-.58-1.426l1.99-4.778c.402-.97 1.776-.905 2.078.098l1.422 5.078zm-5.654-.986l-4.07 3.09c-.826.627-1.94-.182-1.683-1.223l1.32-5.36c.24-.973 1.617-1.106 2.08-.2l2.79 5.455a.295.295 0 0 1-.437.238zm-6.49-5.108c-.253-1.04.87-1.862 1.696-1.242l4.08 3.072c.81.612.463 1.895-.526 1.94l-5.2.196c-.551.02-.98-.47-.928-1.02a9.211 9.211 0 0 1 .878-2.946zM11.28 9.802l-1.95-4.771c-.394-.964.484-1.963 1.53-1.74a9.188 9.188 0 0 1 3.86 1.624c.387.294.481.832.214 1.24L11.28 9.802z" />
                </svg>
              </a>
              <a
                href="https://www.youtube.com/channel/UC8fcDyolqilmFXHt8pg377Q"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-primary-foreground/10 hover:bg-secondary flex items-center justify-center transition-colors"
              >
                <Youtube className="w-5 h-5 text-primary-foreground" />
              </a>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-foreground/60 text-sm">
            © {currentYear} Big City Plumbing & Heating. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/privacy-policy" className="text-primary-foreground/60 hover:text-primary-foreground text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="text-primary-foreground/60 hover:text-primary-foreground text-sm transition-colors">
              Terms of Service
            </Link>
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
