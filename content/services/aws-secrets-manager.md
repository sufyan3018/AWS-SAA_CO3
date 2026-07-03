---
title: "AWS Secrets Manager"
slug: aws-secrets-manager
category: Identity & Security
priority: High
order: 1
---

# AWS SAA Notes

## 1. Purpose

**AWS Secrets Manager** is a fully managed service that securely **stores, retrieves, manages, and automatically rotates secrets** such as database credentials, API keys, OAuth tokens, and other sensitive information.

Secrets are encrypted using **AWS KMS**, ensuring they remain protected both at rest and in transit.

> **Exam Keyword:** Secret Storage & Automatic Rotation

---

## 2. How It Works

Applications request secrets from AWS Secrets Manager instead of storing them in source code or configuration files.

Secrets Manager decrypts the secret using AWS KMS and securely returns it to the application.

### Secret Retrieval Flow


```text id="8tkm5n"
Application
      │
Request Secret
      │
AWS Secrets Manager
      │
AWS KMS
      │
Decrypt Secret
      │
Return Secret
      │
Application Uses Secret
```

> **Exam Tip:** Applications should retrieve secrets at runtime instead of embedding passwords or API keys in code.

---

### Automatic Secret Rotation


Secrets Manager can automatically rotate supported credentials.

Example:

```text id="7fhzqv"
Database Password
        │
Rotation Schedule
        │
AWS Lambda
        │
Generate New Password
        │
Update Database
        │
Update Secret
```

AWS Secrets Manager commonly uses **AWS Lambda** to perform custom rotation logic.

---

### Encryption


Every secret is encrypted using:

* AWS Managed KMS Key (default)
* Customer Managed KMS Key (optional)

Encryption occurs automatically when storing secrets.

---

## 3. Architecture

Typical architecture:

```text id="m2v8ax"
              Application
                    │
             Get Secret API
                    │
         AWS Secrets Manager
                    │
              AWS KMS
                    │
       Encrypted Secret Stored
                    │
Database / Third-Party API
```

---

### AWS Services Commonly Integrated


AWS Secrets Manager integrates with:

* Amazon RDS
* Amazon Aurora
* Amazon DocumentDB
* Amazon Redshift
* AWS Lambda
* Amazon ECS
* Amazon EKS
* AWS App Runner
* Custom applications

---


### Never Store Secrets in Code


Avoid storing:

* Database passwords
* API keys
* Access tokens
* OAuth secrets

inside:

* Source code
* Git repositories
* Environment files
* Configuration files

Instead, retrieve them securely from AWS Secrets Manager.

---

### Enable Automatic Rotation


Whenever supported, enable rotation for:

* Database credentials
* Service credentials
* Application secrets

Benefits:

* Improved security
* Reduced operational effort
* Better compliance

---

### Use IAM for Access Control


Control who can access secrets using:

* IAM Policies
* IAM Roles
* Resource-based policies (where appropriate)

Follow the **Principle of Least Privilege**.

---

### Encrypt with Customer Managed KMS Keys When Required


Use a Customer Managed KMS Key if you need:

* Custom key policies
* Cross-account access
* Compliance controls
* Detailed auditing

Otherwise, the default AWS Managed KMS Key is sufficient for many workloads.

---

### Audit Secret Access


AWS Secrets Manager integrates with **AWS CloudTrail**.

CloudTrail records actions such as:

* CreateSecret
* GetSecretValue
* UpdateSecret
* RotateSecret
* DeleteSecret

This supports security monitoring and compliance.

---

## 4. Key Features

### Secure Secret Storage


Stores:

* Database usernames and passwords
* API keys
* OAuth tokens
* Application credentials
* Third-party service credentials

---

### Automatic Rotation


Supports automatic credential rotation.

Commonly implemented using AWS Lambda.

---

### AWS KMS Integration


Every secret is encrypted using AWS KMS.

Supports:

* AWS Managed Keys
* Customer Managed Keys

---

### Versioning


Secrets Manager maintains versions of secrets.

This allows applications to transition smoothly during secret rotation.

---

### Fine-Grained Access Control


Supports:

* IAM Policies
* IAM Roles
* Resource-based policies

Only authorized identities can retrieve secrets.

---

### High Availability


AWS Secrets Manager is a fully managed, highly available regional service.

---

### When to Use


Use AWS Secrets Manager when you need to:

* Store database credentials securely.
* Store API keys.
* Store OAuth tokens.
* Store application secrets.
* Automatically rotate passwords.
* Secure credentials for Amazon RDS, Aurora, DocumentDB, or Redshift.
* Retrieve secrets programmatically from applications.

---

### When NOT to Use


| Requirement                    | Better AWS Service            |
| ------------------------------ | ----------------------------- |
| Manage encryption keys         | AWS KMS                       |
| Manage SSL/TLS certificates    | AWS Certificate Manager (ACM) |
| Authenticate application users | Amazon Cognito                |
| Employee Single Sign-On        | IAM Identity Center           |
| Manage AWS permissions         | IAM                           |

> **Exam Tip:** AWS Secrets Manager stores **secrets**, not encryption keys or certificates.

