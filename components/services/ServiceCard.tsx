'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Service } from '@/lib/services-data';

interface ServiceCardProps {
  service: Service;
  accentColor: string;
  borderClass: string;
}

export function ServiceCard({ service, accentColor, borderClass }: ServiceCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      layout
      className={`glass rounded-xl border-l-2 ${borderClass} cursor-pointer transition-all duration-300 hover:border-opacity-60`}
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h4 className="text-lg font-bold text-white mb-1">{service.name}</h4>
            <p className="text-sm text-shroomy">{service.tagline}</p>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.2 }}
            className="mt-1 flex-shrink-0"
          >
            <span className="text-xl text-greige">+</span>
          </motion.div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
              className="overflow-hidden"
            >
              <div className="pt-5 mt-5 border-t border-white/5">
                <p className="text-shroomy leading-relaxed mb-6">{service.description}</p>

                <div className="mb-6">
                  <p className="text-xs font-semibold text-greige uppercase tracking-wider mb-3">
                    What You Get
                  </p>
                  <ul className="space-y-2">
                    {service.outcomes.map((outcome) => (
                      <li key={outcome} className="flex items-start gap-2.5 text-sm text-shroomy">
                        <span
                          className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: accentColor }}
                        />
                        {outcome}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-wrap gap-4 text-xs text-greige">
                  <div>
                    <span className="text-white font-medium">Delivery:</span>{' '}
                    {service.deliveryModel}
                  </div>
                  <div>
                    <span className="text-white font-medium">Scope:</span>{' '}
                    {service.typicalScope}
                  </div>
                </div>

                <p className="mt-4 text-sm text-shroomy/80 italic">{service.whoItsFor}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
