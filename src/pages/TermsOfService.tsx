import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Wrench, UserCheck, DollarSign, AlertTriangle, Award, Scale, Phone } from 'lucide-react';

const TermsOfService = () => {
  const sections = [
    {
      icon: FileText,
      title: "Acceptance of Terms",
      content: [
        "By accessing or using Big City Plumbing & Heating Inc.'s website and services, you agree to be bound by these Terms of Service",
        "If you do not agree to these terms, please do not use our services",
        "We reserve the right to modify these terms at any time without prior notice",
        "Your continued use of our services after any changes constitutes acceptance of those changes"
      ]
    },
    {
      icon: Wrench,
      title: "Services Description",
      content: [
        "Big City Plumbing & Heating Inc. provides professional plumbing and heating services",
        "Services include but are not limited to: plumbing repair, heating system installation, gas conversion, tankless water heaters, and emergency services",
        "All services are performed by licensed and insured professionals",
        "We serve Nassau County, Suffolk County, and New York City areas"
      ]
    },
    {
      icon: UserCheck,
      title: "User Responsibilities",
      content: [
        "You agree to provide accurate and complete information when requesting services",
        "You must ensure safe access to work areas for our technicians",
        "You are responsible for disclosing any known hazards or conditions that may affect service delivery",
        "You agree to be present or have an authorized representative present during scheduled appointments"
      ]
    },
    {
      icon: DollarSign,
      title: "Estimates and Pricing",
      content: [
        "Estimates are provided based on information available at the time of assessment",
        "Final pricing may vary if additional issues are discovered during service",
        "Any changes to scope or pricing will be communicated and require your approval before proceeding",
        "Payment is due upon completion of services unless other arrangements have been made"
      ]
    },
    {
      icon: AlertTriangle,
      title: "Limitation of Liability",
      content: [
        "Big City Plumbing & Heating Inc. is not liable for pre-existing conditions not disclosed prior to service",
        "We are not responsible for delays caused by factors beyond our control",
        "Our liability is limited to the cost of services provided",
        "We are not liable for indirect, incidental, or consequential damages"
      ]
    },
    {
      icon: Award,
      title: "Warranty Information",
      content: [
        "Warranties on workmanship and parts vary by service type",
        "Manufacturer warranties apply to installed equipment as specified by the manufacturer",
        "Warranty claims must be reported promptly upon discovery of any issues",
        "Warranties do not cover damage caused by misuse, neglect, or unauthorized modifications"
      ]
    },
    {
      icon: Scale,
      title: "Governing Law",
      content: [
        "These Terms of Service are governed by the laws of the State of New York",
        "Any disputes arising from these terms or our services shall be resolved in the courts of New York State",
        "You agree to submit to the personal jurisdiction of such courts",
        "If any provision of these terms is found unenforceable, the remaining provisions will continue in effect"
      ]
    },
    {
      icon: Phone,
      title: "Contact Information",
      content: [
        "Big City Plumbing & Heating Inc.",
        "Long Island: 631-361-9500",
        "New York City: 718-326-5833",
        "Service Areas: Nassau County, Suffolk County, and New York City"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Terms of Service - Big City Plumbing and Heating"
        description="Terms and conditions for Big City Plumbing and Heating services. Read our service agreements, warranties, and policies."
        path="/terms-of-service"
      />
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero-gradient pt-32 pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-secondary/20 text-secondary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <FileText className="w-4 h-4" />
              Legal Agreement
            </div>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
              Terms of Service
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto">
              Please read these terms carefully before using our plumbing and heating services.
            </p>
            <p className="text-sm text-primary-foreground/60 mt-4">
              Last Updated: February 2026
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <p className="text-muted-foreground mb-12 text-center">
              These Terms of Service ("Terms") govern your use of the services provided by Big City Plumbing 
              & Heating Inc. ("Company," "we," "us," or "our"). By engaging our services, you agree to 
              comply with and be bound by the following terms and conditions.
            </p>

            <div className="space-y-6">
              {sections.map((section, index) => (
                <Card key={index} className="shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 font-heading text-xl">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <section.icon className="w-5 h-5 text-primary" />
                      </div>
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {section.content.map((item, itemIndex) => (
                        <li key={itemIndex} className="text-muted-foreground flex items-start gap-2">
                          <span className="text-secondary mt-1.5">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TermsOfService;
