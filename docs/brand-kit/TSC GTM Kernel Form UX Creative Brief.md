**TSC GTM Kernel Form UX Creative Brief**  
The Starr Conspiracy  
Bret Starr  
*January 26, 2026*

\#\# Executive Summary

\*\*The Problem:\*\* Your forms look like 1990s software with radio bubbles and basic dropdowns. They feel disconnected from an "AI-native" product. The wizard works functionally, but lacks sophistication. The kernel detail dashboard is confusing and broken. Most critically: \*\*you've asked for "other" fields with follow-up text 100 times and Claude keeps ignoring the brand kit.\*\*

\*\*The Opportunity:\*\* Implement modern, sophisticated form patterns that leverage voice dictation, AI-generated clarification questions, and progressive disclosure. Transform from 90's radio buttons into a contemporary experience that actually \*feels\* like cutting-edge technology.

\*\*Scope:\*\* This brief covers form architecture, component patterns, and interaction design for the onboarding wizard (primary) and kernel detail dashboard (secondary).

\*\*\*

\#\# Current State Assessment

\#\#\# What's Working ✅  
\- \*\*Functional skeleton\*\*: Wizard structure is sound (7 steps, domain-aligned)  
\- \*\*Voice integration\*\*: Speech-to-text \+ LLM extraction is implemented  
\- \*\*Data persistence\*\*: Save/restore flow works (after recent fixes)  
\- \*\*Backend ready\*\*: API supports what the frontend needs

\#\#\# What's Broken ❌

\#\#\#\# 1\. \*\*Form Components Are Dated\*\*  
\- Radio buttons with tiny circles (not 2025\)  
\- Dropdown selects for options that should be cards  
\- No visual hierarchy between required vs optional fields  
\- Company Profile shows poorly aligned optional section  
\- Social channels toggle instead of additive multi-entry pattern

\#\#\#\# 2\. \*\*"Other" Fields Completely Missing\*\*  
You've requested "Other" options with follow-up text fields in 6 GTM Model fields:  
\- How do customers reach you? → Need "Other" \+ text  
\- How are deals closed? → Need "Other" \+ text    
\- Routes to market? → Need "Other" \+ text  
\- GTM strategy? → Need "Other" \+ text  
\- Flywheel effects? → Need "Other" \+ text  
\- Expansion model? → Need "Other" \+ text

\*\*Current state\*\*: These exist as dropdowns with no "Other" option. When the research agents hit an edge case, that data is lost.

\#\#\#\# 3\. \*\*AI-Generated Follow-Up Questions Not Implemented\*\*  
\- Wizard has voice input working  
\- But no AI-powered "Tell me more about that" → generates clarifying questions  
\- No smooth flow like: User answers → AI suggests 1-2 follow-ups → User responds → Data enriched  
\- Typeform has this. Perplexity has this. You don't.

