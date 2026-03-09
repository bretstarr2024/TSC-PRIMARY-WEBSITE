'use client';

import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { AnimatedSection } from '@/components/AnimatedSection';

interface Mission {
  id: string;
  domain: 'Strategy' | 'Demand' | 'Execution';
  name: string;
  diagnosis: string;
  symptom: string;
  whatsReallyHappening: string;
  missionObjective: string;
  solutionPath: string;
  solutionSteps: { name: string; description: string }[];
}

const domainMeta = {
  Strategy: { color: '#FF5910', label: 'Strategy Domain' },
  Demand: { color: '#73F5FF', label: 'Demand Domain' },
  Execution: { color: '#E1FF00', label: 'Execution Domain' },
};

const missions: Mission[] = [
  {
    id: 'no-playbook',
    domain: 'Strategy',
    name: 'No Playbook',
    diagnosis: 'Launching products or repositioning without a repeatable GTM system.',
    symptom:
      "You're going to market with a slide deck, a few alignment meetings, and a campaign brief. Every launch or repositioning effort starts from scratch. Teams are moving, but not in the same direction.",
    whatsReallyHappening:
      "Major transitions (product launches, M&A integrations, market expansion, leadership resets) demand a complete GTM architecture. Who you're targeting. Why you win. What you're saying. How it connects across every channel, team, and system. Most companies never build this. They skip from decision to execution and wonder why alignment falls apart three weeks in.\n\nThe result is fragmentation across brand, marketing, sales, and product. The positioning doc says one thing. The sales deck says another. The campaign landing page says a third. Nobody is wrong. Nobody is aligned.",
    missionObjective:
      'Build a unified GTM system before going to market. Align every team and every channel to the same strategy. Replace the slide deck with a machine-readable foundation that governs execution across the entire organization.',
    solutionPath: 'Kernel \u2192 Brand Development \u2192 Web Creation \u2192 Campaign Creation \u2192 Intelligence + Content Engine + AI GTM Engine',
    solutionSteps: [
      { name: 'GTM Kernel', description: "Full strategic build. Brand identity, message identity, ICP, jobs to be done, competitive positioning, demand states, buying triggers. The most comprehensive version of your go-to-market strategy you've ever had, structured for both human and AI consumption." },
      { name: 'Brand Development', description: 'New or repositioned brand identity and messaging framework built on the kernel.' },
      { name: 'Web Creation', description: 'A site that operationalizes the new positioning from the first interaction.' },
      { name: 'Campaign Creation', description: 'Launch campaigns, awareness programs, demand gen, and sales enablement, all running on the same strategic spine.' },
      { name: 'Intelligence + Content + AI GTM Engine', description: 'The ongoing system that keeps the GTM engine running after launch. Intelligence identifies opportunities. Content feeds the pipeline. The AI GTM Engine executes.' },
    ],
  },
  {
    id: 'content-noise',
    domain: 'Strategy',
    name: 'Content Noise',
    diagnosis: 'Publishing constantly but pipeline impact is unclear.',
    symptom:
      "The editorial calendar is full. Blog posts, ebooks, webinars, social content, videos. The team is busy. The content machine is running. Pipeline isn't moving.",
    whatsReallyHappening:
      "Content is disconnected from what buyers actually care about. It's built on keyword lists, internal assumptions, and editorial calendars, not on the jobs buyers are trying to get done or the questions they're asking AI systems and search engines.\n\nActivity is not impact. You're producing content that fills a schedule, not content that fills a pipeline. And as AI-driven search surfaces become primary research tools for B2B buyers, content that isn't built on real buyer intent data won't just underperform. It won't appear at all.",
    missionObjective:
      'Rebuild the content strategy from the foundation up. Define what buyers are actually looking for. Align every piece of content to a real buyer job. Build a production system that creates content at scale, on-strategy by default, optimized for both traditional and AI-driven discovery.',
    solutionPath: 'Kernel \u2192 Intelligence Engine \u2192 Content Engine \u2192 AI GTM Engine \u2192 Campaigns',
    solutionSteps: [
      { name: 'GTM Kernel', description: 'Define the strategic layer that governs content. Jobs to be done, ICP, messaging framework, competitive positioning. Every piece of content anchored to this foundation.' },
      { name: 'Intelligence Engine', description: "Deep query analysis and AEO data that maps buyer intent to content opportunities. Reveals what your buyers are actually searching for, what questions they're asking AI systems, and where the gaps are." },
      { name: 'Content Engine', description: 'AI-native content production governed by the kernel, informed by the Intelligence Engine. Every piece aligned to a real buyer job. Built to perform across traditional search and AI discovery.' },
      { name: 'AI GTM Engine', description: 'Distribution, optimization, and autonomous execution. Ensures content reaches the right audience and continuously identifies new opportunities to capture.' },
    ],
  },
  {
    id: 'pipeline-down',
    domain: 'Demand',
    name: 'Pipeline Down',
    diagnosis: 'Leads declining and campaigns not converting.',
    symptom:
      "Pipeline is shrinking quarter over quarter. Lead volume is down. Campaigns that produced results twelve months ago aren't producing now. The metrics you report to the board are trending the wrong direction and the explanations are getting harder to make.",
    whatsReallyHappening:
      "Your demand gen isn't broken. Your foundation is. The channels and campaigns you're running were built on assumptions about your buyer that may no longer be true. Your ICP has shifted. Your messaging doesn't match how buyers evaluate solutions in 2026. Your content isn't showing up where buyers actually look, including AI-driven search surfaces that didn't exist two years ago.\n\nYou're not underperforming. You're aimed at the wrong target. Every dollar you put into campaigns built on an outdated foundation produces less than it did last quarter. And the gap keeps widening.",
    missionObjective:
      'Rebuild the strategic foundation so every campaign, piece of content, and sales conversation is aimed at the right buyer with the right message. Then build the intelligence and execution systems that turn that foundation into pipeline.',
    solutionPath: 'Kernel \u2192 Intelligence Engine \u2192 Campaign Creation \u2192 AI GTM Engine',
    solutionSteps: [
      { name: 'GTM Kernel', description: 'Rebuild the strategic foundation. ICP, positioning, messaging, jobs to be done, competitive frame. All captured in a machine-readable kernel that becomes the single source of truth for your demand engine.' },
      { name: 'Intelligence Engine', description: "Map where your buyers actually are. Deep query analysis and AEO data reveal the questions buyers are asking, the intent behind them, and where pipeline opportunities exist that you're not seeing." },
      { name: 'Campaign Creation', description: 'Demand gen programs built on the new foundation. Right buyer, right message, right channels.' },
      { name: 'AI GTM Engine', description: 'AI systems that identify and execute on pipeline opportunities autonomously. Production systems that run, learn, and compound.' },
    ],
  },
  {
    id: 'signal-lost',
    domain: 'Demand',
    name: 'Signal Lost',
    diagnosis: 'Messaging and positioning are not resonating with the market.',
    symptom:
      "Buyers aren't responding. Campaigns feel like they're going into a void. Sales says marketing leads are low quality. Win rates are declining. The message that worked two years ago doesn't land anymore.",
    whatsReallyHappening:
      "Your positioning was built for a different moment. Maybe the market shifted and you didn't shift with it. Maybe competitors repositioned around you. Maybe the messaging was always a little generic and it's only now becoming visible because buyers have more options, more noise, and less patience.\n\nThe symptoms show up everywhere. Weak campaigns. Low engagement. Sales frustration. But the root cause is one thing: the market doesn't hear you clearly because you haven't told them clearly who you are and why you win. When positioning is off, nothing built on top of it performs.",
    missionObjective:
      "Rebuild positioning and messaging from the strategic core. Define who you are, who you serve, and why you win in language that lands with actual buyers. Then cascade that clarity into every channel, campaign, and conversation.",
    solutionPath: 'Kernel \u2192 Brand Development \u2192 Content Engine \u2192 Web Creation',
    solutionSteps: [
      { name: 'GTM Kernel', description: "Define the strategic core. Who you are. Who you serve. Why you win. How you're different from every other option the buyer evaluates." },
      { name: 'Brand Development', description: 'Build or rebuild the brand identity and messaging framework. Not a logo exercise. A strategic positioning system that gives every team, tool, and channel the same clear story.' },
      { name: 'Content Engine', description: 'Content that reflects the new positioning and speaks directly to buyer jobs. Every piece aligned to the kernel.' },
      { name: 'Web Creation', description: 'A site that communicates the repositioned brand with clarity and conviction from the first interaction.' },
    ],
  },
  {
    id: 'ai-pilot-purgatory',
    domain: 'Execution',
    name: 'AI Pilot Purgatory',
    diagnosis: 'AI tools have been adopted but production has not improved.',
    symptom:
      "You bought the tools. ChatGPT, Jasper, Clay, workflow automations, a handful of custom builds. The team ran pilots. Leadership approved budgets. But nothing became a production system. Output hasn't meaningfully changed. And now the CEO is asking what the company has to show for the AI investment.",
    whatsReallyHappening:
      "You don't have an AI problem. You have a strategy problem. AI tools were layered onto an operating model that didn't have a clear GTM foundation. Without knowing what to say, to whom, and why, AI helped you produce more of the wrong thing faster.\n\nMost companies are stuck in pilot purgatory. A growing stack of disconnected tools. A handful of experiments that showed promise in a demo and delivered nothing at scale. No production-grade system delivering measurable outcomes. The tools aren't failing. The strategy underneath them is missing.",
    missionObjective:
      'Build the strategic foundation that AI needs to function. Then deploy production-grade AI systems that execute against that foundation. Replace experiments with systems. Replace pilots with production.',
    solutionPath: 'Kernel \u2192 AI GTM Engine \u2192 Intelligence Engine \u2192 Content Engine',
    solutionSteps: [
      { name: 'GTM Kernel', description: 'The strategic layer AI needs to function. ICP, jobs to be done, messaging, positioning, competitive intelligence, demand states, triggers. All machine-readable. All structured for AI consumption. Wrapped in an MCP server that plugs directly into any AI-enabled system.' },
      { name: 'AI GTM Engine', description: 'Production-grade AI systems that execute against the kernel. Not another pilot. A system that runs, learns, identifies opportunities, and acts on them autonomously.' },
      { name: 'Intelligence Engine', description: "AI-driven query and intent analysis that finds real opportunities. Maps what buyers are asking, where they're asking it, and what content or presence would capture that demand." },
      { name: 'Content Engine', description: 'AI-native content production governed by the kernel. On-strategy by default. Built to perform across every surface where buyers look for answers.' },
    ],
  },
  {
    id: 'skeleton-crew',
    domain: 'Execution',
    name: 'Skeleton Crew',
    diagnosis: 'Team size has shrunk but output expectations remain the same.',
    symptom:
      "Headcount got cut. Budget got cut. The remaining team is stretched across everything. Every campaign is a scramble. Every content request is a negotiation. Goals didn't change. The math doesn't work.",
    whatsReallyHappening:
      "You're not just short-staffed. You're running without a system. Every campaign requires your team to build from scratch. Every content brief starts with \"what should we write about?\" Every channel decision is made on instinct because there's no data infrastructure telling you where to focus.\n\nThe problem isn't headcount. The problem is that your marketing operation was designed to run on people, not systems. When the people left, the operation collapsed to match the remaining capacity. Adding people back won't fix it. You'll rebuild the same fragile setup. You need a marketing operating system that makes a small team produce at a scale that wasn't possible before.",
    missionObjective:
      'Replace the people-dependent operating model with a system-driven one. Give the remaining team a single source of truth, AI-powered execution capacity, and data-driven prioritization so they focus only on what moves pipeline.',
    solutionPath: 'Kernel \u2192 AI GTM Engine \u2192 Content Engine \u2192 Intelligence Engine \u2192 Campaigns',
    solutionSteps: [
      { name: 'GTM Kernel', description: 'The single source of truth the team runs on. Strategy, messaging, ICP, competitive positioning. No more debating the message. No more starting from scratch every quarter.' },
      { name: 'AI GTM Engine', description: 'AI systems that handle execution tasks the team no longer has capacity for. Content distribution. Opportunity identification. Campaign execution. Operates autonomously against the kernel.' },
      { name: 'Content Engine', description: 'Scaled content production without adding headcount. On-strategy content at volume, governed by the kernel.' },
      { name: 'Intelligence Engine', description: 'Data-driven prioritization. Instead of spreading a thin team across everything, the Intelligence Engine shows exactly where to focus for maximum pipeline impact.' },
      { name: 'Campaign + Web Creation', description: "When the team can't carry the execution load, we build it. Campaigns and sites built on the kernel, delivered at the pace the business demands." },
    ],
  },
];

