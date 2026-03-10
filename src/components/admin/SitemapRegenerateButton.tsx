import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Globe, Loader2, Download, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function SitemapRegenerateButton() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleRegenerate = async () => {
    setIsLoading(true);
    try {
      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/generate-sitemap`
      );

      if (!response.ok) throw new Error('Failed to generate sitemap');

      const xml = await response.text();
      const blob = new Blob([xml], { type: 'application/xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sitemap.xml';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: 'Sitemap downloaded',
        description: 'Replace public/sitemap.xml with the downloaded file and redeploy.',
      });
    } catch (err) {
      console.error('Sitemap generation error:', err);
      toast({
        title: 'Error generating sitemap',
        description: 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button variant="outline" onClick={handleRegenerate} disabled={isLoading} className="gap-2">
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Globe className="w-4 h-4" />
      )}
      Download Sitemap XML
    </Button>
  );
}
