
"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Media } from "@/components/Media";
import type { Media as MediaType } from "@/payload-types";
import RichText from "@/components/RichText";

type FaqItem = {
  id: string;
  question: string;
  answer: any; // richText or string
};

type FaqAccordionProps = {
  image:any;
  faqs: FaqItem[];
};

const FaqAccordion = ({ image, faqs = [] }: FaqAccordionProps) => {
  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          
          {/* Left: Accordion */}
          <div className="order-2 lg:order-1">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  value={`item-${faq.id}`}
                  className="border-b border-border py-3"
                >
                  <AccordionTrigger className="py-5 text-left hover:no-underline">
                    <h3 className="text-xl lg:text-2xl font-semibold text-foreground text-left">
                      {faq.question}
                    </h3>
                  </AccordionTrigger>
                 <AccordionContent className="pt-2 pb-8">
                    <div className="prose prose-lg max-w-none text-muted-foreground">
                      <RichText data={faq.answer} />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Right: Single Static Image */}
          <div className="order-1 lg:order-2 lg:sticky lg:top-24">
            <div className="bg-muted/50 rounded-2xl overflow-hidden shadow-2xl">
              {image && typeof image === "object" && (
                <Media
                  resource={image}
                  imgClassName="w-full aspect-square lg:aspect-video object-cover"
                  // width={800}
                  // height={600}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqAccordion;