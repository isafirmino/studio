"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Spinner } from "../ui/spinner";
import { useEffect } from "react";

const profileSchema = z.object({
  judgingBody: z.string().min(3, "O órgão julgador é obrigatório."),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfileForm() {
  const { user, userProfile } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      judgingBody: "",
    },
  });

  useEffect(() => {
    if (userProfile) {
      form.reset({
        judgingBody: userProfile.judgingBody || "",
      });
    }
  }, [userProfile, form]);
  
  const onSubmit = async (data: ProfileFormValues) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você deve estar logado para atualizar seu perfil.",
        variant: "destructive",
      });
      return;
    }

    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        judgingBody: data.judgingBody,
      });
      toast({
        title: "Sucesso",
        description: "Seu perfil foi atualizado.",
      });
      // Force a reload of auth state to update profileComplete
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Erro ao atualizar perfil: ", error);
      toast({
        title: "Erro",
        description: "Falha ao atualizar o perfil. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="judgingBody"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Órgão Julgador</FormLabel>
              <FormControl>
                <Input placeholder="ex: Tribunal de Justiça de São Paulo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {userProfile?.role && (
            <FormItem>
              <FormLabel>Cargo</FormLabel>
              <FormControl>
                <Input value={userProfile.role} disabled className="bg-muted/50" />
              </FormControl>
              <FormMessage />
            </FormItem>
        )}
        <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
          {form.formState.isSubmitting && (
            <Spinner className="mr-2 h-4 w-4 animate-spin" />
          )}
          Salvar e Continuar
        </Button>
      </form>
    </Form>
  );
}
