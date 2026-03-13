import 'dotenv/config';
import { MongoClient } from 'mongodb';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load .env.local manually since dotenv/config picks up .env
import { config } from 'dotenv';
config({ path: '.env.local' });

const EM_DASH = /—/g;
const FORBIDDEN_WORDS = /\b(delve|tapestry|realm|foster|leverage|revolutionize|groundbreaking|game-changer|game-changing|cutting-edge|state-of-the-art|robust|supercharge|paradigm|plethora|myriad)\b/gi;
const FORBIDDEN_PHRASES = /(in today's fast-paced world|in conclusion|here's the kicker|at the end of the day|firstly,)/gi;
const COLON_IN_HEADING = /^(#{1,3}\s+[^\n:]+:[^\n]+)/gm;

function check(text) {
  if (!text || typeof text !== 'string') return [];
  const hits = [];
  const emCount = (text.match(EM_DASH) || []).length;
  if (emCount) hits.push({ rule: 'em-dash', count: emCount });

  const wordRe = /\b(delve|tapestry|realm|foster|leverage|revolutionize|groundbreaking|game-changer|game-changing|cutting-edge|state-of-the-art|robust|supercharge|paradigm|plethora|myriad)\b/gi;
  let m;
  const foundWords = new Set();
  while ((m = wordRe.exec(text)) !== null) foundWords.add(m[0].toLowerCase());
  if (foundWords.size) hits.push({ rule: 'forbidden-word', words: [...foundWords] });

  const phraseRe = /(in today's fast-paced world|in conclusion|here's the kicker|at the end of the day|firstly,)/gi;
  const foundPhrases = new Set();
  while ((m = phraseRe.exec(text)) !== null) foundPhrases.add(m[0].toLowerCase());
  if (foundPhrases.size) hits.push({ rule: 'forbidden-phrase', phrases: [...foundPhrases] });

  const headingRe = /^(#{1,3} [^\n]+:[^\n]+)/gm;
  const headings = [];
  while ((m = headingRe.exec(text)) !== null) headings.push(m[0].trim().substring(0, 80));
  if (headings.length) hits.push({ rule: 'colon-in-heading', headings });

  return hits;
}

function checkDoc(doc, fields) {
  const all = [];
  for (const f of fields) {
    const val = doc[f];
    if (!val) continue;
    const text = Array.isArray(val) ? val.join(' ') : String(val);
    const hits = check(text);
    if (hits.length) all.push({ field: f, hits });
  }
  return all;
}

const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();
const db = client.db('tsc');

const collections = [
  { name: 'blog_posts',      idField: 'slug',           fields: ['title','body','excerpt','metaDescription'] },
  { name: 'glossary_terms',  idField: 'termId',         fields: ['term','shortDefinition','fullDefinition'] },
  { name: 'faq_items',       idField: 'faqId',          fields: ['question','answer'] },
  { name: 'comparisons',     idField: 'comparisonId',   fields: ['title','introduction','verdict'] },
  { name: 'expert_qa',       idField: 'qaId',           fields: ['question','answer','context'] },
  { name: 'news_items',      idField: 'newsId',         fields: ['title','summary','body'] },
  { name: 'industry_briefs', idField: 'briefId',        fields: ['title','summary','body','keyTakeaways'] },
  { name: 'tools',           idField: 'toolId',         fields: ['title','description','body'] },
  { name: 'infographics',    idField: 'infographicId',  fields: ['title','description','body'] },
];

const results = {};

for (const col of collections) {
  const docs = await db.collection(col.name).find({ status: 'published' }).toArray();
  const colHits = [];
  for (const doc of docs) {
    const issues = checkDoc(doc, col.fields);
    if (issues.length) colHits.push({ id: doc[col.idField], issues });
  }
  if (colHits.length) results[col.name] = colHits;
}

console.log(JSON.stringify(results, null, 2));
await client.close();
