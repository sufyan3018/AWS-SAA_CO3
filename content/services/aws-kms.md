---
title: "AWS KMS"
slug: aws-kms
category: Identity & Security
priority: High
order: 1
---

# AWS SAA Notes

## 1. Purpose

**AWS Key Management Service (AWS KMS)** is a fully managed service that allows you to **create, manage, and control cryptographic keys** used to encrypt data across AWS services and your own applications.

AWS KMS **does not store secrets or encrypt large files directly**. Instead, it securely manages encryption keys that are used to protect your data.

> **Exam Keyword:** Encryption Key Management

---

## 2. How It Works

AWS KMS follows the concept of **Envelope Encryption**, which improves both security and performance.

Instead of encrypting large amounts of data with a KMS key, AWS KMS encrypts a **Data Key**, and the Data Key encrypts the actual data.

### Envelope Encryption Flow


```text id="1fkh3d"
Data
 │
Encrypted using
 │
Data Key
 │
Encrypted using
 │
AWS KMS Key (CMK)
```

This approach allows AWS services to encrypt large datasets efficiently while keeping the master encryption key secure.

> **Exam Tip:** AWS KMS encrypts **keys**, not your entire S3 object or EBS volume directly.

---

### Encryption Process


```text id="vqz5ln"
Application
      │
Request Data Key
      │
AWS KMS
      │
Generate Data Key
      │
Encrypt Data
      │
Encrypted Data
+
Encrypted Data Key
```

During decryption:

```text id="bmn5ut"
Encrypted Data
        │
Encrypted Data Key
        │
AWS KMS
        │
Decrypt Data Key
        │
Original Data Key
        │
Decrypt Data
```

---

### Types of KMS Keys


### AWS Owned Keys


* Owned and managed entirely by AWS.
* Used internally by AWS services.
* Customers have no visibility or control.

---

### AWS Managed Keys


* Created and managed by AWS.
* One per supported AWS service in each Region.
* Limited customization.

Example:

```text id="9qmwkc"
aws/s3
aws/ebs
aws/rds
```

---

### Customer Managed Keys (CMKs)


Created and managed by you.

You control:

* Key policies
* Key rotation
* Key deletion
* Permissions
* Aliases

> **Exam Tip:** Customer Managed Keys provide the greatest flexibility and are commonly the correct answer when the question mentions **full control** over encryption keys.

---

## 3. Architecture

Typical KMS architecture:

```text id="mcr9z2"
               Application
                    │
            Encrypt Request
                    │
               AWS KMS
                    │
             KMS Encryption Key
                    │
              Generates Data Key
                    │
         Data Encrypted Locally
                    │
Encrypted Data + Encrypted Data Key
```

---

### AWS Services Integrated with KMS


AWS KMS integrates with many AWS services, including:

* Amazon S3
* Amazon EBS
* Amazon EFS
* Amazon RDS
* Amazon DynamoDB
* Amazon Redshift
* AWS Lambda
* AWS Secrets Manager
* Amazon SQS
* Amazon SNS
* AWS Backup

> **Exam Tip:** If an AWS service asks whether encryption can be managed using KMS, the answer is usually **Yes**.

---


### Use Customer Managed Keys When More Control Is Needed


Choose Customer Managed Keys when you need:

* Custom key policies
* Cross-account access
* Manual key rotation control
* Compliance requirements
* Audit control

---

### Prefer Automatic Key Rotation


Enable automatic rotation for Customer Managed Keys where appropriate.

Benefits:

* Better security
* Eases compliance
* Reduces operational overhead

---

### Separate Keys by Workload


Example:

```text id="k4ylbp"
Production Key
Development Key
Finance Key
HR Key
```

Using separate keys improves security isolation and simplifies access management.

---

### Use Least Privilege


Control access using:

* Key Policies
* IAM Policies (when permitted by the key policy)
* Grants

Only authorized users and services should be able to use encryption keys.

---

### Enable Auditing


AWS KMS integrates with **AWS CloudTrail**.

CloudTrail records operations such as:

* Encrypt
* Decrypt
* GenerateDataKey
* CreateKey
* ScheduleKeyDeletion

