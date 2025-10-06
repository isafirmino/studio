"use client";

import { useState, type Dispatch, type SetStateAction, type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { addProcessForUser } from "@/lib/firestore";
import { Spinner } from "../ui/spinner";
import { useRouter } from "next/navigation";

interface ImportProcessDialogProps {
  children: ReactNode;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function ImportProcessDialog({ children, isOpen, setIsOpen }: ImportProcessDialogProps) {
  const [processNumber, setProcessNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Erro de Autenticação", description: "Você deve estar logado para importar um processo.", variant: "destructive" });
      return;
    }
    if (!processNumber.trim()) {
      toast({ title: "Erro de Validação", description: "O número do processo não pode estar vazio.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const newProcessId = await addProcessForUser(user.uid, processNumber);
      toast({ title: "Sucesso!", description: `Processo ${processNumber} importado.` });
      setIsOpen(false);
      setProcessNumber("");
      router.push(`/process/${newProcessId}`);
    } catch (error) {
      console.error("Erro ao importar processo:", error);
      toast({ title: "Erro na Importação", description: "Falha ao importar processo. Por favor, tente novamente.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-headline">Importar Processo Jurídico</DialogTitle>
          <DialogDescription>
            Digite o número do processo para importá-lo da API Datajud. Isso buscará metadados e documentos associados.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="0000000-00.0000.0.00.0000"
            value={processNumber}
            onChange={(e) => setProcessNumber(e.target.value)}
            disabled={isSubmitting}
          />
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setIsOpen(false)} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Spinner className="mr-2 h-4 w-4 animate-spin" />}
              Importar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
