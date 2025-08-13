"use client";

import React, { useState, useTransition } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import type { Employee } from '@/lib/data';
import { upsertEmployee } from '@/lib/actions';

const employeeRoles = ['waiter', 'cashier'] as const;

const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
  pin: z.string().min(4, { message: "El PIN debe tener al menos 4 dígitos." }).max(8, { message: "El PIN no puede tener más de 8 dígitos."}),
  role: z.enum(employeeRoles, {
    required_error: "Debes seleccionar un rol.",
  }),
});

type EmployeeFormValues = z.infer<typeof formSchema>;

interface EmployeeDialogProps {
  children: React.ReactNode;
  employee?: Employee;
}

export function EmployeeDialog({ children, employee }: EmployeeDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: employee?.id,
      name: employee?.name ?? '',
      pin: employee?.pin ?? '',
      role: employee?.role,
    },
  });

  const onSubmit = (values: EmployeeFormValues) => {
    startTransition(async () => {
      const result = await upsertEmployee(values);
      if (result.success) {
        toast({
          title: `Empleado ${employee ? 'Actualizado' : 'Creado'}`,
          description: `El empleado "${result.employee?.name}" se ha guardado correctamente.`,
        });
        setOpen(false);
        form.reset();
      } else {
        toast({
          title: 'Error',
          description: result.message,
          variant: 'destructive',
        });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{employee ? 'Editar Empleado' : 'Añadir Nuevo Empleado'}</DialogTitle>
          <DialogDescription>
            {employee ? 'Edita los detalles del empleado.' : 'Completa los detalles del nuevo empleado.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nombre
            </Label>
            <div className="col-span-3">
              <Input id="name" {...form.register('name')} />
              {form.formState.errors.name && <p className="text-destructive text-xs mt-1">{form.formState.errors.name.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">
              Rol
            </Label>
            <div className="col-span-3">
               <Controller
                control={form.control}
                name="role"
                render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecciona un rol" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="waiter">Camarero</SelectItem>
                            <SelectItem value="cashier">Cajero</SelectItem>
                        </SelectContent>
                    </Select>
                )}
               />
               {form.formState.errors.role && <p className="text-destructive text-xs mt-1">{form.formState.errors.role.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="pin" className="text-right">
              PIN
            </Label>
            <div className="col-span-3">
              <Input id="pin" type="password" {...form.register('pin')} />
              {form.formState.errors.pin && <p className="text-destructive text-xs mt-1">{form.formState.errors.pin.message}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}