"use client";

import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Trash2 } from 'lucide-react';
import { deleteTable } from '@/lib/actions';

interface DeleteTableButtonProps {
  tableId: number;
  tableName: string;
  isEnabled: boolean;
}

export function DeleteTableButton({ tableId, tableName, isEnabled }: DeleteTableButtonProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteTable(tableId);
      if (result.success) {
        toast({
          title: 'Mesa Eliminada',
          description: `La ${tableName} ha sido eliminada.`,
        });
      } else {
        toast({
          title: 'Error al Eliminar',
          description: result.message,
          variant: 'destructive',
        });
      }
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive"
          disabled={!isEnabled || isPending}
          onClick={(e) => e.stopPropagation()}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          {isPending ? 'Eliminando...' : 'Eliminar Mesa'}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción es irreversible. Se eliminará permanentemente la <strong>{tableName}</strong>.
            No puedes eliminar una mesa que está ocupada o reservada.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? 'Eliminando...' : 'Sí, eliminar'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
