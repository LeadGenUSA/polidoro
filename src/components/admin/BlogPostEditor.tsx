import { useState, useRef } from 'react';
import { BlogPost } from '@/hooks/useBlogPosts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, CheckCircle, XCircle, Trash2, Save, Loader2, ImagePlus, X } from 'lucide-react';
import { uploadFileWithConversion, isHeicFile } from '@/lib/upload-helpers';

interface BlogPostEditorProps {
  post: BlogPost;
  onUpdate: (id: string, updates: Partial<BlogPost>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onBack: () => void;
}

export const BlogPostEditor = ({ post, onUpdate, onDelete, onBack }: BlogPostEditorProps) => {
  const [title, setTitle] = useState(post.title);
  const [metaDescription, setMetaDescription] = useState(post.meta_description || '');
  const [content, setContent] = useState(post.content);
  const [faqs, setFaqs] = useState<{ question: string; answer: string }[]>(post.faqs || []);
  const [featuredImageUrl, setFeaturedImageUrl] = useState(post.featured_image_url);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/') && !isHeicFile(file)) {
      toast({ title: 'Invalid file type', description: 'Please select an image file.', variant: 'destructive' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'File too large', description: 'Image must be under 5MB.', variant: 'destructive' });
      return;
    }

    setIsUploading(true);
    try {
      const publicUrl = await uploadFileWithConversion(file, 'blog-images');
      setFeaturedImageUrl(publicUrl);
      toast({ title: 'Image uploaded successfully' });
    } catch {
      toast({ title: 'Upload failed', variant: 'destructive' });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    await onUpdate(post.id, { title, meta_description: metaDescription, content, faqs, featured_image_url: featuredImageUrl });
    setIsSaving(false);
  };

  const pingSearchEngines = async (slug: string) => {
    try {
      await supabase.functions.invoke('ping-blog-post', { body: { slug } });
      console.log('Search engine ping sent for:', slug);
    } catch (e) {
      console.error('Ping failed (non-blocking):', e);
    }
  };

  const handleApprove = async () => {
    setIsSaving(true);
    await onUpdate(post.id, { title, meta_description: metaDescription, content, faqs, featured_image_url: featuredImageUrl, status: 'published' });
    // Ping search engines after publishing (fire-and-forget)
    const slug = post.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    pingSearchEngines(slug);
    setIsSaving(false);
    onBack();
  };

  const handleReject = async () => {
    setIsSaving(true);
    await onUpdate(post.id, { status: 'rejected' });
    setIsSaving(false);
    onBack();
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this post?')) {
      await onDelete(post.id);
      onBack();
    }
  };

  const updateFaq = (index: number, field: 'question' | 'answer', value: string) => {
    const updated = [...faqs];
    updated[index] = { ...updated[index], [field]: value };
    setFaqs(updated);
  };

  return (
    <div>
      <Button variant="ghost" onClick={onBack} className="gap-2 mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to Posts
      </Button>

      {/* Featured Image */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.heic,.heif"
        onChange={handleImageUpload}
        className="hidden"
      />
      {featuredImageUrl ? (
        <div className="mb-6 rounded-xl overflow-hidden relative group">
          <img src={featuredImageUrl} alt={title} className="w-full h-64 object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <ImagePlus className="w-4 h-4 mr-1" />}
              Change
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => setFeaturedImageUrl(null)}
            >
              <X className="w-4 h-4 mr-1" /> Remove
            </Button>
          </div>
        </div>
      ) : (
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full h-32 border-dashed gap-2"
          >
            {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImagePlus className="w-5 h-5" />}
            {isUploading ? 'Uploading...' : 'Add Featured Image'}
          </Button>
        </div>
      )}

      {/* Status Badge */}
      <div className="mb-4">
        <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
          post.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
          post.status === 'published' ? 'bg-green-100 text-green-800' :
          'bg-red-100 text-red-800'
        }`}>
          {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
        </span>
      </div>

      {/* Title */}
      <div className="mb-4">
        <label className="text-sm font-medium text-foreground mb-1 block">Title</label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>

      {/* Meta Description */}
      <div className="mb-4">
        <label className="text-sm font-medium text-foreground mb-1 block">Meta Description</label>
        <Input value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} />
        <p className="text-xs text-muted-foreground mt-1">{metaDescription.length}/160 characters</p>
      </div>

      {/* Content */}
      <div className="mb-6">
        <label className="text-sm font-medium text-foreground mb-1 block">Content (Markdown)</label>
        <Textarea value={content} onChange={(e) => setContent(e.target.value)} className="min-h-[400px] font-mono text-sm" />
      </div>

      {/* FAQs */}
      {faqs.length > 0 && (
        <div className="mb-6">
          <label className="text-sm font-medium text-foreground mb-2 block">FAQs</label>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-muted/50 rounded-lg p-4">
                <Input
                  value={faq.question}
                  onChange={(e) => updateFaq(i, 'question', e.target.value)}
                  placeholder="Question"
                  className="mb-2"
                />
                <Textarea
                  value={faq.answer}
                  onChange={(e) => updateFaq(i, 'answer', e.target.value)}
                  placeholder="Answer"
                  className="min-h-[60px]"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-3 border-t pt-4">
        <Button onClick={handleSave} disabled={isSaving} className="gap-2">
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </Button>
        {post.status !== 'published' && (
          <Button onClick={handleApprove} disabled={isSaving} variant="outline" className="gap-2 text-green-600 border-green-300 hover:bg-green-50">
            <CheckCircle className="w-4 h-4" /> Approve & Publish
          </Button>
        )}
        {post.status !== 'rejected' && (
          <Button onClick={handleReject} disabled={isSaving} variant="outline" className="gap-2 text-red-600 border-red-300 hover:bg-red-50">
            <XCircle className="w-4 h-4" /> Reject
          </Button>
        )}
        <Button onClick={handleDelete} variant="ghost" className="gap-2 text-destructive ml-auto">
          <Trash2 className="w-4 h-4" /> Delete
        </Button>
      </div>
    </div>
  );
};
