import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Star, Quote, MapPin, Calendar, Filter, Send, MessageSquarePlus, ThumbsUp, Award, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const testimonials = [
  {
    id: 1,
    title: 'Prompt, Professional and Knowledgeable',
    name: 'Byron',
    date: 'March 1, 2024',
    location: 'South Setauket',
    text: 'I reached out to Big City Plumbing for an urgent repair on my Navien Combi unit, which had stopped supplying heat. To my relief, they were able to send over a plumber without any delay. Benny arrived and wasted no time in getting to the root of the problem. He was not only swift in diagnosing the issue but also took the time to explain everything in a way that was easy to understand. I\'m truly grateful for Benny\'s expertise and professionalism.',
    rating: 5,
    category: 'navien',
  },
  {
    id: 2,
    title: 'Impeccable Workmanship',
    name: 'Joel and Linda',
    date: 'April 4, 2023',
    location: 'E. Setauket, NY',
    text: 'Mike did a conversion from fuel oil to gas 10 years ago. Removed all old sooty oily furnace and piping after covering all carpets and walls, job done perfectly and clean. Saved thousands in heating first year plus Diane did all rebate paperwork for over $7000 back, she\'s a gem. System works like a charm with no maintenance since.',
    rating: 5,
    category: 'gas-conversion',
  },
  {
    id: 3,
    title: 'Big City Plumbing RULES!!!',
    name: 'Branko Yurisak',
    date: 'December 20, 2022',
    location: 'Kings Park, NY',
    text: 'I would like to recommend Big City Plumbing for anyone who is considering converting from Oil to Gas. When dealing with getting my oil conversion done, I was referred by National Grid to Big City Plumbing as well as several other certified plumbing companies. My first encounter was with Diane from the office, she was friendly and prompt all the time. She scheduled my appointments and assisted the entire way with the application, permits, and rebates. Diane is the bright star of the office!',
    rating: 5,
    category: 'gas-conversion',
  },
  {
    id: 4,
    title: 'Finally a Honest Company!',
    name: 'Judy',
    date: 'December 22, 2021',
    location: 'W. Hempstead, NY',
    text: 'My Navien Heat Exchanger was about to breach. I had many companies in who wanted to sell me a new heating system. My system was only 7 years old, and could not believe I needed a new system so soon. As it turns out, Navien warranties the heat exchanger for 10 years. I called them, and they send me a new Heat Exchanger free of charge. So, all the companies who wanted to sell me a new system would not help me - but Big City Plumbing did!',
    rating: 5,
    category: 'navien',
  },
  {
    id: 5,
    title: 'Saint Mike to the Rescue',
    name: 'Kathleen Rodriguez',
    date: 'April 15, 2021',
    location: 'Brooklyn, NY',
    text: 'Once again Mike came to my rescue. I called Big City Plumbing after 3 on Tuesday. I had no hot water - my tankless water heater just died. Diane was kind and cared about my situation. She connected me with Mike who immediately made arrangements for the guys to come the next day. Benny came and installed tankless heater, explained what he was doing and asked if I had any questions. Benny is very professional and has a great sense of humor. Without a doubt he is a Master plumber!',
    rating: 5,
    category: 'water-heater',
  },
  {
    id: 6,
    title: 'Great Service!',
    name: 'Angelo Strazzera',
    date: 'October 17, 2019',
    location: 'South Setauket',
    text: 'My old school boiler/hot water heater combination unit finally gave out. I was scrambling trying to find a reputable company. I walked into Big City Plumbing\'s store front and Diane was very nice as I explained my situation. Michael came out and we talked about the Navien system. His crew was at my house the next morning installing the unit. We now have hot water and heat and also have additional space in my boiler room. I highly recommend you give Big City Plumbing a call!',
    rating: 5,
    category: 'installation',
  },
  {
    id: 7,
    title: 'Old School Quality and Service with a Smile',
    name: 'Bob Scottaline',
    date: 'December 8, 2018',
    location: 'Lake Grove',
    text: 'Mike is honest and provides only the work that is necessary or requested. The crew is friendly and polite and respect your home. Benny is an exceptional plumber and is very tech-savvy when it comes to dealing with today\'s modern heating equipment. All work is performed according to the manufacturer\'s specifications with the highest quality materials. If you get a lower price, you are not getting the same job.',
    rating: 5,
    category: 'heating',
  },
  {
    id: 8,
    title: 'Amazing Bathroom Renovation',
    name: 'Jimmy V.',
    date: 'June 13, 2015',
    location: 'Smithtown, L.I.',
    text: 'The job involved a complete gutting of my master Bathroom. From walls to ceiling, to floor! With the addition of a whirlpool one wall had to be moved. None of the existing plumbing remained in its original place. What really impressed me was how professional and courteous he was. The real surprise was the quality of work! They really took care and made sure I was happy. Needless to say - my new Bathroom is MAGNIFICENT!!! Hire these gentlemen now!! I guarantee you\'ll be totally happy!!!',
    rating: 5,
    category: 'plumbing',
  },
  {
    id: 9,
    title: 'Professional Service!',
    name: 'Shikui Chen',
    date: 'June 13, 2018',
    location: 'Stony Brook',
    text: 'We contacted Big City Plumbing to convert our oil boiler into a tankless gas boiler and foam the oil tank. Mike provided a reasonable quotation and Diane could always provide prompt answers to our questions. Benny and his team carried out the boiler installation project. They arrived at 8:00 a.m. and by 3:00 p.m., the new boiler was installed. They also cleaned the laundry room after the project was finished. The installed gas boiler looks really awesome!',
    rating: 5,
    category: 'gas-conversion',
  },
];

