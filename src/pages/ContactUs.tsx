import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import { Phone, MapPin } from 'lucide-react';

const ContactUs = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Header */}
      <section className="bg-primary pt-32 pb-16">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            Contact Us
          </h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            Get in touch with our expert plumbing and heating team.
          </p>
        </div>
      </section>

      {/* Location Info + Map */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left - Contact Info */}
            <div className="space-y-8">
              {/* Long Island */}
              <div>
                <h2 className="font-heading text-xl font-bold text-primary uppercase mb-1">Long Island:</h2>
                <a href="tel:6313619500" className="text-lg font-bold text-foreground hover:text-primary transition-colors">
                  631.361.9500
                </a>
              </div>

              {/* NYC */}
              <div>
                <h2 className="font-heading text-xl font-bold text-primary uppercase mb-1">New York City:</h2>
                <p className="text-muted-foreground">68-01 79 Street Middle Village NY 11379</p>
                <a href="tel:7183265833" className="text-lg font-bold text-foreground hover:text-primary transition-colors block">
                  718.326.5833
                </a>
                <a href="tel:7185044876" className="text-lg font-bold text-foreground hover:text-primary transition-colors block">
                  718.504.4876
                </a>
              </div>

              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Someone will pick up the phone to help you 24/7. We use <span className="underline font-medium text-foreground">real</span> people, not an answering machine.
                </p>
                <p>
                  You can also contact us via the form below and indicate the type of service you are looking for. Just write a small description and the best time to contact you and one of our service technicians will set up an appointment and meet you at the job site.
                </p>
                <p>
                  You can also visit our showroom to discuss your needs.
                </p>
              </div>
            </div>

            {/* Right - Showroom Address + Map */}
            <div>
              <div className="mb-4">
                <h2 className="font-heading text-xl font-bold text-secondary mb-1">Showroom Address:</h2>
                <p className="text-muted-foreground">2639-2 Middle County Road, Centereach, NY 11720.</p>
              </div>
              <div className="rounded-2xl overflow-hidden shadow-card">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3020.5!2d-73.0843!3d40.8584!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89e83775f2e34d95%3A0x6c0e2cb3c13e38d6!2s2639%20Middle%20Country%20Rd%2C%20Centereach%2C%20NY%2011720!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
                  width="100%"
                  height="350"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Big City Plumbing & Heating Showroom Location"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <ContactForm />

      <Footer />
    </div>
  );
};

export default ContactUs;