function MissionSelector({
  activeDomain,
  onSelect,
}: {
  activeDomain: string;
  onSelect: (domain: string) => void;
}) {
  const reducedMotion = useReducedMotion();
  const domains = ['Strategy', 'Demand', 'Execution'] as const;

  return (
    <div className="flex flex-wrap gap-3 mb-12">
      {domains.map((domain) => {
        const meta = domainMeta[domain];
        const isActive = activeDomain === domain;
        return (
          <motion.button
            key={domain}
            onClick={() => onSelect(domain)}
            className={`relative px-6 py-3 rounded-lg text-sm font-bold uppercase tracking-wider transition-all duration-300 border-2 overflow-hidden ${
              isActive
                ? 'text-heart-of-darkness'
                : 'text-white border-white/20 hover:border-white/40'
            }`}
            style={{
              borderColor: isActive ? meta.color : undefined,
              backgroundColor: isActive ? meta.color : 'transparent',
            }}
            whileHover={reducedMotion ? {} : { scale: 1.02 }}
            whileTap={reducedMotion ? {} : { scale: 0.98 }}
          >
            {domain}
          </motion.button>
        );
      })}
    </div>
  );
}

function MissionDetail({ mission }: { mission: Mission }) {
  const meta = domainMeta[mission.domain];

  return (
    <motion.div
      key={mission.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
      className="glass rounded-2xl border overflow-hidden"
      style={{ borderColor: `${meta.color}33` }}
    >
      {/* Header bar */}
      <div
        className="px-8 md:px-10 py-6 border-b"
        style={{
          borderColor: `${meta.color}22`,
          background: `linear-gradient(135deg, ${meta.color}0A 0%, transparent 50%)`,
        }}
      >
        <div className="flex items-center gap-3 mb-2">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: meta.color, boxShadow: `0 0 8px ${meta.color}88` }}
          />
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: meta.color }}>
            {mission.domain} Domain
          </span>
        </div>
        <h3 className="text-3xl md:text-4xl font-extrabold text-white">{mission.name}</h3>
      </div>

      <div className="px-8 md:px-10 py-8 space-y-8">
        {/* Symptom */}
        <div>
          <p className="text-xs font-bold text-greige uppercase tracking-wider mb-3">Symptom</p>
          <p className="text-white text-lg leading-relaxed">{mission.symptom}</p>
        </div>

        {/* What's Really Happening */}
        <div>
          <p className="text-xs font-bold text-greige uppercase tracking-wider mb-3">
            What&apos;s Really Happening
          </p>
          {mission.whatsReallyHappening.split('\n\n').map((para, i) => (
            <p key={i} className="text-shroomy leading-relaxed mb-3 last:mb-0">{para}</p>
          ))}
        </div>

        {/* Mission Objective */}
        <div className="glass rounded-xl p-6 border" style={{ borderColor: `${meta.color}22` }}>
          <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: meta.color }}>
            Mission Objective
          </p>
          <p className="text-white text-lg leading-relaxed font-medium">{mission.missionObjective}</p>
        </div>

        {/* Solution Path */}
        <div>
          <p className="text-xs font-bold text-greige uppercase tracking-wider mb-4">Solution Path</p>
          <p className="text-sm font-bold mb-6" style={{ color: meta.color }}>
            {mission.solutionPath}
          </p>
          <div className="relative">
            {/* Connecting line */}
            <div
              className="absolute left-[11px] top-3 bottom-3 w-px"
              style={{
                background: `repeating-linear-gradient(to bottom, ${meta.color} 0px, ${meta.color} 4px, transparent 4px, transparent 12px)`,
              }}
            />
            <div className="space-y-5">
              {mission.solutionSteps.map((step, i) => (
                <div key={step.name} className="flex items-start gap-4 pl-1">
                  <span
                    className="mt-2 w-[14px] h-[14px] rounded-full border-2 flex-shrink-0 relative z-10"
                    style={{
                      borderColor: meta.color,
                      backgroundColor: i === 0 ? meta.color : 'transparent',
                    }}
                  />
                  <div>
                    <span className="font-bold text-white">{step.name}</span>
                    <p className="text-sm text-shroomy mt-1 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function MissionGrid() {
  const [activeDomain, setActiveDomain] = useState<string>('Strategy');
  const [activeMission, setActiveMission] = useState<string>('no-playbook');
  const reducedMotion = useReducedMotion();

  const domainMissions = missions.filter((m) => m.domain === activeDomain);
  const selectedMission = missions.find((m) => m.id === activeMission) || domainMissions[0];

  const handleDomainSelect = (domain: string) => {
    setActiveDomain(domain);
    const firstMission = missions.find((m) => m.domain === domain);
    if (firstMission) setActiveMission(firstMission.id);
  };

  const meta = domainMeta[activeDomain as keyof typeof domainMeta];

  return (
    <section className="relative py-32 md:py-40 overflow-hidden">
      {/* Deep space background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0c1118] via-[#0e0c14] to-heart-of-darkness" />

      {/* Large domain-reactive glow — shifts color when you switch domains */}
      <motion.div
        key={`glow-${activeDomain}`}
        className="absolute top-[20%] right-[0%] w-[800px] h-[800px] rounded-full blur-[120px] pointer-events-none"
        style={{ background: `radial-gradient(circle, ${meta.color}33 0%, ${meta.color}08 50%, transparent 70%)` }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: reducedMotion ? 0.4 : [0.3, 0.55, 0.3],
          scale: reducedMotion ? 1 : [0.95, 1.05, 0.95],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Sprinkles accent — bottom left, always present */}
      <motion.div
        className="absolute bottom-[15%] left-[5%] w-[500px] h-[500px] rounded-full blur-[100px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(237,10,210,0.1) 0%, transparent 70%)' }}
        animate={reducedMotion ? { opacity: 0.3 } : {
          opacity: [0.2, 0.4, 0.2],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      />

      {/* Tangerine warmth — top left corner */}
      <motion.div
        className="absolute top-[5%] left-[15%] w-[400px] h-[400px] rounded-full blur-[100px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(255,89,16,0.08) 0%, transparent 70%)' }}
        animate={reducedMotion ? { opacity: 0.3 } : {
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      {/* Animated divider — brighter */}
      <div className="absolute top-0 left-0 right-0 h-px overflow-hidden">
        <motion.div
          className="h-full w-full"
          style={{
            background: 'linear-gradient(90deg, transparent, #FF5910, #73F5FF, #E1FF00, transparent)',
            backgroundSize: '200% 100%',
          }}
          animate={reducedMotion ? {} : { backgroundPosition: ['0% 0%', '200% 0%'] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      <div className="relative z-10 section-wide">
        <AnimatedSection className="mb-12">
          <p className="text-[16px] font-bold text-shroomy uppercase tracking-[4px] mb-6">
            Choose Your Mission
          </p>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-normal tracking-tight text-white leading-[1] mb-6">
            Six missions.<br />
            <span className="text-white font-extrabold">Find yours.</span>
          </h2>
          <p className="text-xl text-shroomy max-w-2xl leading-relaxed">
            Each mission is a pattern we&apos;ve seen hundreds of times. Select a domain,
            pick the mission that sounds like your situation, and see the full diagnosis.
          </p>
        </AnimatedSection>

        {/* Domain Selector */}
        <MissionSelector activeDomain={activeDomain} onSelect={handleDomainSelect} />

        {/* Two-column: mission list + detail */}
        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          {/* Mission list */}
          <div className="space-y-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeDomain}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-3"
              >
                {domainMissions.map((mission) => {
                  const isActive = mission.id === activeMission;
                  return (
                    <motion.button
                      key={mission.id}
                      onClick={() => setActiveMission(mission.id)}
                      className={`w-full text-left rounded-xl p-5 transition-all duration-300 border ${
                        isActive
                          ? 'glass'
                          : 'border-transparent hover:border-white/10'
                      }`}
                      style={{
                        borderColor: isActive ? `${meta.color}44` : undefined,
                      }}
                      whileHover={reducedMotion ? {} : { x: 4 }}
                    >
                      <h4 className={`text-lg font-extrabold mb-1 transition-colors ${
                        isActive ? 'text-white' : 'text-white/60 hover:text-white'
                      }`}>
                        {mission.name}
                      </h4>
                      <p className={`text-sm leading-relaxed transition-colors ${
                        isActive ? 'text-shroomy' : 'text-greige'
                      }`}>
                        {mission.diagnosis}
                      </p>
                    </motion.button>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Mission detail */}
          <AnimatePresence mode="wait">
            {selectedMission && <MissionDetail mission={selectedMission} />}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
