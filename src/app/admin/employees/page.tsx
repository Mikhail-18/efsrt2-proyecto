import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getEmployees } from '@/lib/actions';
import { PlusCircle, ArrowLeft } from 'lucide-react';
import { EmployeeDialog } from '@/components/admin/EmployeeDialog';
import { DeleteEmployeeButton } from '@/components/admin/DeleteEmployeeButton';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const roleMap = {
  waiter: 'Camarero',
  cashier: 'Cajero',
};

export default async function EmployeeManagementPage() {
  const currentEmployees = await getEmployees();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
          <div>
            <Button variant="outline" asChild>
                <Link href="/admin">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver al Panel
                </Link>
            </Button>
            <h1 className="text-3xl font-headline font-semibold mt-4">Gestionar Empleados</h1>
            <p className="text-muted-foreground">Añade, edita o elimina empleados y gestiona sus roles.</p>
          </div>
        
        <EmployeeDialog>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Añadir Empleado
          </Button>
        </EmployeeDialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>PIN</TableHead>
              <TableHead className="w-[180px] text-center">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentEmployees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell className="font-medium">{employee.name}</TableCell>
                <TableCell>{roleMap[employee.role]}</TableCell>
                <TableCell className="font-mono">{'*'.repeat(employee.pin.length)}</TableCell>
                <TableCell className="flex justify-center items-center gap-2">
                  <EmployeeDialog employee={employee}>
                    <Button variant="outline" size="sm">Editar</Button>
                  </EmployeeDialog>
                  <DeleteEmployeeButton employeeId={employee.id} employeeName={employee.name} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
         {currentEmployees.length === 0 && (
            <div className="text-center p-8 text-muted-foreground">
                No hay empleados registrados. ¡Añade uno para empezar!
            </div>
        )}
      </div>
    </div>
  );
}
