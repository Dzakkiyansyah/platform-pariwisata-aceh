// src/components/landing/CategoriesSection.tsx
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Landmark, Mountain, MoonStar } from "lucide-react";
import Link from "next/link";

// Data untuk setiap kartu kategori
const categories = [
  {
    icon: Landmark,
    title: "Wisata Sejarah & Budaya",
    description: "Jelajahi jejak sejarah dan kekayaan budaya Aceh.",
    count: 15,
    href: "/destinasi?kategori=sejarah-budaya",
  },
  {
    icon: Mountain,
    title: "Wisata Alam",
    description: "Nikmati keindahan alam yang memukau.",
    count: 15,
    href: "/destinasi?kategori=alam",
  },
  {
    icon: MoonStar,
    title: "Wisata Religi",
    description: "Nikmati ketenangan spiritual yang mendalam.",
    count: 15,
    href: "/destinasi?kategori=religi",
  },
];

const CategoriesSection = () => {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Kolom Kiri: Teks Deskripsi */}
        <div className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Temukan Pengalaman
            <br />
            Wisata Anda di Banda Aceh
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            Jelajahi beragam kategori wisata yang menarik di Banda Aceh. Dari
            sejarah dan budaya yang kaya hingga keindahan alam yang memukau, kami
            menyediakan semua informasi yang Anda butuhkan.
          </p>
        </div>

        {/* Kolom Kanan: Kartu Kategori */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {categories.map((category, index) => (
            <Link 
              key={index} 
              href={category.href} 
              className="group block h-full"
            >
              <Card className="h-full flex flex-col hover:border-blue-500 hover:shadow-lg transition-all duration-300 border border-gray-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                    <category.icon className="h-6 w-6 text-blue-600" />
                  </div>
                </CardHeader>
                
                <CardContent className="flex-1 pb-3">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                    {category.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                    {category.description}
                  </p>
                </CardContent>
                
                <CardFooter className="pt-3 border-t border-gray-100">
                  <div className="flex justify-between items-center w-full text-sm">
                    <span className="text-gray-500">
                      {category.count} Destinasi
                    </span>
                    <span className="font-semibold text-blue-600 group-hover:underline">
                      Jelajahi
                    </span>
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;