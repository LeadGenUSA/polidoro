import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface GalleryItem {
  id: string;
  image_url: string;
  caption: string | null;
  description: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useGallery = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('gallery_items')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setItems((data as GalleryItem[]) || []);
    } catch (error: any) {
      console.error('Error fetching gallery items:', error);
      toast({
        title: 'Error',
        description: 'Failed to load gallery items',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('gallery')
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Upload Error',
        description: error.message || 'Failed to upload image',
        variant: 'destructive',
      });
      return null;
    }
  };

  const addItem = async (imageUrl: string, caption?: string, description?: string): Promise<boolean> => {
    try {
      const maxOrder = items.length > 0 ? Math.max(...items.map(i => i.display_order)) : -1;
      
      const { error } = await supabase
        .from('gallery_items')
        .insert({
          image_url: imageUrl,
          caption: caption || null,
          description: description || null,
          display_order: maxOrder + 1,
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Gallery item added successfully',
      });
      
      await fetchItems();
      return true;
    } catch (error: any) {
      console.error('Error adding gallery item:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to add gallery item',
        variant: 'destructive',
      });
      return false;
    }
  };

  const updateItem = async (id: string, updates: Partial<Pick<GalleryItem, 'caption' | 'description' | 'is_active' | 'display_order'>>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('gallery_items')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Gallery item updated',
      });
      
      await fetchItems();
      return true;
    } catch (error: any) {
      console.error('Error updating gallery item:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update gallery item',
        variant: 'destructive',
      });
      return false;
    }
  };

  const deleteItem = async (id: string): Promise<boolean> => {
    try {
      // Get the item to find the image URL
      const item = items.find(i => i.id === id);
      
      const { error } = await supabase
        .from('gallery_items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Try to delete the image from storage
      if (item?.image_url) {
        const fileName = item.image_url.split('/').pop();
        if (fileName) {
          await supabase.storage.from('gallery').remove([fileName]);
        }
      }

      toast({
        title: 'Success',
        description: 'Gallery item deleted',
      });
      
      await fetchItems();
      return true;
    } catch (error: any) {
      console.error('Error deleting gallery item:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete gallery item',
        variant: 'destructive',
      });
      return false;
    }
  };

  return {
    items,
    isLoading,
    fetchItems,
    uploadImage,
    addItem,
    updateItem,
    deleteItem,
  };
};
