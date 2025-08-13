"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

type AppHeaderProps = {
  title: string;
  showBackButton?: boolean;
  children?: React.ReactNode;
};

export function AppHeader({ title, showBackButton = false, children }: AppHeaderProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            {showBackButton && (
              <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Volver</span>
              </Button>
            )}
            <h1 className="text-2xl font-headline font-bold text-primary">{title}</h1>
          </div>
          <div className="flex items-center gap-4">
            {children}
            <Button variant="ghost" size="icon" asChild>
              <Link href="/">
                <Home className="h-5 w-5" />
                <span className="sr-only">Inicio</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
