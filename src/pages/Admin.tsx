import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import SEO from '@/components/SEO';
import { useReviews, useReviewCounts } from '@/hooks/useReviews';
import { useAllSubmissionCounts } from '@/hooks/useSubmissions';
import { ReviewCard } from '@/components/admin/ReviewCard';
import { ImportReviewsButton } from '@/components/admin/ImportReviewsButton';
import { SlideshowManager } from '@/components/admin/SlideshowManager';
import { GalleryManager } from '@/components/admin/GalleryManager';
import { SubmissionsManager } from '@/components/admin/SubmissionsManager';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LogOut, 
  Home, 
  Star, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Loader2,
  LayoutDashboard,
  Images,
  MessageSquare,
  Camera,
  FileText,
  BookOpen,
  Users,
  Video
} from 'lucide-react';
import { BlogManager } from '@/components/admin/BlogManager';
import { SitemapRegenerateButton } from '@/components/admin/SitemapRegenerateButton';
import { UserRolesManager } from '@/components/admin/UserRolesManager';
import { YouTubeVideosManager } from '@/components/admin/YouTubeVideosManager';
import { useBlogPosts } from '@/hooks/useBlogPosts';

const Admin = () => {
  const navigate = useNavigate();
  const { user, isAdmin, isLoading: authLoading, signOut } = useAuth();
  const [adminSection, setAdminSection] = useState<'reviews' | 'slideshow' | 'gallery' | 'submissions' | 'blog' | 'users' | 'videos'>('reviews');
  const { posts: blogDrafts } = useBlogPosts('draft');
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const { reviews, isLoading, fetchReviews, approveReview, rejectReview, deleteReview } = useReviews(activeTab);
  const { counts, fetchCounts } = useReviewCounts();
  const submissionCounts = useAllSubmissionCounts();

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate('/admin/login');
    }
  }, [user, isAdmin, authLoading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  const pendingCount = counts.pending;
  const approvedCount = counts.approved;
  const rejectedCount = counts.rejected;

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Admin Dashboard" description="Admin dashboard." noIndex />
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl hero-gradient flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-heading font-bold text-lg text-foreground">Admin Dashboard</h1>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
                <Home className="w-4 h-4 mr-2" />
                View Site
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 lg:px-8 py-8">
        {/* Section Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Button
            variant={adminSection === 'reviews' ? 'default' : 'outline'}
            onClick={() => setAdminSection('reviews')}
            className="gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            Reviews
          </Button>
          <Button
            variant={adminSection === 'submissions' ? 'default' : 'outline'}
            onClick={() => setAdminSection('submissions')}
            className="gap-2 relative"
          >
            <FileText className="w-4 h-4" />
            Submissions
            {submissionCounts.total > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                {submissionCounts.total}
              </span>
            )}
          </Button>
          <Button
            variant={adminSection === 'slideshow' ? 'default' : 'outline'}
            onClick={() => setAdminSection('slideshow')}
            className="gap-2"
          >
            <Images className="w-4 h-4" />
            Homepage Slideshow
          </Button>
          <Button
            variant={adminSection === 'gallery' ? 'default' : 'outline'}
            onClick={() => setAdminSection('gallery')}
            className="gap-2"
          >
            <Camera className="w-4 h-4" />
            Project Gallery
          </Button>
          <Button
            variant={adminSection === 'blog' ? 'default' : 'outline'}
            onClick={() => setAdminSection('blog')}
            className="gap-2 relative"
          >
            <BookOpen className="w-4 h-4" />
            Blog
            {blogDrafts.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                {blogDrafts.length}
              </span>
            )}
          </Button>
          <Button
            variant={adminSection === 'users' ? 'default' : 'outline'}
            onClick={() => setAdminSection('users')}
            className="gap-2"
          >
            <Users className="w-4 h-4" />
            Users
          </Button>
          <Button
            variant={adminSection === 'videos' ? 'default' : 'outline'}
            onClick={() => setAdminSection('videos')}
            className="gap-2"
          >
            <Video className="w-4 h-4" />
            Videos
          </Button>
        </div>

        {adminSection === 'videos' ? (
          <>
            <div className="mb-8">
              <h2 className="font-heading text-2xl font-bold text-foreground">YouTube Videos</h2>
              <p className="text-muted-foreground">Sync and manage videos from your YouTube channel.</p>
            </div>
            <YouTubeVideosManager />
          </>
        ) : adminSection === 'users' ? (
          <>
            <div className="mb-8">
              <h2 className="font-heading text-2xl font-bold text-foreground">User Management</h2>
              <p className="text-muted-foreground">Grant or revoke admin access for users.</p>
            </div>
            <UserRolesManager />
          </>
        ) : adminSection === 'blog' ? (
          <>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <div>
                <h2 className="font-heading text-2xl font-bold text-foreground">Blog Management</h2>
                <p className="text-muted-foreground">Generate, review, edit, and publish AI-generated blog posts.</p>
              </div>
              <SitemapRegenerateButton />
            </div>
            <BlogManager />
          </>
        ) : adminSection === 'submissions' ? (
          <>
            <div className="mb-8">
              <h2 className="font-heading text-2xl font-bold text-foreground">Form Submissions</h2>
              <p className="text-muted-foreground">View and manage estimate, work order, and survey form submissions.</p>
            </div>
            <SubmissionsManager />
          </>
        ) : adminSection === 'gallery' ? (
          <>
            <div className="mb-8">
              <h2 className="font-heading text-2xl font-bold text-foreground">Project Gallery</h2>
              <p className="text-muted-foreground">Upload and manage photos displayed in the Projects Gallery page.</p>
            </div>
            <GalleryManager />
          </>
        ) : adminSection === 'slideshow' ? (
          <>
            <div className="mb-8">
              <h2 className="font-heading text-2xl font-bold text-foreground">Slideshow Management</h2>
              <p className="text-muted-foreground">Manage the images and videos displayed in the homepage hero section.</p>
            </div>
            <SlideshowManager />
          </>
        ) : (
          <>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <div>
                <h2 className="font-heading text-2xl font-bold text-foreground">Review Management</h2>
                <p className="text-muted-foreground">Approve or reject testimonials before they appear on the site.</p>
              </div>
              <ImportReviewsButton onImportComplete={() => { fetchReviews(); fetchCounts(); }} />
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-card rounded-xl p-4 shadow-card">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{pendingCount}</p>
                    <p className="text-sm text-muted-foreground">Pending</p>
                  </div>
                </div>
              </div>
              <div className="bg-card rounded-xl p-4 shadow-card">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{approvedCount}</p>
                    <p className="text-sm text-muted-foreground">Approved</p>
                  </div>
                </div>
              </div>
              <div className="bg-card rounded-xl p-4 shadow-card">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                    <XCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{rejectedCount}</p>
                    <p className="text-sm text-muted-foreground">Rejected</p>
                  </div>
                </div>
              </div>
              <div className="bg-card rounded-xl p-4 shadow-card">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Star className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{counts.total}</p>
                    <p className="text-sm text-muted-foreground">Total</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
              <TabsList className="mb-6">
                <TabsTrigger value="pending" className="gap-2">
                  <Clock className="w-4 h-4" />
                  Pending
                  {pendingCount > 0 && (
                    <span className="ml-1 px-2 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                      {pendingCount}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="approved" className="gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Approved
                </TabsTrigger>
                <TabsTrigger value="rejected" className="gap-2">
                  <XCircle className="w-4 h-4" />
                  Rejected
                </TabsTrigger>
                <TabsTrigger value="all" className="gap-2">
                  <Star className="w-4 h-4" />
                  All
                </TabsTrigger>
              </TabsList>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-12 bg-card rounded-xl">
                  <Star className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
                  <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
                    No reviews found
                  </h3>
                  <p className="text-muted-foreground">
                    {activeTab === 'pending' 
                      ? 'No reviews awaiting approval. Import reviews from Google to get started.'
                      : `No ${activeTab} reviews at this time.`}
                  </p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {reviews.map((review) => (
                    <ReviewCard
                      key={review.id}
                      review={review}
                      onApprove={approveReview}
                      onReject={rejectReview}
                      onDelete={deleteReview}
                    />
                  ))}
                </div>
              )}
            </Tabs>
          </>
        )}
      </main>
    </div>
  );
};

export default Admin;