---

**Next:** Part 2 covers:

## 7. Comparison with Similar Services

* Exam Decision Guide

Understanding the differences between AWS Secrets Manager and similar AWS services is important because the SAA-C03 exam often tests which service best fits a security scenario.

---

### AWS Secrets Manager vs AWS KMS


| AWS Secrets Manager                               | AWS KMS                                         |
| ------------------------------------------------- | ----------------------------------------------- |
| Stores and manages secrets                        | Manages encryption keys                         |
| Stores database passwords, API keys, OAuth tokens | Creates and manages cryptographic keys          |
| Supports automatic secret rotation                | Supports key rotation for Customer Managed Keys |
| Encrypts secrets using AWS KMS                    | Does not store application secrets              |

### When to Choose


* **Need to store database credentials or API keys?** → AWS Secrets Manager
* **Need to manage encryption keys?** → AWS KMS

> **Exam Tip:** Secrets Manager **uses AWS KMS** to encrypt every secret.

---

### AWS Secrets Manager vs AWS Systems Manager Parameter Store


| AWS Secrets Manager                                  | Systems Manager Parameter Store                         |
| ---------------------------------------------------- | ------------------------------------------------------- |
| Purpose-built for secrets                            | General configuration and parameter storage             |
| Automatic secret rotation                            | No built-in automatic rotation                          |
| Native integration with database credential rotation | Stores configuration values and SecureString parameters |
| Higher cost                                          | Lower cost (Standard parameters available at no charge) |

### When to Choose


* **Need automatic password rotation?** → AWS Secrets Manager
* **Need to store application configuration or non-sensitive parameters?** → Systems Manager Parameter Store
* **Need to store encrypted parameters without automatic rotation?** → Parameter Store (SecureString)

> **Exam Tip:** If the question mentions **automatic credential rotation**, the answer is almost always **AWS Secrets Manager**.

---

### AWS Secrets Manager vs AWS Certificate Manager (ACM)


| AWS Secrets Manager                  | AWS Certificate Manager                            |
| ------------------------------------ | -------------------------------------------------- |
| Stores secrets                       | Manages SSL/TLS certificates                       |
| Database passwords, API keys, tokens | HTTPS certificates                                 |
| Uses AWS KMS for encryption          | Integrates with ALB, CloudFront, API Gateway, etc. |

### When to Choose


* **Store API keys or passwords?** → AWS Secrets Manager
* **Secure a website with HTTPS?** → AWS Certificate Manager

---

### AWS Secrets Manager vs Amazon Cognito


| AWS Secrets Manager             | Amazon Cognito                       |
| ------------------------------- | ------------------------------------ |
| Stores application secrets      | Authenticates application users      |
| Protects credentials            | Manages customer sign-up and sign-in |
| No user authentication features | Issues authentication tokens (JWTs)  |

### When to Choose


* **Store secrets securely?** → AWS Secrets Manager
* **Authenticate customers?** → Amazon Cognito

---

### Exam Decision Guide


| If the Question Says...                   | Choose                          |
| ----------------------------------------- | ------------------------------- |
| Store database passwords securely         | AWS Secrets Manager             |
| Automatically rotate database credentials | AWS Secrets Manager             |
| Store API keys                            | AWS Secrets Manager             |
| Store OAuth tokens                        | AWS Secrets Manager             |
| Manage encryption keys                    | AWS KMS                         |
| Store application configuration values    | Systems Manager Parameter Store |
| Secure a website with HTTPS               | AWS Certificate Manager         |
| Authenticate customers                    | Amazon Cognito                  |

> **Exam Tip:** If the scenario mentions **password rotation**, **database credentials**, or **API keys**, AWS Secrets Manager is usually the correct answer.

---

## 8. Real World Example

### Scenario


A company runs a Java application on Amazon ECS.

Requirements:

* Connect securely to an Amazon RDS database.
* Do not hardcode database credentials.
* Automatically rotate the database password every 30 days.
* Allow only the ECS task to retrieve the credentials.

### Solution


1. Store the database username and password in AWS Secrets Manager.
2. Enable automatic rotation using AWS Lambda.
3. Grant the ECS Task Role permission to call `GetSecretValue`.
4. Encrypt the secret using AWS KMS.
5. Configure the application to retrieve the secret at runtime.

### Benefits


* No credentials in source code.
* Automatic password rotation.
* Centralized secret management.
* Fine-grained IAM access control.
* Audit logging through AWS CloudTrail.

---

## 9. Pricing Basics

AWS Secrets Manager pricing is based on:

* Number of secrets stored.
* Number of API calls (such as `GetSecretValue`).
* Lambda execution costs if custom rotation functions are used.

Cost optimization:

* Delete unused secrets.
* Cache secrets in applications when appropriate to reduce API calls.
* Use Systems Manager Parameter Store for simple configuration values that do not require automatic rotation.

> **Exam Tip:** Secrets Manager is generally more expensive than Parameter Store because it includes advanced secret management features such as automatic rotation.

---

## 10. SAA-C03 Exam Tips

