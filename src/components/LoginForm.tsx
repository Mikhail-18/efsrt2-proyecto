"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { LogIn } from "lucide-react";

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
      <form onSubmit={handleSubmit}>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline">Bienvenido</CardTitle>
          <CardDescription>
            Ingresa para gestionar tu turno.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
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
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading || !role || !pin}>
            {isLoading ? "Ingresando..." : (
              <>
                <LogIn />
                Ingresar
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
