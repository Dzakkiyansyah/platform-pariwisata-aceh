// src/components/shared/ReviewCard.tsx

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

interface ReviewCardProps {
  text: string;
  author: string;
  avatarUrl: string;
  rating: number;
}

// Komponen kecil untuk menampilkan bintang
const StarRating = ({ rating }: { rating: number }) => {
  return (
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
};

const ReviewCard = ({ text, author, avatarUrl, rating }: ReviewCardProps) => {
  return (
    <Card className="h-full flex flex-col justify-between">
      <CardContent className="p-6">
        <StarRating rating={rating} />
        <blockquote className="mt-4 text-lg font-semibold leading-snug">
        <q>{text}</q> 
        </blockquote>
      </CardContent>
      <div className="flex items-center gap-4 p-6 pt-0 mt-auto">
        <Avatar>
          <AvatarImage src={avatarUrl} alt={author} />
          <AvatarFallback>{author.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">{author}</p>
        </div>
      </div>
    </Card>
  );
};

export default ReviewCard;