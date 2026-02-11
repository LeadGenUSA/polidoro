import { useState } from 'react';
import Navbar from '@/components/Navbar';
import SEO from '@/components/SEO';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Star, Quote, MapPin, Calendar, Send, MessageSquarePlus, ThumbsUp, Award, Users, Loader2, Globe } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useApprovedReviews, Review } from '@/hooks/useReviews';
import StarRating from '@/components/StarRating';
import { supabase } from '@/integrations/supabase/client';
const stats = [{
  icon: Star,
  value: '5.0',
  label: 'Average Rating'
}, {
  icon: Users,
  value: '5000+',
  label: 'Happy Customers'
}, {
  icon: ThumbsUp,
  value: '99%',
  label: 'Recommend Us'
}, {
  icon: Award,
  value: '35+',
  label: 'Years Trusted'
}];
const TestimonialsPage = () => {
  const {
    toast
  } = useToast();
  const {
    reviews,
    isLoading
  } = useApprovedReviews();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: '',
    title: '',
    testimonial: '',
    rating: 0
  });
  
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Client-side validation
    if (!formData.name.trim()) {
      toast({ title: "Error", description: "Please enter your name.", variant: "destructive" });
      return;
    }
    if (!formData.email.trim()) {
      toast({ title: "Error", description: "Please enter your email.", variant: "destructive" });
      return;
    }
    if (!formData.testimonial.trim()) {
      toast({ title: "Error", description: "Please enter your review.", variant: "destructive" });
      return;
    }
    if (formData.rating === 0) {
      toast({ title: "Error", description: "Please select a star rating.", variant: "destructive" });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('submit-review', {
        body: {
          author_name: formData.name.trim(),
          email: formData.email.trim(),
          location: formData.location.trim() || undefined,
          title: formData.title.trim() || undefined,
          text: formData.testimonial.trim(),
          rating: formData.rating,
        }
      });
      
      if (error) throw error;
      
      if (data?.error) {
        toast({ title: "Error", description: data.error, variant: "destructive" });
        return;
      }
      
      toast({
        title: "Thank you for your review!",
        description: "Your testimonial has been submitted and will appear after approval."
      });
      
      setFormData({
        name: '',
        email: '',
        location: '',
        title: '',
        testimonial: '',
        rating: 0
      });
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  return <div className="min-h-screen bg-background">
      <SEO
        title="Customer Reviews - Big City Plumbing and Heating"
        description="Read reviews from satisfied customers of Big City Plumbing and Heating. See why homeowners across Long Island and NYC trust us for plumbing and heating services."
        path="/reviews"
      />
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero-gradient pt-32 pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 backdrop-blur-sm border border-secondary/30 mb-6">
              <Star className="w-4 h-4 text-secondary fill-secondary" />
              <span className="text-sm font-medium text-primary-foreground">Customer Reviews</span>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">Reviews</h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl">
              Don't just take our word for it. See what our customers across Nassau, Suffolk, 
              and NYC have to say about our plumbing and heating services.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="relative -mt-10 z-10">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="bg-card rounded-2xl shadow-lg p-6 md:p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {stats.map(stat => <div key={stat.label} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl cta-gradient mb-3">
                    <stat.icon className="w-6 h-6 text-secondary-foreground" />
                  </div>
                  <p className="font-heading text-2xl md:text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>)}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Testimonials List */}
              {isLoading ? <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div> : reviews.length === 0 ? <div className="text-center py-12 bg-card rounded-xl">
                  <Star className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
                  <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
                    No reviews yet
                  </h3>
                  <p className="text-muted-foreground">
                    Be the first to leave a review!
                  </p>
                </div> : <div className="space-y-6">
                  {reviews.map((testimonial, index) => <div key={testimonial.id} className="bg-card p-6 md:p-8 rounded-2xl shadow-card hover:shadow-lg transition-all duration-300 animate-fade-in" style={{
                animationDelay: `${index * 50}ms`
              }}>
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          {testimonial.author_photo_url ? <img src={testimonial.author_photo_url} alt={testimonial.author_name} className="w-12 h-12 rounded-full object-cover flex-shrink-0" /> : <div className="w-12 h-12 rounded-full hero-gradient flex items-center justify-center flex-shrink-0">
                              <span className="text-primary-foreground font-bold text-lg">
                                {testimonial.author_name.charAt(0)}
                              </span>
                            </div>}
                          <div>
                            <h3 className="font-heading font-bold text-foreground">{testimonial.author_name}</h3>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                              {testimonial.location && <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {testimonial.location}
                                </span>}
                            {testimonial.review_date && <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {formatDate(testimonial.review_date)}
                                </span>}
                              {testimonial.source === 'google' && (
                                <Badge variant="outline" className="flex items-center gap-1 text-xs bg-card border-border">
                                  <span className="font-bold text-primary">G</span>
                                  <span className="text-muted-foreground">Google Review</span>
                                </Badge>
                              )}
                              {testimonial.source === 'manual' && (
                                <Badge variant="outline" className="flex items-center gap-1 text-xs bg-card border-border">
                                  <Globe className="w-3 h-3 text-primary" />
                                  <span className="text-muted-foreground">Website Review</span>
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <Quote className="w-8 h-8 text-secondary/20 flex-shrink-0" />
                      </div>

                      {/* Rating */}
                      <div className="flex gap-1 mb-3">
                        {[...Array(testimonial.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-secondary text-secondary" />)}
                      </div>

                      {/* Title */}
                      {testimonial.title && <h4 className="font-heading font-semibold text-lg text-foreground mb-3">
                          "{testimonial.title}"
                        </h4>}

                      {/* Content */}
                      <p className={`text-muted-foreground leading-relaxed ${expandedId === testimonial.id ? '' : 'line-clamp-3'}`}>
                        {testimonial.text}
                      </p>
                      
                      {testimonial.text.length > 200 && <button onClick={() => setExpandedId(expandedId === testimonial.id ? null : testimonial.id)} className="text-secondary font-medium text-sm mt-2 hover:underline">
                          {expandedId === testimonial.id ? 'Show less' : 'Read more...'}
                        </button>}
                    </div>)}
                </div>}
            </div>

            {/* Sidebar - Submit Form */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="bg-card p-6 md:p-8 rounded-2xl shadow-card">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl cta-gradient flex items-center justify-center">
                      <MessageSquarePlus className="w-5 h-5 text-secondary-foreground" />
                    </div>
                    <h3 className="font-heading text-xl font-bold text-foreground">Add a Review</h3>
                  </div>
                  
                  <p className="text-muted-foreground text-sm mb-6">
                    Had a great experience with Big City Plumbing? We'd love to hear from you!
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Input 
                      placeholder="Your Name *" 
                      value={formData.name} 
                      onChange={e => setFormData({ ...formData, name: e.target.value })} 
                      disabled={isSubmitting}
                      maxLength={100}
                      required 
                    />
                    <Input 
                      type="email" 
                      placeholder="Email *" 
                      value={formData.email} 
                      onChange={e => setFormData({ ...formData, email: e.target.value })} 
                      disabled={isSubmitting}
                      maxLength={255}
                      required 
                    />
                    <Input 
                      placeholder="Location (City, NY)" 
                      value={formData.location} 
                      onChange={e => setFormData({ ...formData, location: e.target.value })} 
                      disabled={isSubmitting}
                      maxLength={100}
                    />
                    <Input 
                      placeholder="Title of Review" 
                      value={formData.title} 
                      onChange={e => setFormData({ ...formData, title: e.target.value })} 
                      disabled={isSubmitting}
                      maxLength={200}
                    />
                    <Textarea 
                      placeholder="Your review *" 
                      value={formData.testimonial} 
                      onChange={e => setFormData({ ...formData, testimonial: e.target.value })} 
                      disabled={isSubmitting}
                      maxLength={2000}
                      required 
                      className="min-h-[120px] resize-none" 
                    />
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Your Rating *</label>
                      <StarRating 
                        rating={formData.rating} 
                        onRatingChange={(rating) => setFormData({ ...formData, rating })}
                        disabled={isSubmitting}
                      />
                    </div>
                    <Button variant="hero" className="w-full group" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          Submit Review
                          <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>;
};
export default TestimonialsPage;