import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Panel de Administración</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Visión General</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Aquí se mostrarán las estadísticas principales del restaurante.</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader>
            <CardTitle>Gestión de Menú</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Próximamente: editar, añadir o eliminar platos del menú.</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader>
            <CardTitle>Reportes Avanzados</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Próximamente: reportes de ventas, rendimiento de platos, etc.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
