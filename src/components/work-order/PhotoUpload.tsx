import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { X, Loader2, ImagePlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { uploadFileWithConversion, isHeicFile } from '@/lib/upload-helpers';

interface PhotoUploadProps {
  photos: string[];
  onPhotosChange: (photos: string[]) => void;
  maxPhotos?: number;
}

const PhotoUpload = ({ photos, onPhotosChange, maxPhotos = 5 }: PhotoUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = maxPhotos - photos.length;
    if (remainingSlots <= 0) {
      toast({
        title: 'Maximum photos reached',
        description: `You can only upload up to ${maxPhotos} photos.`,
        variant: 'destructive',
      });
      return;
    }

    const filesToUpload = Array.from(files).slice(0, remainingSlots);
    setIsUploading(true);

    try {
      const uploadedUrls: string[] = [];

      for (const file of filesToUpload) {
        // Validate file type
        if (!file.type.startsWith('image/') && file.type !== 'video/mp4' && !isHeicFile(file)) {
          toast({
            title: 'Invalid file type',
            description: `${file.name} is not an image file.`,
            variant: 'destructive',
          });
          continue;
        }

        // Validate file size (max 25MB for images, 20MB for videos)
        const maxSize = file.type === 'video/mp4' ? 20 * 1024 * 1024 : 25 * 1024 * 1024;
        const maxLabel = file.type === 'video/mp4' ? '20MB' : '25MB';
        if (file.size > maxSize) {
          toast({
            title: 'File too large',
            description: `${file.name} exceeds ${maxLabel} limit.`,
            variant: 'destructive',
          });
          continue;
        }

        const fileIndex = filesToUpload.indexOf(file) + 1;
        const heic = isHeicFile(file);
        setUploadStatus(
          heic
            ? `Converting HEIC to JPEG (${fileIndex}/${filesToUpload.length})...`
            : `Uploading ${fileIndex}/${filesToUpload.length}...`
        );

        try {
          const publicUrl = await uploadFileWithConversion(file, 'work-order-photos');
          uploadedUrls.push(publicUrl);
        } catch (uploadErr: any) {
          console.error('Upload error:', uploadErr);
          toast({
            title: 'Upload failed',
            description: `Failed to upload ${file.name}.`,
            variant: 'destructive',
          });
          continue;
        }
      }

      if (uploadedUrls.length > 0) {
        onPhotosChange([...photos, ...uploadedUrls]);
        toast({
          title: 'Photos uploaded',
          description: `${uploadedUrls.length} photo(s) uploaded successfully.`,
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: 'An error occurred while uploading photos.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      setUploadStatus('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    onPhotosChange(newPhotos);
  };

  return (
    <div className="space-y-3">
      <Label>Photos</Label>
      <p className="text-destructive font-bold text-sm">Work orders will not upload without a picture or video attached.</p>
      
      {/* Photo grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {photos.map((url, index) => (
            <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-border bg-muted">
              <img
                src={url}
                alt={`Work order photo ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removePhoto(index)}
                className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      {photos.length < maxPhotos && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/mp4,.heic,.heif"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            id="photo-upload"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full sm:w-auto"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {uploadStatus || 'Uploading...'}
              </>
            ) : (
              <>
                <ImagePlus className="w-4 h-4 mr-2" />
                Add Photos ({photos.length}/{maxPhotos})
              </>
            )}
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            Upload up to {maxPhotos} photos or videos. Max 25MB per image, 20MB per video. Supported formats: JPG, PNG, WEBP, HEIC, MP4.
          </p>
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;
