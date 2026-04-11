import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import About from '@/components/About';
import Testimonials from '@/components/Testimonials';
import Certifications from '@/components/Certifications';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "Plumber",
  "name": "Big City Plumbing and Heating",
  "description": "Licensed plumbing and heating services for Long Island and New York City. Boiler installation, oil to gas conversion, radiant heat, and 24-hour emergency service.",
  "url": "https://www.bigcityplumbing.com",
  "logo": "https://www.bigcityplumbing.com/favicon.png",
  "telephone": ["631-361-9500", "718-326-5833"],
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "122 Spruce St",
    "addressLocality": "Massapequa",
    "addressRegion": "NY",
    "postalCode": "11758",
    "addressCountry": "US"
  },
  "areaServed": [
    { "@type": "State", "name": "New York" },
    { "@type": "AdministrativeArea", "name": "Long Island" },
    { "@type": "AdministrativeArea", "name": "Nassau County" },
    { "@type": "AdministrativeArea", "name": "Suffolk County" },
    { "@type": "City", "name": "Queens" },
    { "@type": "City", "name": "Brooklyn" },
    { "@type": "City", "name": "Manhattan" },
    { "@type": "City", "name": "Bronx" },
    { "@type": "City", "name": "Staten Island" }
  ],
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    "opens": "00:00",
    "closes": "23:59"
  },
  "founder": {
    "@type": "Person",
    "name": "Michael Polidoro"
  },
  "priceRange": "$$",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "70",
    "bestRating": "5"
  },
  "sameAs": [
    "http://www.facebook.com/bigcityplumbing",
    "https://x.com/bigcityplumbing",
    "https://www.linkedin.com/profile/view?id=AAkAAAUWvLUB1msy7omBhpMetwl7zMHANsC8wzs",
    "http://www.yelp.com/biz/big-city-plumbing-and-heating-centereach",
    "https://www.youtube.com/channel/UC8fcDyolqilmFXHt8pg377Q"
  ],
  "image": "https://www.bigcityplumbing.com/favicon.png"
};

const Index = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="Big City Plumbing and Heating - Licensed Plumbers, Long Island &amp; NYC"
        description="Licensed plumbing and heating services for Long Island and New York City. Boiler installation, oil to gas conversion, radiant heat, and 24-hour emergency service. Call 631-361-9500."
        canonical="/"
        schemaJson={localBusinessSchema}
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
