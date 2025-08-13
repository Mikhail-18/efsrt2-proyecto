import Link from 'next/link';
import type { Table, TableStatus } from '@/lib/data';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { DeleteTableButton } from './DeleteTableButton';

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
  const effectiveStatus = table.order.length > 0 ? 'occupied' : table.status;
  const isClickable = role === 'waiter' || (role === 'cashier' && effectiveStatus === 'occupied');
  const LinkWrapper = isClickable ? Link : 'div';
  const linkProps = isClickable ? { href: `/${role}/table/${table.id}` } : {};

  return (
    <Card className={cn(
      "h-full transition-all duration-300 shadow-md flex flex-col",
      isClickable && "hover:shadow-lg hover:border-primary/50",
      !isClickable && "bg-muted/50 cursor-not-allowed"
    )}>
      <LinkWrapper {...linkProps} className="block flex-grow">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className='flex-1'>
              <CardTitle className="font-headline text-2xl">{table.name}</CardTitle>
              <CardDescription className="pt-2">
                {effectiveStatus === 'occupied' ? `${table.order.length} artículo(s) en el pedido` : effectiveStatus === 'free' ? 'Toca para empezar un pedido' : 'Mesa reservada'}
              </CardDescription>
            </div>
            <Badge variant="outline" className={cn("text-sm whitespace-nowrap", statusMap[effectiveStatus].className)}>
              {statusMap[effectiveStatus].text}
            </Badge>
          </div>
        </CardHeader>
      </LinkWrapper>
      {role === 'waiter' && (
        <CardFooter className="p-2 pt-0 mt-auto">
          <DeleteTableButton tableId={table.id} tableName={table.name} isEnabled={effectiveStatus === 'free'} />
        </CardFooter>
      )}
    </Card>
  );
}