This is important for security audits and compliance.

---

## 4. Key Features

### Fully Managed Service


AWS manages:

* Hardware availability
* Durability
* Scalability
* High availability

---

### Regional Service


AWS KMS is **Regional**.

Keys are created within a specific AWS Region.

> **Exam Tip:** Unlike IAM, AWS KMS is **not Global**.

---

### Automatic Integration


Works natively with many AWS services without requiring application changes.

Examples:

* Amazon S3 Server-Side Encryption (SSE-KMS)
* Amazon EBS encryption
* Amazon RDS encryption
* AWS Secrets Manager encryption

---

### Key Policies


Every KMS key has a **Key Policy**.

The Key Policy determines:

* Who can use the key.
* Who can administer the key.

Unlike most AWS services, Key Policies are central to KMS authorization.

---

### Automatic Key Rotation


Supported for Customer Managed Keys.

AWS can rotate keys automatically on a scheduled basis.

---

### Aliases


Aliases provide friendly names for KMS keys.

Example:

```text id="vnl6hs"
alias/production
alias/finance
alias/application
```

Applications reference aliases instead of Key IDs.

---

### When to Use


Use AWS KMS when:

* Encrypting data stored in Amazon S3.
* Encrypting Amazon EBS volumes.
* Encrypting Amazon RDS databases.
* Encrypting Amazon EFS file systems.
* Protecting secrets stored in AWS Secrets Manager.
* Managing encryption keys centrally.
* Meeting compliance requirements for encryption.

---

### When NOT to Use


| Requirement                    | Better AWS Service            |
| ------------------------------ | ----------------------------- |
| Store passwords or API keys    | AWS Secrets Manager           |
| Manage SSL/TLS certificates    | AWS Certificate Manager (ACM) |
| Authenticate application users | Amazon Cognito                |
| Employee Single Sign-On        | IAM Identity Center           |
| Manage AWS permissions         | IAM                           |

---

**Next:** Part 2 covers:

## 7. Comparison with Similar Services

* Exam Decision Guide

Understanding the differences between AWS KMS and related AWS security services is one of the most frequently tested topics in the SAA-C03 exam.

---

### AWS KMS vs AWS Secrets Manager


| AWS KMS                                | AWS Secrets Manager                                    |
| -------------------------------------- | ------------------------------------------------------ |
| Manages encryption keys                | Stores secrets such as passwords, API keys, and tokens |
| Encrypts data using cryptographic keys | Encrypts stored secrets using AWS KMS                  |
| Does not store secrets                 | Stores and retrieves secrets securely                  |
| Supports key policies and IAM policies | Supports automatic secret rotation                     |

### When to Choose


* **Need to manage encryption keys?** → AWS KMS
* **Need to store database passwords or API keys?** → AWS Secrets Manager

> **Exam Tip:** Secrets Manager **uses AWS KMS** to encrypt secrets.

---

### AWS KMS vs AWS CloudHSM


| AWS KMS                                        | AWS CloudHSM                                                      |
| ---------------------------------------------- | ----------------------------------------------------------------- |
| Fully managed key management service           | Dedicated Hardware Security Modules (HSMs)                        |
| AWS manages the HSM infrastructure             | Customer has full administrative control over HSMs                |
| Easier to use and integrates with AWS services | Designed for strict regulatory or compliance requirements         |
| Best for most AWS workloads                    | Best when you require exclusive control of cryptographic hardware |

### When to Choose


* **Standard AWS encryption requirements?** → AWS KMS
* **Need dedicated HSMs or compliance requiring exclusive hardware control?** → AWS CloudHSM

---

### AWS KMS vs AWS Certificate Manager (ACM)


| AWS KMS                                 | AWS Certificate Manager                                             |
| --------------------------------------- | ------------------------------------------------------------------- |
| Manages encryption keys                 | Manages SSL/TLS certificates                                        |
| Encrypts data at rest                   | Encrypts data in transit (HTTPS/TLS)                                |
| Used with S3, EBS, RDS, Secrets Manager | Used with CloudFront, ALB, API Gateway and other supported services |

### When to Choose


