import { useState } from 'react';
import { useYouTubeVideosAdmin, YouTubeVideo } from '@/hooks/useYouTubeVideos';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Loader2, RefreshCw, Eye, EyeOff, Clock, Play } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';

export const YouTubeVideosManager = () => {
  const { videos, isLoading, isSyncing, syncVideos, toggleActive, updateCategory } = useYouTubeVideosAdmin();
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [categoryValue, setCategoryValue] = useState('');

  const handleSync = async () => {
    try {
      const result = await syncVideos();
      toast({
        title: 'Videos Synced',
        description: result?.message || 'YouTube videos have been updated.',
      });
    } catch (err: any) {
      toast({
        title: 'Sync Failed',
        description: err.message || 'Failed to sync videos from YouTube.',
        variant: 'destructive',
      });
    }
  };

  const handleToggle = async (video: YouTubeVideo) => {
    const { error } = await toggleActive(video.id, !video.is_active);
    if (error) {
      toast({ title: 'Error', description: 'Failed to update video visibility.', variant: 'destructive' });
    }
  };

  const handleCategorySave = async (id: string) => {
    await updateCategory(id, categoryValue.trim() || null);
    setEditingCategory(null);
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
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {videos.length} videos • {videos.filter(v => v.is_active).length} active
        </p>
        <Button onClick={handleSync} disabled={isSyncing} className="gap-2">
          {isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          {isSyncing ? 'Syncing...' : 'Sync from YouTube'}
        </Button>
      </div>

      {videos.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-xl">
          <Play className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
          <h3 className="font-heading font-semibold text-lg text-foreground mb-2">No videos yet</h3>
          <p className="text-muted-foreground mb-4">Click "Sync from YouTube" to import videos from your channel.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {videos.map((video) => (
            <div key={video.id} className={`flex gap-4 p-4 bg-card rounded-xl shadow-card ${!video.is_active ? 'opacity-60' : ''}`}>
              <div className="relative w-40 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                <img
                  src={video.thumbnail_url || ''}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                {video.duration && (
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-foreground/80 rounded text-xs text-background">
                    {video.duration}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-heading font-semibold text-foreground truncate">{video.title}</h4>
                <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                  {video.view_count && <span>{video.view_count} views</span>}
                  {video.published_at && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(video.published_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-2">
                  {editingCategory === video.id ? (
                    <div className="flex items-center gap-2">
                      <Input
                        value={categoryValue}
                        onChange={(e) => setCategoryValue(e.target.value)}
                        placeholder="Category"
                        className="h-8 w-32 text-sm"
                        onKeyDown={(e) => e.key === 'Enter' && handleCategorySave(video.id)}
                      />
                      <Button size="sm" variant="ghost" onClick={() => handleCategorySave(video.id)}>Save</Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditingCategory(null)}>Cancel</Button>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setEditingCategory(video.id); setCategoryValue(video.category || ''); }}
                      className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground hover:bg-muted/80"
                    >
                      {video.category || 'Set category'}
                    </button>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {video.is_active ? <Eye className="w-4 h-4 text-muted-foreground" /> : <EyeOff className="w-4 h-4 text-muted-foreground" />}
                <Switch checked={video.is_active} onCheckedChange={() => handleToggle(video)} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
