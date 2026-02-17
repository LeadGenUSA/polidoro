import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const sitemapCategories = [
  {
    title: 'Main Pages',
    links: [
      { name: 'Home', path: '/' },
      { name: 'Services', path: '/services' },
      { name: 'About Us', path: '/about-us' },
      { name: 'Contact Us', path: '/contact-us' },
    ],
  },
  {
    title: 'Services',
    links: [
      { name: 'Plumbing Services', path: '/plumbing-services' },
      { name: 'Heating Services', path: '/heating-services' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { name: 'Blog', path: '/blog' },
      { name: 'How-To Videos', path: '/how-to-videos' },
      { name: 'Projects Gallery', path: '/projects-gallery' },
      { name: 'Reviews', path: '/reviews' },
    ],
  },
  {
    title: 'Forms',
    links: [
      { name: 'Free Estimate', path: '/free-estimate' },
      { name: 'Work Order', path: '/work-order' },
      { name: 'Customer Survey', path: '/customer-survey' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { name: 'Privacy Policy', path: '/privacy-policy' },
      { name: 'Terms of Service', path: '/terms-of-service' },
    ],
  },
];

const Sitemap = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Sitemap | Big City Plumbing & Heating"
        description="Browse all pages on Big City Plumbing & Heating. Find plumbing services, heating services, resources, and more."
        path="/sitemap"
      />
      <Navbar />

      <section className="hero-gradient pt-28 md:pt-32 pb-16 md:pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground">
            Sitemap
          </h1>
          <p className="text-primary-foreground/80 mt-2 max-w-2xl">
            A complete directory of all pages on our website.
          </p>
        </div>
      </section>

      <main className="flex-1 py-12 md:py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sitemapCategories.map((category) => (
              <Card key={category.title}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{category.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {category.links.map((link) => (
                      <li key={link.path}>
                        <Link
                          to={link.path}
                          className="text-sm text-primary hover:text-primary/80 hover:underline transition-colors"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Sitemap;
