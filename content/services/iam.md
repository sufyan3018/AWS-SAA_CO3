---
title: IAM
slug: iam
category: Identity & Security
priority: High
order: 1
description: Securely control who (authentication) can access AWS resources and what (authorization) they're allowed to do.
---

# AWS SAA Notes

## 1. Purpose

AWS Identity and Access Management (IAM) is a **global** AWS service that enables you to securely control who (**authentication**) can access AWS resources and what (**authorization**) actions they are allowed to perform.

**Problems IAM solves:**

- Secure access to AWS resources
- Enforce the Principle of Least Privilege
- Eliminate sharing of AWS account credentials
- Provide temporary credentials through IAM Roles

> **Exam keyword:** Authentication + Authorization

## 2. How It Works

IAM consists of four main components.

**IAM User** — a permanent identity for a person or application requiring long-term access. Can have a console password, access keys (CLI/SDK/API), and attached policies.

```
Developer Alice
     │
 IAM User
```

**IAM Group** — a collection of IAM Users. Permissions are assigned once to the group and inherited by all members.

```
Developers Group
      │
 ├── Alice
 ├── Bob
 └── Charlie
```

Note: groups contain only users, groups cannot contain other groups, and a user can belong to multiple groups.

**IAM Role** — an identity that provides *temporary* security credentials. Unlike users, roles do not have passwords or long-term access keys. Roles are assumed by EC2, Lambda, ECS tasks, cross-account users, and federated users.

```
EC2 Instance
      │
 Assume Role
      │
Access S3 Bucket
```

AWS automatically provides temporary credentials once a role is assumed.

**IAM Policy** — a JSON document that defines permissions:

```
{
  "Version":"2012-10-17",
  "Statement":[
    {
      "Effect":"Allow",
      "Action":"s3:GetObject",
      "Resource":"arn:aws:s3:::my-bucket/*"
    }
  ]
}
```

**Permission evaluation order:** Default (Implicit Deny) → is there an Allow policy? → if yes, is there an Explicit Deny? → Explicit Deny found = **DENY**; none found = **ALLOW**.

> **Rule to remember:** Explicit Deny ALWAYS wins. This is one of the most frequently tested IAM concepts.

## 3. Architecture

```
             IAM
      ┌───────────────┐
      │ Users         │
      │ Groups        │
      │ Roles         │
      │ Policies      │
      └──────┬────────┘
             │
     Permission Evaluation
             │
             ▼
 ┌─────────────────────────┐
 │ S3 │ EC2 │ RDS │ Lambda │
 └─────────────────────────┘
```

**Common integrations:**

| Service | IAM Usage |
|---|---|
| EC2 | IAM Role |
| Lambda | Execution Role |
| ECS | Task Role |
| CloudFormation | Service Role |
| S3 | User/Role Policies |
| RDS | IAM Database Authentication (supported engines) |

## 4. Key Features

- **Global service** — IAM is global, not regional.
- **Fine-grained permissions** at the service, resource, and action level (e.g. `s3:GetObject` instead of `s3:*`).
- **Temporary credentials** via IAM Roles — automatically rotated, more secure than access keys, nothing stored in application code.
- **Multi-Factor Authentication (MFA)** — supports authenticator apps, hardware keys, and FIDO security keys. Strongly recommended.
- **Password policies** — enforce minimum length, complexity, expiration, and reuse prevention.
- **Credential reports** — a downloadable report of password status, MFA status, last login, and access key age, used for audits.
- **Access Advisor** — shows which services an identity can access and when it last used them, useful for trimming excessive permissions.

## 5. When to Use It

Use IAM whenever you need to:

- Manage AWS users
- Secure AWS resources
- Grant EC2 access to S3
- Give Lambda permissions
- Enable CLI access
- Implement least privilege
- Provide cross-account access through roles

## 6. When NOT to Use It

Don't use IAM when another AWS service better fits the need:

| Requirement | Better Service |
|---|---|
| Single sign-on across multiple AWS accounts | IAM Identity Center |
| Store database passwords | Secrets Manager |
| Encrypt data with managed keys | KMS |
| User authentication for applications | Amazon Cognito |

