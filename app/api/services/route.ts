import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { siteConfig } from "@/config/site";
import { validateServiceMarkdown } from "@/lib/validate-service";

const CONTENT_DIR = path.join(process.cwd(), siteConfig.contentDir);

interface CreateServiceBody {
  raw: string;
  overwrite?: boolean;
}

export async function POST(request: Request) {
  let body: CreateServiceBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, errors: ["Invalid request body."] }, { status: 400 });
  }

  const { raw, overwrite = false } = body;
  if (typeof raw !== "string") {
    return NextResponse.json({ ok: false, errors: ["Missing `raw` markdown content."] }, { status: 400 });
  }

  const result = validateServiceMarkdown(raw);
  if (!result.ok || !result.parsed) {
    return NextResponse.json({ ok: false, errors: result.errors, warnings: result.warnings }, { status: 422 });
  }

  const { slug } = result.parsed;

  // Belt-and-braces: the slug pattern is already validated, but never trust
  // input that ends up in a filesystem path.
  const safeSlug = path.basename(slug);
  if (safeSlug !== slug || slug.includes("..") || slug.includes("/")) {
    return NextResponse.json({ ok: false, errors: ["Invalid slug."] }, { status: 400 });
  }

  if (!fs.existsSync(CONTENT_DIR)) {
    fs.mkdirSync(CONTENT_DIR, { recursive: true });
  }

  const filePath = path.join(CONTENT_DIR, `${safeSlug}.md`);
  const alreadyExists = fs.existsSync(filePath);

  if (alreadyExists && !overwrite) {
    return NextResponse.json(
      { ok: false, exists: true, errors: [`A service with slug "${safeSlug}" already exists.`] },
      { status: 409 }
    );
  }

  try {
    fs.writeFileSync(filePath, raw.trimStart() + (raw.endsWith("\n") ? "" : "\n"), "utf8");
  } catch {
    return NextResponse.json({ ok: false, errors: ["Failed to write the file to disk."] }, { status: 500 });
  }

  return NextResponse.json({ ok: true, slug: safeSlug, created: !alreadyExists });
}
