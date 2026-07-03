---
title: "AWS IAM Identity Center"
slug: aws-iam-identity-center
category: Identity & Security
priority: High
order: 1
---

# AWS SAA Notes

## 1. Purpose

**AWS IAM Identity Center** (formerly **AWS Single Sign-On (AWS SSO)**) is a managed service that provides **centralized Single Sign-On (SSO)** for workforce users across **multiple AWS accounts** and supported business applications.

Instead of creating separate IAM Users in every AWS account, employees authenticate once and receive temporary access to the AWS accounts and applications they are authorized to use.

> **Exam Keyword:** Workforce Single Sign-On (SSO)

---

## 2. How It Works

IAM Identity Center centralizes authentication and authorization for employees.

Instead of managing users in every AWS account, users authenticate once and are granted access using **Permission Sets**, which create IAM Roles in target AWS accounts.

### Authentication Flow


```text id="vsm4tk"
Employee
    │
Login
    │
IAM Identity Center
    │
Authentication
    │
Permission Set
    │
IAM Role
    │
AWS Account
```

---

### Permission Sets


A **Permission Set** is a collection of permissions defined in IAM Identity Center.

When assigned to an AWS account, IAM Identity Center automatically creates the required IAM Role in that account.

Example:

```text id="hkg82d"
Developer Permission Set
        │
──────────────────────────
AmazonEC2ReadOnly
AmazonS3ReadOnly
CloudWatchReadOnly
──────────────────────────
        │
Automatically Creates
        │
IAM Role in Target Account
```

> **Exam Tip:** Permission Sets are **not** IAM Policies. They use IAM Policies internally but are managed centrally through IAM Identity Center.

---

### Identity Sources


IAM Identity Center supports multiple identity sources.

Examples:

* Built-in Identity Store
* Microsoft Entra ID (Azure AD)
* Okta
* Google Workspace
* Active Directory
* Other SAML 2.0 Identity Providers

Example:

```text id="gtn7uv"
Microsoft Entra ID
          │
Authenticate User
          │
IAM Identity Center
          │
AWS Accounts
```

---

### Temporary Credentials


After successful authentication:

* IAM Identity Center assumes an IAM Role.
* AWS issues temporary credentials.
* No long-term access keys are stored or distributed.

---

## 3. Architecture

Typical architecture:

```text id="pn9fwa"
                Employee
                    │
             Single Sign-On
                    │
        IAM Identity Center
                    │
          Permission Set
                    │
      Automatically Creates
              IAM Role
                    │
    ┌─────────┼──────────┐
    │         │          │
AWS Account AWS Account AWS Account
```

---

### Integration with AWS Organizations


The most common deployment is:

```text id="tr1mne"
AWS Organizations
        │
Multiple AWS Accounts
        │
IAM Identity Center
        │
Employees
```

Benefits:

* Centralized user management.
* Centralized permission management.
* Single sign-on across all AWS accounts.
* Easier onboarding and offboarding.

> **Exam Tip:** IAM Identity Center is commonly used **together** with AWS Organizations.

---


### Use IAM Identity Center for Human Users


Use IAM Identity Center for:

* Employees
* Administrators
* Developers
* Support engineers

Do **not** use IAM Identity Center for AWS services like EC2, Lambda, or ECS.

Those services should use **IAM Roles**.

---

### Use Permission Sets Instead of Individual IAM Users


Instead of:

Creating IAM Users in every AWS account

Use:

* One Permission Set
* Assign users or groups
* IAM Identity Center provisions the required IAM Roles

This greatly simplifies administration.

---

### Integrate with Existing Identity Providers


If your organization already uses:

* Microsoft Entra ID
* Okta
* Google Workspace
* Active Directory

Integrate them with IAM Identity Center instead of creating duplicate user accounts.

---

### Use Temporary Credentials


IAM Identity Center provides temporary credentials after login.

Benefits:

* Better security
* No long-term access keys
* Automatic credential expiration
* Easier compliance

---

### Follow the Principle of Least Privilege


Create Permission Sets that grant only the permissions users need.

Example:

Developer Permission Set:

```text id="txo3dq"
AmazonEC2ReadOnly
AmazonS3ReadOnly
```

Administrator Permission Set:

```text id="4mjlwm"
AdministratorAccess
```

Assign permissions based on job responsibilities.

---

## 4. Key Features

### Single Sign-On (SSO)


Employees authenticate once and access:

* Multiple AWS accounts
* AWS applications
* Supported third-party applications

---

### Permission Sets


Centralized permission management.

Automatically creates IAM Roles in assigned AWS accounts.

---

### External Identity Provider Integration


Supports:

* Microsoft Entra ID
* Okta
* Google Workspace
* Active Directory
* SAML 2.0 providers

---

### Multi-Account Access


Works seamlessly with AWS Organizations.

Ideal for enterprises with many AWS accounts.

---

### Temporary Credentials


Users receive temporary AWS credentials after authentication.

No long-term access keys are required.

---

### Centralized User Management


Manage users, groups, and permissions from one location instead of configuring each AWS account separately.

