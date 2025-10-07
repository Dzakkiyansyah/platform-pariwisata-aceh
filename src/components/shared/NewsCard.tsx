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
      {/* Perubahan di sini: tambahkan h-full flex flex-col */}
      <Card className="w-full h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        {/* Gambar Berita (Tidak berubah) */}
        <CardHeader className="p-0">
          <div className="relative h-52 w-full">
            <Image
              src={imageUrl}
              alt={title}
              layout="fill"
              objectFit="cover"
              className="group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </CardHeader>

        {/* Perubahan di sini: tambahkan flex-grow */}
        <CardContent className="p-4 flex flex-col flex-grow">
          <div className="flex-grow">
            <CardTitle className="text-lg leading-tight mb-2 group-hover:text-blue-700 transition-colors">
              {title}
            </CardTitle>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
              {excerpt}
            </p>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t mt-auto">
            <div className="flex items-center">
              <UserCircle className="w-4 h-4 mr-2" />
              <span>{author}</span>
            </div>
            <div className="flex items-center">
              <CalendarDays className="w-4 h-4 mr-2" />
              <span>{date}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default NewsCard;