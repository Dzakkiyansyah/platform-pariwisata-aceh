import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Landmark, Mountain, MoonStar, UtensilsCrossed } from "lucide-react";
import Link from "next/link";
import React from "react";

// Objek slug dari database ke komponen ikon
const iconMap: { [key: string]: React.ElementType } = {
  'wisata-sejarah-budaya': Landmark,
  'wisata-alam': Mountain,
  'wisata-religi': MoonStar,
  'wisata-kuliner': UtensilsCrossed,
};

export default async function CategoriesSection() {
  const supabase = await createClient();

  // Ambil data kategori dari Supabase
  const { data: categories, error } = await supabase
    .from('categories')
    .select('name, slug')
    .limit(3);

  if (error) {
    console.error("Error fetching categories for landing page:", error);
    return null;
  }

  return (
    <section className="container mx-auto py-16">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Teks Deskripsi  */}
        <div className="space-y-4">
          <h2 className="text-4xl font-bold tracking-tight">
            Temukan Pengalaman
            <br />
            Wisata Anda di Banda Aceh
          </h2>
          <p className="text-muted-foreground text-lg">
            Jelajahi beragam kategori wisata yang menarik di Banda Aceh. Temukan pengalaman
            yang sesuai dengan minat Anda dan rencanakan perjalanan yang tak
            terlupakan.
          </p>
        </div>

        {/*  Kartu Kategori */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((category) => {
              const IconComponent = iconMap[category.slug] || Landmark;
              
              return (
                <Link key={category.slug} href={`/destinasi?category=${category.slug}`} className="group">
                    <Card className="h-full hover:border-blue-500 hover:bg-slate-50 transition-all duration-300 flex flex-col">
                        <CardHeader>
                            <IconComponent className="h-10 w-10 text-blue-600" />
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <h3 className="font-semibold text-lg">{category.name}</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                Jelajahi destinasi dalam kategori ini.
                            </p>
                        </CardContent>
                        <CardFooter>
                            <span className="font-semibold text-blue-600 group-hover:underline text-sm">Jelajahi</span>
                        </CardFooter>
                    </Card>
                </Link>
            )})}
        </div>
      </div>
    </section>
  );
};