import Link from 'next/link';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

type AppHeaderProps = {
  title: string;
  children?: React.ReactNode;
};

export function AppHeader({ title, children }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <h1 className="text-2xl font-headline font-bold text-primary">{title}</h1>
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
