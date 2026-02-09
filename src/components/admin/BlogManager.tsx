import { useState } from 'react';
import { useBlogPosts, BlogPost } from '@/hooks/useBlogPosts';
import { BlogSettings } from './BlogSettings';
import { BlogPostEditor } from './BlogPostEditor';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, CheckCircle, XCircle, Star, Loader2, FileText } from 'lucide-react';

export const BlogManager = () => {
  const [activeTab, setActiveTab] = useState<'draft' | 'published' | 'rejected' | 'all'>('draft');
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const { posts, isLoading, fetchPosts, updatePost, deletePost } = useBlogPosts(activeTab);

  const draftCount = posts.filter(p => p.status === 'draft').length;
  const publishedCount = posts.filter(p => p.status === 'published').length;
  const rejectedCount = posts.filter(p => p.status === 'rejected').length;

  if (editingPost) {
    return (
      <BlogPostEditor
        post={editingPost}
        onUpdate={updatePost}
        onDelete={deletePost}
        onBack={() => { setEditingPost(null); fetchPosts(); }}
      />
    );
  }

  return (
    <div>
      <BlogSettings onPostGenerated={fetchPosts} />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-card rounded-xl p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{activeTab === 'all' ? posts.filter(p => p.status === 'draft').length : activeTab === 'draft' ? posts.length : draftCount}</p>
              <p className="text-sm text-muted-foreground">Drafts</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{activeTab === 'all' ? posts.filter(p => p.status === 'published').length : activeTab === 'published' ? posts.length : publishedCount}</p>
              <p className="text-sm text-muted-foreground">Published</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{activeTab === 'all' ? posts.filter(p => p.status === 'rejected').length : activeTab === 'rejected' ? posts.length : rejectedCount}</p>
              <p className="text-sm text-muted-foreground">Rejected</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
        <TabsList className="mb-6">
          <TabsTrigger value="draft" className="gap-2">
            <Clock className="w-4 h-4" /> Drafts
          </TabsTrigger>
          <TabsTrigger value="published" className="gap-2">
            <CheckCircle className="w-4 h-4" /> Published
          </TabsTrigger>
          <TabsTrigger value="rejected" className="gap-2">
            <XCircle className="w-4 h-4" /> Rejected
          </TabsTrigger>
          <TabsTrigger value="all" className="gap-2">
            <Star className="w-4 h-4" /> All
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-xl">
          <FileText className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
          <h3 className="font-heading font-semibold text-lg text-foreground mb-2">No posts found</h3>
          <p className="text-muted-foreground">
            {activeTab === 'draft' ? 'No drafts awaiting review. Click "Generate Now" to create one.' : `No ${activeTab} posts.`}
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {posts.map((post) => (
            <div
              key={post.id}
              onClick={() => setEditingPost(post)}
              className="bg-card rounded-xl shadow-card overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            >
              {post.featured_image_url && (
                <img src={post.featured_image_url} alt={post.title} className="w-full h-40 object-cover" />
              )}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    post.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                    post.status === 'published' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {post.status}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(post.created_at).toLocaleDateString()}
                  </span>
                </div>
                <h4 className="font-heading font-semibold text-foreground line-clamp-2">{post.title}</h4>
                {post.meta_description && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{post.meta_description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
