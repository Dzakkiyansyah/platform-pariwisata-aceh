// src/components/admin/AdminNavLinks.tsx
'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, List, Users, FileText, Newspaper } from "lucide-react";

const navLinks = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/verifikasi", label: "Verifikasi Pendaftar", icon: FileText },
    { href: "/admin/destinasi", label: "Manajemen Destinasi", icon: Newspaper },
    { href: "/admin/kategori", label: "Manajemen Kategori", icon: List },
    { href: "/admin/pengguna", label: "Manajemen Pengguna", icon: Users },
    { href: "/admin/berita", label: "Manajemen Berita", icon: Newspaper },
];

export default function AdminNavLinks() {
    const pathname = usePathname();

    return (
        <nav className="p-4 flex-1">
            <ul className="space-y-2">
                {navLinks.map(link => (
                    <li key={link.href}>
                        <Link 
                            href={link.href}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all text-sm font-medium hover:bg-gray-100 ${
                                pathname.startsWith(link.href) ? 'bg-blue-100 text-blue-700' : 'text-gray-500'
                            }`}
                        >
                            <link.icon className="h-4 w-4" />
                            {link.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    )
}