* **Encrypt stored data?** → AWS KMS
* **Secure a website with HTTPS?** → AWS Certificate Manager

---

### AWS KMS vs Server-Side Encryption with Amazon S3 (SSE-S3)


| AWS KMS (SSE-KMS)                  | SSE-S3                                   |
| ---------------------------------- | ---------------------------------------- |
| Uses AWS KMS keys                  | Uses Amazon S3-managed keys              |
| Full control over key policies     | No customer control over encryption keys |
| CloudTrail logging for key usage   | Simpler and lower operational overhead   |
| Supports cross-account key control | No KMS key management features           |

### When to Choose


* **Need auditing, key control, or compliance?** → SSE-KMS
* **Need simple server-side encryption?** → SSE-S3

---

### Exam Decision Guide


| If the Question Says...                                 | Choose                  |
| ------------------------------------------------------- | ----------------------- |
| Encrypt an Amazon EBS volume                            | AWS KMS                 |
| Encrypt an Amazon RDS database                          | AWS KMS                 |
| Encrypt Amazon S3 objects with customer-controlled keys | SSE-KMS (AWS KMS)       |
| Store API keys securely                                 | AWS Secrets Manager     |
| Secure a website using HTTPS                            | AWS Certificate Manager |
| Need dedicated hardware security modules                | AWS CloudHSM            |
| Need centralized encryption key management              | AWS KMS                 |

> **Exam Tip:** If the question emphasizes **customer-managed encryption keys**, **key rotation**, **audit logging**, or **compliance**, AWS KMS is usually the correct answer.

---

## 8. Real World Example

### Scenario


A financial company stores sensitive documents in Amazon S3.

Requirements:

* Encrypt all documents at rest.
* Control who can use the encryption keys.
* Log every encryption and decryption operation.
* Meet compliance requirements.

### Solution


1. Create a **Customer Managed Key (CMK)** in AWS KMS.
2. Configure the S3 bucket to use **SSE-KMS**.
3. Define a restrictive Key Policy allowing only authorized IAM Roles.
4. Enable automatic key rotation.
5. Use AWS CloudTrail to audit all KMS API calls.

### Benefits


* Strong encryption.
* Centralized key management.
* Fine-grained access control.
* Complete audit trail.
* Meets common compliance requirements.

---

## 9. Pricing Basics

AWS KMS pricing typically includes charges for:

* Customer Managed Keys (per key per month).
* Cryptographic API requests (Encrypt, Decrypt, GenerateDataKey, etc.).

AWS Managed Keys used by AWS services generally do not incur a monthly key management charge, though KMS request charges may still apply where applicable.

Cost optimization:

* Use AWS Managed Keys when advanced key management isn't required.
* Create Customer Managed Keys only when you need greater control.
* Reuse keys appropriately instead of creating unnecessary keys.

> **Exam Tip:** Customer Managed Keys cost more but provide significantly greater control.

---

## 10. SAA-C03 Exam Tips

* AWS KMS is a **Regional** service.
* Uses **Envelope Encryption**.
* Customer Managed Keys provide the most flexibility.
* KMS integrates with most AWS storage services.
* Key Policies are fundamental to KMS authorization.
* CloudTrail logs all KMS API activity.
* Automatic key rotation is supported for Customer Managed Keys.
* AWS services commonly integrate with KMS without requiring application changes.

---

## 11. Common Exam Traps

### Trap 1: Thinking KMS Stores Secrets


❌ Wrong:

Store database passwords inside AWS KMS.

✅ Correct:

Store passwords in **AWS Secrets Manager**, which encrypts them using AWS KMS.

---

### Trap 2: Confusing KMS with ACM


AWS KMS:

* Encrypts stored data.
* Manages encryption keys.

AWS Certificate Manager:

* Manages SSL/TLS certificates.
* Secures HTTPS communications.

---

### Trap 3: Assuming KMS Encrypts Large Files Directly


AWS KMS does **not** encrypt entire files directly.

Instead, it generates and protects **Data Keys**, which are then used to encrypt the data (Envelope Encryption).

---

### Trap 4: Forgetting That KMS Is Regional


Unlike IAM:

* IAM → Global
* AWS KMS → Regional

