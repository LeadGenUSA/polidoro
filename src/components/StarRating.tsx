import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  disabled?: boolean;
}

const StarRating = ({ rating, onRatingChange, disabled = false }: StarRatingProps) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          onClick={() => onRatingChange(star)}
          className={cn(
            "p-1 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded",
            disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:scale-110"
          )}
          aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
        >
          <Star
            className={cn(
              "w-6 h-6 transition-colors",
              star <= rating
                ? "fill-secondary text-secondary"
                : "text-muted-foreground/30 hover:text-secondary/50"
            )}
          />
        </button>
      ))}
      <span className="ml-2 text-sm text-muted-foreground">
        {rating > 0 ? `${rating} star${rating > 1 ? 's' : ''}` : 'Select rating'}
      </span>
    </div>
  );
};

export default StarRating;
