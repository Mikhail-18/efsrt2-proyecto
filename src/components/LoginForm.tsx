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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
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

const ADMIN_PIN = "0000"; // Simple hardcoded PIN for admin

export function LoginForm({ employees }: LoginFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [pin, setPin] = useState("");
  const [adminPin, setAdminPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAdminDialogOpen, setIsAdminDialogOpen] = useState(false);

  const handleEmployeeSubmit = (e: React.FormEvent) => {
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
  
  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (adminPin === ADMIN_PIN) {
        toast({
            title: "Acceso Concedido",
            description: "Bienvenido, Administrador.",
        });
        router.push("/admin");
    } else {
        toast({
            title: "Acceso Denegado",
            description: "El PIN de administrador es incorrecto.",
            variant: "destructive",
        });
    }
    setIsLoading(false);
    setAdminPin("");
    setIsAdminDialogOpen(false);
  }

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
                 <Dialog open={isAdminDialogOpen} onOpenChange={setIsAdminDialogOpen}>
                    <DialogTrigger asChild>
                         <Button variant="outline">
                            <Shield className="mr-2 h-4 w-4" />
                            Ingresar como Administrador
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <form onSubmit={handleAdminSubmit}>
                            <DialogHeader>
                                <DialogTitle>Acceso de Administrador</DialogTitle>
                                <DialogDescription>
                                    Ingresa el PIN de administrador para continuar.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="flex items-center space-x-2 my-4">
                               <div className="grid flex-1 gap-2">
                                    <Label htmlFor="admin-pin" className="sr-only">
                                        PIN de Administrador
                                    </Label>
                                    <Input
                                        id="admin-pin"
                                        type="password"
                                        placeholder="••••"
                                        value={adminPin}
                                        onChange={(e) => setAdminPin(e.target.value)}
                                    />
                                </div>
                            </div>
                            <DialogFooter className="sm:justify-end">
                                <DialogClose asChild>
                                    <Button type="button" variant="secondary">
                                        Cancelar
                                    </Button>
                                </DialogClose>
                                 <Button type="submit" disabled={isLoading}>
                                    {isLoading ? "Verificando..." : "Verificar"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                 </Dialog>

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

            <form onSubmit={handleEmployeeSubmit} className="grid gap-4 mt-4">
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
                               {employee.name} <span className="text-muted-foreground ml-2">({roleMap[employee.role]})</span>
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
