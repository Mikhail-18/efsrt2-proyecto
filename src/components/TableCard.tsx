import Link from 'next/link';
import type { Table, TableStatus } from '@/lib/data';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type TableCardProps = {
  table: Table;
  role: 'waiter' | 'cashier';
};

const statusMap: Record<TableStatus, { text: string; className: string }> = {
  free: { text: 'Libre', className: 'bg-green-500/20 text-green-700 border-green-500/30' },
  occupied: { text: 'Ocupada', className: 'bg-orange-500/20 text-orange-700 border-orange-500/30' },
  reserved: { text: 'Reservada', className: 'bg-blue-500/20 text-blue-700 border-blue-500/30' },
};

export function TableCard({ table, role }: TableCardProps) {
  // A table is considered "occupied" if it has items in the order.
  const effectiveStatus = table.order.length > 0 ? 'occupied' : table.status;
  
  const isClickable = role === 'waiter' || (role === 'cashier' && effectiveStatus === 'occupied');
  
  const cardContent = (
    <Card className={cn(
      "h-full transition-all duration-300 shadow-md",
      isClickable && "hover:shadow-lg hover:border-primary/50 cursor-pointer",
      !isClickable && "bg-muted/50 cursor-not-allowed"
    )}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="font-headline text-2xl">{table.name}</CardTitle>
          <Badge variant="outline" className={cn("text-sm", statusMap[effectiveStatus].className)}>
            {statusMap[effectiveStatus].text}
          </Badge>
        </div>
        <CardDescription className="pt-2">
          {effectiveStatus === 'occupied' ? `${table.order.length} artículo(s) en el pedido` : 'Toca para empezar un pedido'}
        </CardDescription>
      </CardHeader>
    </Card>
  );

  if (!isClickable) {
    return cardContent;
  }

  return (
    <Link href={`/${role}/table/${table.id}`} className="h-full block">
      {cardContent}
    </Link>
  );
}
