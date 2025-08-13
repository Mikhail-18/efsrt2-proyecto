import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { menu } from '@/lib/data';
import { PlusCircle, ArrowLeft } from 'lucide-react';
import { MenuItemDialog } from '@/components/admin/MenuItemDialog';
import { DeleteMenuItemButton } from '@/components/admin/DeleteMenuItemButton';
import Link from 'next/link';

export default function MenuManagementPage() {
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
            <h1 className="text-3xl font-headline font-semibold mt-4">Gestionar Menú</h1>
            <p className="text-muted-foreground">Añade, edita o elimina los artículos del menú de tu restaurante.</p>
          </div>
        
        <MenuItemDialog>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Añadir Artículo
          </Button>
        </MenuItemDialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead className="text-right">Precio</TableHead>
              <TableHead className="w-[180px] text-center">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {menu.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell className="text-right font-mono">S/{item.price.toFixed(2)}</TableCell>
                <TableCell className="flex justify-center items-center gap-2">
                  <MenuItemDialog item={item}>
                    <Button variant="outline" size="sm">Editar</Button>
                  </MenuItemDialog>
                  <DeleteMenuItemButton itemId={item.id} itemName={item.name} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
         {menu.length === 0 && (
            <div className="text-center p-8 text-muted-foreground">
                No hay artículos en el menú. ¡Añade uno para empezar!
            </div>
        )}
      </div>
    </div>
  );
}
