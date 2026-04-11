import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Eye, Share2, Lock, UserCheck, Mail, RefreshCw } from 'lucide-react';

const PrivacyPolicy = () => {
  const sections = [
    {
      icon: Eye,
      title: "Information We Collect",
      content: [
        "Personal information you provide when requesting services (name, address, phone number, email)",
        "Details about your property and plumbing/heating systems when scheduling estimates or work orders",
        "Photos uploaded through our estimate and work order forms",
        "Communication records including emails and form submissions",
        "Website usage data through cookies and analytics tools"
      ]
    },
    {
      icon: Shield,
      title: "How We Use Your Information",
      content: [
        "To provide plumbing and heating services you request",
        "To schedule appointments and send service reminders",
        "To communicate about your service requests and provide estimates",
        "To improve our services and customer experience",
        "To send promotional materials (with your consent)"
      ]
    },
    {
      icon: Share2,
      title: "Information Sharing",
      content: [
        "We do not sell your personal information to third parties",
        "We may share information with trusted service partners who assist in our operations",
        "We may disclose information when required by law or to protect our rights",
        "Any shared information is protected by confidentiality agreements"
      ]
    },
    {
      icon: Lock,
      title: "Data Security",
      content: [
        "We implement industry-standard security measures to protect your data",
        "All form submissions are transmitted over secure, encrypted connections",
        "Access to personal information is limited to authorized personnel",
        "We regularly review and update our security practices"
      ]
    },
    {
      icon: UserCheck,
      title: "Your Rights",
      content: [
        "You may request access to the personal information we hold about you",
        "You may request correction of inaccurate information",
        "You may request deletion of your personal information (subject to legal requirements)",
        "You may opt out of marketing communications at any time"
      ]
    },
    {
      icon: Mail,
      title: "Contact Us",
      content: [
        "For privacy-related inquiries, please contact us:",
        "Phone: 631-361-9500 (Long Island) or 718-326-5833 (NYC)",
        "Email: Through our website contact form",
        "Service Areas: Nassau County, Suffolk County, and New York City"
      ]
    },
    {
      icon: RefreshCw,
      title: "Policy Updates",
      content: [
        "We may update this Privacy Policy periodically",
        "Changes will be posted on this page with an updated effective date",
        "Continued use of our services after changes constitutes acceptance",
        "We encourage you to review this policy regularly"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Privacy Policy - Big City Plumbing and Heating"
        description="How Big City Plumbing and Heating collects, uses, and protects your personal information. Read our privacy policy for details on data security."
        canonical="/privacy-policy"
      />
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero-gradient pt-32 pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-secondary/20 text-secondary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              Your Privacy Matters
            </div>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
              Privacy Policy
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto">
              Big City Plumbing & Heating Inc. is committed to protecting your privacy and personal information.
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
              This Privacy Policy explains how Big City Plumbing & Heating Inc. collects, uses, and protects 
              your personal information when you use our website and services. By using our services, you 
              agree to the collection and use of information in accordance with this policy.
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

export default PrivacyPolicy;
