"use client";

import type { LegalDocument } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "../ui/separator";

interface DocumentItemProps {
  document: LegalDocument;
  processId: string;
}

export default function DocumentItem({ document, processId }: DocumentItemProps) {

  const Icon = () => (
    <FileText className="h-6 w-6 text-primary drop-shadow-[0_0_4px_hsl(var(--primary))] shrink-0" />
  );

  return (
    <div className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-4 flex-1">
        <Icon />
        <div className="flex-1">
            <p className="font-medium">{document.name}</p>
            {document.summary && (
                 <Accordion type="single" collapsible className="w-full mt-2">
                    <AccordionItem value="item-1" className="border-b-0">
                        <AccordionTrigger className="text-primary hover:no-underline py-1 text-sm">Ver Resumo da IA</AccordionTrigger>
                        <AccordionContent className="prose prose-invert max-w-none text-muted-foreground pt-2">
                            {document.summary}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            )}
        </div>
      </div>
      <div className="flex items-center gap-2 self-end md:self-center">
        <Button variant="outline" size="sm">
          Ver Documento
        </Button>
      </div>
    </div>
  );
}
