import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqItems } from "@/lib/site-content";

type FaqSectionProps = {
  showHeader?: boolean;
  className?: string;
};

export function FaqSection({ showHeader = true, className }: FaqSectionProps) {
  return (
    <section className={className}>
      {showHeader && (
        <div className="text-center mb-10 max-w-2xl mx-auto">
          <p className="text-accent text-sm font-semibold uppercase tracking-[0.2em] mb-3">
            Preguntas Frecuentes
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold uppercase text-primary mb-4">
            ¿Necesitas conocer algo más?
          </h2>
        </div>
      )}

      <Accordion type="single" collapsible className="max-w-3xl mx-auto w-full">
        {faqItems.map((item, index) => (
          <AccordionItem key={item.question} value={`faq-${index}`}>
            <AccordionTrigger className="text-left font-semibold text-primary">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed">
              {"intro" in item && item.intro && (
                <p className="mb-3 font-medium text-foreground">{item.intro}</p>
              )}
              {Array.isArray(item.answer) ? (
                <ul className="list-disc pl-5 space-y-1">
                  {item.answer.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              ) : (
                <p>{item.answer}</p>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
