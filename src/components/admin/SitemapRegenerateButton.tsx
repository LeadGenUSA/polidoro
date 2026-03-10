import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Globe, Loader2, Upload, CloudUpload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export function SitemapRegenerateButton() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const fetchSitemapXml = async (): Promise<string> => {
    const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/generate-sitemap`
    );
    if (!response.ok) throw new Error('Failed to generate sitemap');
    return response.text();
  };

  const uploadToBucket = async (xml: string) => {
    const blob = new Blob([xml], { type: 'application/xml' });
    const file = new File([blob], 'sitemap.xml', { type: 'application/xml' });

    // Remove existing file first (upsert)
    await supabase.storage.from('sitemap').remove(['sitemap.xml']);

    const { error } = await supabase.storage
      .from('sitemap')
      .upload('sitemap.xml', file, {
        contentType: 'application/xml',
        upsert: true,
      });

    if (error) throw error;
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const xml = await fetchSitemapXml();
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
      setIsDownloading(false);
    }
  };

  const handleGenerateAndUpload = async () => {
    setIsUploading(true);
    try {
      const xml = await fetchSitemapXml();
      await uploadToBucket(xml);
      toast({
        title: 'Sitemap uploaded',
        description: 'The live sitemap has been updated in cloud storage.',
      });
    } catch (err) {
      console.error('Sitemap upload error:', err);
      toast({
        title: 'Error uploading sitemap',
        description: 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const xml = await file.text();
      await uploadToBucket(xml);
      toast({
        title: 'Sitemap uploaded',
        description: 'Custom sitemap.xml has been saved to cloud storage.',
      });
    } catch (err) {
      console.error('Sitemap file upload error:', err);
      toast({
        title: 'Error uploading file',
        description: 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const isLoading = isDownloading || isUploading;

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" onClick={handleDownload} disabled={isLoading} className="gap-2">
        {isDownloading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Globe className="w-4 h-4" />
        )}
        Download Sitemap XML
      </Button>

      <Button variant="outline" onClick={handleGenerateAndUpload} disabled={isLoading} className="gap-2">
        {isUploading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <CloudUpload className="w-4 h-4" />
        )}
        Generate & Upload to Cloud
      </Button>

      <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isLoading} className="gap-2">
        <Upload className="w-4 h-4" />
        Upload Custom XML
      </Button>

      <input
        ref={fileInputRef}
        type="file"
        accept=".xml,application/xml,text/xml"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
}
