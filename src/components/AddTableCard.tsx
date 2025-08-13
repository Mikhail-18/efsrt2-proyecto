"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { useTransition } from 'react';
import { addTable } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export function AddTableCard() {
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    const handleAddTable = () => {
        startTransition(async () => {
            const result = await addTable();
            if (result.success) {
                toast({
                    title: 'Mesa Añadida',
                    description: `Se ha añadido la ${result.newTable?.name}.`,
                });
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
        <Card 
            className={cn(
                "h-full transition-all duration-300 shadow-md hover:shadow-lg hover:border-primary/50 cursor-pointer border-dashed",
                isPending && "opacity-50 cursor-not-allowed"
            )}
            onClick={!isPending ? handleAddTable : undefined}
        >
            <CardContent className="flex flex-col items-center justify-center h-full p-4">
                <Plus className="h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">Añadir Mesa</p>
            </CardContent>
        </Card>
    );
}
