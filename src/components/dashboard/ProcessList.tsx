"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getProcessesForUser } from "@/lib/firestore";
import type { LegalProcess } from "@/lib/types";
import ProcessCard from "./ProcessCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ProcessListProps {
  setProcessCount: (count: number) => void;
}

export default function ProcessList({ setProcessCount }: ProcessListProps) {
  const { user } = useAuth();
  const [processes, setProcesses] = useState<LegalProcess[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (user) {
      const fetchProcesses = async () => {
        setLoading(true);
        const userProcesses = await getProcessesForUser(user.uid);
        setProcesses(userProcesses);
        setProcessCount(userProcesses.length);
        setLoading(false);
      };
      fetchProcesses();
    }
  }, [user, setProcessCount]);

  const filteredProcesses = useMemo(() => {
    return processes.filter((process) =>
      process.processNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      process.parties.toLowerCase().includes(searchTerm.toLowerCase()) ||
      process.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [processes, searchTerm]);

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-48 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Buscar por número do processo, partes ou assunto..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredProcesses.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProcesses.map((process) => (
            <ProcessCard key={process.id} process={process} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border text-center p-12">
          <h3 className="text-xl font-semibold">Nenhum Processo Encontrado</h3>
          <p className="mt-2 text-muted-foreground">
            {searchTerm ? "Tente um termo de busca diferente." : "Importe seu primeiro processo para começar."}
          </p>
        </div>
      )}
    </div>
  );
}