## 7. Comparison with Similar Services

| Service | Purpose | Best For |
|---|---|---|
| IAM | AWS permissions | Users, Roles, Policies |
| IAM Identity Center | Workforce SSO | Employees accessing multiple AWS accounts |
| Amazon Cognito | Customer identity | Web & mobile app users |
| AWS KMS | Encryption keys | Managing cryptographic keys |
| AWS Secrets Manager | Secrets storage | Passwords, API keys, tokens |

### IAM vs. IAM Identity Center

| IAM | IAM Identity Center |
|---|---|
| Manages AWS Users, Groups, Roles, and Policies | Provides Single Sign-On (SSO) for workforce users |
| Primarily for AWS account access | Primarily for accessing multiple AWS accounts and business applications |
| Users are created inside IAM | Users can come from an external identity provider (Microsoft Entra ID, Okta, Google Workspace, Active Directory) |
| Best for small environments or programmatic access | Best for organizations with multiple AWS accounts |
| Uses IAM Policies | Uses Permission Sets (which create IAM Roles in target accounts) |

**When to choose:** need to manage AWS users directly → **IAM**. Need employee SSO across multiple AWS accounts → **IAM Identity Center**.

### IAM vs. Amazon Cognito

| IAM | Amazon Cognito |
|---|---|
| For AWS administrators and AWS resources | For application end users |
| Controls access to AWS resources | Handles customer sign-up, sign-in, and authentication |
| Not designed for mobile or web application users | Designed for mobile and web applications |
| Uses IAM Users and Roles | Uses User Pools and Identity Pools |

**When to choose:** employees or administrators accessing AWS → **IAM**. Customers logging into your application → **Amazon Cognito**.

### IAM vs. AWS Secrets Manager

| IAM | AWS Secrets Manager |
|---|---|
| Controls permissions | Stores sensitive credentials |
| Determines who can access resources | Stores passwords, API keys, OAuth tokens |
| Uses Policies and Roles | Uses AWS KMS for encryption |

**When to choose:** need access control → **IAM**. Need to securely store passwords or API keys → **AWS Secrets Manager**.

### IAM vs. AWS KMS

| IAM | AWS KMS |
|---|---|
| Identity and access management | Encryption key management |
| Controls who can access resources | Controls encryption keys |
| Uses Policies | Uses Key Policies and IAM Policies |

**When to choose:** who can access S3 → **IAM**. How should S3 objects be encrypted → **AWS KMS**.

### Exam Decision Guide

| If the Question Says... | Choose |
|---|---|
| Give an EC2 instance access to S3 | IAM Role |
| Employee needs access to multiple AWS accounts | IAM Identity Center |
| Customer logs into a mobile application | Amazon Cognito |
| Store database passwords securely | AWS Secrets Manager |
| Encrypt an EBS volume | AWS KMS |
| Allow developers read-only access to S3 | IAM Policy |
| Multiple developers need identical permissions | IAM Group |
| Temporary credentials are required | IAM Role |

Read the scenario carefully — the distinction between "employee," "customer," "AWS service," and "application" usually determines the correct answer.

## 8. Real World Example

A company has 20 developers, 5 database administrators, and 3 security engineers, plus an application running on EC2 that needs access to an S3 bucket — with a security requirement that prohibits storing AWS access keys on servers.

**Solution:**

1. Create separate IAM Groups: `Developers`, `DBAdmins`, `Security`.
2. Attach least-privilege policies to each group.
3. Assign users to the appropriate groups.
4. Create an IAM Role with permission to access the S3 bucket, and attach it to the EC2 instance instead of storing access keys.
5. Enable MFA for all users.

**Benefits:** no long-term credentials stored on the server, permissions are centrally managed, onboarding new developers is easier, and the setup follows AWS security best practices.

## 9. Pricing Basics

IAM is provided at **no additional cost**. There is no charge for creating users, groups, roles, or policies — you only pay for the AWS resources those identities access.

> **Exam tip:** IAM itself is free.

## 10. SAA-C03 Exam Tips

