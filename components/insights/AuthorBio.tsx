import { getClientConfig } from '@/lib/kernel/client';
import { getOrganizationSchema } from '@/lib/schema/people';

interface AuthorBioProps {
  featuredAuthor?: string;
}

export function AuthorBio({ featuredAuthor }: AuthorBioProps) {
  const config = getClientConfig();
  const leaders = featuredAuthor
    ? config.leaders.filter((l) => l.name === featuredAuthor)
    : config.leaders;

  if (leaders.length === 0) return null;

  const orgSchema = getOrganizationSchema();

  return (
    <section className="my-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />

      <h3 className="text-lg font-semibold text-white mb-6">
        {featuredAuthor ? 'About the Author' : `About ${config.brand.name.full}`}
      </h3>

      <div className="space-y-4">
        {leaders.map((leader) => {
          const initials = leader.name
            .split(' ')
            .map((n) => n[0])
            .join('');

          return (
            <div key={leader.name} className="glass rounded-xl p-6 flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-atomic-tangerine to-hot-sauce flex items-center justify-center text-white font-bold text-lg shrink-0">
                {initials}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-white font-semibold">{leader.name}</span>
                  <span className="text-greige text-sm">{leader.title}</span>
                </div>
                <p className="text-shroomy text-sm leading-relaxed">{leader.shortBio}</p>
                <div className="flex gap-3 mt-2">
                  {leader.linkedIn && (
                    <a href={leader.linkedIn} target="_blank" rel="noopener noreferrer" className="text-xs text-atomic-tangerine hover:text-hot-sauce">
                      LinkedIn
                    </a>
                  )}
                  {leader.youTube && (
                    <a href={leader.youTube} target="_blank" rel="noopener noreferrer" className="text-xs text-atomic-tangerine hover:text-hot-sauce">
                      YouTube
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