---

### When to Use


Use IAM Identity Center when:

* Employees need access to multiple AWS accounts.
* Your organization uses AWS Organizations.
* You require centralized workforce authentication.
* Users should authenticate using Microsoft Entra ID, Okta, Google Workspace, or Active Directory.
* You want to eliminate IAM Users across multiple AWS accounts.
* You want Single Sign-On for AWS and supported business applications.

---

### When NOT to Use


| Requirement                                 | Better AWS Service  |
| ------------------------------------------- | ------------------- |
| Customer authentication for web/mobile apps | Amazon Cognito      |
| EC2, Lambda, or ECS permissions             | IAM Roles           |
| Manage users within a single AWS account    | IAM                 |
| Store passwords or API keys                 | AWS Secrets Manager |
| Manage encryption keys                      | AWS KMS             |

---

**Next:** Part 2 covers:

## 7. Comparison with Similar Services

* Exam Decision Guide

Understanding the differences between IAM Identity Center and other identity services is one of the most frequently tested topics in the SAA-C03 exam.

---

### IAM Identity Center vs IAM


| IAM Identity Center                                | IAM                                                 |
| -------------------------------------------------- | --------------------------------------------------- |
| Workforce Single Sign-On (SSO)                     | Identity and access management for AWS              |
| Best for multiple AWS accounts                     | Best for a single AWS account or service identities |
| Uses Permission Sets                               | Uses IAM Policies                                   |
| Supports external Identity Providers               | Native AWS identities (Users, Groups, Roles)        |
| Creates IAM Roles automatically in target accounts | Roles are created and managed manually              |

### When to Choose


* **Employees need access to multiple AWS accounts?** → IAM Identity Center
* **Need to create an IAM Role for an EC2 instance?** → IAM

---

### IAM Identity Center vs Amazon Cognito


| IAM Identity Center     | Amazon Cognito                     |
| ----------------------- | ---------------------------------- |
| Employee authentication | Customer authentication            |
| Workforce SSO           | Web and mobile application users   |
| AWS account access      | Application login                  |
| Uses Permission Sets    | Uses User Pools and Identity Pools |

### When to Choose


* **Employees logging into AWS?** → IAM Identity Center
* **Customers logging into an application?** → Amazon Cognito

---

### IAM Identity Center vs AWS Directory Service


| IAM Identity Center                  | AWS Directory Service                    |
| ------------------------------------ | ---------------------------------------- |
| Single Sign-On service               | Managed Microsoft Active Directory       |
| Provides centralized AWS access      | Provides Active Directory infrastructure |
| Integrates with external directories | Hosts or connects to Active Directory    |

### When to Choose


* **Centralized access to AWS accounts?** → IAM Identity Center
* **Need Microsoft Active Directory?** → AWS Directory Service

---

### IAM Identity Center vs AWS Organizations


| IAM Identity Center            | AWS Organizations               |
| ------------------------------ | ------------------------------- |
| Manages user access            | Manages AWS accounts            |
| Authentication & authorization | Account governance and billing  |
| Permission Sets                | Service Control Policies (SCPs) |

### When to Choose


* **Need employees to access AWS accounts?** → IAM Identity Center
* **Need to organize and govern multiple AWS accounts?** → AWS Organizations

> **Exam Tip:** These two services are commonly used **together**.

---

### Exam Decision Guide


| If the Question Says...                                     | Choose              |
| ----------------------------------------------------------- | ------------------- |
| Employees need Single Sign-On across multiple AWS accounts  | IAM Identity Center |
| Customers need to log into a mobile application             | Amazon Cognito      |
| EC2 needs access to S3                                      | IAM Role            |
| Developers need identical permissions in one AWS account    | IAM Group           |
| Company uses AWS Organizations and wants centralized access | IAM Identity Center |
| Integrate AWS login with Microsoft Entra ID or Okta         | IAM Identity Center |
| Organize multiple AWS accounts under one company            | AWS Organizations   |

> **Exam Tip:** If you see **employees**, **multiple AWS accounts**, **SSO**, or **Permission Sets**, IAM Identity Center is usually the correct answer.

---

## 8. Real World Example

### Scenario


A company has:

* 20 AWS accounts.
* 500 employees.
* Microsoft Entra ID as its corporate identity provider.
* A requirement for employees to sign in once and access only the AWS accounts assigned to them.

### Solution


1. Configure AWS Organizations.
2. Enable IAM Identity Center.
3. Connect IAM Identity Center to Microsoft Entra ID.
4. Create Permission Sets such as:

   * Administrator
   * Developer
   * ReadOnly
5. Assign users or groups to AWS accounts.

### Benefits


* One login for all AWS accounts.
* Centralized permission management.
* Temporary credentials.
* No IAM Users in every AWS account.
* Easier onboarding and offboarding.

---

## 9. Pricing Basics

IAM Identity Center itself is available **at no additional charge**.

You may incur costs for:

* External identity providers (depending on the provider).
* AWS resources accessed after login.

