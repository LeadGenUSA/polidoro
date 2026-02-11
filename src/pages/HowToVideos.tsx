import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Play, Clock, Eye, Youtube, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

const videos = [
  {
    id: '-4KY5CTyeZI',
    title: 'Navien Trip',
    duration: '0:47',
    views: '27',
    date: '2 years ago',
    category: 'navien',
    thumbnail: 'https://i.ytimg.com/vi/-4KY5CTyeZI/hqdefault.jpg',
  },
  {
    id: 'g0jkuePC8-w',
    title: 'New Navien NFB Installation',
    duration: '0:55',
    views: '67',
    date: '2 years ago',
    category: 'navien',
    thumbnail: 'https://i.ytimg.com/vi/g0jkuePC8-w/hqdefault.jpg',
  },
  {
    id: 'nsNipjT1qk4',
    title: 'Big City Plumbing Navien',
    duration: '0:16',
    views: '13',
    date: '2 years ago',
    category: 'navien',
    thumbnail: 'https://i.ytimg.com/vi/nsNipjT1qk4/hqdefault.jpg',
  },
  {
    id: 'UmnFqPEHBNY',
    title: 'Old to New Navien Installation',
    duration: '0:11',
    views: '1.8K',
    date: '4 years ago',
    category: 'installation',
    thumbnail: 'https://i.ytimg.com/vi/UmnFqPEHBNY/hqdefault.jpg',
  },
  {
    id: '0kwCdq1CKfI',
    title: 'Brownstone in East New York',
    duration: '1:01',
    views: '55',
    date: '4 years ago',
    category: 'residential',
    thumbnail: 'https://i.ytimg.com/vi/0kwCdq1CKfI/hqdefault.jpg',
  },
  {
    id: 'example1',
    title: 'Brooklyn Apartment Installation',
    duration: '0:16',
    views: '1.5K',
    date: '4 years ago',
    category: 'installation',
    thumbnail: 'https://i.ytimg.com/vi/UmnFqPEHBNY/hqdefault.jpg',
  },
  {
    id: 'example2',
    title: 'Water Heater Replacement Guide',
    duration: '2:30',
    views: '892',
    date: '3 years ago',
    category: 'how-to',
    thumbnail: 'https://i.ytimg.com/vi/g0jkuePC8-w/hqdefault.jpg',
  },
  {
    id: 'example3',
    title: 'Commercial Plumbing Project',
    duration: '1:45',
    views: '234',
    date: '2 years ago',
    category: 'commercial',
    thumbnail: 'https://i.ytimg.com/vi/-4KY5CTyeZI/hqdefault.jpg',
  },
];

const categories = [
  { id: 'all', label: 'All Videos' },
  { id: 'navien', label: 'Navien' },
  { id: 'installation', label: 'Installations' },
  { id: 'how-to', label: 'How-To' },
  { id: 'residential', label: 'Residential' },
  { id: 'commercial', label: 'Commercial' },
];

const HowToVideos = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  const filteredVideos = activeCategory === 'all' 
    ? videos 
    : videos.filter(v => v.category === activeCategory);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="How-To Videos - Big City Plumbing and Heating"
        description="Helpful plumbing and heating video guides from Big City Plumbing and Heating. Learn about Navien systems, boiler maintenance, and home plumbing tips."
        path="/how-to-videos"
      />
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero-gradient pt-32 pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl">
            <a 
              href="https://www.youtube.com/channel/UC8fcDyolqilmFXHt8pg377Q"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 backdrop-blur-sm border border-secondary/30 mb-6 hover:bg-secondary/30 transition-colors"
            >
              <Youtube className="w-4 h-4 text-secondary" />
              <span className="text-sm font-medium text-primary-foreground">Our YouTube Channel</span>
            </a>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
              How-To Videos
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl">
              Watch our expert plumbers in action. Learn about Navien installations, 
              plumbing repairs, and see the quality of our work firsthand.
            </p>
          </div>
        </div>
      </section>

      {/* Videos Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Category Filters */}
          <div className="flex flex-wrap items-center gap-3 mb-12">
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

          {/* Video Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVideos.map((video, index) => (
              <div
                key={video.id}
                className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-large transition-all duration-300 hover:-translate-y-1 animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden">
                  {playingVideo === video.id ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
                      title={video.title}
                      className="absolute inset-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <>
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Play Button */}
                      <button
                        onClick={() => setPlayingVideo(video.id)}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <div className="w-16 h-16 rounded-full cta-gradient flex items-center justify-center shadow-glow transform group-hover:scale-110 transition-transform duration-300">
                          <Play className="w-7 h-7 text-secondary-foreground ml-1" fill="currentColor" />
                        </div>
                      </button>
                      
                      {/* Duration Badge */}
                      <div className="absolute bottom-3 right-3 px-2 py-1 bg-foreground/80 rounded text-xs font-medium text-background">
                        {video.duration}
                      </div>
                    </>
                  )}
                </div>
                
                {/* Content */}
                <div className="p-4">
                  <h3 className="font-heading font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-secondary transition-colors">
                    {video.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {video.views} views
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {video.date}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* YouTube CTA */}
          <div className="mt-16 text-center">
            <div className="inline-flex flex-col items-center gap-4 p-8 bg-card rounded-2xl shadow-card">
              <Youtube className="w-12 h-12 text-secondary" />
              <h3 className="font-heading text-xl font-bold text-foreground">
                Want to see more?
              </h3>
              <p className="text-muted-foreground max-w-md">
                Subscribe to our YouTube channel for the latest plumbing tips, 
                installation guides, and behind-the-scenes content.
              </p>
              <Button 
                variant="hero" 
                size="lg"
                onClick={() => window.open('https://www.youtube.com/@bigcityplumbing', '_blank')}
              >
                <Youtube className="w-5 h-5" />
                Subscribe on YouTube
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HowToVideos;