This distinction appears frequently in certification exams.

---

### Trap 5: Ignoring Key Policies


Even if an IAM Policy allows key usage, the **Key Policy** must also permit access (unless appropriate delegation is configured).

Remember:

**Key Policies are central to KMS authorization.**

---

### Trap 6: Choosing Customer Managed Keys Unnecessarily


If a scenario simply requires encryption with no special control, **AWS Managed Keys** are often sufficient.

Choose **Customer Managed Keys** only when the question requires:

* Custom key policies
* Cross-account access
* Manual administration
* Compliance
* Detailed auditing

---

## 12. Frequently Asked Exam Scenarios

### Scenario 1


A company needs to encrypt Amazon S3 objects while maintaining full control over encryption keys.

**Answer:**

Use **SSE-KMS** with a **Customer Managed Key**.

---

### Scenario 2


An application stores database credentials securely.

**Answer:**

Use **AWS Secrets Manager**, encrypted with AWS KMS.

---

### Scenario 3


A company must audit every encryption and decryption operation.

**Answer:**

Use AWS KMS with **AWS CloudTrail**.

---

### Scenario 4


A company needs SSL certificates for an Application Load Balancer.

**Answer:**

Use **AWS Certificate Manager**, not AWS KMS.

---

### Scenario 5


A regulated organization requires exclusive control over dedicated cryptographic hardware.

**Answer:**

Use **AWS CloudHSM**.

---

## 13. Summary

| Topic               | Key Point                                                             |
| ------------------- | --------------------------------------------------------------------- |
| Purpose             | Encryption key management                                             |
| Scope               | Regional service                                                      |
| Core Concept        | Envelope Encryption                                                   |
| Key Types           | AWS Owned, AWS Managed, Customer Managed                              |
| Authorization       | Key Policies + IAM Policies                                           |
| Integrates With     | S3, EBS, EFS, RDS, DynamoDB, Lambda, Secrets Manager, and many others |
| Auditing            | AWS CloudTrail                                                        |
| Pricing             | Based on Customer Managed Keys and API requests                       |
| Most Tested Concept | AWS KMS vs Secrets Manager vs CloudHSM                                |
| Common Trap         | Confusing encryption keys with secrets or certificates                |

---

## Revision Checklist

- [ ] Memory Tip

### AWS SAA-C03 Notes – Part 3: AWS Key Management Service (AWS KMS) (Part 2)


- [ ] 


- [ ] Before moving on, make sure you can answer:

- [ ] What is the purpose of AWS KMS?
- [ ] What is Envelope Encryption?
- [ ] What are the differences between AWS Owned, AWS Managed, and Customer Managed Keys?
- [ ] When should you choose a Customer Managed Key?
- [ ] Why is AWS KMS considered a Regional service?
- [ ] How do Key Policies differ from IAM Policies?
- [ ] When should you use Secrets Manager instead of KMS?
- [ ] When should you use CloudHSM instead of KMS?

- [ ] 

### Memory Tip


- [ ] Think of AWS KMS as answering this question:

- [ ] > **"How do I securely create, control, and audit encryption keys for my AWS resources?"**

- [ ] Remember these associations:

- [ ] **AWS KMS** → Encryption key management.
- [ ] **Envelope Encryption** → Data Key encrypts data; KMS key encrypts the Data Key.
- [ ] **Customer Managed Key** → Maximum control.
- [ ] **AWS Managed Key** → Simpler management.
- [ ] **CloudTrail** → Audits KMS API activity.
- [ ] **Secrets Manager** → Stores secrets, encrypted by KMS.
- [ ] **ACM** → Certificates for HTTPS, not data encryption.

### Quick Decision Cheat Sheet


- [ ] **Encrypt S3, EBS, or RDS data?** → AWS KMS
- [ ] **Need full control of encryption keys?** → Customer Managed Key
- [ ] **Store passwords or API keys?** → AWS Secrets Manager
- [ ] **Secure a website with HTTPS?** → AWS Certificate Manager
- [ ] **Need dedicated HSM hardware?** → AWS CloudHSM
- [ ] **Need audit logs for key usage?** → AWS KMS + AWS CloudTrail
