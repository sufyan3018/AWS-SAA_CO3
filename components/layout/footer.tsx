import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="border-t border-border px-6 py-6">
      <p className="text-center text-xs text-muted-foreground">
        Built by <span className="font-medium text-foreground">{siteConfig.author}</span>
      </p>
    </footer>
  );
}
