import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, CheckCircle, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import TurnstileWidget from '@/components/TurnstileWidget';

const serviceOptions = [
  'Complaint',
  'New Plumbing Problem',
  'New Gas Boiler Installations',
  'Need a Repair',
];

const ContactForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    service: '',
    name: '',
    city: '',
    phone: '',
    email: '',
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

      if (typeof window.gtag === 'function') {
        window.gtag('event', 'lead_submit', {
          event_category: 'lead',
          event_label: 'contact_form',
          value: 1,
        });
        window.gtag('event', 'conversion', {
          send_to: 'AW-17977213592',
        });
      }

      setShowThankYou(true);
      setFormData({ service: '', name: '', city: '', phone: '', email: '', message: '' });
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
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4 lg:px-8 max-w-2xl">
        <h3 className="font-heading text-lg md:text-xl font-bold text-foreground text-center mb-8">
          Please complete the form below for prompt assistance by our team of professionals.
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            value={formData.service}
            onValueChange={(value) => setFormData({ ...formData, service: value })}
          >
            <SelectTrigger className="h-12 bg-background">
              <SelectValue placeholder="How can we help you?" />
            </SelectTrigger>
            <SelectContent className="bg-background z-50">
              {serviceOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="h-12"
          />

          <Input
            placeholder="City"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className="h-12"
          />

          <Input
            type="tel"
            placeholder="Phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
            className="h-12"
          />

          <Input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            className="h-12"
          />

          <Textarea
            placeholder="Message"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            required
            className="min-h-[120px] resize-none"
          />

          <TurnstileWidget onVerify={setTurnstileToken} onExpire={() => setTurnstileToken(null)} />
          <Button variant="hero" size="xl" className="w-full sm:w-auto group" disabled={isSubmitting || !turnstileToken}>
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                Submit
                <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </Button>
        </form>
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

export default ContactForm;
