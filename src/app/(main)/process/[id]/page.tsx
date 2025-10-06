import { getProcessDetails } from "@/lib/firestore";
import DocumentItem from "@/components/process/DocumentItem";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface ProcessDetailPageProps {
  params: { id: string };
}

export default async function ProcessDetailPage({ params }: ProcessDetailPageProps) {
  const process = await getProcessDetails(params.id);

  if (!process) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold">Processo Não Encontrado</h1>
        <p className="text-muted-foreground">
          O processo que você está procurando não existe.
        </p>
        <Button asChild variant="link" className="mt-4">
            <Link href="/dashboard">Retornar ao Painel</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <Button asChild variant="ghost" className="-ml-4 mb-4">
            <Link href="/dashboard"><ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao Painel</Link>
        </Button>
        <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-3xl font-bold font-headline">{process.processNumber}</h1>
            <Badge variant="outline" className="text-sm">{process.area} / {process.class}</Badge>
        </div>
        <p className="mt-1 text-muted-foreground">{process.parties}</p>
      </div>
      
      <Card>
        <CardHeader>
            <CardTitle className="font-headline text-xl">Detalhes do Processo</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Assunto</p>
                <p>{process.subject}</p>
            </div>
            <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Data</p>
                <p>{process.date}</p>
            </div>
        </CardContent>
      </Card>
      
      <div>
        <h2 className="text-2xl font-semibold font-headline mb-4">Documentos</h2>
        <Card>
            <CardContent className="p-0">
                <div className="space-y-2">
                {process.documents && process.documents.map((doc, index) => (
                    <div key={doc.id}>
                    <DocumentItem document={doc} processId={process.id} />
                    {index < process.documents!.length - 1 && <Separator />}
                    </div>
                ))}
                {!process.documents || process.documents.length === 0 && (
                    <p className="p-6 text-center text-muted-foreground">Nenhum documento encontrado para este processo.</p>
                )}
                </div>
            </CardContent>
        </Card>
      </div>

    </div>
  );
}
