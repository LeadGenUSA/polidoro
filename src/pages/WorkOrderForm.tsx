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
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, Loader2 } from 'lucide-react';

const workOrderSchema = z.object({
  // Customer Info
  customerName: z.string().min(1, 'Customer name is required').max(100),
  streetAddress: z.string().min(1, 'Street address is required').max(200),
  aptNumber: z.string().max(20).optional(),
  phone: z.string().min(1, 'Phone number is required').max(20),
  zipCode: z.string().min(1, 'Zip code is required').max(10),
  email: z.string().email('Invalid email address').max(100),
  emailTo: z.string().email('Invalid email address').max(100).optional().or(z.literal('')),
  
  // Job Detail
  errorCode: z.string().max(50).optional(),
  makeModel: z.string().max(100).optional(),
  serialNumber: z.string().max(100).optional(),
  jobDescription: z.string().min(1, 'Job description is required').max(2000),
  recommendations: z.string().max(1000).optional(),
  rgaNavienTech: z.string().max(100).optional(),
  waterSamplingPH: z.string().max(20).optional(),
  partsUnderWarranty: z.enum(['yes', 'no']).optional(),
  
  // Technician Info
  techOnJob: z.string().max(100).optional(),
  hoursOnJob: z.string().max(20).optional(),
  jobDate: z.string().optional(),
  jobCompleted: z.enum(['yes', 'no']).optional(),
  
  // Billing Info
  paymentMethod: z.enum(['check', 'cash', 'credit_card', 'bill_navien']).optional(),
  billingStatus: z.enum(['estimate_needed', 'email_paid_invoice', 'bill_customer', 'parts_ordered']).optional(),
  totalCharges: z.string().max(20).optional(),
  
  // Credit Card Info (optional)
  ccName: z.string().max(100).optional(),
  ccAddress: z.string().max(200).optional(),
  ccZip: z.string().max(10).optional(),
  ccNumber: z.string().max(20).optional(),
  ccExpiration: z.string().max(7).optional(),
  ccSecurityCode: z.string().max(4).optional(),
  
  // Authorization
  termsAccepted: z.boolean().refine(val => val === true, 'You must accept the terms'),
});

type WorkOrderFormData = z.infer<typeof workOrderSchema>;

const WorkOrderForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<WorkOrderFormData>({
    resolver: zodResolver(workOrderSchema),
    defaultValues: {
      termsAccepted: false,
    }
  });

  const termsAccepted = watch('termsAccepted');

  const onSubmit = async (data: WorkOrderFormData) => {
    setIsSubmitting(true);
    
    try {
      const { data: response, error } = await supabase.functions.invoke('send-work-order', {
        body: data,
      });

      if (error) throw error;

      setIsSubmitted(true);
      toast({
        title: 'Work Order Submitted',
        description: 'Your work order has been sent successfully.',
      });
    } catch (error: any) {
      console.error('Error submitting work order:', error);
      toast({
        title: 'Submission Failed',
        description: 'There was an error submitting your work order. Please try again.',
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
        <main className="flex-1 pt-32 pb-20">
          <div className="container mx-auto px-4 max-w-2xl">
            <Card className="text-center py-16">
              <CardContent className="space-y-6">
                <CheckCircle className="w-20 h-20 text-primary mx-auto" />
                <h1 className="text-3xl font-heading font-bold text-foreground">
                  Thank You!
                </h1>
                <p className="text-muted-foreground text-lg">
                  Your work order has been submitted successfully. We will review it and get back to you shortly.
                </p>
                <Button onClick={() => setIsSubmitted(false)} variant="outline">
                  Submit Another Work Order
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
      
      {/* Hero Section with blue background for navbar consistency */}
      <section className="relative bg-primary pt-32 pb-16">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h1 className="text-4xl font-heading font-bold text-primary-foreground mb-4">
            Work Order Form
          </h1>
          <p className="text-primary-foreground/80">
            Please fill out your Work Order details below.
          </p>
        </div>
      </section>
      
      <main className="flex-1 py-12 bg-muted/30">
        <div className="container mx-auto px-4 max-w-4xl">

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Customer Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-primary">Customer Info</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="customerName">Customer's Name *</Label>
                  <Input id="customerName" {...register('customerName')} placeholder="Full Name" />
                  {errors.customerName && <p className="text-destructive text-sm mt-1">{errors.customerName.message}</p>}
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="streetAddress">Street Address *</Label>
                  <Input id="streetAddress" {...register('streetAddress')} placeholder="123 Main St" />
                  {errors.streetAddress && <p className="text-destructive text-sm mt-1">{errors.streetAddress.message}</p>}
                </div>
                <div>
                  <Label htmlFor="aptNumber">Apt #</Label>
                  <Input id="aptNumber" {...register('aptNumber')} placeholder="Apt/Unit" />
                </div>
                <div>
                  <Label htmlFor="phone">Phone # *</Label>
                  <Input id="phone" {...register('phone')} placeholder="(555) 555-5555" />
                  {errors.phone && <p className="text-destructive text-sm mt-1">{errors.phone.message}</p>}
                </div>
                <div>
                  <Label htmlFor="zipCode">Zip Code *</Label>
                  <Input id="zipCode" {...register('zipCode')} placeholder="12345" />
                  {errors.zipCode && <p className="text-destructive text-sm mt-1">{errors.zipCode.message}</p>}
                </div>
                <div>
                  <Label htmlFor="email">Email (for our records) *</Label>
                  <Input id="email" type="email" {...register('email')} placeholder="customer@email.com" />
                  {errors.email && <p className="text-destructive text-sm mt-1">{errors.email.message}</p>}
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="emailTo">Email TO (send copy of this form TO:)</Label>
                  <Input id="emailTo" type="email" {...register('emailTo')} placeholder="recipient@email.com" />
                  {errors.emailTo && <p className="text-destructive text-sm mt-1">{errors.emailTo.message}</p>}
                </div>
              </CardContent>
            </Card>

            {/* Job Detail */}
            <Card>
              <CardHeader>
                <CardTitle className="text-primary">Job Detail</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="errorCode">Error Code</Label>
                  <Input id="errorCode" {...register('errorCode')} placeholder="Error code if applicable" />
                </div>
                <div>
                  <Label htmlFor="makeModel">Make & Model #</Label>
                  <Input id="makeModel" {...register('makeModel')} placeholder="Equipment make and model" />
                </div>
                <div>
                  <Label htmlFor="serialNumber">Serial #</Label>
                  <Input id="serialNumber" {...register('serialNumber')} placeholder="Serial number" />
                </div>
                <div>
                  <Label htmlFor="rgaNavienTech">RGA# & Navien Tech Name</Label>
                  <Input id="rgaNavienTech" {...register('rgaNavienTech')} placeholder="RGA# and tech name" />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="jobDescription">Job Description *</Label>
                  <Textarea id="jobDescription" {...register('jobDescription')} placeholder="Describe the work performed or needed" rows={4} />
                  {errors.jobDescription && <p className="text-destructive text-sm mt-1">{errors.jobDescription.message}</p>}
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="recommendations">Recommendations</Label>
                  <Textarea id="recommendations" {...register('recommendations')} placeholder="Any recommendations for the customer" rows={3} />
                </div>
                <div>
                  <Label htmlFor="waterSamplingPH">Water Sampling PH</Label>
                  <Input id="waterSamplingPH" {...register('waterSamplingPH')} placeholder="PH level" />
                </div>
                <div>
                  <Label>Parts Under Warranty</Label>
                  <RadioGroup
                    onValueChange={(value) => setValue('partsUnderWarranty', value as 'yes' | 'no')}
                    className="flex gap-4 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="warranty-yes" />
                      <Label htmlFor="warranty-yes" className="font-normal">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="warranty-no" />
                      <Label htmlFor="warranty-no" className="font-normal">No</Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>

            {/* Technician Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-primary">Technician Info</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="techOnJob">Tech On Job</Label>
                  <Input id="techOnJob" {...register('techOnJob')} placeholder="Technician name" />
                </div>
                <div>
                  <Label htmlFor="hoursOnJob">Hours On Job</Label>
                  <Input id="hoursOnJob" {...register('hoursOnJob')} placeholder="Hours worked" />
                </div>
                <div>
                  <Label htmlFor="jobDate">Date</Label>
                  <Input id="jobDate" type="date" {...register('jobDate')} />
                </div>
                <div>
                  <Label>Job Completed</Label>
                  <RadioGroup
                    onValueChange={(value) => setValue('jobCompleted', value as 'yes' | 'no')}
                    className="flex gap-4 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="completed-yes" />
                      <Label htmlFor="completed-yes" className="font-normal">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="completed-no" />
                      <Label htmlFor="completed-no" className="font-normal">No</Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>

            {/* Billing Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-primary">Billing Info</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Payment Method</Label>
                  <RadioGroup
                    onValueChange={(value) => setValue('paymentMethod', value as any)}
                    className="flex flex-wrap gap-4 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="check" id="payment-check" />
                      <Label htmlFor="payment-check" className="font-normal">Check</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cash" id="payment-cash" />
                      <Label htmlFor="payment-cash" className="font-normal">Cash</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="credit_card" id="payment-cc" />
                      <Label htmlFor="payment-cc" className="font-normal">Credit Card</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="bill_navien" id="payment-navien" />
                      <Label htmlFor="payment-navien" className="font-normal">Bill Navien</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div>
                  <Label>Billing Status</Label>
                  <RadioGroup
                    onValueChange={(value) => setValue('billingStatus', value as any)}
                    className="flex flex-wrap gap-4 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="estimate_needed" id="status-estimate" />
                      <Label htmlFor="status-estimate" className="font-normal">Estimate Needed</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="email_paid_invoice" id="status-paid" />
                      <Label htmlFor="status-paid" className="font-normal">Email Paid Invoice</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="bill_customer" id="status-bill" />
                      <Label htmlFor="status-bill" className="font-normal">Bill Customer</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="parts_ordered" id="status-parts" />
                      <Label htmlFor="status-parts" className="font-normal">Parts Ordered</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div>
                  <Label htmlFor="totalCharges">Total Charges</Label>
                  <Input id="totalCharges" {...register('totalCharges')} placeholder="$0.00" />
                </div>
              </CardContent>
            </Card>

            {/* Credit Card Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-primary">Credit Card Information (if applicable)</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="ccName">Name on Credit Card</Label>
                  <Input id="ccName" {...register('ccName')} placeholder="Name as it appears on card" />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="ccAddress">Street Address of Credit Card</Label>
                  <Input id="ccAddress" {...register('ccAddress')} placeholder="Billing address" />
                </div>
                <div>
                  <Label htmlFor="ccZip">Zip Code of Credit Card</Label>
                  <Input id="ccZip" {...register('ccZip')} placeholder="Billing zip code" />
                </div>
                <div>
                  <Label htmlFor="ccNumber">Credit Card #</Label>
                  <Input id="ccNumber" {...register('ccNumber')} placeholder="Card number" />
                </div>
                <div>
                  <Label htmlFor="ccExpiration">Expiration Date (MM/YY)</Label>
                  <Input id="ccExpiration" {...register('ccExpiration')} placeholder="MM/YY" />
                </div>
                <div>
                  <Label htmlFor="ccSecurityCode">Security Code</Label>
                  <Input id="ccSecurityCode" {...register('ccSecurityCode')} placeholder="CVV" maxLength={4} />
                </div>
              </CardContent>
            </Card>

            {/* Authorization */}
            <Card>
              <CardHeader>
                <CardTitle className="text-primary">Customer Authorization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted p-4 rounded-lg text-sm text-muted-foreground space-y-2">
                  <p>
                    By signing this work order you have Read and accepted the workmanship and the price and are satisfied with the work performed, and would recommend Big City Plumbing Heating Inc.
                  </p>
                  <p>
                    There are multiple functionalities that can cause the same error code, if a different part is diagnosed for the same error code there will be an additional charge.
                  </p>
                  <p>
                    By clicking the box below you authorize Big City Plumbing to charge your credit card or Bill you.
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="termsAccepted"
                    checked={termsAccepted}
                    onCheckedChange={(checked) => setValue('termsAccepted', checked as boolean)}
                  />
                  <Label htmlFor="termsAccepted" className="font-normal leading-relaxed cursor-pointer">
                    I have read and accepted Your Terms *
                  </Label>
                </div>
                {errors.termsAccepted && <p className="text-destructive text-sm">{errors.termsAccepted.message}</p>}
              </CardContent>
            </Card>

            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                Please make sure all required fields are filled in before submitting!
              </p>
              <Button type="submit" size="lg" disabled={isSubmitting} className="min-w-[200px]">
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Work Order'
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

export default WorkOrderForm;
