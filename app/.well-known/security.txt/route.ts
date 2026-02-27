export async function GET() {
  const body = `Contact: mailto:hello@thestarrconspiracy.com
Expires: 2027-03-01T00:00:00.000Z
Preferred-Languages: en
Canonical: https://tsc-primary-website.vercel.app/.well-known/security.txt
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
