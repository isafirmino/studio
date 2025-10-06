"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Scale } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  email: z.string().email("Por favor, insira um endereço de e-mail válido."),
  password: z.string().min(1, "A senha é obrigatória."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { signInWithEmail, user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    try {
      await signInWithEmail(data.email, data.password);
      // O AuthProvider cuidará do redirecionamento após o login bem-sucedido
    } catch (error: any) {
      toast({
        title: "Falha no Login",
        description: error.message || "Ocorreu um erro inesperado. Por favor, tente novamente.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mx-auto max-w-sm w-full bg-card border-border shadow-lg shadow-primary/10">
      <CardHeader className="space-y-1 text-center">
        <div className="inline-flex justify-center items-center gap-2 mb-4">
            <Scale className="h-8 w-8 text-primary drop-shadow-[0_0_8px_hsl(var(--primary))]" />
            <CardTitle className="text-3xl font-bold font-headline">
            JuridicoDocs
            </CardTitle>
        </div>
        <CardDescription>
          Digite seu e-mail abaixo para fazer login em sua conta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="m@exemplo.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <Spinner className="animate-spin" />
              ) : (
                "Entrar"
              )}
            </Button>
          </form>
        </Form>
        <div className="mt-4 text-center text-sm">
          Não tem uma conta?{" "}
          <Link href="/register" className="underline text-primary">
            Cadastre-se
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
