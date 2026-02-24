import { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PongGameTrigger } from '@/components/contact/PongGameTrigger';

export const metadata: Metadata = {
  title: 'Contact | The Starr Conspiracy',
  description:
    'Get in touch with The Starr Conspiracy. Partnerships, press, careers, or just say hello.',
  openGraph: {
    title: 'Contact | The Starr Conspiracy',
    description:
      'Get in touch with The Starr Conspiracy. Partnerships, press, careers, or just say hello.',
  },
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-32 pb-20">
        <div className="section-wide">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Contact
          </h1>
          <p className="text-xl text-shroomy max-w-2xl">
            Coming soon.
          </p>
        </div>

        <PongGameTrigger />
      </main>
      <Footer />
    </>
  );
}
