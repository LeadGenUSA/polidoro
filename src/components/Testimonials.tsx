import { Star, Quote } from 'lucide-react';
const testimonials = [{
  name: 'Judy M.',
  location: 'Long Island, NY',
  text: 'My Navien Heat Exchanger was about to breach. Big City Plumbing diagnosed the issue quickly and saved me from costly repairs. Their Navien expertise is unmatched!',
  rating: 5
}, {
  name: 'Robert K.',
  location: 'Queens, NY',
  text: 'Professional, punctual, and fair pricing. They converted our home to gas and helped us get the Con Ed rebate. Highly recommend for any plumbing or heating work.',
  rating: 5
}, {
  name: 'Maria S.',
  location: 'Nassau County, NY',
  text: 'Had an emergency leak at 2 AM. They answered immediately and had someone at my house within an hour. True 24/7 service when you need it most.',
  rating: 5
}];
const Testimonials = () => {
  return <section id="testimonials" className="py-20 lg:py-28 subtle-gradient">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-secondary/10 text-secondary font-semibold text-sm mb-4">
            Customer Reviews 
          </span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            What Our Customers Say
          </h2>
          <p className="text-lg text-muted-foreground">
            Don't just take our word for it - hear from homeowners and businesses 
            who trust Big City Plumbing & Heating.
          </p>
        </div>
        
        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => <div key={testimonial.name} className="bg-card p-8 rounded-2xl shadow-card relative animate-fade-in" style={{
          animationDelay: `${index * 100}ms`
        }}>
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 opacity-10">
                <Quote className="w-12 h-12 text-primary" />
              </div>
              
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => <Star key={i} className="w-5 h-5 fill-secondary text-secondary" />)}
              </div>
              
              {/* Content */}
              <p className="text-foreground mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>
              
              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full hero-gradient flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-heading font-bold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                </div>
              </div>
            </div>)}
        </div>
        
        {/* Link to Reviews Page */}
        <div className="text-center mt-12">
          <a 
            href="/reviews" 
            className="inline-flex items-center gap-2 text-primary hover:text-secondary font-semibold text-lg transition-colors"
          >
            See Other Customer Reviews of Our Excellent Service
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>;
};
export default Testimonials;