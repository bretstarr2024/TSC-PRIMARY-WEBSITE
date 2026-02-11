'use client';

import { useState } from 'react';

interface FaqAccordionProps {
  items: Array<{ question: string; answer: string; faqId?: string }>;
  schemaId?: string;
}

export function FaqAccordion({ items, schemaId }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <div>
      <script
        type="application/ld+json"
        id={schemaId}
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="divide-y divide-white/10">
        {items.map((item, index) => (
          <div key={index} className="py-4">
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex items-center justify-between text-left gap-4"
            >
              <span className="text-white font-medium text-lg">{item.question}</span>
              <svg
                className={`w-5 h-5 text-greige shrink-0 transition-transform duration-200 ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openIndex === index && (
              <div className="mt-3 text-shroomy leading-relaxed">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