- IAM is a **Global** service.
- The root user has unrestricted permissions — create IAM users instead of using the root user daily.
- Use **IAM Roles** for AWS services (EC2, Lambda, ECS) instead of long-term access keys.
- Follow the **Principle of Least Privilege**.
- Use **Groups** to assign common permissions to multiple users.
- Roles use **temporary** credentials, issued and rotated automatically.
- Enable **MFA**, especially for the root user.
- Rotate access keys regularly if they're required at all.
- IAM evaluates all applicable policies before making an authorization decision, and **Explicit Deny always overrides Allow**.
- Use managed policies where appropriate to simplify administration.

## 11. Common Exam Traps

- **Using access keys on EC2** — wrong: create an IAM user and store its access keys on the instance. Correct: attach an **IAM Role** to the EC2 instance.
- **Confusing IAM with IAM Identity Center** — IAM manages permissions within AWS accounts and is used by users/roles/services; IAM Identity Center provides centralized SSO for human users across *multiple* AWS accounts.
- **Forgetting IAM is Global** — it is not tied to a Region.
- **Ignoring Explicit Deny** — even if ten policies allow an action, one Explicit Deny results in Access Denied.
- **Using the root user for daily tasks** — AWS recommends enabling MFA on the root user and using it only for account-level tasks; perform daily administration with IAM users or federated identities.
- **Assigning permissions individually** — wrong: attach the same policy to every user one by one. Correct: create an IAM Group and attach the policy to the group.
- **Hardcoding AWS credentials** — never store access keys in source code, Git repositories, configuration files, or on EC2 instances; use IAM Roles instead.

## 12. Frequently Asked Exam Scenarios

**Q: An EC2 instance must upload files to an S3 bucket.**
A: Attach an IAM Role with `s3:PutObject` permission to the EC2 instance.

**Q: A Lambda function needs to write logs.**
A: Assign an execution role with CloudWatch Logs permissions.

**Q: Fifty developers require identical permissions.**
A: Create an IAM Group and attach the required policy.

**Q: An employee should have read-only access to S3 but must never delete objects.**
A: Allow `s3:GetObject` and explicitly deny delete actions in the policy design.

**Q: A company has multiple AWS accounts and employees need one login to access all of them.**
A: Use IAM Identity Center — not individual IAM users duplicated in every account.

**Q: An application requires database credentials.**
A: Store the credentials in AWS Secrets Manager and control access to them using IAM.

**Q: A security audit requires blocking access to an S3 bucket for a specific user, regardless of their existing permissions.**
A: Apply an Explicit Deny policy — it overrides any Allow.

## 13. Summary

| Topic | Key Point |
|---|---|
| Purpose | Control authentication and authorization in AWS |
| Scope | Global service |
| Core Components | Users, Groups, Roles, Policies |
| Best Practice | Least privilege, and IAM Roles instead of long-term access keys |
| Pricing | Free |
| Most Tested Concept | Explicit Deny overrides Allow |
| Common Trap | Using IAM users/access keys where a Role or IAM Identity Center is the better choice |

**Memory tip:** IAM answers one question — *"Who can do what in AWS?"*

- **IAM User** → a person or application with long-term credentials.
- **IAM Group** → a collection of users with shared permissions.
- **IAM Role** → temporary credentials for AWS services, users, or cross-account access.
- **IAM Policy** → the permission rules, written in JSON.

Quick cheat sheet: need access control → IAM. Need temporary credentials → IAM Role. Need permissions for multiple users → IAM Group. Need employee SSO → IAM Identity Center. Need customer authentication → Amazon Cognito. Need to store passwords → AWS Secrets Manager. Need encryption keys → AWS KMS.

## Revision Checklist

- [ ] What is the difference between an IAM User, Group, Role, and Policy?
- [ ] Why are IAM Roles preferred over access keys?
- [ ] Why is IAM considered a global service?
- [ ] How does AWS evaluate permissions (Implicit Deny → Allow → Explicit Deny)?
- [ ] When should you use IAM vs. IAM Identity Center vs. Cognito?
- [ ] Why is the Principle of Least Privilege important?
- [ ] How do IAM Groups simplify permission management?
- [ ] What are common IAM mistakes in AWS architecture?
