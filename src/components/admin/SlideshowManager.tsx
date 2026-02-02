import { useState, useRef } from 'react';
import { useSlideshow, SlideshowItem } from '@/hooks/useSlideshow';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Image,
  Video,
  Upload,
  Trash2,
  GripVertical,
  Loader2,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  Info,
  Lock,
} from 'lucide-react';

export const SlideshowManager = () => {
  const { items, isLoading, isUploading, hasCustomSlides, addItem, updateItem, deleteItem, reorderItems } = useSlideshow();
  const [altText, setAltText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isValidType = file.type.startsWith('image/') || file.type.startsWith('video/');
    if (!isValidType) {
      alert('Please select an image or video file');
      return;
    }

    await addItem(file, altText);
    setAltText('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...items];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
    reorderItems(newItems);
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
      {/* Upload Section */}
      <div className="bg-card rounded-xl p-6 shadow-card">
        <h3 className="font-heading font-semibold text-lg mb-4">Add New Slide</h3>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Label htmlFor="altText" className="mb-2 block">
              Alt Text (optional)
            </Label>
            <Input
              id="altText"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Describe the image for accessibility"
            />
          </div>
          <div className="flex items-end">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={handleFileSelect}
              className="hidden"
              id="slideshow-upload"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="gap-2"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload Image/Video
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Items List */}
      <div className="bg-card rounded-xl p-6 shadow-card">
        <h3 className="font-heading font-semibold text-lg mb-4">
          Current Slides ({items.length})
        </h3>
        
        {!hasCustomSlides && items.length > 0 && (
          <Alert className="mb-4">
            <Info className="h-4 w-4" />
            <AlertDescription>
              These are the default built-in slides. Upload your own images/videos to replace them, 
              or they will continue to display on the homepage.
            </AlertDescription>
          </Alert>
        )}
        
        {items.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Image className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>No slides yet. Upload an image or video to get started.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item, index) => (
              <SlideItem
                key={item.id}
                item={item}
                index={index}
                totalItems={items.length}
                onMoveUp={() => moveItem(index, 'up')}
                onMoveDown={() => moveItem(index, 'down')}
                onToggleActive={(isActive) => updateItem(item.id, { is_active: isActive })}
                onDelete={() => deleteItem(item.id)}
                isDefault={item.isDefault || false}
                hasCustomSlides={hasCustomSlides}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface SlideItemProps {
  item: SlideshowItem;
  index: number;
  totalItems: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onToggleActive: (isActive: boolean) => void;
  onDelete: () => void;
  isDefault: boolean;
  hasCustomSlides: boolean;
}

const SlideItem = ({
  item,
  index,
  totalItems,
  onMoveUp,
  onMoveDown,
  onToggleActive,
  onDelete,
  isDefault,
  hasCustomSlides,
}: SlideItemProps) => {
  // Default items are read-only
  const isReadOnly = isDefault && !hasCustomSlides;
  
  return (
    <div className={`flex items-center gap-4 p-4 rounded-lg border ${item.is_active ? 'bg-background' : 'bg-muted/50 opacity-60'} ${isReadOnly ? 'border-dashed' : ''}`}>
      {isReadOnly ? (
        <div className="flex flex-col items-center justify-center w-6">
          <Lock className="w-4 h-4 text-muted-foreground" />
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={onMoveUp}
            disabled={index === 0}
          >
            <ChevronUp className="w-4 h-4" />
          </Button>
          <GripVertical className="w-4 h-4 text-muted-foreground mx-auto" />
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={onMoveDown}
            disabled={index === totalItems - 1}
          >
            <ChevronDown className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Thumbnail */}
      <div className="w-24 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
        {item.type === 'video' ? (
          <video src={item.file_url} className="w-full h-full object-cover" muted />
        ) : (
          <img src={item.file_url} alt={item.alt_text || ''} className="w-full h-full object-cover" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          {item.type === 'video' ? (
            <Video className="w-4 h-4 text-primary" />
          ) : (
            <Image className="w-4 h-4 text-primary" />
          )}
          <span className="font-medium capitalize">{item.type}</span>
          <span className="text-xs text-muted-foreground">#{index + 1}</span>
          {isReadOnly && (
            <span className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground">Default</span>
          )}
        </div>
        {item.alt_text && (
          <p className="text-sm text-muted-foreground truncate">{item.alt_text}</p>
        )}
      </div>

      {/* Actions */}
      {!isReadOnly && (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {item.is_active ? (
              <Eye className="w-4 h-4 text-primary" />
            ) : (
              <EyeOff className="w-4 h-4 text-muted-foreground" />
            )}
            <Switch
              checked={item.is_active}
              onCheckedChange={onToggleActive}
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive"
            onClick={onDelete}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};