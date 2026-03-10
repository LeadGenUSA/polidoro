import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { uploadFileWithConversion, isHeicFile } from '@/lib/upload-helpers';
import heroImage from '@/assets/hero-plumbing.jpg';
import heroVideo from '@/assets/big-city-plumbing-and-heating.mp4';

export interface SlideshowItem {
  id: string;
  type: 'image' | 'video';
  file_url: string;
  alt_text: string | null;
  display_order: number;
  is_active: boolean;
  duration_seconds: number;
  overlay_title: string | null;
  overlay_text: string | null;
  link_url: string | null;
  show_volume_controls: boolean;
  is_default_first: boolean;
  created_at: string;
  updated_at: string;
  isDefault?: boolean; // Flag for built-in default slides
}

// Default slides that come with the site
const defaultSlides: SlideshowItem[] = [
  {
    id: 'default-video',
    type: 'video',
    file_url: heroVideo,
    alt_text: 'Big City Plumbing and Heating introduction video',
    display_order: 0,
    is_active: true,
    duration_seconds: 15,
    overlay_title: null,
    overlay_text: null,
    link_url: null,
    show_volume_controls: false,
    is_default_first: true,
    created_at: '',
    updated_at: '',
    isDefault: true,
  },
  {
    id: 'default-image',
    type: 'image',
    file_url: heroImage,
    alt_text: 'Professional plumbing and heating services',
    display_order: 1,
    is_active: true,
    duration_seconds: 15,
    overlay_title: null,
    overlay_text: null,
    link_url: null,
    show_volume_controls: false,
    is_default_first: false,
    created_at: '',
    updated_at: '',
    isDefault: true,
  },
];

export const useSlideshow = () => {
  const [items, setItems] = useState<SlideshowItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [hasCustomSlides, setHasCustomSlides] = useState(false);
  const { toast } = useToast();

  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('slideshow_items')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      
      if (data && data.length > 0) {
        // Sort so default first slide always appears at index 0
        const sortedData = [...data].sort((a, b) => {
          if (a.is_default_first) return -1;
          if (b.is_default_first) return 1;
          return a.display_order - b.display_order;
        });
        setItems(sortedData as SlideshowItem[]);
        setHasCustomSlides(true);
      } else {
        // Show default slides when no custom ones exist
        setItems(defaultSlides);
        setHasCustomSlides(false);
      }
    } catch (error) {
      console.error('Error fetching slideshow items:', error);
      toast({
        title: 'Error',
        description: 'Failed to load slideshow items',
        variant: 'destructive',
      });
      // Fall back to defaults on error
      setItems(defaultSlides);
      setHasCustomSlides(false);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const uploadFile = async (file: File): Promise<string | null> => {
    try {
      return await uploadFileWithConversion(file, 'slideshow');
    } catch (error) {
      console.error('Upload error:', error);
      return null;
    }
  };

  const addItem = async (file: File, altText?: string, durationSeconds?: number, overlayTitle?: string, overlayText?: string, linkUrl?: string) => {
    setIsUploading(true);
    try {
      const fileUrl = await uploadFile(file);
      if (!fileUrl) throw new Error('Upload failed');

      const isVideo = file.type.startsWith('video/');
      const maxOrder = items.length > 0 
        ? Math.max(...items.map(i => i.display_order)) 
        : -1;

      const { error } = await supabase.from('slideshow_items').insert({
        type: isVideo ? 'video' : 'image',
        file_url: fileUrl,
        alt_text: altText || null,
        display_order: maxOrder + 1,
        is_active: true,
        duration_seconds: durationSeconds || 15,
        overlay_title: overlayTitle || null,
        overlay_text: overlayText || null,
        link_url: linkUrl || null,
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Slideshow item added successfully',
      });
      await fetchItems();
    } catch (error) {
      console.error('Error adding item:', error);
      toast({
        title: 'Error',
        description: 'Failed to add slideshow item',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const updateItem = async (id: string, updates: Partial<Pick<SlideshowItem, 'alt_text' | 'is_active' | 'display_order' | 'duration_seconds' | 'overlay_title' | 'overlay_text' | 'link_url' | 'is_default_first'>>) => {
    try {
      const { error } = await supabase
        .from('slideshow_items')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Slideshow item updated',
      });
      await fetchItems();
    } catch (error) {
      console.error('Error updating item:', error);
      toast({
        title: 'Error',
        description: 'Failed to update slideshow item',
        variant: 'destructive',
      });
    }
  };

  const setDefaultFirst = async (id: string) => {
    try {
      // Clear all other defaults first
      await supabase
        .from('slideshow_items')
        .update({ is_default_first: false })
        .neq('id', id);

      // Set the selected one
      const { error } = await supabase
        .from('slideshow_items')
        .update({ is_default_first: true })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Default first slide updated',
      });
      await fetchItems();
    } catch (error) {
      console.error('Error setting default first:', error);
      toast({
        title: 'Error',
        description: 'Failed to set default first slide',
        variant: 'destructive',
      });
    }
  };

  const deleteItem = async (id: string) => {
    try {
      // Get the item to delete its file from storage
      const item = items.find(i => i.id === id);
      if (item) {
        const fileName = item.file_url.split('/').pop();
        if (fileName) {
          await supabase.storage.from('slideshow').remove([fileName]);
        }
      }

      const { error } = await supabase
        .from('slideshow_items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Slideshow item deleted',
      });
      await fetchItems();
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete slideshow item',
        variant: 'destructive',
      });
    }
  };

  const reorderItems = async (reorderedItems: SlideshowItem[]) => {
    try {
      const updates = reorderedItems.map((item, index) => ({
        id: item.id,
        display_order: index,
      }));

      for (const update of updates) {
        await supabase
          .from('slideshow_items')
          .update({ display_order: update.display_order })
          .eq('id', update.id);
      }

      setItems(reorderedItems.map((item, index) => ({ ...item, display_order: index })));
      toast({
        title: 'Success',
        description: 'Order updated',
      });
    } catch (error) {
      console.error('Error reordering:', error);
      toast({
        title: 'Error',
        description: 'Failed to reorder items',
        variant: 'destructive',
      });
    }
  };

  return {
    items,
    isLoading,
    isUploading,
    hasCustomSlides,
    fetchItems,
    addItem,
    updateItem,
    deleteItem,
    reorderItems,
    setDefaultFirst,
  };
};
