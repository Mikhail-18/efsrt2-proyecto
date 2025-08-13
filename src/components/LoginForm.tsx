"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { LogIn, Shield, User } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import type { Employee } from "@/lib/data";

interface LoginFormProps {
    employees: Employee[];
}

const roleMap = {
  waiter: 'Camarero',
  cashier: 'Cajero',
};

export function LoginForm({ employees }: LoginFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [pin, setPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployeeId) {
      toast({
        title: "Error de Validación",
        description: "Por favor, selecciona un empleado.",
        variant: "destructive",
      });
      return;
    }
    if (!pin) {
       toast({
        title: "Error de Validación",
        description: "Por favor, ingresa tu PIN.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    const employee = employees.find(emp => emp.id === selectedEmployeeId);

    setTimeout(() => {
      if (employee && employee.pin === pin) {
        if (employee.role === "waiter") {
            router.push("/waiter");
        } else if (employee.role === "cashier") {
            router.push("/cashier");
        }
      } else {
         toast({
            title: "Error de Autenticación",
            description: "PIN incorrecto. Por favor, inténtalo de nuevo.",
            variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <Card className="w-full max-w-sm shadow-lg">
        <CardHeader className="text-center">
            <CardTitle className="text-3xl font-headline">Bienvenido</CardTitle>
            <CardDescription>
                Ingresa con tu usuario y PIN para gestionar tu turno.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="grid gap-4">
                 <Button asChild variant="outline">
                    <Link href="/admin">
                        <Shield className="mr-2 h-4 w-4" />
                        Ingresar como Administrador
                    </Link>
                </Button>

                <div className="relative">
                    <Separator />
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                        O inicia sesión como empleado
                        </span>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-4 mt-4">
                <div className="grid gap-2">
                    <Label htmlFor="employee">Empleado</Label>
                    <Select onValueChange={setSelectedEmployeeId} value={selectedEmployeeId}>
                    <SelectTrigger id="employee" className="w-full">
                         <SelectValue placeholder={
                            <div className="flex items-center">
                                <User className="mr-2 h-4 w-4" />
                                Selecciona tu usuario
                            </div>
                        } />
                    </SelectTrigger>
                    <SelectContent>
                        {employees.map(employee => (
                            <SelectItem key={employee.id} value={employee.id}>
                                <div className="flex justify-between w-full">
                                    <span>{employee.name}</span>
                                    <span className="text-muted-foreground">{roleMap[employee.role]}</span>
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="pin">PIN</Label>
                    <Input
                    id="pin"
                    type="password"
                    placeholder="••••"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    />
                </div>
                 <Button type="submit" className="w-full" disabled={isLoading || !selectedEmployeeId || !pin}>
                    {isLoading ? "Ingresando..." : (
                    <>
                        <LogIn className="mr-2 h-4 w-4" />
                        Ingresar
                    </>
                    )}
                </Button>
            </form>
        </CardContent>
    </Card>
  );
}
