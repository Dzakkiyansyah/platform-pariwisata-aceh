// src/components/admin/LogoutButton.tsx
'use client'

import { logout } from "@/components/auth/actions";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
    return (
        <form action={logout}>
            <Button variant="ghost" className="w-full justify-start gap-3 px-3 text-gray-500">
                <LogOut className="h-4 w-4" />
                Logout
            </Button>
        </form>
    )
}