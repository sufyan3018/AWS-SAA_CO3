# AWS SAA-C03 Learning Hub

A personal, file-based study companion for the **AWS Certified Solutions Architect – Associate (SAA-C03)** exam. No database, no auth, no backend — every note lives as a Markdown file, and all progress (completed services, bookmarks, recent history, revision checklists) is stored in your browser's LocalStorage.

Built by **Sufyan**.

---

## Tech Stack

- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS** + **shadcn/ui**-style primitives (Radix UI under the hood)
- **Framer Motion** for subtle animations
- **next-themes** for light/dark mode
- **react-markdown** + **remark-gfm** + **rehype-slug** + **rehype-autolink-headings** for content rendering
- **gray-matter** for frontmatter parsing, **reading-time** for reading-time estimates
- **cmdk** for the `⌘K` / `Ctrl+K` command palette
- **Lucide React** icons

No database. No Prisma/Firebase/Supabase/Clerk. No API routes. Content is read from the filesystem at build/request time via Node's `fs` module inside Server Components.

---

## Getting Started

Requires **Node.js 18.18+** (Node 20+ recommended).

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — it redirects straight to `/dashboard`.

### Other scripts

```bash
npm run build   # production build (static-generates every service page)
npm run start   # serve the production build
npm run lint    # ESLint
```

---

## Adding a New Service

### Option A — In the app (recommended)

Click **Add Service** in the sidebar (or go to `/add-service`).

1. Fill in **Title**, **Category**, **Priority**, **Order**, and optionally
   **Description**. Slug auto-fills from the title (editable).
2. Paste your notes into the big text box — **plain text is fine**. No YAML
   frontmatter, no `---` block, no `#`/`##` markdown symbols required.
   Sections are detected by their **title text** wherever they appear — e.g.
   a line that just says `Comparison with Similar Services`, or
   `7. Comparison with Similar Services`, or `## 7. Comparison with Similar
   Services` are all recognized the same way. The right panel shows which of
   the 14 sections were detected live as you type.
3. Click **Save Service**. The app builds the frontmatter from your form
   fields, converts the recognized section titles into clean markdown
   headings, converts checklist lines under "Revision Checklist" into
   interactive `- [ ]` items, and writes the finished file straight to
   `content/services/<slug>.md`. If that slug already exists you'll be asked
   to confirm before it's overwritten.

**What the detector recognizes:** Purpose, How It Works, Architecture, Key
Features, When to Use It, When NOT to Use It, Comparison with Similar
Services, Real World Example, Pricing Basics, SAA-C03 Exam Tips, Common Exam
Traps, Frequently Asked Exam Scenarios, Summary, and Revision Checklist —
matched case-insensitively regardless of numbering, `#` symbols, or
decorative emoji (⭐ 📌 ✅ ❌, etc.) in front of them. Missing sections are
flagged as warnings but don't block saving.

**Known limitations:**
- Paste **one clean set of notes at a time**. If you paste two drafts of the
  same document concatenated together, their content gets merged under the
  matching headings rather than kept separate — fine for "an expanded second
  draft," confusing for genuinely unrelated content.
- Tables only render as real tables if they use markdown pipe syntax
  (`| Col A | Col B |`). Tab-separated text copied from a rendered
  Word/Notion table will paste as plain text, not a table — reformat it with
  `|` characters if you want it to render as one.

This works by posting the assembled file to a small local API route
(`app/api/services/route.ts`) that writes it to disk with
`fs.writeFileSync` — still no database, it's just doing the same file write
you'd otherwise do by hand in an editor. It only works while the Next.js
server is running (`npm run dev` or `npm run start`), which is the app's
normal mode of use.

### Option B — By hand

1. Create a new Markdown file in `content/services/`, e.g. `content/services/ec2.md`.
2. Start it with frontmatter matching this exact shape:

   ```yaml
   ---
   title: EC2
   slug: ec2
   category: Compute
   priority: High
   order: 1
   description: One-sentence summary shown on the service page.
   ---
   ```

   - `category` must be one of the nine categories defined in `config/categories.ts`
     (Identity & Security, Compute, Storage, Databases, Networking,
     Monitoring & Governance, Messaging & Integration, Medium Priority, Low Priority).
   - `order` controls position within that category (previous/next navigation
     and the sidebar both use `category` then `order`).
   - `slug` must be unique and match the filename (used for the URL,
     `/services/<slug>`, and for LocalStorage progress keys).

