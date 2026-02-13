import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Phone, Mail, MapPin, Clock, Send, Loader2, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import TurnstileWidget from '@/components/TurnstileWidget';

const contactInfo = [
  {
    icon: Phone,
    title: 'Phone',
    details: ['631-361-9500 (LI)', '718-326-5833 (NYC)'],
  },
  {
    icon: Mail,
    title: 'Email',
    details: ['info@bigcityplumbing.com'],
  },
  {
    icon: MapPin,
    title: 'Service Areas',
    details: ['Nassau, Suffolk & 5 Boroughs'],
  },
  {
    icon: Clock,
    title: 'Hours',
    details: ['24-Hour Response Time'],
  },
];

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-contact-form', {
        body: { ...formData, turnstileToken },
      });

      if (error) throw error;

      setShowThankYou(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
      setTurnstileToken(null);
    } catch (error: any) {
      console.error('Error sending contact form:', error);
      toast({
        title: "Failed to send message",
        description: "Please try again or call us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 lg:py-28 bg-card">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left - Contact Info */}
          <div>
            <span className="inline-block px-4 py-2 rounded-full bg-secondary/10 text-secondary font-semibold text-sm mb-4">
              Contact Us
            </span>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Get Your Free Estimate Today
            </h2>
            <p className="text-lg text-muted-foreground mb-10">
              Ready to solve your plumbing or heating issues? Contact us for a free, 
              no-obligation estimate. We're here to help 24/7.
            </p>
            
            {/* Contact Cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              {contactInfo.map((item) => (
                <div 
                  key={item.title}
                  className="bg-background p-5 rounded-xl shadow-soft flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-lg cta-gradient flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-secondary-foreground" />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-foreground mb-1">{item.title}</h4>
                    {item.details.map((detail) => (
                      <p key={detail} className="text-sm text-muted-foreground">{detail}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right - Form */}
          <div className="bg-background p-8 lg:p-10 rounded-2xl shadow-card">
            <h3 className="font-heading text-2xl font-bold text-foreground mb-6">
              Request a Quote
            </h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Input
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="h-12"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="h-12"
                />
                <Input
                  type="tel"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  className="h-12"
                />
              </div>
              <div>
                <Textarea
                  placeholder="Describe your plumbing or heating needs..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  className="min-h-[120px] resize-none"
                />
              </div>
              <TurnstileWidget onVerify={setTurnstileToken} onExpire={() => setTurnstileToken(null)} />
              <Button variant="hero" size="xl" className="w-full group" disabled={isSubmitting || !turnstileToken}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>

      <Dialog open={showThankYou} onOpenChange={setShowThankYou}>
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader className="items-center">
            <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-secondary" />
            </div>
            <DialogTitle className="text-2xl font-heading">Thank You!</DialogTitle>
            <DialogDescription className="text-base mt-2">
              We will get back to you as soon as possible with your free estimation quote.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-4">
            <p className="text-sm text-muted-foreground">
              Our team typically responds within 24 hours. For urgent matters, please call us directly:
            </p>
            <div className="flex flex-col items-center gap-1 text-sm font-semibold">
              <a href="tel:6313619500" className="text-primary hover:underline">631-361-9500 (Long Island)</a>
              <a href="tel:7183265833" className="text-primary hover:underline">718-326-5833 (NYC)</a>
            </div>
          </div>
          <Button variant="hero" className="mt-4 w-full" onClick={() => setShowThankYou(false)}>
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Contact;
