import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useGallery, GalleryItem } from '@/hooks/useGallery';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Loader2, X, Camera } from 'lucide-react';

// Import static gallery images
import navienBoiler from '@/assets/gallery/navien-boiler-installation.jpg';
import commercialTankless from '@/assets/gallery/commercial-tankless-array.jpg';
import quadTankless from '@/assets/gallery/quad-tankless-system.jpg';
import radiantHeat from '@/assets/gallery/radiant-heat-manifold.jpg';

// Static gallery items to show initially (before DB items load or if none exist)
const staticGalleryItems = [
  {
    id: 'static-1',
    image_url: navienBoiler,
    caption: 'Navien Boiler Installation',
    description: 'Professional Navien tankless water heater and boiler installation with precision copper piping, expansion tank, and zone controls.',
  },
  {
    id: 'static-2',
    image_url: commercialTankless,
    caption: 'Commercial Tankless Array',
    description: 'Multi-unit Navien tankless water heater installation for commercial building, featuring cascading system for high-demand hot water supply.',
  },
  {
    id: 'static-3',
    image_url: quadTankless,
    caption: 'Quad Tankless System',
    description: 'Four Navien tankless units installed in parallel for maximum efficiency and endless hot water in a large residential property.',
  },
  {
    id: 'static-4',
    image_url: radiantHeat,
    caption: 'Radiant Heat Manifold',
    description: 'Taco zone control system with radiant floor heating manifold, featuring precision valves and professional copper work.',
  },
];

const ProjectsGallery = () => {
  const { items, isLoading } = useGallery();
  const [selectedItem, setSelectedItem] = useState<GalleryItem | typeof staticGalleryItems[0] | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Use database items if available, otherwise show static items
  const displayItems = items.length > 0 ? items : staticGalleryItems;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium mb-6">
                <Camera className="w-4 h-4" />
                Our Work
              </div>
              <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
                Project Gallery
              </h1>
              <p className="text-lg text-muted-foreground">
                Browse our portfolio of completed plumbing and heating installations. 
                Each project showcases our commitment to quality craftsmanship and professional service.
              </p>
            </div>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {displayItems.map((item) => (
                  <div
                    key={item.id}
                    className="group cursor-pointer"
                    onMouseEnter={() => setHoveredId(item.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onClick={() => setSelectedItem(item)}
                  >
                    {/* Thumbnail */}
                    <div className="relative w-[150px] h-[150px] mx-auto rounded-lg overflow-hidden shadow-card transition-all duration-300 group-hover:shadow-glow group-hover:scale-105">
                      <img
                        src={item.image_url}
                        alt={item.caption || 'Project photo'}
                        className="w-full h-full object-cover"
                      />
                      {/* Hover overlay */}
                      <div className={`absolute inset-0 bg-primary/80 flex items-center justify-center transition-opacity duration-300 ${hoveredId === item.id ? 'opacity-100' : 'opacity-0'}`}>
                        <span className="text-primary-foreground text-sm font-medium px-2 text-center">
                          Click to view
                        </span>
                      </div>
                    </div>
                    {/* Caption */}
                    <div className="mt-3 text-center h-12">
                      <p className="text-sm text-foreground font-medium line-clamp-2">
                        {item.caption || 'Untitled'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!isLoading && displayItems.length === 0 && (
              <div className="text-center py-20">
                <Camera className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No projects yet</h3>
                <p className="text-muted-foreground">Check back soon for our latest work!</p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Modal for full-size image */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl">
              {selectedItem?.caption || 'Project Photo'}
            </DialogTitle>
          </DialogHeader>
          
          {selectedItem && (
            <div className="space-y-4">
              <div className="relative rounded-lg overflow-hidden bg-muted">
                <img
                  src={selectedItem.image_url}
                  alt={selectedItem.caption || 'Project photo'}
                  className="w-full h-auto max-h-[60vh] object-contain mx-auto"
                />
              </div>
              {selectedItem.description && (
                <DialogDescription className="text-base text-muted-foreground pt-2">
                  {selectedItem.description}
                </DialogDescription>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default ProjectsGallery;
