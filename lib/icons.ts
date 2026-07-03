import {
  ShieldCheck,
  Cpu,
  HardDrive,
  Database,
  Network,
  Activity,
  Waypoints,
  CircleDot,
  CircleDashed,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  ShieldCheck,
  Cpu,
  HardDrive,
  Database,
  Network,
  Activity,
  Waypoints,
  CircleDot,
  CircleDashed,
};

export function getIcon(name: string): LucideIcon {
  return ICON_MAP[name] ?? CircleDot;
}
