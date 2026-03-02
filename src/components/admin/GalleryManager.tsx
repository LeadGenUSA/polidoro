import { useState, useRef } from 'react';
import { useGallery, GalleryItem } from '@/hooks/useGallery';
import { isHeicFile } from '@/lib/upload-helpers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { 
  Plus, 
  Upload, 
  Trash2, 
  Loader2, 
  Image as ImageIcon,
  Edit,
  Eye,
  EyeOff,
  GripVertical
} from 'lucide-react';

export const GalleryManager = () => {
  const { items, isLoading, uploadImage, addItem, updateItem, deleteItem } = useGallery();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // Form state for new item
  const [newCaption, setNewCaption] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // Form state for editing
  const [editCaption, setEditCaption] = useState('');
  const [editDescription, setEditDescription] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddItem = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    try {
      const imageUrl = await uploadImage(selectedFile);
      if (imageUrl) {
        const success = await addItem(imageUrl, newCaption, newDescription);
        if (success) {
          resetAddForm();
          setIsAddDialogOpen(false);
        }
      }
    } finally {
      setIsUploading(false);
    }
  };

  const resetAddForm = () => {
    setNewCaption('');
    setNewDescription('');
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleEditClick = (item: GalleryItem) => {
    setEditingItem(item);
    setEditCaption(item.caption || '');
    setEditDescription(item.description || '');
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;
    
    const success = await updateItem(editingItem.id, {
      caption: editCaption,
      description: editDescription,
    });
    
    if (success) {
      setEditingItem(null);
    }
  };

  const handleToggleActive = async (item: GalleryItem) => {
    await updateItem(item.id, { is_active: !item.is_active });
  };

  const handleDelete = async (id: string) => {
    await deleteItem(id);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Gallery Items</h3>
          <p className="text-sm text-muted-foreground">
            {items.length} item{items.length !== 1 ? 's' : ''} in gallery
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          if (!open) resetAddForm();
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Photo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Add Gallery Photo</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              {/* Image Upload */}
              <div className="space-y-2">
                <Label>Photo</Label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.heic,.heif"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                {previewUrl ? (
                  <div className="relative">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setSelectedFile(null);
                        setPreviewUrl(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-48 border-2 border-dashed border-muted-foreground/25 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-primary/50 transition-colors"
                  >
                    <Upload className="w-8 h-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Click to upload photo</span>
                  </button>
                )}
              </div>

              {/* Caption */}
              <div className="space-y-2">
                <Label htmlFor="caption">Caption</Label>
                <Input
                  id="caption"
                  placeholder="e.g., Navien Boiler Installation"
                  value={newCaption}
                  onChange={(e) => setNewCaption(e.target.value)}
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the project in detail..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleAddItem} 
                disabled={!selectedFile || isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {selectedFile && isHeicFile(selectedFile) ? 'Converting HEIC to JPEG...' : 'Uploading...'}
                  </>
                ) : (
                  'Add Photo'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Gallery Items Grid */}
      {items.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
            <h4 className="font-semibold text-foreground mb-2">No gallery items</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Add photos to showcase your completed projects.
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)} variant="outline" className="gap-2">
              <Plus className="w-4 h-4" />
              Add First Photo
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <Card key={item.id} className={`overflow-hidden ${!item.is_active ? 'opacity-60' : ''}`}>
              <div className="relative aspect-video">
                <img
                  src={item.image_url}
                  alt={item.caption || 'Gallery item'}
                  className="w-full h-full object-cover"
                />
                {!item.is_active && (
                  <div className="absolute top-2 left-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                    Hidden
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <h4 className="font-semibold text-foreground mb-1 line-clamp-1">
                  {item.caption || 'Untitled'}
                </h4>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {item.description || 'No description'}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={item.is_active}
                      onCheckedChange={() => handleToggleActive(item)}
                    />
                    <span className="text-sm text-muted-foreground">
                      {item.is_active ? 'Visible' : 'Hidden'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditClick(item)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Photo?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete this gallery item. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(item.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Gallery Photo</DialogTitle>
          </DialogHeader>
          
          {editingItem && (
            <div className="space-y-4 py-4">
              <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                <img
                  src={editingItem.image_url}
                  alt={editingItem.caption || 'Gallery item'}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-caption">Caption</Label>
                <Input
                  id="edit-caption"
                  value={editCaption}
                  onChange={(e) => setEditCaption(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingItem(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
