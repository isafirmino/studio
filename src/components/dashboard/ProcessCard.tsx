import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { LegalProcess } from "@/lib/types";
import { ArrowRight, CalendarIcon } from "lucide-react";

interface ProcessCardProps {
  process: LegalProcess;
}

export default function ProcessCard({ process }: ProcessCardProps) {
  return (
    <Link href={`/process/${process.id}`} className="group block">
      <Card className="bg-card border-border transition-all duration-300 group-hover:border-primary group-hover:shadow-lg group-hover:shadow-primary/20 h-full flex flex-col">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="font-headline text-lg leading-tight">
              {process.processNumber}
            </CardTitle>
            <Badge variant="secondary">{process.area}</Badge>
          </div>
          <CardDescription>{process.parties}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col justify-end">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{process.subject}</p>
            <div className="flex items-center text-xs text-muted-foreground">
              <CalendarIcon className="mr-1.5 h-3 w-3" />
              <span>{process.date}</span>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-end text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Ver Detalhes <ArrowRight className="ml-2 h-4 w-4" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
