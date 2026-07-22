import { useParams, Link } from 'react-router-dom';
import { useBlogPost } from '@/hooks/useBlogPosts';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Loader2, Calendar, ArrowLeft } from 'lucide-react';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { post, isLoading } = useBlogPost(slug || '');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center pt-40 pb-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-40 pb-20 text-center">
          <h1 className="font-heading text-3xl font-bold text-foreground mb-4">Post Not Found</h1>
          <Link to="/blog" className="text-primary hover:underline">← Back to Blog</Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Render markdown-lite (headings, bold, bullets, paragraphs) as safe React nodes.
  const renderInline = (text: string): (string | JSX.Element)[] => {
    // Split by **bold** while escaping other content by relying on React's JSX escaping.
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      const m = part.match(/^\*\*([^*]+)\*\*$/);
      if (m) return <strong key={i}>{m[1]}</strong>;
      return part;
    });
  };

  const renderContent = (md: string) => {
    const lines = md.split('\n');
    const elements: JSX.Element[] = [];
    let listItems: string[] = [];

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`ul-${elements.length}`} className="list-disc pl-6 mb-4 space-y-1 text-foreground/90">
            {listItems.map((item, i) => (
              <li key={i}>{renderInline(item)}</li>
            ))}
          </ul>
        );
        listItems = [];
      }
    };

    lines.forEach((line, i) => {
      const trimmed = line.trim();

      if (trimmed.startsWith('### ')) {
        flushList();
        elements.push(<h3 key={i} className="font-heading text-xl font-bold text-foreground mt-6 mb-3">{trimmed.slice(4)}</h3>);
      } else if (trimmed.startsWith('## ')) {
        flushList();
        elements.push(<h2 key={i} className="font-heading text-2xl font-bold text-foreground mt-8 mb-4">{trimmed.slice(3)}</h2>);
      } else if (trimmed.startsWith('# ')) {
        flushList();
        elements.push(<h2 key={i} className="font-heading text-2xl font-bold text-foreground mt-8 mb-4">{trimmed.slice(2)}</h2>);
      } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        listItems.push(trimmed.slice(2));
      } else if (trimmed === '') {
        flushList();
      } else {
        flushList();
        elements.push(
          <p key={i} className="text-foreground/90 leading-relaxed mb-4">
            {renderInline(trimmed)}
          </p>
        );
      }
    });
    flushList();
    return elements;
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`${post.title} - Big City Plumbing and Heating`}
        description={post.meta_description || `Read about ${post.title} from Big City Plumbing and Heating.`}
        canonical={`/blog/${post.slug}`}
        schemaJson={post.faqs && post.faqs.length > 0 ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": post.faqs.map((faq: { question: string; answer: string }) => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": { "@type": "Answer", "text": faq.answer }
          }))
        } : undefined}
      />
      <Navbar />

      {/* Hero */}
      <section className="hero-gradient pt-32 pb-12">
        <div className="container mx-auto px-4 lg:px-8">
          <Link to="/blog" className="text-primary-foreground/80 hover:text-primary-foreground text-sm flex items-center gap-1 mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground mb-4 max-w-3xl">
            {post.title}
          </h1>
          {post.published_at && (
            <div className="flex items-center gap-2 text-primary-foreground/70">
              <Calendar className="w-4 h-4" />
              {new Date(post.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
          )}
        </div>
      </section>

      {/* Content */}
      <article className="py-12">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          {post.featured_image_url && (
            <img src={post.featured_image_url} alt={post.title} className="w-full rounded-xl mb-8 shadow-card" />
          )}

          <div className="prose-like">
            {renderContent(post.content)}
          </div>

          {/* FAQs */}
          {post.faqs && post.faqs.length > 0 && (
            <div className="mt-12">
              <h2 className="font-heading text-2xl font-bold text-foreground mb-6">Frequently Asked Questions</h2>
              <Accordion type="single" collapsible className="w-full">
                {post.faqs.map((faq, i) => (
                  <AccordionItem key={i} value={`faq-${i}`}>
                    <AccordionTrigger className="text-left font-medium text-foreground">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default BlogPost;