* AWS Secrets Manager stores **secrets**, not encryption keys.
* Secrets are encrypted using AWS KMS.
* Supports automatic rotation through AWS Lambda.
* Integrates with Amazon RDS, Aurora, DocumentDB, Redshift, ECS, EKS, Lambda, and custom applications.
* Access is controlled using IAM Policies, IAM Roles, and resource-based policies.
* CloudTrail logs all secret management API calls.
* Retrieve secrets at runtime rather than storing them in code.

---

## 11. Common Exam Traps

### Trap 1: Confusing Secrets Manager with KMS


AWS Secrets Manager:

* Stores passwords, API keys, tokens.
* Retrieves secrets securely.
* Supports automatic rotation.

AWS KMS:

* Manages encryption keys.
* Encrypts data.
* Does not store passwords or API keys.

---

### Trap 2: Using Parameter Store for Automatic Password Rotation


Parameter Store can store encrypted values.

However, **automatic secret rotation is a feature of AWS Secrets Manager**, not Parameter Store.

---

### Trap 3: Hardcoding Credentials


❌ Wrong:

Store passwords inside:

* Source code
* GitHub repositories
* Environment variables (without secure management)

✅ Correct:

Retrieve credentials from AWS Secrets Manager at runtime.

---

### Trap 4: Assuming Secrets Manager Performs Authentication


Secrets Manager stores credentials.

It does **not** authenticate users.

For user authentication:

* Amazon Cognito
* IAM
* IAM Identity Center

---

### Trap 5: Forgetting IAM Permissions


Even if a secret exists, an application must have IAM permission to call:

```text id="e1tq9g"
secretsmanager:GetSecretValue
```

---

### Trap 6: Assuming Secrets Are Stored in Plain Text


Secrets are always encrypted using AWS KMS before being stored.

---

## 12. Frequently Asked Exam Scenarios

### Scenario 1


An application needs database credentials that rotate automatically every month.

**Answer:**

Store the credentials in AWS Secrets Manager and enable automatic rotation.

---

### Scenario 2


A Lambda function requires an API key to call a third-party service.

**Answer:**

Store the API key in AWS Secrets Manager and allow the Lambda execution role to retrieve it.

---

### Scenario 3


A company needs to encrypt sensitive data stored in Amazon S3.

**Answer:**

Use AWS KMS (or SSE-KMS), **not** AWS Secrets Manager.

---

### Scenario 4


An application stores configuration values that rarely change and do not require rotation.

**Answer:**

Use AWS Systems Manager Parameter Store.

---

### Scenario 5


A web application requires HTTPS certificates.

**Answer:**

Use AWS Certificate Manager, **not** AWS Secrets Manager.

---

## 13. Summary

| Topic               | Key Point                                               |
| ------------------- | ------------------------------------------------------- |
| Purpose             | Secure storage and management of secrets                |
| Stores              | Database passwords, API keys, OAuth tokens, credentials |
| Encryption          | AWS KMS                                                 |
| Rotation            | Automatic (commonly using AWS Lambda)                   |
| Access Control      | IAM Policies, IAM Roles, Resource Policies              |
| Auditing            | AWS CloudTrail                                          |
| Pricing             | Based on stored secrets and API requests                |
| Most Tested Concept | Secrets Manager vs KMS vs Parameter Store               |
| Common Trap         | Confusing secret storage with key management            |

---

## Revision Checklist

- [ ] Memory Tip

### AWS SAA-C03 Notes – Part 4: AWS Secrets Manager (Part 2)


- [ ] 


- [ ] Before moving on, make sure you can answer:

- [ ] What types of data are stored in AWS Secrets Manager?
- [ ] How are secrets encrypted?
- [ ] How does automatic secret rotation work?
- [ ] When should you choose Secrets Manager over Parameter Store?
- [ ] When should you use KMS instead of Secrets Manager?
- [ ] Which IAM permission allows an application to retrieve a secret?
- [ ] Why should applications retrieve secrets at runtime?

- [ ] 

### Memory Tip


- [ ] Think of AWS Secrets Manager as answering this question:

- [ ] > **"How do I securely store, retrieve, and automatically rotate sensitive application credentials?"**

- [ ] Remember these associations:

- [ ] **Secrets Manager** → Passwords, API keys, OAuth tokens.
- [ ] **AWS KMS** → Encrypts every secret.
- [ ] **AWS Lambda** → Performs automatic rotation.
- [ ] **IAM Role** → Grants applications permission to retrieve secrets.
- [ ] **CloudTrail** → Audits access to secrets.
- [ ] **Parameter Store** → Configuration values; no built-in automatic rotation.

### Quick Decision Cheat Sheet


- [ ] **Store database passwords?** → AWS Secrets Manager
- [ ] **Automatically rotate credentials?** → AWS Secrets Manager
- [ ] **Store API keys?** → AWS Secrets Manager
- [ ] **Manage encryption keys?** → AWS KMS
- [ ] **Store application configuration?** → Systems Manager Parameter Store
- [ ] **Secure a website with HTTPS?** → AWS Certificate Manager
- [ ] **Authenticate customers?** → Amazon Cognito
