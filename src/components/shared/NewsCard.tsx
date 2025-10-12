// src/components/shared/NewsCard.tsx

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, UserCircle } from "lucide-react";

interface NewsCardProps {
  slug: string;
  imageUrl: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
}

const NewsCard = ({
  slug,
  imageUrl,
  title,
  excerpt,
  date,
  author,
}: NewsCardProps) => {
  return (
    <Link href={`/berita/${slug}`} className="group">
      <Card className="w-full h-full flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        {/* Gambar Berita */}
        <CardHeader className="p-0">
          <div className="relative aspect-[16/9] w-full overflow-hidden">
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
            />
            {/* Overlay gradient agar gambar terlihat lebih dramatis */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
          </div>
        </CardHeader>

        {/* Isi Card */}
        <CardContent className="p-5 flex flex-col flex-grow">
          <div className="flex-grow">
            <CardTitle className="text-lg font-semibold leading-tight mb-2 group-hover:text-blue-700 transition-colors">
              {title}
            </CardTitle>
            <p className="text-sm text-gray-600 line-clamp-3 mb-4">
              {excerpt}
            </p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100 mt-auto">
            <div className="flex items-center">
              <UserCircle className="w-4 h-4 mr-1.5 text-gray-400" />
              <span>{author}</span>
            </div>
            <div className="flex items-center">
              <CalendarDays className="w-4 h-4 mr-1.5 text-gray-400" />
              <span>{date}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default NewsCard;
