/**
 * FAQ data and schema for the Careers page.
 * Answer capsules addressing common questions about working at TSC.
 */

import type { AnswerCapsule } from '@/lib/services-data';

export const careersCapsules: AnswerCapsule[] = [
  {
    question: 'What does "remote-first" actually mean at TSC?',
    answer:
      'It means remote is the default, not the exception. We have no office lease to justify. Team members work from wherever they do their best thinking — home offices, co-working spaces, coffee shops, different time zones. We hire for talent, not proximity.',
  },
  {
    question: 'What is the interview process like?',
    answer:
      'A conversation, not an interrogation. You will talk with the hiring lead and one or two people you would actually work with. We want to understand how you think, what excites you, and whether TSC is the right fit for where you are headed. No whiteboard hazing.',
  },
  {
    question: 'Do I need agency experience?',
    answer:
      'Not necessarily. We value sharp thinking and a bias toward execution over a specific resume shape. Some of our best people came from in-house roles, startups, or completely different industries. What matters is that you can do the work and want to do it here.',
  },
  {
    question: 'What is the AI Workflow Engineer role?',
    answer:
      'You build and optimize the AI systems that power our clients and our own operations — content pipelines, automation workflows, prompt engineering, model evaluation. This is not a research role. You ship production systems that make marketing teams faster and smarter.',
  },
  {
    question: 'How do I apply?',
    answer:
      'Drop us a note using the form on this page. Tell us who you are, what you are good at, and what caught your eye. We read every submission personally — no applicant tracking system, no keyword filters. A real human will respond.',
  },
];
