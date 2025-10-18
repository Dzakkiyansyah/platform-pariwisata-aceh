'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Edit, MessageSquare } from "lucide-react";
import LogoutButton from "@/components/admin/LogoutButton";

const navLinks = [
    { href: "/pengelola/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/pengelola/destinasi", label: "Kelola Destinasi", icon: Edit },
    { href: "/pengelola/ulasan", label: "Manajemen Ulasan", icon: MessageSquare },
];

export default function PengelolaSidebar({ namaUsaha }: { namaUsaha: string }) {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-white border-r flex flex-col">
            <div className="p-4 border-b">
                <h2 className="text-xl font-bold text-green-600">Dasbor Pengelola</h2>
                <p className="text-sm text-muted-foreground truncate">{namaUsaha}</p>
            </div>
            
            <nav className="p-4 flex-1">
                <ul className="space-y-2">
                    {navLinks.map(link => (
                        <li key={link.href}>
                            <Link 
                                href={link.href}
                                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all text-sm font-medium hover:bg-gray-100 ${
                                    pathname.startsWith(link.href) ? 'bg-green-100 text-green-700' : 'text-gray-500'
                                }`}
                            >
                                <link.icon className="h-4 w-4" />
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
            
            <div className="mt-auto p-4 border-t">
                <LogoutButton />
            </div>
        </aside>
    )
}