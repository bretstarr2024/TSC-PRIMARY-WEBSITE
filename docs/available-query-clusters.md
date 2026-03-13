# Available Query Clusters for Import

Source: AEO GTM Engine (`aeo.query_coverage`)
Fractional CMO clusters removed. Pick **10–15** to import into the TSC pipeline.

Many clusters below are near-duplicates of each other (the GTM engine ran multiple passes).
**Pick one per theme** — the import script will deduplicate queries within each selected cluster.

---

## GTM Strategy
*Core TSC territory — go-to-market is what we do*

- [ ] **Go-To-Market Strategy Fundamentals** — 1,026 queries
- [X] **B2B Go-To-Market Strategy Insights** — 667 queries
- [ ] **B2B SaaS Go-To-Market Strategy** — 610 queries
- [ ] **B2B GTM Metrics and KPIs** — 218 queries
- [ ] **B2B Marketing & GTM Templates** — 350 queries

---

## AI-Driven Marketing
*Strong TSC angle — AI transformation is one of our 3 JTBD clusters*

- [ ] **AI-Driven Marketing Transformation & Future** — 732 queries
- [ ] **AI-Powered Marketing Strategies and Tools** — 725 queries
- [x] **AI-Powered Marketing Transformation Trends** — 693 queries
- [] **AI-Driven B2B Sales & ABM** — 344 queries
- [] **Future of AI-Driven Marketing** — 43 queries

---

## Sales–Marketing Alignment
*Direct ICP pain point in our kernel*

- [ ] **Sales–Marketing Alignment Strategies** — 891 queries
- [ ] **Sales and Marketing Alignment Fundamentals** — 482 queries
- [ ] **Sales–Marketing Alignment & Collaboration** — 473 queries

---

## B2B Marketing Strategy (Broad)
*High-volume, high-authority content territory*

- [ ] **B2B Marketing Strategies and Examples** — 1,278 queries
- [ ] **Marketing Strategy Fundamentals and Planning** — 572 queries
- [ ] **B2B Marketing Strategy Frameworks** — 519 queries
- [x] **B2B Marketing Strategy Trends** — 469 queries
- [ ] **Marketing Technology Stack Strategy** — 892 queries

---

## Marketing ROI & Performance
*Measurability is a core TSC claim*

- [ ] **Marketing ROI Measurement & Benchmarks** — 523 queries
- [ ] **Measuring & Optimizing B2B Marketing ROI** — 223 queries
- [ ] **B2B Marketing and GTM Success KPIs** — 296 queries

---

## Lead & Demand Generation
*Pipeline building is core to TSC's value prop*

- [x] **B2B Lead and Demand Generation** — 394 queries
- [ ] **B2B Lead Generation Strategies and Tools** — 327 queries
- [ ] **B2B Demand Generation Fundamentals** — 244 queries

---

## Content Marketing
*TSC creates content strategy for clients*

- [x] **B2B Content Marketing Strategy (but with AI spin)** — 379 queries
- [ ] **B2B Content Marketing Strategy Framework** — 381 queries

---

## Brand Positioning
*TSC does positioning work*

- [ ] **B2B Brand Positioning Templates & Examples** — 238 queries
- [ ] **B2B Brand Positioning Frameworks & Examples** — 226 queries

---

## Hiring & Evaluating Agencies
*Relevant to buyers considering TSC*

- [ ] **Hiring & Evaluating Marketing Agencies** — 470 queries

---

## Segmentation & ABM
*ICP targeting and ABM strategy*

- [ ] **B2B Segmentation, Targeting, and Personas** — 137 queries
- [x] **Account-Based Marketing Strategy & Alignment** — 114 queries

---

## Social Media & Digital
*Supporting content category — lower priority for TSC*

- [ ] **B2B Social Media Marketing Strategies** — 894 queries
- [ ] **B2B Social and Channel Effectiveness** — 354 queries

---

## B2B Sales
*Adjacent — relevant but not core TSC territory*

- [ ] **B2B Sales Fundamentals and Strategy** — 458 queries
- [ ] **B2B Sales Strategy and Training** — 385 queries

---

## Notes for Import

Once you've selected your clusters, the import script will:
1. Pull up to **50 queries per cluster** (highest coverage score first)
2. Deduplicate against existing TSC `query_coverage` entries
3. Set `coverageScore: 0` so the seeder picks them up immediately
4. Skip any query containing blacklisted terms (leadership gap, fractional CMO)

The daily pipeline caps mean even with 500+ new queries loaded, content generates at a controlled pace (3 pieces/day currently, expandable).
