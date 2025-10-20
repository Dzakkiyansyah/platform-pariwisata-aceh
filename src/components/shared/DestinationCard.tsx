import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Clock, Ticket } from "lucide-react";

interface DestinationCardProps {
  slug: string;
  imageUrl: string;
  name: string;
  address: string;
  category: string;
  openTime: string;
  ticketPrice: string;
}

const DestinationCard = ({
  slug,
  imageUrl,
  name,
  address,
  category,
  openTime,
  ticketPrice,
}: DestinationCardProps) => {
  return (
    <Link href={`/destinasi/${slug}`} className="group">
      <Card className="w-full h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        {/* Gambar */}
        <CardHeader className="p-0">
          <div className="relative h-52 w-full">
            <Image
              src={imageUrl}
              alt={name}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </CardHeader>

        {/* Info */}
        <CardContent className="p-4 flex flex-col flex-grow">
          <p className="text-sm font-semibold text-blue-600">{category}</p>
          <CardTitle className="text-lg leading-tight mt-1 group-hover:text-blue-700 transition-colors">
            {name}
          </CardTitle>
          <div className="flex items-start text-sm text-muted-foreground mt-2 flex-grow">
            <MapPin className="w-4 h-4 mr-2 mt-1 flex-shrink-0" />
            <span className="line-clamp-2">{address}</span>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground pt-3 mt-3 border-t">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1.5" />
              <span>{openTime}</span>
            </div>
            <div className="flex items-center font-medium text-black">
              <Ticket className="w-4 h-4 mr-1.5" />
              <span>{ticketPrice}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default DestinationCard;
