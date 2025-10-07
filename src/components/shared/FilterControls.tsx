'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const categories = [
    "Semua Kategori", "Wisata Religi", "Wisata Edukasi", "Wisata Alam", "Wisata Sejarah", "Wisata Budaya"
];

export default function FilterControls() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handleSearch = (term: string) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set('q', term);
        } else {
            params.delete('q');
        }
        replace(`${pathname}?${params.toString()}`);
    }

    const handleCategoryChange = (category: string) => {
        const params = new URLSearchParams(searchParams);
        if (category && category !== 'Semua Kategori') {
            params.set('category', category);
        } else {
            params.delete('category');
        }
        replace(`${pathname}?${params.toString()}`);
    }

    return (
        <div className="flex flex-col md:flex-row gap-4 mb-8 p-4 bg-white rounded-lg shadow-sm sticky top-[73px] z-40">
            <Input 
                placeholder="Cari destinasi..."
                className="flex-grow"
                defaultValue={searchParams.get('q')?.toString()}
                onChange={(e) => handleSearch(e.target.value)}
            />
            <Select
                defaultValue={searchParams.get('category')?.toString() || 'Semua Kategori'}
                onValueChange={handleCategoryChange}
            >
                <SelectTrigger className="w-full md:w-[280px]">
                    <SelectValue placeholder="Pilih Kategori" />
                </SelectTrigger>
                <SelectContent>
                    {categories.map(category => (
                        <SelectItem key={category} value={category}>
                            {category}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}