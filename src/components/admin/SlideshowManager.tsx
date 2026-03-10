import { useState, useRef } from 'react';
import { isHeicFile } from '@/lib/upload-helpers';
import { useSlideshow, SlideshowItem } from '@/hooks/useSlideshow';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
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
  Clock,
  Type,
  Settings2,
  ExternalLink,
  Star,
} from 'lucide-react';

export const SlideshowManager = () => {
  const { items, isLoading, isUploading, hasCustomSlides, addItem, updateItem, deleteItem, reorderItems, setDefaultFirst } = useSlideshow();
  const [altText, setAltText] = useState('');
  const [duration, setDuration] = useState('15');
  const [overlayTitle, setOverlayTitle] = useState('');
  const [overlayText, setOverlayText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isValidType = file.type.startsWith('image/') || file.type.startsWith('video/') || isHeicFile(file);
    if (!isValidType) {
      alert('Please select an image or video file');
      return;
    }
    setIsConverting(isHeicFile(file));
    await addItem(file, altText, parseInt(duration) || 15, overlayTitle || undefined, overlayText || undefined, linkUrl || undefined);
    setIsConverting(false);
    setAltText('');
    setDuration('15');
    setOverlayTitle('');
    setOverlayText('');
    setLinkUrl('');
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
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
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
          <div>
            <Label htmlFor="duration" className="mb-2 block">
              Duration (seconds)
            </Label>
            <Input
              id="duration"
              type="number"
              min="3"
              max="60"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="15"
            />
          </div>
        </div>
        <div className="mb-4">
          <Label htmlFor="overlayTitle" className="mb-2 block">
            Overlay Title (optional)
          </Label>
          <Input
            id="overlayTitle"
            value={overlayTitle}
            onChange={(e) => setOverlayTitle(e.target.value)}
            placeholder="Bold title displayed above the text"
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="overlayText" className="mb-2 block">
            Overlay Text (optional)
          </Label>
          <Textarea
            id="overlayText"
            value={overlayText}
            onChange={(e) => setOverlayText(e.target.value)}
            placeholder="Text to display over the image/video"
            rows={2}
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="linkUrl" className="mb-2 block">
            Link URL (optional)
          </Label>
          <Input
            id="linkUrl"
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://example.com - opens in new tab when slide is clicked"
          />
        </div>
        <div className="flex justify-end">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*,.heic,.heif"
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
                {isConverting ? 'Converting HEIC to JPEG...' : 'Uploading...'}
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
                onUpdate={(updates) => updateItem(item.id, updates)}
                onDelete={() => deleteItem(item.id)}
                onSetDefaultFirst={() => setDefaultFirst(item.id)}
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
  onUpdate: (updates: Partial<Pick<SlideshowItem, 'is_active' | 'duration_seconds' | 'overlay_title' | 'overlay_text' | 'link_url' | 'show_volume_controls'>>) => void;
  onDelete: () => void;
  onSetDefaultFirst: () => void;
  isDefault: boolean;
  hasCustomSlides: boolean;
}

const SlideItem = ({
  item,
  index,
  totalItems,
  onMoveUp,
  onMoveDown,
  onUpdate,
  onDelete,
  onSetDefaultFirst,
  isDefault,
  hasCustomSlides,
}: SlideItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editDuration, setEditDuration] = useState(item.duration_seconds.toString());
  const [editOverlayTitle, setEditOverlayTitle] = useState(item.overlay_title || '');
  const [editOverlay, setEditOverlay] = useState(item.overlay_text || '');
  const [editLinkUrl, setEditLinkUrl] = useState(item.link_url || '');
  
  // Default items are read-only
  const isReadOnly = isDefault && !hasCustomSlides;

  const handleSave = () => {
    onUpdate({
      duration_seconds: parseInt(editDuration) || 15,
      overlay_title: editOverlayTitle || null,
      overlay_text: editOverlay || null,
      link_url: editLinkUrl || null,
    });
    setIsEditing(false);
  };
  
  return (
    <div className={`rounded-lg border ${item.is_active ? 'bg-background' : 'bg-muted/50 opacity-60'} ${isReadOnly ? 'border-dashed' : ''}`}>
      <div className="flex items-center gap-4 p-4">
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
        <div className="w-24 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0 relative">
          {item.type === 'video' ? (
            <video src={item.file_url} className="w-full h-full object-cover" muted />
          ) : (
            <img src={item.file_url} alt={item.alt_text || ''} className="w-full h-full object-cover" />
          )}
          {item.overlay_text && (
            <div className="absolute inset-0 bg-primary/50 flex items-center justify-center">
              <Type className="w-4 h-4 text-primary-foreground" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            {item.type === 'video' ? (
              <Video className="w-4 h-4 text-primary" />
            ) : (
              <Image className="w-4 h-4 text-primary" />
            )}
            <span className="font-medium capitalize">{item.type}</span>
            <span className="text-xs text-muted-foreground">#{index + 1}</span>
            <span className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {item.duration_seconds}s
            </span>
            {item.is_default_first && (
              <span className="text-xs px-2 py-0.5 bg-secondary text-secondary-foreground rounded-full flex items-center gap-1 font-medium">
                <Star className="w-3 h-3 fill-current" />
                First Slide
              </span>
            )}
            {isReadOnly && (
              <span className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground">Default</span>
            )}
            {item.link_url && (
              <span className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground flex items-center gap-1">
                <ExternalLink className="w-3 h-3" />
                Link
              </span>
            )}
          </div>
          {item.alt_text && (
            <p className="text-sm text-muted-foreground truncate">{item.alt_text}</p>
          )}
          {item.overlay_text && (
            <p className="text-xs text-primary truncate mt-1">
              <Type className="w-3 h-3 inline mr-1" />
              {item.overlay_text}
            </p>
          )}
          {item.link_url && (
            <p className="text-xs text-muted-foreground truncate mt-1">
              <ExternalLink className="w-3 h-3 inline mr-1" />
              {item.link_url}
            </p>
          )}
        </div>

        {/* Actions */}
        {!isReadOnly && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Checkbox
                id={`default-first-${item.id}`}
                checked={item.is_default_first}
                onCheckedChange={() => {
                  if (!item.is_default_first) {
                    onSetDefaultFirst();
                  }
                }}
                disabled={item.is_default_first}
              />
              <Label 
                htmlFor={`default-first-${item.id}`} 
                className="text-xs cursor-pointer whitespace-nowrap"
              >
                Show First
              </Label>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(!isEditing)}
              className="h-8 w-8"
            >
              <Settings2 className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-2">
              {item.is_active ? (
                <Eye className="w-4 h-4 text-primary" />
              ) : (
                <EyeOff className="w-4 h-4 text-muted-foreground" />
              )}
              <Switch
                checked={item.is_active}
                onCheckedChange={(isActive) => onUpdate({ is_active: isActive })}
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive hover:text-destructive h-8 w-8"
              onClick={onDelete}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
      
      {/* Edit Panel */}
      {isEditing && !isReadOnly && (
        <div className="border-t p-4 bg-muted/30">
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor={`duration-${item.id}`} className="mb-2 block text-sm">
                Duration (seconds)
              </Label>
              <Input
                id={`duration-${item.id}`}
                type="number"
                min="3"
                max="60"
                value={editDuration}
                onChange={(e) => setEditDuration(e.target.value)}
              />
            </div>
          </div>
          <div className="mb-4">
            <Label htmlFor={`overlay-title-${item.id}`} className="mb-2 block text-sm">
              Overlay Title
            </Label>
            <Input
              id={`overlay-title-${item.id}`}
              value={editOverlayTitle}
              onChange={(e) => setEditOverlayTitle(e.target.value)}
              placeholder="Bold title displayed above the text"
            />
          </div>
          <div className="mb-4">
            <Label htmlFor={`overlay-${item.id}`} className="mb-2 block text-sm">
              Overlay Text
            </Label>
            <Textarea
              id={`overlay-${item.id}`}
              value={editOverlay}
              onChange={(e) => setEditOverlay(e.target.value)}
              placeholder="Text to display over this slide"
              rows={2}
            />
          </div>
          <div className="mb-4">
            <Label htmlFor={`link-${item.id}`} className="mb-2 block text-sm">
              Link URL
            </Label>
            <Input
              id={`link-${item.id}`}
              type="url"
              value={editLinkUrl}
              onChange={(e) => setEditLinkUrl(e.target.value)}
              placeholder="https://example.com"
            />
            <p className="text-xs text-muted-foreground mt-1">Opens in a new tab when the slide is clicked</p>
          </div>
          {item.type === 'video' && (
            <div className="mb-4 flex items-center gap-2">
              <Checkbox
                id={`volume-${item.id}`}
                checked={item.show_volume_controls}
                onCheckedChange={(checked) => onUpdate({ show_volume_controls: !!checked })}
              />
              <Label htmlFor={`volume-${item.id}`} className="text-sm cursor-pointer">
                Show Volume Controls (unmutes video)
              </Label>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
