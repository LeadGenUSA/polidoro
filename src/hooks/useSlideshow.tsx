import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SlideshowItem {
  id: string;
  type: 'image' | 'video';
  file_url: string;
  alt_text: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useSlideshow = () => {
  const [items, setItems] = useState<SlideshowItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('slideshow_items')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setItems((data as SlideshowItem[]) || []);
    } catch (error) {
      console.error('Error fetching slideshow items:', error);
      toast({
        title: 'Error',
        description: 'Failed to load slideshow items',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const uploadFile = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = fileName;

    const { error: uploadError } = await supabase.storage
      .from('slideshow')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return null;
    }

    const { data } = supabase.storage.from('slideshow').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const addItem = async (file: File, altText?: string) => {
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

  const updateItem = async (id: string, updates: Partial<Pick<SlideshowItem, 'alt_text' | 'is_active' | 'display_order'>>) => {
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
    fetchItems,
    addItem,
    updateItem,
    deleteItem,
    reorderItems,
  };
};
