import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Utensils, BarChart3, Users, DoorClosed } from 'lucide-react';

export default function AdminDashboard() {
  const features = [
    {
      title: 'Gestionar Menú',
      description: 'Añade, edita o elimina platos y bebidas.',
      href: '/admin/menu',
      icon: <Utensils className="h-8 w-8 text-primary" />,
      cta: 'Ir a Menú',
    },
    {
      title: 'Reportes de Ventas',
      description: 'Visualiza las analíticas y el rendimiento.',
      href: '/admin/reports',
      icon: <BarChart3 className="h-8 w-8 text-primary" />,
      cta: 'Ver Reportes',
      disabled: false,
    },
    {
        title: 'Cierre de Caja',
        description: 'Consulta el reporte del turno y cierra la caja.',
        href: '/admin/close-shift',
        icon: <DoorClosed className="h-8 w-8 text-primary" />,
        cta: 'Ir a Cierre de Caja',
        disabled: false,
    },
    {
      title: 'Gestionar Empleados',
      description: 'Administra los roles y accesos del personal.',
      href: '#',
      icon: <Users className="h-8 w-8 text-primary" />,
      cta: 'Ir a Empleados (Próximamente)',
      disabled: true,
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-headline font-semibold">Bienvenido, Admin</h2>
        <p className="text-muted-foreground mt-1">Aquí podrás gestionar la configuración de tu restaurante.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <Card key={feature.title} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start gap-4">
                {feature.icon}
                <div>
                  <CardTitle className="font-headline text-2xl">{feature.title}</CardTitle>
                  <CardDescription className="mt-1">{feature.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow flex items-end">
              <Button asChild className="w-full" disabled={feature.disabled}>
                <Link href={feature.href}>{feature.cta}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