3. Below the frontmatter, use this exact 13-section format (the app detects
   these headings automatically to drive callouts, the checklist, and the
   table of contents):

   ```markdown
   # AWS SAA Notes

   ## 1. Purpose
   ## 2. How It Works
   ## 3. Architecture
   ## 4. Key Features
   ## 5. When to Use It
   ## 6. When NOT to Use It
   ## 7. Comparison with Similar Services
   ## 8. Real World Example
   ## 9. Pricing Basics
   ## 10. SAA-C03 Exam Tips
   ## 11. Common Exam Traps
   ## 12. Frequently Asked Exam Scenarios
   ## 13. Summary
   ## Revision Checklist
   ```

   - Any heading containing **"Exam Tip"** renders as a blue callout.
   - Any heading containing **"Common Exam Trap"** renders as a red warning callout.
   - The **"Revision Checklist"** heading renders its `- [ ]` list items as an
     interactive, persisted checklist.
   - Fenced code blocks with no language (or `text`/`plaintext`/`ascii`) render
     as monospace "Architecture" panels; any other language renders as a
     regular code panel with a copy button.

4. That's it — no code changes needed. The sidebar, dashboard category grid,
   search index, table of contents, and previous/next navigation all pick up
   the new file automatically.

One fully-written example ships with the app: `content/services/iam.md`.
Everything else you add — by either option above.

---

## How Progress Is Stored

Everything lives under a single LocalStorage key, `aws-saa-hub:progress`:

```json
{
  "completed": ["iam", "kms"],
  "bookmarks": ["iam-identity-center"],
  "recent": ["kms", "iam"],
  "lastVisited": "kms"
}
```

Revision checklist checkbox state is stored separately, per service, under
`aws-saa-hub:checklist:<slug>`.

Clearing your browser's site data for this app resets all progress — there is
no server-side record of anything.

---

## Project Structure

```
app/
  layout.tsx                 Root layout: fonts, theme + progress providers
  page.tsx                   Redirects "/" → "/dashboard"
  not-found.tsx               Global 404
  api/services/route.ts       POST endpoint that writes a new service .md file to disk
  (app)/
    layout.tsx                Fetches content once (dynamic, always fresh), renders the AppShell
    dashboard/page.tsx         Dashboard route
    add-service/page.tsx       Paste-and-save "Add Service" page
    services/[slug]/page.tsx   Service detail route

components/
  layout/          Sidebar, Header, Footer, AppShell, ThemeToggle
  dashboard/        Progress overview, category grid, continue learning, etc.
  service/          Service header, badges, bookmark/complete buttons, prev/next
  markdown/          Markdown renderer, section callouts, code panel, checklist
  toc/               Sticky, scroll-spy table of contents
  search/            ⌘K command palette
  add-service/        The paste-markdown form used by /add-service
  providers/         Theme provider, LocalStorage progress provider
  ui/                Reusable primitives (button, badge, card, dialog, ...)

lib/
  content.ts          Reads content/services/*.md, sorts, computes adjacency
  markdown-sections.ts Splits a service's body into H2-bounded sections
  toc.ts               Extracts heading IDs (must match the renderer exactly)
  normalize-notes.ts   Converts loosely-formatted pasted notes into canonical "## N. Title" markdown
  validate-service.ts  Form-field validation + final assembled-file check (form + API route)
  icons.ts             Maps category icon names to Lucide components
  utils.ts             cn(), slugify(), formatReadingTime(), clamp()

config/
  categories.ts        The 9 sidebar categories (name, description, icon)
  site.ts               Site name, author, exam name, content directory

content/services/       One Markdown file per AWS service
types/index.ts           Shared TypeScript types
```

---

## Notes

- **No servers, no secrets.** Everything runs locally; `npm run build` produces
  a fully static export of every service page.
- **Extending without a database** is intentional — add a `.md` file, and the
  whole app (sidebar, dashboard, search, TOC, prev/next) updates itself.
