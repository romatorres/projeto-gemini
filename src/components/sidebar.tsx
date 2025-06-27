"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarLinkProps {
  href: string;
  children: React.ReactNode;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ href, children }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} passHref>
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start",
          isActive && "bg-accent text-accent-foreground"
        )}
      >
        {children}
      </Button>
    </Link>
  );
};

export function Sidebar() {
  return (
    <div className="flex h-full">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r bg-background p-4">
        <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>
        <nav className="flex flex-col space-y-2">
          <SidebarLink href="/dashboard">Visão Geral</SidebarLink>
          <SidebarLink href="/dashboard/settings">Configurações</SidebarLink>
          <SidebarLink href="/dashboard/profile">Perfil</SidebarLink>
          {/* Adicione mais links aqui */}
        </nav>
      </aside>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild className="md:hidden fixed top-4 left-4 z-50">
          <Button variant="outline" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-4 pt-12">
          <SheetHeader>
            <SheetTitle>Dashboard</SheetTitle>
            <nav className="flex flex-col space-y-2">
              <SheetClose asChild>
                <SidebarLink href="/dashboard">Visão Geral</SidebarLink>
              </SheetClose>
              <SheetClose asChild>
                <SidebarLink href="/dashboard/settings">
                  Configurações
                </SidebarLink>
              </SheetClose>
              <SheetClose asChild>
                <SidebarLink href="/dashboard/profile">Perfil</SidebarLink>
              </SheetClose>
              {/* Adicione mais links aqui */}
            </nav>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
}
