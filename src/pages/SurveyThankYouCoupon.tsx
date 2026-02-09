import { useEffect } from 'react';
import { Printer, Scissors, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import logo from '@/assets/big-city-plumbing-and-heating-logo-2.png';

const SurveyThankYouCoupon = () => {
  // Prevent search engine indexing
  useEffect(() => {
    const metaRobots = document.createElement('meta');
    metaRobots.name = 'robots';
    metaRobots.content = 'noindex, nofollow';
    document.head.appendChild(metaRobots);

    return () => {
      document.head.removeChild(metaRobots);
    };
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero-gradient pt-32 pb-16">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <span className="inline-block px-4 py-2 bg-secondary/20 text-secondary rounded-full text-sm font-semibold mb-6">
            Thank You
          </span>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            Thanks for Your Feedback!
          </h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            As a token of our appreciation for completing our customer survey, please enjoy this exclusive discount on your next service.
          </p>
        </div>
      </section>

      {/* Coupon Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-2xl mx-auto">
            {/* Printable Coupon */}
            <Card className="relative overflow-hidden border-2 border-dashed border-secondary print:border-solid" id="coupon">
              {/* Scissors decoration */}
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 bg-background p-1 print:hidden">
                <Scissors className="w-6 h-6 text-secondary rotate-90" />
              </div>
              <div className="absolute -right-3 top-1/2 -translate-y-1/2 bg-background p-1 print:hidden">
                <Scissors className="w-6 h-6 text-secondary -rotate-90" />
              </div>

              <div className="p-8 md:p-12 text-center">
                {/* Logo */}
                <div className="flex justify-center mb-6">
                  <img 
                    src={logo} 
                    alt="Big City Plumbing & Heating" 
                    className="w-24 h-24 rounded-full object-cover"
                  />
                </div>

                {/* Company Name */}
                <h2 className="font-heading text-2xl md:text-3xl font-bold text-primary mb-2">
                  Big City Plumbing & Heating Inc.
                </h2>
                
                {/* Discount Amount */}
                <div className="my-8">
                  <div className="inline-block bg-secondary/10 rounded-2xl px-8 py-6">
                    <span className="font-heading text-6xl md:text-7xl font-bold text-secondary">
                      $50
                    </span>
                    <span className="block font-heading text-2xl md:text-3xl font-bold text-primary mt-2">
                      OFF
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xl md:text-2xl font-semibold text-foreground mb-4">
                  Your Next Plumbing or Heating Service
                </p>
                <p className="text-muted-foreground mb-6">
                  Thank you for taking the time to share your feedback with us! Present this coupon at the time of service to receive your discount.
                </p>

                {/* Terms */}
                <div className="border-t border-border pt-6 mt-6">
                  <p className="text-sm text-muted-foreground mb-4">
                    * Cannot be combined with other offers. One coupon per household. 
                    Valid for residential services only. Excludes emergency services.
                  </p>
                  
                  {/* Contact Info */}
                  <div className="flex flex-col md:flex-row justify-center items-center gap-4 text-sm">
                    <div className="flex items-center gap-2 text-foreground">
                      <Phone className="w-4 h-4 text-secondary" />
                      <span>631-361-9500</span>
                    </div>
                    <div className="hidden md:block text-muted-foreground">|</div>
                    <div className="flex items-center gap-2 text-foreground">
                      <Phone className="w-4 h-4 text-secondary" />
                      <span>718-326-5833 (NYC)</span>
                    </div>
                    <div className="hidden md:block text-muted-foreground">|</div>
                    <div className="flex items-center gap-2 text-foreground">
                      <MapPin className="w-4 h-4 text-secondary" />
                      <span>Nassau, Suffolk & NYC</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Print Button */}
            <div className="text-center mt-8 print:hidden">
              <Button 
                onClick={handlePrint}
                size="lg"
                className="gap-2"
              >
                <Printer className="w-5 h-5" />
                Print This Coupon
              </Button>
              <p className="text-sm text-muted-foreground mt-3">
                Click the button above to print a printer-friendly version of this coupon.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #coupon, #coupon * {
            visibility: visible;
          }
          #coupon {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 100%;
            max-width: 600px;
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default SurveyThankYouCoupon;
