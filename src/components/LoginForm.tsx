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
import { LogIn, Shield } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [role, setRole] = useState("");
  const [pin, setPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) {
      toast({
        title: "Error de Validación",
        description: "Por favor, selecciona un rol.",
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
    // Mock authentication - redirects after a short delay
    setTimeout(() => {
      if (role === "waiter") {
        router.push("/waiter");
      } else if (role === "cashier") {
        router.push("/cashier");
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <Card className="w-full max-w-sm shadow-lg">
        <CardHeader className="text-center">
            <CardTitle className="text-3xl font-headline">Bienvenido</CardTitle>
            <CardDescription>
                Ingresa con tu rol y PIN para gestionar tu turno.
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
                    <Label htmlFor="role">Rol</Label>
                    <Select onValueChange={setRole} value={role}>
                    <SelectTrigger id="role" className="w-full">
                        <SelectValue placeholder="Selecciona un rol" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="waiter">Camarero</SelectItem>
                        <SelectItem value="cashier">Cajero</SelectItem>
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
                 <Button type="submit" className="w-full" disabled={isLoading || !role || !pin}>
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