> **Exam Tip:** Similar to IAM, IAM Identity Center does not have a separate service charge.

---

## 10. SAA-C03 Exam Tips

* IAM Identity Center is the successor to **AWS Single Sign-On (AWS SSO)**.
* Designed for **workforce identities**, not customers.
* Works best with **AWS Organizations**.
* Uses **Permission Sets**, not IAM Policies directly.
* Creates IAM Roles automatically in target AWS accounts.
* Supports external identity providers using standards like SAML 2.0.
* Provides temporary credentials after successful authentication.

---

## 11. Common Exam Traps

### Trap 1: Using IAM Users Across Multiple AWS Accounts


❌ Wrong:

Create separate IAM Users in every AWS account.

✅ Correct:

Use IAM Identity Center with AWS Organizations.

---

### Trap 2: Confusing IAM Identity Center with Amazon Cognito


**IAM Identity Center**

* Employees
* AWS accounts
* Workforce SSO

**Amazon Cognito**

* Customers
* Applications
* Mobile and web login

---

### Trap 3: Confusing Permission Sets with IAM Policies


Permission Sets are defined in IAM Identity Center and automatically create IAM Roles in target accounts.

You generally don't assign IAM Policies directly to users in IAM Identity Center.

---

### Trap 4: Using IAM Identity Center for EC2 or Lambda Permissions


AWS services such as EC2, Lambda, and ECS should use **IAM Roles**.

IAM Identity Center is for human users.

---

### Trap 5: Forgetting AWS Organizations


Although IAM Identity Center can work in different setups, it is most commonly used with **AWS Organizations** for centralized account access.

---

### Trap 6: Assuming Users Receive Long-Term Credentials


IAM Identity Center issues **temporary credentials** after authentication.

No long-term access keys are distributed to users.

---

## 12. Frequently Asked Exam Scenarios

### Scenario 1


A company has 100 AWS accounts and wants employees to sign in once to access the accounts assigned to them.

**Answer:**

Use IAM Identity Center with AWS Organizations.

---

### Scenario 2


Employees authenticate using Microsoft Entra ID and require access to AWS.

**Answer:**

Integrate Microsoft Entra ID with IAM Identity Center.

---

### Scenario 3


A company wants centralized permission management across multiple AWS accounts.

**Answer:**

Create Permission Sets in IAM Identity Center and assign them to users or groups.

---

### Scenario 4


A mobile application needs customer authentication.

**Answer:**

Use Amazon Cognito, **not** IAM Identity Center.

---

### Scenario 5


An EC2 instance needs permission to read objects from Amazon S3.

**Answer:**

Attach an IAM Role to the EC2 instance, **not** IAM Identity Center.

---

## 13. Summary

| Topic               | Key Point                                                                       |
| ------------------- | ------------------------------------------------------------------------------- |
| Purpose             | Workforce Single Sign-On (SSO)                                                  |
| Best For            | Employees accessing AWS accounts                                                |
| Authentication      | Centralized through IAM Identity Center                                         |
| Authorization       | Permission Sets                                                                 |
| Credentials         | Temporary                                                                       |
| Integrates With     | AWS Organizations, Microsoft Entra ID, Okta, Google Workspace, Active Directory |
| Pricing             | No additional service charge                                                    |
| Most Tested Concept | IAM Identity Center vs IAM vs Cognito                                           |
| Common Trap         | Using Cognito or IAM Users instead of IAM Identity Center for employee SSO      |

---

## Revision Checklist

- [ ] Memory Tip


### AWS SAA-C03 Notes – Part 2: AWS IAM Identity Center (Part 2)


- [ ] 


- [ ] Before moving on, make sure you can answer:

- [ ] What problem does IAM Identity Center solve?
- [ ] What is the difference between IAM and IAM Identity Center?
- [ ] What is a Permission Set?
- [ ] How does IAM Identity Center work with AWS Organizations?
- [ ] Which external identity providers can integrate with IAM Identity Center?
- [ ] When should you use Cognito instead?
- [ ] Why does IAM Identity Center use temporary credentials?

- [ ] 

### Memory Tip


- [ ] Think of IAM Identity Center as answering this question:

- [ ] > **"How can employees securely access multiple AWS accounts with one login?"**

- [ ] Remember these associations:

- [ ] **IAM Identity Center** → Workforce SSO
- [ ] **Permission Set** → Defines permissions and creates IAM Roles
- [ ] **AWS Organizations** → Multi-account management
- [ ] **External IdP** → Microsoft Entra ID, Okta, Google Workspace, Active Directory
- [ ] **Temporary Credentials** → More secure than long-term access keys

### Quick Decision Cheat Sheet


- [ ] **Employee SSO?** → IAM Identity Center
- [ ] **Multiple AWS accounts?** → IAM Identity Center + AWS Organizations
- [ ] **Customer login?** → Amazon Cognito
- [ ] **EC2 accessing S3?** → IAM Role
- [ ] **Single AWS account user management?** → IAM
- [ ] **Microsoft Active Directory infrastructure?** → AWS Directory Service
