"use client";

import { useAuth } from "@/hooks/useAuth";
import ProcessList from "@/components/dashboard/ProcessList";
import ImportProcessDialog from "@/components/dashboard/ImportProcessDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function DashboardPage() {
  const { userProfile } = useAuth();
  const [isImporting, setIsImporting] = useState(false);
  const [processCount, setProcessCount] = useState(0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">
          Bem-vindo, {userProfile?.displayName?.split(" ")[0] || "Usuário"}!
        </h1>
        <p className="text-muted-foreground">
          Você tem {processCount} processos. Você pode importar novos a qualquer momento.
        </p>
      </div>
      
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold font-headline">Meus Processos</h2>
        <ImportProcessDialog 
          isOpen={isImporting} 
          setIsOpen={setIsImporting}
        >
          <Button onClick={() => setIsImporting(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Importar Processo
          </Button>
        </ImportProcessDialog>
      </div>

      <ProcessList setProcessCount={setProcessCount} />
    </div>
  );
}
