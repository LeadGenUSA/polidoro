import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, Loader2 } from 'lucide-react';

const surveySchema = z.object({
  // Customer Info
  customerName: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address').max(100),
  phone: z.string().max(20).optional(),
  serviceDate: z.string().optional(),
  technicianName: z.string().max(100).optional(),
  
  // Service Ratings
  overallSatisfaction: z.enum(['very_satisfied', 'satisfied', 'neutral', 'dissatisfied', 'very_dissatisfied']).optional(),
  qualityOfWork: z.enum(['excellent', 'good', 'average', 'below_average', 'poor']).optional(),
  timeliness: z.enum(['excellent', 'good', 'average', 'below_average', 'poor']).optional(),
  professionalism: z.enum(['excellent', 'good', 'average', 'below_average', 'poor']).optional(),
  communication: z.enum(['excellent', 'good', 'average', 'below_average', 'poor']).optional(),
  valueForMoney: z.enum(['excellent', 'good', 'average', 'below_average', 'poor']).optional(),
  
  // Additional Feedback
  wouldRecommend: z.enum(['yes', 'no', 'maybe']).optional(),
  useAgain: z.enum(['yes', 'no', 'maybe']).optional(),
  whatDidWell: z.string().max(1000).optional(),
  areasToImprove: z.string().max(1000).optional(),
  additionalComments: z.string().max(2000).optional(),
});

type SurveyFormData = z.infer<typeof surveySchema>;

const ratingLabels = {
  excellent: 'Excellent',
  good: 'Good',
  average: 'Average',
  below_average: 'Below Average',
  poor: 'Poor',
};

const satisfactionLabels = {
  very_satisfied: 'Very Satisfied',
  satisfied: 'Satisfied',
  neutral: 'Neutral',
  dissatisfied: 'Dissatisfied',
  very_dissatisfied: 'Very Dissatisfied',
};

const CustomerSurveyForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<SurveyFormData>({
    resolver: zodResolver(surveySchema),
  });

  const onSubmit = async (data: SurveyFormData) => {
    setIsSubmitting(true);
    
    try {
      const { data: response, error } = await supabase.functions.invoke('send-customer-survey', {
        body: data,
      });

      if (error) throw error;

      setIsSubmitted(true);
      toast({
        title: 'Survey Submitted',
        description: 'Thank you for your feedback!',
      });
    } catch (error: any) {
      console.error('Error submitting survey:', error);
      toast({
        title: 'Submission Failed',
        description: 'There was an error submitting your survey. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <section className="relative bg-primary pt-32 pb-16">
          <div className="container mx-auto px-4 max-w-2xl text-center">
            <h1 className="text-4xl font-heading font-bold text-primary-foreground mb-4">
              Customer Survey
            </h1>
          </div>
        </section>
        
        <main className="flex-1 py-12 bg-muted/30">
          <div className="container mx-auto px-4 max-w-2xl">
            <Card className="text-center py-16">
              <CardContent className="space-y-6">
                <CheckCircle className="w-20 h-20 text-primary mx-auto" />
                <h1 className="text-3xl font-heading font-bold text-foreground">
                  Thank You!
                </h1>
                <p className="text-muted-foreground text-lg">
                  We truly appreciate you taking the time to share your feedback. Your input helps us continue to improve our services.
                </p>
                <Button onClick={() => setIsSubmitted(false)} variant="outline">
                  Submit Another Survey
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <section className="relative bg-primary pt-32 pb-16">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h1 className="text-4xl font-heading font-bold text-primary-foreground mb-4">
            Customer Survey
          </h1>
          <p className="text-primary-foreground/80">
            We value your feedback! Please take a moment to share your experience with us.
          </p>
        </div>
      </section>
      
      <main className="flex-1 py-12 bg-muted/30">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Promotional Box */}
          <Card className="mb-8 bg-primary text-primary-foreground text-center">
            <CardContent className="py-8">
              <h2 className="text-2xl font-heading font-bold mb-2">Big City Plumbing & Heating</h2>
              <p className="text-xl font-semibold mb-4">631-361-9500</p>
              <p className="text-lg">
                Please complete the short survey below and we will provide you with
              </p>
              <p className="text-3xl font-bold mt-2">$50.00 off your next plumbing job.</p>
            </CardContent>
          </Card>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Customer Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-primary">Your Information</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customerName">Your Name *</Label>
                  <Input id="customerName" {...register('customerName')} placeholder="Full Name" />
                  {errors.customerName && <p className="text-destructive text-sm mt-1">{errors.customerName.message}</p>}
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input id="email" type="email" {...register('email')} placeholder="your@email.com" />
                  {errors.email && <p className="text-destructive text-sm mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" {...register('phone')} placeholder="(555) 555-5555" />
                </div>
                <div>
                  <Label htmlFor="serviceDate">Date of Service</Label>
                  <Input id="serviceDate" type="date" {...register('serviceDate')} />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="technicianName">Technician Name (if known)</Label>
                  <Input id="technicianName" {...register('technicianName')} placeholder="Technician's name" />
                </div>
              </CardContent>
            </Card>

            {/* Overall Satisfaction */}
            <Card>
              <CardHeader>
                <CardTitle className="text-primary">Overall Satisfaction</CardTitle>
              </CardHeader>
              <CardContent>
                <Label>How satisfied are you with our service?</Label>
                <RadioGroup
                  onValueChange={(value) => setValue('overallSatisfaction', value as any)}
                  className="flex flex-wrap gap-4 mt-3"
                >
                  {Object.entries(satisfactionLabels).map(([value, label]) => (
                    <div key={value} className="flex items-center space-x-2">
                      <RadioGroupItem value={value} id={`satisfaction-${value}`} />
                      <Label htmlFor={`satisfaction-${value}`} className="font-normal">{label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Service Ratings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-primary">Rate Our Service</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Quality of Work</Label>
                  <RadioGroup
                    onValueChange={(value) => setValue('qualityOfWork', value as any)}
                    className="flex flex-wrap gap-4 mt-2"
                  >
                    {Object.entries(ratingLabels).map(([value, label]) => (
                      <div key={value} className="flex items-center space-x-2">
                        <RadioGroupItem value={value} id={`quality-${value}`} />
                        <Label htmlFor={`quality-${value}`} className="font-normal">{label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div>
                  <Label>Timeliness</Label>
                  <RadioGroup
                    onValueChange={(value) => setValue('timeliness', value as any)}
                    className="flex flex-wrap gap-4 mt-2"
                  >
                    {Object.entries(ratingLabels).map(([value, label]) => (
                      <div key={value} className="flex items-center space-x-2">
                        <RadioGroupItem value={value} id={`timeliness-${value}`} />
                        <Label htmlFor={`timeliness-${value}`} className="font-normal">{label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div>
                  <Label>Professionalism</Label>
                  <RadioGroup
                    onValueChange={(value) => setValue('professionalism', value as any)}
                    className="flex flex-wrap gap-4 mt-2"
                  >
                    {Object.entries(ratingLabels).map(([value, label]) => (
                      <div key={value} className="flex items-center space-x-2">
                        <RadioGroupItem value={value} id={`professionalism-${value}`} />
                        <Label htmlFor={`professionalism-${value}`} className="font-normal">{label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div>
                  <Label>Communication</Label>
                  <RadioGroup
                    onValueChange={(value) => setValue('communication', value as any)}
                    className="flex flex-wrap gap-4 mt-2"
                  >
                    {Object.entries(ratingLabels).map(([value, label]) => (
                      <div key={value} className="flex items-center space-x-2">
                        <RadioGroupItem value={value} id={`communication-${value}`} />
                        <Label htmlFor={`communication-${value}`} className="font-normal">{label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div>
                  <Label>Value for Money</Label>
                  <RadioGroup
                    onValueChange={(value) => setValue('valueForMoney', value as any)}
                    className="flex flex-wrap gap-4 mt-2"
                  >
                    {Object.entries(ratingLabels).map(([value, label]) => (
                      <div key={value} className="flex items-center space-x-2">
                        <RadioGroupItem value={value} id={`value-${value}`} />
                        <Label htmlFor={`value-${value}`} className="font-normal">{label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="text-primary">Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Would you recommend us to friends and family?</Label>
                  <RadioGroup
                    onValueChange={(value) => setValue('wouldRecommend', value as any)}
                    className="flex gap-6 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="recommend-yes" />
                      <Label htmlFor="recommend-yes" className="font-normal">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="recommend-no" />
                      <Label htmlFor="recommend-no" className="font-normal">No</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="maybe" id="recommend-maybe" />
                      <Label htmlFor="recommend-maybe" className="font-normal">Maybe</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label>Would you use our services again?</Label>
                  <RadioGroup
                    onValueChange={(value) => setValue('useAgain', value as any)}
                    className="flex gap-6 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="again-yes" />
                      <Label htmlFor="again-yes" className="font-normal">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="again-no" />
                      <Label htmlFor="again-no" className="font-normal">No</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="maybe" id="again-maybe" />
                      <Label htmlFor="again-maybe" className="font-normal">Maybe</Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>

            {/* Additional Feedback */}
            <Card>
              <CardHeader>
                <CardTitle className="text-primary">Additional Feedback</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="whatDidWell">What did we do well?</Label>
                  <Textarea 
                    id="whatDidWell" 
                    {...register('whatDidWell')} 
                    placeholder="Tell us what you liked about our service..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="areasToImprove">How can we improve?</Label>
                  <Textarea 
                    id="areasToImprove" 
                    {...register('areasToImprove')} 
                    placeholder="Let us know how we can serve you better..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="additionalComments">Any additional comments?</Label>
                  <Textarea 
                    id="additionalComments" 
                    {...register('additionalComments')} 
                    placeholder="Share any other thoughts or experiences..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex justify-center">
              <Button 
                type="submit" 
                size="lg" 
                className="min-w-[200px]"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Survey'
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CustomerSurveyForm;
