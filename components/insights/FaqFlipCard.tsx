'use client';

import { useState } from 'react';
import Link from 'next/link';

interface FaqFlipCardProps {
  question: string;
  answer: string;
  faqId: string;
  tags?: string[];
}

export function FaqFlipCard({ question, answer, faqId, tags }: FaqFlipCardProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="relative h-64 cursor-pointer"
      style={{ perspective: '1000px' }}
      onClick={() => setFlipped(!flipped)}
    >
      <div
        className="absolute inset-0 transition-transform duration-500"
        style={{
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Front — Question */}
        <div
          className="absolute inset-0 glass rounded-xl p-6 flex flex-col justify-between"
          style={{
            backfaceVisibility: 'hidden',
            borderLeftColor: '#E1FF00',
            borderLeftWidth: 3,
          }}
        >
          <div>
            <span
              className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full inline-block mb-4"
              style={{ color: '#E1FF00', backgroundColor: '#E1FF0015' }}
            >
              FAQ
            </span>
            <h3 className="text-white font-semibold text-lg leading-snug line-clamp-4">
              {question}
            </h3>
          </div>
          <div className="flex items-center gap-1 text-xs text-greige">
            <span>Tap to reveal</span>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        {/* Back — Answer preview + link */}
        <div
          className="absolute inset-0 glass rounded-xl p-6 flex flex-col justify-between"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            borderLeftColor: '#E1FF00',
            borderLeftWidth: 3,
          }}
        >
          <div>
            <p className="text-shroomy text-sm leading-relaxed line-clamp-6">
              {answer}
            </p>
          </div>
          <div className="flex items-center justify-between mt-4">
            {tags && tags.length > 0 && (
              <div className="flex gap-1 flex-wrap">
                {tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="text-xs text-greige bg-white/5 px-2 py-0.5 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <Link
              href={`/insights/faq/${faqId}`}
              className="text-atomic-tangerine text-sm font-medium hover:underline flex items-center gap-1"
              onClick={(e) => e.stopPropagation()}
            >
              Read More
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
