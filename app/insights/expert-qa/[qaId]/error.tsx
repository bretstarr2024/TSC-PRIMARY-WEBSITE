'use client';
import { ContentError } from '@/components/insights/ContentError';
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <ContentError error={error} reset={reset} backLabel="Expert Q&A" backHref="/insights/expert-qa" />;
}
