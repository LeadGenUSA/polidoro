import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import About from '@/components/About';
import Testimonials from '@/components/Testimonials';
import Certifications from '@/components/Certifications';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';

const Index = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="Big City Plumbing and Heating - Licensed Plumbers, Long Island &amp; NYC"
        description="Licensed plumbing and heating services for Long Island and New York City. Boiler installation, oil to gas conversion, radiant heat, and 24-hour emergency service. Call 631-361-9500."
        path="/"
      />
      <Navbar />
      <Hero />
      <Services />
      <About />
      <Testimonials />
      <Certifications />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
