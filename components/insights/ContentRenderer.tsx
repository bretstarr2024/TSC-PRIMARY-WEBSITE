/**
 * Markdown-to-React renderer for content pages.
 * Custom parser (no external markdown lib) with dark theme styling.
 * Server component — no 'use client' needed.
 */

import React from 'react';

interface ContentRendererProps {
  content: string;
}

export function ContentRenderer({ content }: ContentRendererProps) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];
  let listType: 'ul' | 'ol' | null = null;
  let key = 0;

  function flushList() {
    if (listItems.length === 0) return;
    const items = listItems.map((item, i) => (
      <li key={i} className="text-shroomy leading-relaxed">
        {renderInline(item)}
      </li>
    ));
    if (listType === 'ol') {
      elements.push(
        <ol key={key++} className="list-decimal list-inside space-y-2 mb-6 text-shroomy">
          {items}
        </ol>
      );
    } else {
      elements.push(
        <ul key={key++} className="list-disc list-inside space-y-2 mb-6 text-shroomy">
          {items}
        </ul>
      );
    }
    listItems = [];
    listType = null;
  }

  function renderInline(text: string): React.ReactNode {
    // Bold
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="text-white font-semibold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      // Links
      const linkParts = part.split(/(\[[^\]]+\]\([^)]+\))/g);
      return linkParts.map((lp, j) => {
        const linkMatch = lp.match(/\[([^\]]+)\]\(([^)]+)\)/);
        if (linkMatch) {
          return (
            <a key={`${i}-${j}`} href={linkMatch[2]} className="text-atomic-tangerine hover:text-hot-sauce underline">
              {linkMatch[1]}
            </a>
          );
        }
        return lp;
      });
    });
  }

  for (const line of lines) {
    const trimmed = line.trim();

    // Empty line
    if (!trimmed) {
      flushList();
      continue;
    }

    // H2
    if (trimmed.startsWith('## ')) {
      flushList();
      elements.push(
        <h2 key={key++} className="text-2xl font-semibold text-white mt-10 mb-4">
          {renderInline(trimmed.slice(3))}
        </h2>
      );
      continue;
    }

    // H3
    if (trimmed.startsWith('### ')) {
      flushList();
      elements.push(
        <h3 key={key++} className="text-xl font-semibold text-white mt-8 mb-3">
          {renderInline(trimmed.slice(4))}
        </h3>
      );
      continue;
    }

    // Blockquote
    if (trimmed.startsWith('> ')) {
      flushList();
      elements.push(
        <blockquote
          key={key++}
          className="border-l-4 border-atomic-tangerine pl-4 py-2 my-6 italic text-shroomy"
        >
          {renderInline(trimmed.slice(2))}
        </blockquote>
      );
      continue;
    }

    // Unordered list
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      if (listType !== 'ul') flushList();
      listType = 'ul';
      listItems.push(trimmed.slice(2));
      continue;
    }

    // Ordered list
    const olMatch = trimmed.match(/^(\d+)\.\s+(.+)/);
    if (olMatch) {
      if (listType !== 'ol') flushList();
      listType = 'ol';
      listItems.push(olMatch[2]);
      continue;
    }

    // Paragraph
    flushList();
    elements.push(
      <p key={key++} className="text-shroomy leading-relaxed mb-4">
        {renderInline(trimmed)}
      </p>
    );
  }

  flushList();

  return <div className="prose-dark">{elements}</div>;
}
