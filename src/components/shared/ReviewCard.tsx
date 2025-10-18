import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

// Props sekarang menerima profil atau nama anonim
interface ReviewCardProps {
  text: string;
  rating: number;
  author: string
  avatarUrl?: string | null;
}

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-1">
    {Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
        }`}
      />
    ))}
  </div>
);

const ReviewCard = ({ text, author, avatarUrl, rating }: ReviewCardProps) => {
  return (
    <Card className="h-full flex flex-col justify-between">
      <CardContent className="p-6">
        <StarRating rating={rating} />
        <blockquote className="mt-4 text-lg font-semibold leading-snug">
          &quot;{text}&quot;
        </blockquote>
      </CardContent>
      <div className="flex items-center gap-4 p-6 pt-0 mt-auto">
        <Avatar>
          <AvatarImage src={avatarUrl || ''} alt={author} />
          <AvatarFallback>{author ? author.charAt(0).toUpperCase() : '?'}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">{author || 'Wisatawan Anonim'}</p>
        </div>
      </div>
    </Card>
  );
};

export default ReviewCard;