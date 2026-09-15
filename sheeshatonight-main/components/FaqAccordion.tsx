'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export interface FaqItem {
  question: string;
  answer: string;
}

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="space-y-4">
      {items.map((faq, index) => {
        const isOpen = openFaq === index;
        return (
          <div
            key={index}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md"
          >
            <button
              type="button"
              onClick={() => toggleFaq(index)}
              className="w-full flex items-center justify-between p-6 text-left"
              aria-expanded={isOpen}
            >
              <h3 className="text-base sm:text-lg font-bold text-slate-900 pr-4">
                {faq.question}
              </h3>
              {isOpen ? (
                <ChevronUp className="w-5 h-5 text-[#74189B] flex-shrink-0" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
              )}
            </button>

            {isOpen && (
              <div className="px-6 pb-6 pt-0 border-t border-slate-50">
                <p className="text-slate-600 leading-relaxed text-[15px] pt-4">
                  {faq.answer}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
