"use client";

import { useState, useTransition } from "react";
import type { LegalDocument } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { FileText, Sparkles } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/hooks/use-toast";
import { generateSummaryAction } from "@/app/actions";
import { saveSummaryToFirestore } from "@/lib/firestore";

interface DocumentItemProps {
  document: LegalDocument;
  processId: string;
}

export default function DocumentItem({ document, processId }: DocumentItemProps) {
  const [summary, setSummary] = useState(document.summary);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleGenerateSummary = () => {
    startTransition(async () => {
      const result = await generateSummaryAction(document.contentText);
      if (result.summary) {
        await saveSummaryToFirestore(processId, document.id, result.summary);
        setSummary(result.summary);
        toast({
          title: "Summary Generated",
          description: `AI summary for ${document.name} is complete.`,
        });
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    });
  };

  const Icon = () => (
    <FileText className="h-6 w-6 text-primary drop-shadow-[0_0_4px_hsl(var(--primary))] shrink-0" />
  );

  return (
    <div className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-4 flex-1">
        <Icon />
        <span className="font-medium">{document.name}</span>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          View Document
        </Button>
        {!summary && (
          <Button onClick={handleGenerateSummary} disabled={isPending} size="sm">
            {isPending ? (
              <Spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Generate Summary
          </Button>
        )}
      </div>

      {summary && (
        <div className="w-full md:w-auto md:basis-full md:mt-4">
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                    <AccordionTrigger className="text-primary hover:no-underline">View AI Summary</AccordionTrigger>
                    <AccordionContent className="prose prose-invert max-w-none text-muted-foreground">
                        {summary}
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
      )}
    </div>
  );
}
