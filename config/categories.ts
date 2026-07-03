import type { CategoryConfig, CategoryName } from "@/types";

/**
 * Canonical ordered list of categories. Order here controls the order
 * categories appear in the sidebar and dashboard grid.
 */
export const CATEGORIES: CategoryConfig[] = [
  {
    name: "Identity & Security",
    description: "IAM, KMS, and access control services",
    icon: "ShieldCheck",
  },
  {
    name: "Compute",
    description: "EC2, Lambda, containers, and auto scaling",
    icon: "Cpu",
  },
  {
    name: "Storage",
    description: "S3, EBS, EFS, and storage gateways",
    icon: "HardDrive",
  },
  {
    name: "Databases",
    description: "RDS, DynamoDB, Aurora, and caching",
    icon: "Database",
  },
  {
    name: "Networking",
    description: "VPC, Route 53, CloudFront, and load balancing",
    icon: "Network",
  },
  {
    name: "Monitoring & Governance",
    description: "CloudWatch, CloudTrail, Config, and Organizations",
    icon: "Activity",
  },
  {
    name: "Messaging & Integration",
    description: "SQS, SNS, EventBridge, and Step Functions",
    icon: "Waypoints",
  },
  {
    name: "Medium Priority",
    description: "Services worth knowing well before exam day",
    icon: "CircleDot",
  },
  {
    name: "Low Priority",
    description: "Lighter review — good for a final pass",
    icon: "CircleDashed",
  },
];

export const CATEGORY_NAMES: CategoryName[] = CATEGORIES.map((c) => c.name);

export function getCategoryConfig(name: string): CategoryConfig | undefined {
  return CATEGORIES.find((c) => c.name === name);
}
