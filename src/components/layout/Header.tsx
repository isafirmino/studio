"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, Scale, User as UserIcon } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ThemeSwitcher } from "./ThemeSwitcher";

export default function Header() {
  const { userProfile, signOut } = useAuth();
  const userAvatar = PlaceHolderImages.find(p => p.id === 'user-avatar');

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
          <Scale className="h-6 w-6 text-primary drop-shadow-[0_0_5px_hsl(var(--primary))]" />
          <span className="hidden font-bold sm:inline-block font-headline">
            JuridicoDocs
          </span>
        </Link>
        <div className="flex flex-1 items-center justify-end gap-2">
          <ThemeSwitcher />
          {userProfile && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src={userProfile.photoURL ?? userAvatar?.imageUrl}
                      alt={userProfile.displayName ?? "User"}
                      data-ai-hint={userAvatar?.imageHint}
                    />
                    <AvatarFallback>
                      {getInitials(userProfile.displayName)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {userProfile.displayName}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {userProfile.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href="/profile" passHref>
                  <DropdownMenuItem>
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Perfil</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
