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
import type { MenuItem } from '@/lib/data';
import { upsertMenuItem } from '@/lib/actions';

const menuCategories = ['Entradas', 'Platos Principales', 'Postres', 'Bebidas'] as const;

const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
  price: z.coerce.number().min(0, { message: "El precio no puede ser negativo." }),
  category: z.enum(menuCategories, {
    required_error: "Debes seleccionar una categoría.",
  }),
});

type MenuItemFormValues = z.infer<typeof formSchema>;

interface MenuItemDialogProps {
  children: React.ReactNode;
  item?: MenuItem;
}

export function MenuItemDialog({ children, item }: MenuItemDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<MenuItemFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: item?.id,
      name: item?.name ?? '',
      price: item?.price ?? 0,
      category: item?.category,
    },
  });

  const onSubmit = (values: MenuItemFormValues) => {
    startTransition(async () => {
      const result = await upsertMenuItem(values);
      if (result.success) {
        toast({
          title: `Artículo ${item ? 'Actualizado' : 'Creado'}`,
          description: `El artículo "${result.menuItem?.name}" se ha guardado correctamente.`,
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
          <DialogTitle>{item ? 'Editar Artículo' : 'Añadir Nuevo Artículo'}</DialogTitle>
          <DialogDescription>
            {item ? 'Edita los detalles del artículo.' : 'Completa los detalles del nuevo artículo del menú.'}
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
            <Label htmlFor="price" className="text-right">
              Precio (S/)
            </Label>
            <div className="col-span-3">
              <Input id="price" type="number" step="0.01" {...form.register('price')} />
              {form.formState.errors.price && <p className="text-destructive text-xs mt-1">{form.formState.errors.price.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Categoría
            </Label>
            <div className="col-span-3">
               <Controller
                control={form.control}
                name="category"
                render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecciona una categoría" />
                        </SelectTrigger>
                        <SelectContent>
                            {menuCategories.map(cat => (
                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
               />
               {form.formState.errors.category && <p className="text-destructive text-xs mt-1">{form.formState.errors.category.message}</p>}
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
