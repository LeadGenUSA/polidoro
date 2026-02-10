import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Phone, Menu, X, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import logo from '@/assets/big-city-plumbing-and-heating-logo-2.png';

const serviceLinks = [
  { name: 'All Services', href: '/services' },
  { name: 'Plumbing Services', href: '/plumbing-services' },
  { name: 'Heating Services', href: '/heating-services' },
];

const externalLinks = [
  { name: 'Free Estimate Form', href: '/free-estimate', external: false },
  { name: 'Work Order Form', href: '/work-order', external: false },
  { name: 'Customer Survey Form', href: '/customer-survey', external: false },
  { name: 'Blog', href: '/blog', external: false },
];

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about-us' },
  { name: 'Projects', href: '/projects-gallery' },
  { name: 'Reviews', href: '/testimonials' },
  { name: 'How-To Videos', href: '/how-to-videos' },
  { name: 'Contact', href: '/#contact' },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname === href || location.pathname.startsWith(href.split('#')[0]);
  };

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    
    // If it's a hash link on the same page or home page
    if (href.includes('#')) {
      const [path, hash] = href.split('#');
      if (location.pathname === '/' || path === '/') {
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled || isMobileMenuOpen
          ? 'bg-card/95 backdrop-blur-md shadow-card py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Big City Plumbing & Heating" className="w-24 h-24 rounded-full object-cover" />
            <div className={`transition-colors ${isScrolled ? 'text-foreground' : 'text-primary-foreground'}`}>
              <span className="font-heading font-bold text-lg">Big City</span>
              <span className="font-heading text-sm block -mt-1 opacity-80">Plumbing and Heating</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {/* Home */}
            <Link
              to="/"
              onClick={() => handleNavClick('/')}
              className={`font-medium transition-colors hover:text-secondary ${
                isScrolled ? 'text-foreground' : 'text-primary-foreground'
              } ${isActive('/') ? 'text-secondary' : ''}`}
            >
              Home
            </Link>

            {/* About */}
            <Link
              to="/about-us"
              onClick={() => handleNavClick('/about-us')}
              className={`font-medium transition-colors hover:text-secondary ${
                isScrolled ? 'text-foreground' : 'text-primary-foreground'
              } ${isActive('/about-us') ? 'text-secondary' : ''}`}
            >
              About
            </Link>
            
            {/* Services Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className={`flex items-center gap-1 font-medium transition-colors hover:text-secondary ${
                isScrolled ? 'text-foreground' : 'text-primary-foreground'
              } ${serviceLinks.some(link => isActive(link.href)) ? 'text-secondary' : ''}`}>
                Services
                <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="bg-card border-border">
                {serviceLinks.map((link) => (
                  <DropdownMenuItem key={link.name} asChild>
                    <Link
                      to={link.href}
                      onClick={() => handleNavClick(link.href)}
                      className={`w-full cursor-pointer ${isActive(link.href) ? 'text-secondary' : ''}`}
                    >
                      {link.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Projects */}
            <Link
              to="/projects-gallery"
              onClick={() => handleNavClick('/projects-gallery')}
              className={`font-medium transition-colors hover:text-secondary ${
                isScrolled ? 'text-foreground' : 'text-primary-foreground'
              } ${isActive('/projects-gallery') ? 'text-secondary' : ''}`}
            >
              Projects
            </Link>

            {/* Reviews */}
            <Link
              to="/testimonials"
              onClick={() => handleNavClick('/testimonials')}
              className={`font-medium transition-colors hover:text-secondary ${
                isScrolled ? 'text-foreground' : 'text-primary-foreground'
              } ${isActive('/testimonials') ? 'text-secondary' : ''}`}
            >
              Reviews
            </Link>

            {/* How-To Videos */}
            <Link
              to="/how-to-videos"
              onClick={() => handleNavClick('/how-to-videos')}
              className={`font-medium transition-colors hover:text-secondary ${
                isScrolled ? 'text-foreground' : 'text-primary-foreground'
              } ${isActive('/how-to-videos') ? 'text-secondary' : ''}`}
            >
              How-To Videos
            </Link>

            {/* Links Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className={`flex items-center gap-1 font-medium transition-colors hover:text-secondary ${
                isScrolled ? 'text-foreground' : 'text-primary-foreground'
              }`}>
                Links
                <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="bg-card border-border">
                {externalLinks.map((link) => (
                  <DropdownMenuItem key={link.name} asChild>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full cursor-pointer"
                      >
                        {link.name}
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        onClick={() => handleNavClick(link.href)}
                        className="w-full cursor-pointer"
                      >
                        {link.name}
                      </Link>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Contact */}
            <Link
              to="/#contact"
              onClick={() => handleNavClick('/#contact')}
              className={`font-medium transition-colors hover:text-secondary ${
                isScrolled ? 'text-foreground' : 'text-primary-foreground'
              } ${isActive('/#contact') ? 'text-secondary' : ''}`}
            >
              Contact
            </Link>
          </div>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center">
            <Button variant="navCta" size="lg" asChild>
              <a href="tel:631-361-9500" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                CALL US! 631-361-9500
              </a>
            </Button>
          </div>

          {/* Mobile CTA - portrait only */}
          <div className="lg:hidden portrait:flex hidden items-center">
            <Button variant="navCta" size="sm" asChild>
              <a href="tel:631-361-9500" className="flex items-center gap-1">
                <Phone className="w-4 h-4" />
                CALL US!
              </a>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`lg:hidden p-2 ${(isScrolled || isMobileMenuOpen) ? 'text-foreground' : 'text-primary-foreground'}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-border/20">
            <div className="flex flex-col gap-4 pt-4">
              {/* Home */}
              <Link
                to="/"
                onClick={() => handleNavClick('/')}
                className={`font-medium transition-colors ${
                  (isScrolled || isMobileMenuOpen) ? 'text-foreground' : 'text-primary-foreground'
                } ${isActive('/') ? 'text-secondary' : ''}`}
              >
                Home
              </Link>

              {/* About */}
              <Link
                to="/about-us"
                onClick={() => handleNavClick('/about-us')}
                className={`font-medium transition-colors ${
                  (isScrolled || isMobileMenuOpen) ? 'text-foreground' : 'text-primary-foreground'
                } ${isActive('/about-us') ? 'text-secondary' : ''}`}
              >
                About
              </Link>
              
              {/* Mobile Services Section */}
              <div className="flex flex-col gap-2">
                <span className={`font-semibold ${(isScrolled || isMobileMenuOpen) ? 'text-foreground' : 'text-primary-foreground'}`}>
                  Services
                </span>
                <div className="flex flex-col gap-2 pl-4">
                  {serviceLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.href}
                      onClick={() => handleNavClick(link.href)}
                      className={`font-medium transition-colors ${
                        (isScrolled || isMobileMenuOpen) ? 'text-foreground' : 'text-primary-foreground'
                      } ${isActive(link.href) ? 'text-secondary' : ''}`}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Projects */}
              <Link
                to="/projects-gallery"
                onClick={() => handleNavClick('/projects-gallery')}
                className={`font-medium transition-colors ${
                  (isScrolled || isMobileMenuOpen) ? 'text-foreground' : 'text-primary-foreground'
                } ${isActive('/projects-gallery') ? 'text-secondary' : ''}`}
              >
                Projects
              </Link>

              {/* Reviews */}
              <Link
                to="/testimonials"
                onClick={() => handleNavClick('/testimonials')}
                className={`font-medium transition-colors ${
                  (isScrolled || isMobileMenuOpen) ? 'text-foreground' : 'text-primary-foreground'
                } ${isActive('/testimonials') ? 'text-secondary' : ''}`}
              >
                Reviews
              </Link>

              {/* How-To Videos */}
              <Link
                to="/how-to-videos"
                onClick={() => handleNavClick('/how-to-videos')}
                className={`font-medium transition-colors ${
                  (isScrolled || isMobileMenuOpen) ? 'text-foreground' : 'text-primary-foreground'
                } ${isActive('/how-to-videos') ? 'text-secondary' : ''}`}
              >
                How-To Videos
              </Link>

              {/* Mobile Links Section */}
              <div className="flex flex-col gap-2">
                <span className={`font-semibold ${(isScrolled || isMobileMenuOpen) ? 'text-foreground' : 'text-primary-foreground'}`}>
                  Links
                </span>
                <div className="flex flex-col gap-2 pl-4">
                  {externalLinks.map((link) => (
                    link.external ? (
                      <a
                        key={link.name}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`font-medium transition-colors ${
                          (isScrolled || isMobileMenuOpen) ? 'text-foreground' : 'text-primary-foreground'
                        }`}
                      >
                        {link.name}
                      </a>
                    ) : (
                      <Link
                        key={link.name}
                        to={link.href}
                        onClick={() => handleNavClick(link.href)}
                        className={`font-medium transition-colors ${
                          (isScrolled || isMobileMenuOpen) ? 'text-foreground' : 'text-primary-foreground'
                        }`}
                      >
                        {link.name}
                      </Link>
                    )
                  ))}
                </div>
              </div>

              {/* Contact */}
              <Link
                to="/#contact"
                onClick={() => handleNavClick('/#contact')}
                className={`font-medium transition-colors ${
                  (isScrolled || isMobileMenuOpen) ? 'text-foreground' : 'text-primary-foreground'
                } ${isActive('/#contact') ? 'text-secondary' : ''}`}
              >
                Contact
              </Link>
              <Button variant="navCta" size="lg" className="mt-2" asChild>
                <a href="tel:631-361-9500" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  CALL US! 631-361-9500
                </a>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
