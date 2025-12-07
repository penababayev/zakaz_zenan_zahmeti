"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Page = () => {
  const faqs = [
    {
      id: "1",
      question: "Is it accessible?",
      answer: "Yes. It adheres to the WAI-ARIA design pattern.",
    },
    {
      id: "2",
      question: "Can I use it in my project?",
      answer: "Absolutely! It's easy to integrate and customize.",
    },
    {
      id: "3",
      question: "Does it support keyboard navigation?",
      answer: "Yes, it supports keyboard navigation out of the box.",
    },
    {
      id: "4",
      question: "Is it responsive?",
      answer: "Yes, it works seamlessly across all devices.",
    },
  ];

  return (
    <div className="min-h-screen flex justify-center items-start pt-16 bg-white">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-6 text-gray-900">
          Frequently Asked Questions
        </h1>
        <Accordion type="single" collapsible>
          {faqs.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default Page;
