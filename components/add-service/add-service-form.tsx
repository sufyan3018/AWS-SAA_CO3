"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Loader2,
  Copy,
  Check,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { validateServiceFields, assembleServiceFile } from "@/lib/validate-service";
import { CANONICAL_SECTIONS } from "@/lib/normalize-notes";
import { CATEGORY_NAMES } from "@/config/categories";
import { slugify } from "@/lib/utils";
import type { Priority } from "@/types";

const PRIORITIES: Priority[] = ["High", "Medium", "Low"];

const NOTES_TEMPLATE = CANONICAL_SECTIONS.map((s) =>
  s.number ? `${s.number}. ${s.title}\n\n` : `${s.title}\n- \n`
).join("\n");

type Status = "idle" | "submitting" | "conflict" | "success";

function selectClasses() {
  return "h-9 w-full rounded-md border border-border bg-background px-2.5 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring";
}

function inputClasses() {
  return "h-9 w-full rounded-md border border-border bg-background px-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring";
}

export function AddServiceForm() {
  const router = useRouter();

  const [title, setTitle] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [slugTouched, setSlugTouched] = React.useState(false);
  const [category, setCategory] = React.useState<string>(CATEGORY_NAMES[0]);
  const [priority, setPriority] = React.useState<Priority>("High");
  const [order, setOrder] = React.useState("1");
  const [description, setDescription] = React.useState("");
  const [notes, setNotes] = React.useState("");

  const [status, setStatus] = React.useState<Status>("idle");
  const [serverErrors, setServerErrors] = React.useState<string[]>([]);
  const [copied, setCopied] = React.useState(false);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  };

  const fieldErrors = React.useMemo(
    () => validateServiceFields({ title, slug, category, priority, order }),
    [title, slug, category, priority, order]
  );

  const notesResult = React.useMemo(() => {
    if (!notes.trim()) return null;
    return assembleServiceFile(
      { title: title || "Untitled", slug: slug || "untitled", category, priority, order },
      notes
    );
  }, [title, slug, category, priority, order, notes]);

  const hasNotes = notes.trim().length > 0;
  const canSubmit = fieldErrors.length === 0 && hasNotes;

  const submit = async (overwrite: boolean) => {
    if (!canSubmit) return;
    setStatus("submitting");
    setServerErrors([]);

    const { fileContent } = assembleServiceFile(
      { title, slug, category, priority, order, description },
      notes
    );

    try {
      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ raw: fileContent, overwrite }),
      });
      const data = await res.json();

      if (res.status === 409 && data.exists) {
        setStatus("conflict");
        return;
      }
      if (!res.ok || !data.ok) {
        setServerErrors(data.errors ?? ["Something went wrong saving the file."]);
        setStatus("idle");
        return;
      }

      setStatus("success");
      router.refresh();
      setTimeout(() => router.push(`/services/${data.slug}`), 700);
    } catch {
      setServerErrors(["Couldn't reach the server. Is the dev server still running?"]);
      setStatus("idle");
    }
  };

  const copyTemplate = async () => {
    try {
      await navigator.clipboard.writeText(NOTES_TEMPLATE);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
      <div className="flex flex-col gap-4">
        <Card>
          <CardContent className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-xs font-medium text-muted-foreground">Title</label>
              <input
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Amazon EC2"
                className={inputClasses()}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Slug <span className="text-muted-foreground/60">(URL, editable)</span>
              </label>
              <input
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setSlugTouched(true);
                }}
                placeholder="ec2"
                spellCheck={false}
                className={inputClasses() + " font-mono"}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Order</label>
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                className={inputClasses()}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={selectClasses()}
              >
                {CATEGORY_NAMES.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className={selectClasses()}
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-xs font-medium text-muted-foreground">
                Description <span className="text-muted-foreground/60">(optional)</span>
              </label>
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="One sentence shown on the service page"
                className={inputClasses()}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Paste your notes — any format, headings don&apos;t need # symbols
              </p>
              <button
                type="button"
                onClick={copyTemplate}
                className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy section skeleton"}
              </button>
            </div>
            <textarea
              value={notes}
              onChange={(e) => {
                setNotes(e.target.value);
                setStatus("idle");
                setServerErrors([]);
              }}
              placeholder={"1. Purpose\n...\n\n2. How It Works\n...\n\nRevision Checklist\n- ...\n\n(Paste any format — plain text headings, numbered or not, with or without # — we'll detect the sections automatically.)"}
              spellCheck={false}
              className="scrollbar-thin h-[480px] w-full resize-none bg-transparent p-4 font-mono text-[13px] leading-relaxed text-foreground outline-none placeholder:text-muted-foreground/50"
            />
          </CardContent>
        </Card>

        {status === "conflict" && (
          <div className="flex items-center justify-between gap-3 rounded-lg border border-accent/30 bg-accent-subtle px-4 py-3 text-sm">
            <span className="text-foreground">
              A service with slug <strong>{slug}</strong> already exists. Overwrite it?
            </span>
            <div className="flex shrink-0 gap-2">
              <Button size="sm" variant="outline" onClick={() => setStatus("idle")}>
                Cancel
              </Button>
              <Button size="sm" onClick={() => submit(true)}>
                Overwrite
              </Button>
            </div>
          </div>
        )}

        {status === "success" && (
          <div className="flex items-center gap-2 rounded-lg border border-success/30 bg-success-subtle px-4 py-3 text-sm text-success">
            <CheckCircle2 className="h-4 w-4" />
            Saved! Taking you to the new page…
          </div>
        )}

        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Written directly to{" "}
            <code className="rounded bg-muted px-1 py-0.5 font-mono">content/services/</code> —
            no database.
          </p>
          <Button
            onClick={() => submit(false)}
            disabled={!canSubmit || status === "submitting" || status === "success"}
          >
            {status === "submitting" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowRight className="h-4 w-4" />
            )}
            Save Service
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <Card>
          <CardContent className="p-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Detected Sections
            </p>
            {notesResult ? (
              <ul className="flex flex-col gap-1.5 text-sm">
                {CANONICAL_SECTIONS.map((section) => {
                  const found = notesResult.detected.includes(section.title);
                  return (
                    <li key={section.key} className="flex items-center gap-2">
                      {found ? (
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-success" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />
                      )}
                      <span className={found ? "text-foreground" : "text-muted-foreground"}>
                        {section.title}
                      </span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                Paste your notes to see which sections are detected.
              </p>
            )}
          </CardContent>
        </Card>

        {(fieldErrors.length > 0 || serverErrors.length > 0) && (
          <Card className="border-danger/30">
            <CardContent className="p-5">
              <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-danger">
                <XCircle className="h-3.5 w-3.5" />
                Fix before saving
              </p>
              <ul className="flex flex-col gap-1.5 text-sm text-foreground/85">
                {[...serverErrors, ...fieldErrors].map((err) => (
                  <li key={err} className="leading-snug">
                    {err}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {notesResult && notesResult.missing.length > 0 && (
          <Card className="border-accent/30">
            <CardContent className="p-5">
              <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-accent">
                <AlertTriangle className="h-3.5 w-3.5" />
                Sections not detected
              </p>
              <p className="mb-2 text-xs text-muted-foreground">
                These won&apos;t block saving, but check your paste if this looks wrong.
              </p>
              <ul className="flex flex-col gap-1 text-sm text-foreground/85">
                {notesResult.missing.map((title) => (
                  <li key={title} className="leading-snug">
                    {title}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
