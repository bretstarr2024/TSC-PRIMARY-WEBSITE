interface CtaStripProps {
  headline?: string;
  buttonText?: string;
  buttonHref?: string;
  ctaId?: string;
}

export function CtaStrip({
  headline = 'Ready to talk strategy?',
  buttonText = "New Game",
  buttonHref = '/contact',
  ctaId = 'insights-strip',
}: CtaStripProps) {
  const isExternal = buttonHref.startsWith('http');
  const hrefWithCta = !isExternal && ctaId
    ? `${buttonHref}${buttonHref.includes('?') ? '&' : '?'}cta=${ctaId}`
    : buttonHref;

  return (
    <section className="my-16 glass rounded-2xl p-8 md:p-12 text-center">
      <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
        {headline}
      </h3>
      <p className="text-shroomy mb-6 max-w-xl mx-auto">
        Whether you need strategic guidance, demand generation, or AI transformation —
        we should talk.
      </p>
      <a
        href={hrefWithCta}
        {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        className="inline-flex items-center px-8 py-4 text-lg font-medium text-white bg-atomic-tangerine rounded-lg hover:bg-hot-sauce transition-colors hover:no-underline"
        data-track-cta={ctaId}
        data-track-component="CtaStrip"
        data-track-label={buttonText}
        data-track-destination={hrefWithCta}
      >
        {buttonText}
      </a>
    </section>
  );
}
