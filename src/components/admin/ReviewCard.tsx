import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Star, 
  MapPin, 
  Calendar, 
  Check, 
  X, 
  Trash2, 
  ChevronDown, 
  ChevronUp,
  ExternalLink 
} from 'lucide-react';
import { Review } from '@/hooks/useReviews';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface ReviewCardProps {
  review: Review;
  onApprove: (id: string) => void;
  onReject: (id: string, reason?: string) => void;
  onDelete: (id: string) => void;
}

const sourceLabels = {
  google: 'Google',
  manual: 'Manual',
  imported: 'Imported',
  website: 'Website Review',
};

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  approved: 'bg-green-100 text-green-800 border-green-200',
  rejected: 'bg-red-100 text-red-800 border-red-200',
};

export function ReviewCard({ review, onApprove, onReject, onDelete }: ReviewCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  const handleReject = () => {
    onReject(review.id, rejectReason);
    setShowRejectDialog(false);
    setRejectReason('');
  };

  const formattedDate = review.review_date 
    ? new Date(review.review_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'No date';

  return (
    <Card className="shadow-card hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            {review.author_photo_url ? (
              <img 
                src={review.author_photo_url} 
                alt={review.author_name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full hero-gradient flex items-center justify-center">
                <span className="text-primary-foreground font-bold">
                  {review.author_name.charAt(0)}
                </span>
              </div>
            )}
            <div>
              <h3 className="font-heading font-semibold text-foreground">
                {review.author_name}
              </h3>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                {review.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {review.location}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formattedDate}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {sourceLabels[review.source]}
            </Badge>
            <Badge className={`text-xs ${statusColors[review.status]}`}>
              {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Rating */}
        <div className="flex gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`w-4 h-4 ${
                i < review.rating 
                  ? 'fill-secondary text-secondary' 
                  : 'text-muted-foreground/30'
              }`} 
            />
          ))}
        </div>

        {/* Title */}
        {review.title && (
          <h4 className="font-semibold text-foreground mb-2">
            "{review.title}"
          </h4>
        )}

        {/* Review Text */}
        <p className={`text-muted-foreground text-sm leading-relaxed ${
          !isExpanded && review.text.length > 200 ? 'line-clamp-3' : ''
        }`}>
          {review.text}
        </p>

        {review.text.length > 200 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-secondary text-sm mt-2 hover:underline"
          >
            {isExpanded ? (
              <>
                Show less <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                Read more <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>
        )}

        {/* Rejection reason if rejected */}
        {review.status === 'rejected' && review.rejected_reason && (
          <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
            <p className="text-sm text-red-800">
              <strong>Rejection reason:</strong> {review.rejected_reason}
            </p>
          </div>
        )}

        {/* Category */}
        {review.category && (
          <div className="mt-3">
            <Badge variant="secondary" className="text-xs">
              {review.category}
            </Badge>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t">
          {review.status === 'pending' && (
            <>
              <Button 
                size="sm" 
                variant="default"
                className="bg-green-600 hover:bg-green-700"
                onClick={() => onApprove(review.id)}
              >
                <Check className="w-4 h-4 mr-1" />
                Approve
              </Button>
              <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
                <AlertDialogTrigger asChild>
                  <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                    <X className="w-4 h-4 mr-1" />
                    Reject
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Reject Review</AlertDialogTitle>
                    <AlertDialogDescription>
                      This review will be rejected and won't appear on the site. Optionally provide a reason.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <Textarea
                    placeholder="Reason for rejection (optional)"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="min-h-[80px]"
                  />
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleReject}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Reject Review
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}

          {review.status === 'rejected' && (
            <Button 
              size="sm" 
              variant="default"
              className="bg-green-600 hover:bg-green-700"
              onClick={() => onApprove(review.id)}
            >
              <Check className="w-4 h-4 mr-1" />
              Approve
            </Button>
          )}

          {review.status === 'approved' && (
            <Button 
              size="sm" 
              variant="outline"
              className="text-yellow-600 border-yellow-200 hover:bg-yellow-50"
              onClick={() => onReject(review.id)}
            >
              <X className="w-4 h-4 mr-1" />
              Unpublish
            </Button>
          )}

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" variant="ghost" className="text-red-600 hover:bg-red-50 ml-auto">
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Review</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete this review. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={() => onDelete(review.id)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