\#\#\#\# 4\. \*\*Brand Kit Completely Ignored\*\*  
You have \`tsc-brand-kit\` with:  
\- Logo (should replace "GTM Kernel" text in upper left)  
\- Color palette (should be applied consistently)  
\- Typography standards (should replace whatever is being used)  
\- Icon standards (should be followed)

Claude is defaulting to generic styling instead of using these assets.

\#\#\#\# 5\. \*\*Dashboard Is a Train Wreck\*\*  
\- Kernel detail shows "0 of 200 fields, 81 Health" \= makes no sense  
\- JSON viewer is uneditable (screenshot shows raw JSON)  
\- No clear next action from dashboard (Continue Setup? Run Research? Something else?)  
\- Empty components show orange "Empty" badges with no guidance  
\- Overall aesthetic feels unfinished vs. wizard

\#\#\#\# 6\. \*\*Navigation Confusion\*\*  
\- Main stepper (Company → Product → Buyer → Market → Identity → Governance → Launch)  
\- Sub-tabs within each main step (GTM Model, Essential Value, Offerings, etc.)  
\- "1 of 5" pagination at bottom  
\- No clear visual connection between levels  
\- User gets stuck: "Should I advance tabs or advance steps?"

\*\*\*

\#\# Form Pattern Research & Best Practices

Based on 2025 patterns from leading B2B platforms, here's what sophisticated form UX includes:

\#\#\# 1\. \*\*Card-Based Selection (Over Dropdowns)\*\*  
\*\*Modern approach used by\*\*: Linear, Notion, Vercel, Figma  
\- Replace dropdowns with rectangular cards  
\- Cards show icon \+ label \+ optional description  
\- Single-select: Radio button appears on card  
\- Multi-select: Checkbox appears on card  
\- Selected cards highlighted (color, border, filled state)  
\- Keyboard navigable (arrow keys, Enter)

\*\*Applied to GTM Kernel:\*\*  
\`\`\`  
How do customers reach you? (select up to 2\)

\[📱 Inbound Marketing\]  \[↗️ Outbound Sales\]  \[🚀 PLG\]  
\[🤝 Partner\]            \[💡 Founder/Network\]  \[🏪 Marketplace\]  
\[✏️ Other\]              

(When "Other" selected, textarea appears below: "Tell us about other ways...")  
\`\`\`

\#\#\# 2\. \*\*Progressive Disclosure with Conditional Reveals\*\*  
\*\*How it works:\*\*  
\- Show only essential fields initially  
\- "More Details" section with secondary fields  
\- Conditional reveal: "Only show Investors if Ownership \= VC-backed or PE-owned"  
\- Visual indentation/grouping shows what's dependent

\*\*Applied to GTM Kernel:\*\*  
\`\`\`  
Company Profile

REQUIRED  
├─ Company Name \[text input\]  
├─ Company URL \[text input\]    
└─ Headquarters \[text input\]

⬇️ More Details (collapsed)

└─ Ownership Type \[card selection\]  
   ↳ If VC/PE: Lead Investor \[multi-entry\]  
   ↳ If Bootstrapped: hidden  
├─ Employee Count \[dropdown\]  
├─ Revenue Range \[dropdown\]  
└─ ...more...  
\`\`\`

\#\#\# 3\. \*\*Multi-Entry Rows (Not Toggle UX)\*\*  
\*\*Current broken pattern\*\*: Click "LinkedIn" toggle → shows URL field → click again → deletes field

\*\*Correct pattern\*\* (used by HubSpot, Salesforce):  
\`\`\`  
Social Channels

\[LinkedIn\] \[Twitter\] \[YouTube\] \[Facebook\] \[+ Add Channel\]

✓ LinkedIn          https://linkedin.com/company/tsc    \[remove\]  
✓ LinkedIn          https://linkedin.com/founder         \[remove\]  
✓ YouTube           https://youtube.com/tsc             \[remove\]  
\`\`\`

Each channel can have unlimited URLs with optional labels (Company, Founder, Thought Leader, etc.)

\#\#\# 4\. \*\*Voice Input → AI Clarification → Structured Data\*\*  
\*\*Flow\*\*:  
1\. User speaks into textarea (voice button \+ auto-expanding textarea)  
2\. On blur, LLM extracts into chips (already working)  
3\. \*\*NEW\*\*: If response is vague/multi-topic, AI generates 1-2 clarifying questions  
4\. User answers clarification questions  
5\. Combined data enriched into kernel

\*\*Example workflow\*\*:  
\`\`\`  
"What value is unlocked if solved?"

\[User speaks: "Customers get faster time to value, they can deploy to production in days instead of weeks, and their teams are happier because they're not wasting time on manual integration work"\]

\[LLM extraction shows 3 chips\]:  
✓ Faster time to value  
✓ Rapid production deployment    
✓ Improved team efficiency

\[AI generates follow-up\]:  
"I see three benefits here. Which ONE is the most important to your buyers? Or are all three equally important?"

\[User selects\]:  
⦿ Time to value is primary (others are nice-to-haves)  
⦿ All three matter equally

\[Result\]: Kernel field stores selected priority \+ all benefits with relationships  
\`\`\`

\#\#\# 5\. \*\*AI-Powered Question Suggestions\*\*  
\*\*Modern pattern\*\* (Perplexity, ChatGPT):  
\- User answers → AI reads response → Generates 1-3 related follow-up prompts  
\- Appears as clickable chips below textarea  
\- User can click to auto-fill next question OR manually type

\*\*For GTM Kernel\*\*:  
\`\`\`  
"What pain happens if it isn't solved?"

\[User speaks: "Sales teams get frustrated, they don't have visibility into pipeline, forecasts are wrong, revenue is unpredictable"\]

\[AI generates follow-ups\]:  
\[💡 "How does this affect your customer's revenue?"\]  
\[💡 "What's the financial impact of failed forecasts?"\]  
\[💡 "Do different personas experience this pain differently?"\]

\[If user clicks first suggestion\]:  
→ New textarea opens below  
→ Prefilled context: "Based on your last answer, how does this affect your customer's revenue?"  
→ User can edit/refine before speaking  
\`\`\`

\#\#\# 6\. \*\*"Other" Field Pattern\*\*  
\*\*Standard form UX\*\* (used everywhere):  
\`\`\`  
How are deals closed?

\[💼 Fully Self-Serve\]    \[🤝 Sales-Assisted\]    \[👤 Sales-Led\]  
\[🔗 Partner-Led\]         \[🎯 Hybrid\]            \[✏️ Other\]

\[When "Other" selected\]:

Tell us about your closing model  
\[Large textarea with voice button\]  
(If vague, AI generates follow-up: "Can you describe the specific steps in your closing process?")  
\`\`\`

\#\#\# 7\. \*\*Smart Form Validation\*\*   
\*\*Modern approach\*\*:  
\- Don't show error until user tries to leave field  
\- Error appears inline, color-coded (red \= error, yellow \= warning, blue \= info)  
\- Clear language: "Need to select one of the first two" not "validation failed"  
\- Disable Next button only if required field is empty  
\- Show which steps have incomplete required fields

\*\*\*

\#\# Specific Component Redesigns

\#\#\# A. Company Profile Step

\*\*Current Issues\*\*:  
\- Layout broken in optional section  
\- Social channels toggle instead of multi-entry  
\- No conditional reveal for Investors (should only show if VC/PE)  
\- Lead Investor singular (should be plural \+ multi-entry)  
\- No Trade Names/Aliases field

\*\*Redesigned Structure\*\*:  
\`\`\`  
┌─ COMPANY PROFILE ─────────────────────────────────────────┐  
│                                                              │  
│ REQUIRED INFORMATION                                         │  
│                                                              │  
│ Company Legal Name \*                                         │  
│ \[The Starr Conspiracy, LLC            \]  \[?\]              │  
│  Hint: Full legal name with entity type (LLC, Corp, etc)   │  
│                                                              │  
│ Trade Names & Aliases                                        │  
│ \+ The Starr Conspiracy    \+ TSC    \+ Starr    \+ Remove all  │  
│  Hint: How customers, analysts, partners refer to you      │  
│                                                              │  
│ Primary Website \*                                            │  
│ \[https://thestarrconspir...         \]  \[?\]                │  
│                                                              │  
│ Headquarters \*                                               │  
│ \[Northampton, MA 01060, US         \]  \[?\]                 │  
│                                                              │  
│ ▼ More Details (2 missing)                                 │  
│                                                              │  
│ Ownership Type                                               │  
│ \[⦿ Bootstrapped\]  \[☐ VC-Backed\]  \[☐ PE-Owned\]  \[☐ Public\] │  
│ \[☐ Subsidiary\]   \[✏️ Other\]                                │  
│                                                              │  
│ └─ IF VC-Backed or PE-Owned:                              │  
│    │                                                        │  
│    │ Lead Investor(s)                                       │  
│    │ \+ Add investor                                         │  
│    │ ✓ Bessemer Venture Partners     \[remove\]             │  
│    │ ✓ Sequoia Capital               \[remove\]             │  
│    │                                                        │  
│    └─ Lead Investor Type: \[Single-select or Multi-entry?\] │  
│                                                              │  
│ Founded Year        Employee Count        Revenue Range     │  
│ \[2018        \]      \[11-50       \]    \[1M-5M       \]      │  
│                                                              │  
│ CEO Name                                                     │  
│ \[John Doe        \]                                          │  
│                                                              │  
│ Founders (comma-separated)                                   │  
│ \[Jane Doe, Alex Smith    \]                                 │  
│                                                              │  
│ LinkedIn URL                                                 │  
│ \[https://linkedin.com/company/tsc    \]                     │  
│                                                              │  
│ Social Channels & URLs                                       │  
│ \[LinkedIn\] \[Twitter\] \[YouTube\] \[Facebook\] \[Instagram\] etc   │  
│ ✓ LinkedIn  https://linkedin.com/company/tsc  \[remove\]    │  
│ ✓ YouTube   https://youtube.com/tsc           \[remove\]    │  
│                                                              │  
│ Companies Often Confused With Yours                         │  
│ \[ACME Corp, XYZ Solutions       \]                          │  
│                                                              │  
└────────────────────────────────────────────────────────────┘  
\`\`\`

\*\*Key improvements:\*\*  
1\. ✅ Required vs optional clearly separated  
2\. ✅ Trade Names field (multi-entry with chips)  
3\. ✅ Conditional Investors field (only shows when relevant)  
4\. ✅ Grid layout for Related fields (Founded, Employees, Revenue in 3-column)  
5\. ✅ Social Channels now additive (add rows, not toggle)  
6\. ✅ Each section has consistent visual hierarchy

\*\*\*

\#\#\# B. GTM Model Component (With "Other" Options)

\*\*Current Issues\*\*:  
\- All 6 fields are single-select dropdowns  
\- No "Other" option with follow-up field  
\- No description/context for options  
\- No voice input option

\*\*Redesigned as Cards \+ Other Pattern\*\*:  
\`\`\`  
┌─ HOW YOU GO TO MARKET ───────────────────────────────────┐  
│                                                             │  
│ Q1: How do customers primarily reach you today? \*          │  
│ Select up to 2                                             │  
│                                                             │  
│ \[📱 Inbound Marketing\]  \[↗️ Outbound Sales\]  \[🚀 PLG\]    │  
│ \[🤝 Partner Channel\]    \[💡 Founder/Network\] \[🏪 Marketplace\]  
│ \[✏️ Other\]                                                │  
│                                                             │  
│ └─ IF "Other" selected:                                  │  
│    │                                                       │  
│    │ Tell us about other channels                          │  
│    │ \[🎤 Voice\] \[Type or speak...\]                       │  
│    │ \[Free-form textarea, grows to 2-8 rows\]             │  
│    │                                                       │  
│    └─ When user blurs field:                             │  
│       \[AI extracts into chips if possible\]               │  
│       \[AI generates clarification: "Are there any other   │  
│        channels we should know about?"\]                   │  
│                                                             │  
│ ───────────────────────────────────────────────────────   │  
│                                                             │  
│ Q2: How are most deals actually closed? \*                 │  
│ Select one                                                │  
│                                                             │  
│ \[☐ Fully Self-Serve\]  \[☐ Sales-Assisted\]  \[☐ Sales-Led\] │  
│ \[☐ Partner-Led\]       \[☐ Hybrid\]          \[✏️ Other\]    │  
│                                                             │  
│ ───────────────────────────────────────────────────────   │  
│ ...repeat for remaining 4 fields (Routes, GTM, Flywheel) │  
│                                                             │  
│ ───────────────────────────────────────────────────────   │  
│                                                             │  
│ OPTIONAL (if you want to get specific)                    │  
│                                                             │  
│ Sales Org Structure                                        │  
│ \[☐ Founder-Led\]  \[☐ Generalist\]  \[☐ SDR-AE\]  \[☐ AE-SE\] │  
│ \[☐ Enterprise Pod\] \[☐ Partner-Managed\] \[✏️ Other\]       │  
│                                                             │  
│ Dominant GTM Strategy                                      │  
│ \[☐ PLG\]     \[☐ Content\]  \[☐ Abs\]    \[☐ Partner\] \[other\] │  
│                                                             │  
│ What Gets Easier With Scale                               │  
│ \[☐ Product\] \[☐ Content\] \[☐ Word-of-Mouth\]  \[☐ None Yet\] │  
│                                                             │  
│ How Revenue Grows In Accounts                              │  
│ \[☐ Land-Expand\] \[☐ Seat Growth\] \[☐ Usage-Based\]         │  
│ \[☐ Upsell\]      \[☐ Cross-Sell\]  \[☐ Platform\]           │  
│                                                             │  
│ Average Contract Value (ACV)                               │  
│ \[Select: $10k-50k / $50k-100k / $100k-500k / $500k+\]   │  
│                                                             │  
│ Sales Cycle Length                                         │  
│ \[Select: 1-3 months / 3-6 months / 6-12 months / 12+ mo\]│  
│                                                             │  
│ ⬛ \[← Back\]  \[Next →\]                                      │  
│                                                             │  
└────────────────────────────────────────────────────────────┘  
\`\`\`

\*\*Key improvements:\*\*  
1\. ✅ Cards instead of dropdowns (6 questions)  
2\. ✅ Every question has "Other" option with conditional textarea \+ voice  
3\. ✅ Multi-select (Q1) vs single-select (Q2-Q6) clearly visual  
4\. ✅ Required vs optional clearly labeled  
5\. ✅ Voice button embedded for "Other" text fields  
6\. ✅ AI clarification questions on optional "Other" responses

\*\*\*

\#\#\# C. Kernel Detail Dashboard (Major Redesign)

\*\*Current Issues\*\* (from screenshot):  
\- Shows "0 of 200 fields, Health 81%" \= confusing contradiction  
\- Raw JSON viewer non-editable and ugly  
\- No clear next actions (Continue Setup? Run Research?)  
\- Empty components with orange badges but no guidance  
\- Layout misaligned, looks unfinished  
\- Doesn't match wizard aesthetic

\*\*Redesigned Dashboard\*\*:  
\`\`\`  
┌─ STARR CONSPIRACY GTM KERNEL ──────────────────────────────┐  
│                                                               │  
│ \[⬅\] GTM Kernel v1.0 | Updated 26 Jan, 2026 | 81% Health     │  
│                                                               │  
│ ┌─ QUICK STATUS ────────────────────────────────────────┐  │  
│ │                                                         │  │  
│ │  Health 81%  |  Complete 162 of 200 fields  |  Ready  │  │  
│ │  ─────────────────────────────────────────────────     │  │  
│ │  ✓ Company   ✓ Product   ⚠ Buyer   ✓ Market   ...    │  │  
│ │                                                         │  │  
│ │  Last Updated: 26 Jan, 2026 by you                    │  │  
│ │  Next Refresh: Run Research (recommended)              │  │  
│ │                                                         │  │  
│ └─────────────────────────────────────────────────────────┘  │  
│                                                               │  
│ ┌─ RECOMMENDED ACTIONS ─────────────────────────────────┐   │  
│ │                                                         │   │  
│ │ 🚀 Run Research                                        │   │  
│ │    Auto-populate missing Buyer & Governance fields     │   │  
│ │    (est. 3-5 min) → \[Start\]                           │   │  
│ │                                                         │   │  
│ │ 📋 Complete Buyer Domain                              │   │  
│ │    5 questions remaining  → \[Continue\]                │   │  
│ │                                                         │   │  
│ │ 🔗 Connect Integrations                               │   │  
│ │    HubSpot, Gong, G2 for real-time enrichment         │   │  
│ │    → \[Set Up\]                                          │   │  
│ │                                                         │   │  
│ │ 💡 Generate Battlecard                                │   │  
│ │    vs. Top 3 competitors  → \[Generate\]               │   │  
│ │                                                         │   │  
│ └─────────────────────────────────────────────────────────┘  │  
│                                                               │  
│ ┌─ DOMAIN BREAKDOWN ────────────────────────────────────┐   │  
│ │                                                         │   │  
│ │ 🏢 Company                        92% complete ✓✓     │   │  
│ │    7 of 7 core fields filled. LinkedIn & team data    │   │  
│ │    integrated. Health: Verified.                       │   │  
│ │    \[Edit\] \[View Details\]                              │   │  
│ │                                                         │   │  
│ │ 📦 Product                        85% complete ✓       │   │  
│ │    ⚠ Missing: 3 packaging questions, GTM metrics.     │   │  
│ │    GTM Model filled. Essential Value 80% complete.    │   │  
│ │    \[Edit\] \[Complete Remaining\]                        │   │  
│ │                                                         │   │  
│ │ 👤 Radical Buyer                  65% complete ✓       │   │  
│ │    ⚠ ICP clear, but Objections only 40% filled.      │   │  
│ │    Consider running research on Gong calls.           │   │  
│ │    \[Edit\] \[Run Research on This\]                      │   │  
│ │                                                         │   │  
│ │ 🎯 Market Landscape              90% complete ✓✓      │   │  
│ │    All competitors filled. Category clear. Trending.  │   │  
│ │    Health: Reliable.                                  │   │  
│ │    \[Edit\] \[View Details\]                              │   │  
│ │                                                         │   │  
│ │ 🎨 Identity                      100% complete ✓✓     │   │  
│ │    All brand voice & positioning defined.             │   │  
│ │    Health: Verified (from brand assets).              │   │  
│ │    \[Edit\] \[View Details\]                              │   │  
│ │                                                         │   │  
│ │ 📚 Governance                      40% complete ✓       │   │  
│ │    ⚠ Only compliance framework filled. Complete       │   │  
│ │    remaining 5 sections (policies, guardrails, etc).  │   │  
│ │    \[Edit\] \[Complete Remaining\]                        │   │  
│ │                                                         │   │  
│ └─────────────────────────────────────────────────────────┘  │  
│                                                               │  
│ ┌─ CAPABILITIES ────────────────────────────────────────┐   │  
│ │                                                         │   │  
│ │ 🛡️ Battlecards   \[View\]                              │   │  
│ │ 📊 Dashboard      \[View\]                              │   │  
│ │ 🔍 Query Engine   \[Ask a Question\]                    │   │  
│ │ ⏰ Time Machine   \[View History\]                      │   │  
│ │ 🔄 Integrations   \[Connected: HubSpot, Gong\]         │   │  
│ │                                                         │   │  
│ └─────────────────────────────────────────────────────────┘  │  
│                                                               │  
│ ┌─ SETTINGS ────────────────────────────────────────────┐   │  
│ │                                                         │   │  
│ │ \[Edit\] \[Share\] \[Archive\] \[Delete\] \[...\]              │   │  
│ │                                                         │   │  
│ └─────────────────────────────────────────────────────────┘  │  
│                                                               │  
└───────────────────────────────────────────────────────────────┘  
\`\`\`

\*\*Key improvements:\*\*  
1\. ✅ Health score makes sense (162/200 \= 81%, not 0/200 with 81%)  
2\. ✅ Clear next actions: Run Research, Complete Buyer, Set Up Integrations  
3\. ✅ Domain breakdown shows % complete \+ specific gaps  
4\. ✅ Actionable buttons (Edit, Complete, Run Research, etc.)  
5\. ✅ Consistent aesthetic with wizard  
6\. ✅ Progressive disclosure (quick status → actions → domains → capabilities)  
7\. ✅ No raw JSON viewer (edit in modal forms if needed)

\*\*\*

\#\# Implementation Roadmap

\#\#\# Phase 1: Foundation (Week 1-2)  
\*\*File: \`onboard/page.tsx\` (Main refactor)\*\*

1\. Create reusable card-select component  
   \- \`CardSelection.tsx\` (single-select radio \+ multi-select checkbox variants)  
   \- Support for icons, labels, descriptions  
   \- Keyboard navigation (arrow keys, enter)

2\. Create "Other" with conditional reveal component  
   \- \`ConditionalOtherField.tsx\`  
   \- Shows textarea \+ voice input when "Other" selected  
   \- Triggers AI clarification on blur

3\. Create additive multi-entry rows component  
   \- \`AdditiveMultiEntryRows.tsx\` (replace social channels toggle)  
   \- Click button → adds new row  
   \- Each row has \[Channel dropdown\] \[URL input\] \[Label\] \[Remove\]

4\. Refactor Company Profile step  
   \- Replace layout with CSS grid (fix alignment)  
   \- Add Trade Names field (multi-entry chips)  
   \- Add Investors conditional field  
   \- Add Social Channels additive rows

\*\*Files affected:\*\*  
\- \`onboard/page.tsx\` (lines 0-500, Company Profile section)  
\- Create: \`components/CardSelection.tsx\` (\~150 lines)  
\- Create: \`components/ConditionalOtherField.tsx\` (\~200 lines)  
\- Create: \`components/AdditiveMultiEntryRows.tsx\` (\~200 lines)

\#\#\# Phase 2: GTM Model Redesign (Week 2-3)  
\*\*File: \`onboard/page.tsx\` (Product step)\*\*

1\. Convert all 6 required GTM Model fields from dropdowns → cards  
2\. Add "Other" with conditional textarea \+ voice \+ AI clarification to all 6  
3\. Keep optional fields as-is initially (lower priority)

\*\*Pattern for each field\*\*:  
\`\`\`  
\[Card Selection (multi/single)\]  
├─ If "Other" selected:  
│  ├─ Conditional Textarea \+ Voice Button  
│  └─ On blur: AI generates clarification questions (optional)  
└─ Auto-save to form state  
\`\`\`

\*\*Files affected:\*\*  
\- \`onboard/page.tsx\` (Product step, GTM Model section)  
\- Backend: \`extractionprompts.py\` (may need new prompts for "Other" scenarios)  
\- Backend: \`apiextract\` endpoint (may need minor tweaks)

\#\#\# Phase 3: Dashboard Redesign (Week 3-4)  
\*\*Files: \`app/kernel/\[id\]/page.tsx\` \+ \`app/kernel/\[id\]/layout.tsx\`\*\*

Complete redesign of kernel detail view:  
1\. Replace layout with progressive disclosure  
2\. Add "Quick Status" card (health %, complete %, status badges)  
3\. Add "Recommended Actions" section with CTAs  
4\. Refactor Domain Breakdown with % complete \+ specific gaps \+ action buttons  
5\. Hide JSON viewer (edit via forms only)

\*\*Files affected:\*\*  
\- \`app/kernel/\[id\]/page.tsx\` (complete refactor, \~500 lines → \~1000 lines with new sections)  
\- \`components/KernelQuickStatus.tsx\` (new, \~150 lines)  
\- \`components/KernelActionCard.tsx\` (new, \~100 lines)  
\- \`components/DomainProgress.tsx\` (new, \~200 lines)

\#\#\# Phase 4: Brand Kit Integration (Week 4\)  
\*\*File: Throughout\*\*

1\. Import logo from \`tsc-brand-kit\` → replace "GTM Kernel" text in header  
2\. Apply color palette from brand kit to all form cards, buttons, badges  
3\. Use brand icon standards for all icons (dropdowns, checkboxes, etc.)  
4\. Update typography to match brand standards

\*\*Files affected:\*\*  
\- \`app/layout.tsx\` (logo import)  
\- All component files (color variable references)  
\- \`lib/colors.ts\` (new file: brand palette mapping)

\*\*\*

\#\# Design System Specifications

\#\#\# Form Component Hierarchy  
\`\`\`  
Form (handles state, validation)  
├─ FormSection (groups related fields)  
│  ├─ FormQuestion (label \+ required indicator \+ help text)  
│  │  ├─ CardSelection (radio/checkbox cards)  
│  │  ├─ TextInput (single-line)  
│  │  ├─ TextArea (multi-line \+ voice)  
│  │  ├─ Dropdown (when cards overkill)  
│  │  ├─ DatePicker  
│  │  └─ ConditionalOtherField (revealed based on selection)  
│  │  
│  └─ ProgressIndicator (shows validation state)  
│     ├─ ✓ Valid (filled \+ valid)  
│     ├─ ⚠ Warning (filled \+ issue)  
│     └─ ✗ Error (empty required / invalid)  
│  
├─ FormActions  
│  ├─ \[← Back\] (optional)  
│  └─ \[Next →\] (disabled if required field invalid)  
│  
└─ FormFooter  
   └─ "n of N steps complete" \+ time estimate  
\`\`\`

\#\#\# Color Palette (From TSC Brand Kit)  
\- \*\*Primary\*\*: Brand primary color (used for CTAs, selections)  
\- \*\*Success\*\*: Green (checkmarks, validated)  
\- \*\*Warning\*\*: Yellow (incomplete, missing data)  
\- \*\*Error\*\*: Red (validation errors, critical issues)  
\- \*\*Neutral\*\*: Gray (borders, dividers, secondary text)  
\- \*\*Background\*\*: Light (wizard), slightly darker (dashboard)

\#\#\# Typography  
\- \*\*Headings\*\*: Brand font, bold weight  
\- \*\*Body\*\*: Brand font, regular weight  
\- \*\*Labels\*\*: Brand font, medium weight, uppercase for question headers  
\- \*\*Help Text\*\*: Smaller size, slightly gray, italics optional

\*\*\*

\#\# Critical Warnings (What Will Break If Not Done Right)

\#\#\# ⚠️ 1\. State Management Must Handle Conditional Fields  
If you add \`Investors\` field that's conditional on \`ownershipType\`, make sure:  
\- Save/restore both parent and conditional child  
\- Validation skips conditional field if not visible  
\- Paths match exactly in \`buildKernelPayloadFromFormData\` and \`restoreFormDataFromKernel\`

\#\#\# ⚠️ 2\. "Other" Field Data Loss Risk  
Current issue: When "Other" text field is added, ensure:  
\- Both raw text AND parsed array are stored in kernel  
\- Both are restored on page load  
\- API accepts the new field paths  
\- Extraction LLM has specific prompt for the field context

\#\#\# ⚠️ 3\. Additive Rows Must Preserve Order  
Social Channels redesign: If user adds rows in order \[LinkedIn, YouTube, LinkedIn, Twitter\]:  
\- Preserve that exact order  
\- Don't deduplicate or reorder  
\- Allow 2+ URLs for same channel with different labels

\#\#\# ⚠️ 4\. Sub-Tab Navigation Must Be Clear  
Current confusion: Main stepper vs sub-tabs vs pagination

\*\*Proposed solution\*\*: Remove sub-tab buttons entirely, make flow fully linear:  
\`\`\`  
Product Step (Current)  
├─ GTM Model (1/5) → Next  
├─ Essential Value (2/5) → Next  
├─ Offerings (3/5) → Next  
├─ Packaging (4/5) → Next  
└─ Commercial Proof (5/5) → Next → Advances to Buyer Step  
\`\`\`

Next button always means "move to next substep" until Product complete.

\#\#\# ⚠️ 5\. Brand Kit Assets Must Load  
Ensure logo, colors, icons from \`tsc-brand-kit\` are:  
\- Imported correctly (check path)  
\- Loaded before rendering  
\- Have fallback if missing  
\- Cached to avoid refetch on every page load

\*\*\*

\#\# Success Criteria

\#\#\# UX Goals ✅  
\- \[ \] No more radio bubbles. All form options are cards or "Other" text.  
\- \[ \] "Other" pattern implemented on all 6 GTM Model fields.  
\- \[ \] Voice input works on all "Other" fields with AI clarification.  
\- \[ \] Dashboard shows health correctly (162/200 \= 81%, not 0/200).  
\- \[ \] Next actions are clear (Run Research, Complete Buyer, etc.).  
\- \[ \] Brand kit logo \+ colors applied throughout.  
\- \[ \] Sub-tab navigation simplified (fully linear or clear two-level UX).

\#\#\# Technical Goals ✅  
\- \[ \] All new fields in \`KernelCreateRequest\` and \`KernelUpdateRequest\`.  
\- \[ \] Save/restore paths match exactly (\`buildKernelPayloadFromFormData\` ↔ \`restoreFormDataFromKernel\`).  
\- \[ \] Conditional reveal logic works without data loss.  
\- \[ \] "Other" extraction LLM prompts are field-specific.  
\- \[ \] No regression in existing fields (Investment field, founder fields, etc.).  
\- \[ \] All E2E tests pass (navigation, save/restore, validation).

\#\#\# Quality Goals ✅  
\- \[ \] Feels contemporary, not 90's (demo to non-technical person).  
\- \[ \] Matches or exceeds Typeform, Linear, Notion form UX.  
\- \[ \] Accessibility: Keyboard navigation, focus states, labels.  
\- \[ \] Mobile responsive (form works on tablet, phone).  
\- \[ \] 0 data loss issues (tested with form abandonment \+ refresh).

\*\*\*

\#\# Brand Kit Requests

\*\*To Claude (AI Dev):\*\*

When implementing these forms, please:

1\. \*\*Import & Use Logo\*\*  
   \- Get logo from \`tsc-brand-kit\` assets  
   \- Replace text "GTM Kernel" in header with actual Ocho logo \+ text  
   \- Use same logo in kernel list dashboard

2\. \*\*Apply Color Palette\*\*  
   \- Get primary, secondary, success, warning, error colors from brand kit  
   \- Create \`lib/brandColors.ts\` that exports: \`primary\`, \`success\`, \`warning\`, \`error\`, \`neutral\`  
   \- Apply to all CardSelection components, buttons, badges, focus states

3\. \*\*Follow Icon Standards\*\*  
   \- If brand kit specifies icon style (line art, filled, specific size), use that  
   \- Don't mix icon styles (don't use filled \+ outline on same page)  
   \- Ensure icons are accessible (aria-label if icon-only)

4\. \*\*Typography\*\*  
   \- If brand kit specifies font family, import it (don't use fallback)  
   \- Respect font weights (don't make bold if brand says regular)  
   \- Maintain line-height and letter-spacing from brand specs

\*\*\*

\#\# Final Thoughts

You've built an incredibly sophisticated backend (research agents, confidence scoring, integrations, time machine, NLQ). The frontend needs to match that sophistication.

The gap isn't effort—it's \*\*pattern choice\*\*. You're using 1990s form patterns in a 2025 product. The moment you ship:  
\- ✅ Cards instead of radio buttons  
\- ✅ "Other" fields with AI follow-ups    
\- ✅ Voice input as a first-class citizen  
\- ✅ Clear progressive disclosure  
\- ✅ Decent dashboard UX

...the product will feel \*\*genuinely innovative\*\*, not like a complex tool with average UX.

This brief gives you the exact patterns to copy, the component architecture to implement, and the guardrails to avoid data loss. You've got this.

\*\*\*

\*\*Ready to build. Let me know where to start.\*\* 🚀