const categories = [
  { id: 'all', label: 'All Reviews' },
  { id: 'navien', label: 'Navien' },
  { id: 'gas-conversion', label: 'Gas Conversion' },
  { id: 'water-heater', label: 'Water Heaters' },
  { id: 'plumbing', label: 'Plumbing' },
  { id: 'heating', label: 'Heating' },
];

const stats = [
  { icon: Star, value: '5.0', label: 'Average Rating' },
  { icon: Users, value: '500+', label: 'Happy Customers' },
  { icon: ThumbsUp, value: '99%', label: 'Recommend Us' },
  { icon: Award, value: '35+', label: 'Years Trusted' },
];

const TestimonialsPage = () => {
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: '',
    title: '',
    testimonial: '',
  });

  const filteredTestimonials = activeCategory === 'all'
    ? testimonials
    : testimonials.filter(t => t.category === activeCategory);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Thank you for your review!",
      description: "Your testimonial has been submitted for approval.",
    });
    setFormData({ name: '', email: '', location: '', title: '', testimonial: '' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero-gradient pt-32 pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 backdrop-blur-sm border border-secondary/30 mb-6">
              <Star className="w-4 h-4 text-secondary fill-secondary" />
              <span className="text-sm font-medium text-primary-foreground">Customer Reviews</span>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
              Testimonials
            </h1>
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
          <div className="bg-card rounded-2xl shadow-large p-6 md:p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {stats.map((stat, index) => (
                <div key={stat.label} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl cta-gradient mb-3">
                    <stat.icon className="w-6 h-6 text-secondary-foreground" />
                  </div>
                  <p className="font-heading text-2xl md:text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
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
              {/* Category Filters */}
              <div className="flex flex-wrap items-center gap-3 mb-8">
                <Filter className="w-5 h-5 text-muted-foreground" />
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      activeCategory === cat.id
                        ? 'cta-gradient text-secondary-foreground shadow-glow'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Testimonials List */}
              <div className="space-y-6">
                {filteredTestimonials.map((testimonial, index) => (
                  <div
                    key={testimonial.id}
                    className="bg-card p-6 md:p-8 rounded-2xl shadow-card hover:shadow-large transition-all duration-300 animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full hero-gradient flex items-center justify-center flex-shrink-0">
                          <span className="text-primary-foreground font-bold text-lg">
                            {testimonial.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-heading font-bold text-foreground">{testimonial.name}</h3>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {testimonial.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {testimonial.date}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Quote className="w-8 h-8 text-secondary/20 flex-shrink-0" />
                    </div>

                    {/* Rating */}
                    <div className="flex gap-1 mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-secondary text-secondary" />
                      ))}
                    </div>

                    {/* Title */}
                    <h4 className="font-heading font-semibold text-lg text-foreground mb-3">
                      "{testimonial.title}"
                    </h4>

                    {/* Content */}
                    <p className={`text-muted-foreground leading-relaxed ${
                      expandedId === testimonial.id ? '' : 'line-clamp-3'
                    }`}>
                      {testimonial.text}
                    </p>
                    
                    {testimonial.text.length > 200 && (
                      <button
                        onClick={() => setExpandedId(expandedId === testimonial.id ? null : testimonial.id)}
                        className="text-secondary font-medium text-sm mt-2 hover:underline"
                      >
                        {expandedId === testimonial.id ? 'Show less' : 'Read more...'}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar - Submit Form */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="bg-card p-6 md:p-8 rounded-2xl shadow-card">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl cta-gradient flex items-center justify-center">
                      <MessageSquarePlus className="w-5 h-5 text-secondary-foreground" />
                    </div>
                    <h3 className="font-heading text-xl font-bold text-foreground">
                      Add a Testimonial
                    </h3>
                  </div>
                  
                  <p className="text-muted-foreground text-sm mb-6">
                    Had a great experience with Big City Plumbing? We'd love to hear from you!
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                      placeholder="Your Name *"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                    <Input
                      type="email"
                      placeholder="Email *"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                    <Input
                      placeholder="Location (City, NY)"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                    <Input
                      placeholder="Title of Review"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                    <Textarea
                      placeholder="Your testimonial *"
                      value={formData.testimonial}
                      onChange={(e) => setFormData({ ...formData, testimonial: e.target.value })}
                      required
                      className="min-h-[120px] resize-none"
                    />
                    <Button variant="hero" className="w-full group">
                      Submit Review
                      <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TestimonialsPage;
