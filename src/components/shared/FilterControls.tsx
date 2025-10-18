"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebouncedCallback } from "use-debounce";

// Tipe untuk props, menerima daftar kategori dari luar
type FilterControlsProps = {
  categories: string[];
};

export default function FilterControls({ categories }: FilterControlsProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // Fungsi untuk menangani pencarian dengan debounce
  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("q", term);
    } else {
      params.delete("q");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300); // 300ms debounce

  // Fungsi untuk menangani perubahan kategori
  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams);
    if (category && category !== "Semua Kategori") {
      params.set("category", category);
    } else {
      params.delete("category");
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8 p-4 bg-white rounded-lg shadow-sm sticky top-[73px] z-40">
      {/* Input Pencarian */}
      <Input
        placeholder="Cari nama destinasi..."
        className="flex-grow"
        defaultValue={searchParams.get("q")?.toString()}
        onChange={(e) => handleSearch(e.target.value)}
      />
      {/* Dropdown Kategori */}
      <Select
        defaultValue={searchParams.get("category")?.toString() || "Semua Kategori"}
        onValueChange={handleCategoryChange}
      >
        <SelectTrigger className="w-full md:w-[280px]">
          <SelectValue placeholder="Pilih Kategori" />
        </SelectTrigger>
        <SelectContent>
          {/* Opsi default */}
          <SelectItem value="Semua Kategori">Semua Kategori</SelectItem>
          {/* Opsi dinamis dari database */}
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
