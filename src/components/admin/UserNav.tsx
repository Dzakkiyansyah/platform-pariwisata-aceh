// src/components/admin/UserNav.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/components/auth/actions";

// Definisikan tipe untuk profil admin
type AdminProfile = {
    full_name: string | null;
    email: string | undefined;
    avatar_url: string | null;
}

// Komponen tombol logout terpisah karena butuh form
function LogoutButton() {
    return (
        <form action={logout}>
            <button type="submit" className="w-full text-left">
                Logout
            </button>
        </form>
    )
}

export async function UserNav() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('id', user?.id)
        .single();

    const admin: AdminProfile = {
        full_name: profile?.full_name || 'Admin',
        email: user?.email,
        avatar_url: profile?.avatar_url,
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-full justify-start gap-3 px-3">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={admin.avatar_url || ''} alt="@shadcn" />
                        <AvatarFallback>{admin.full_name?.charAt(0) || 'A'}</AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                        <p className="text-sm font-medium leading-none">{admin.full_name}</p>
                        <p className="text-xs leading-none text-muted-foreground truncate">{admin.email}</p>
                    </div>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{admin.full_name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {admin.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>Profil</DropdownMenuItem>
                    <DropdownMenuItem>Pengaturan</DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <LogoutButton />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}