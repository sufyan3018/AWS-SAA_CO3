---
title: "AWS Certificate Manager"
slug: aws-certificate-manager
category: Identity & Security
priority: High
order: 1
---

# AWS SAA Notes

## 1. Purpose

**AWS Certificate Manager (ACM)** is a fully managed service that provisions, manages, and automatically renews **SSL/TLS certificates** used to secure network communications.

ACM enables you to easily deploy HTTPS for websites, APIs, and applications running on supported AWS services without manually handling certificate lifecycle management.

> **Exam Keyword:** SSL/TLS Certificate Management

---

## 2. How It Works

AWS Certificate Manager issues or imports SSL/TLS certificates and deploys them to supported AWS services.

When a client connects over HTTPS, ACM provides the certificate used during the TLS handshake to establish an encrypted connection.

### Certificate Request Flow


```text id="2cm8kt"
Administrator
      │
Request Certificate
      │
AWS Certificate Manager
      │
Domain Validation
      │
Certificate Issued
      │
Attach to AWS Service
```

---

### Domain Validation Methods


Before ACM issues a public certificate, you must prove ownership of the domain.

### DNS Validation (Recommended)


```text id="g7lwpa"
Request Certificate
        │
Receive DNS Record
        │
Add Record to Route 53
        │
Domain Verified
        │
Certificate Issued
```

Benefits:

* Automatic renewal
* Preferred AWS best practice
* Minimal ongoing management

---

### Email Validation


ACM sends verification emails to approved administrative email addresses for the domain.

Examples:

* [admin@example.com](mailto:admin@example.com)
* [administrator@example.com](mailto:administrator@example.com)
* [hostmaster@example.com](mailto:hostmaster@example.com)

The certificate is issued after the email recipient approves the request.

---

### Certificate Renewal


For ACM-issued public certificates that remain in use and continue to satisfy validation requirements:

* AWS automatically renews the certificate before expiration.
* No manual certificate replacement is required.

> **Exam Tip:** Automatic renewal applies to **ACM-issued** certificates, not imported certificates.

---

## 3. Architecture

Typical architecture:

```text id="b6c4wv"
               Internet
                   │
              HTTPS Request
                   │
          AWS Certificate Manager
                   │
          SSL/TLS Certificate
                   │
        ┌──────────┼──────────┐
        │          │          │
   CloudFront     ALB    API Gateway
                   │
             Web Application
```

---

### AWS Services Integrated with ACM


AWS Certificate Manager integrates with:

* Elastic Load Balancing (Application Load Balancer and Network Load Balancer for TLS termination)
* Amazon CloudFront
* Amazon API Gateway
* AWS Elastic Beanstalk (through supported load balancers)
* AWS App Runner
* Amazon CloudFront distributions

> **Exam Tip:** ACM certificates cannot be installed directly on Amazon EC2 instances. If you're running your own web server on EC2, you must manage the certificates yourself.

---


### Use DNS Validation Whenever Possible


Advantages:

* Automatic renewal
* Easier long-term management
* Reduced operational overhead

This is the recommended approach for production workloads.

---

### Terminate TLS at the Load Balancer or Edge


A common architecture is:

```text id="sx8j4p"
Internet
     │
HTTPS
     │
CloudFront / ALB
     │
ACM Certificate
     │
Application
```

Benefits:

* Simplifies certificate management.
* Reduces CPU usage on backend servers.
* Centralizes HTTPS configuration.

---

### Use Separate Certificates for Different Domains


Examples:

```text id="1wr5cn"
api.example.com

shop.example.com

admin.example.com
```

This provides flexibility and isolates certificate management.

---

### Use Wildcard Certificates When Appropriate


A wildcard certificate can secure multiple subdomains.

Example:

```text id="ef4m9r"
*.example.com
```

This covers:

* app.example.com
* api.example.com
* [www.example.com](http://www.example.com)

It does **not** cover:

* example.com
* test.api.example.com

---

### Monitor Certificate Expiration


For imported certificates:

* ACM does **not** automatically renew them.
* Plan renewal and replacement before expiration.

---

## 4. Key Features

### Free Public Certificates


Public certificates issued by ACM are provided at **no additional charge**.

You only pay for the AWS services using the certificate.

---

### Automatic Renewal


ACM automatically renews eligible ACM-issued public certificates before they expire.

---

### Certificate Import


You can import certificates obtained from external Certificate Authorities.

Example:

* Existing enterprise certificate
* Third-party commercial certificate

Imported certificates require manual renewal.

---

### Wildcard Certificates


Supports certificates such as:

```text id="n5k8df"
*.example.com
```

Useful for securing multiple subdomains.

---

### Integration with AWS Services


Native integration with:

* CloudFront
* Application Load Balancer
* Network Load Balancer (TLS listeners)
* API Gateway
* AWS App Runner

No manual installation is required on these supported services.

---

### Secure HTTPS Communication


ACM enables encrypted communication using SSL/TLS, protecting data **in transit** between clients and AWS services.

---

### When to Use


Use AWS Certificate Manager when you need to:

* Enable HTTPS on a website.
* Secure an Application Load Balancer.
* Secure Amazon CloudFront distributions.
* Secure Amazon API Gateway endpoints.
* Manage SSL/TLS certificates automatically.
* Reduce operational effort with automatic certificate renewal.

---

### When NOT to Use


| Requirement                          | Better AWS Service  |
| ------------------------------------ | ------------------- |
| Encrypt data at rest                 | AWS KMS             |
| Store database passwords or API keys | AWS Secrets Manager |
| Authenticate customers               | Amazon Cognito      |
| Employee Single Sign-On              | IAM Identity Center |
| Manage AWS permissions               | IAM                 |

> **Exam Tip:** ACM secures **data in transit (TLS/HTTPS)**, while AWS KMS secures **data at rest**.

---

**Next:** Part 2 covers:

## 7. Comparison with Similar Services

* Exam Decision Guide

Understanding the differences between AWS Certificate Manager and other AWS security services is a common topic in the SAA-C03 exam.

---

### AWS Certificate Manager (ACM) vs AWS KMS


| AWS Certificate Manager                                                 | AWS KMS                                               |
| ----------------------------------------------------------------------- | ----------------------------------------------------- |
| Manages SSL/TLS certificates                                            | Manages encryption keys                               |
| Secures data in transit (HTTPS/TLS)                                     | Secures data at rest                                  |
| Used for HTTPS endpoints                                                | Used for encrypting S3, EBS, RDS, EFS, etc.           |
| Supports automatic certificate renewal (ACM-issued public certificates) | Supports automatic rotation for Customer Managed Keys |

### When to Choose


* **Need HTTPS for a website or API?** → AWS Certificate Manager
* **Need to encrypt stored data?** → AWS KMS

> **Exam Tip:**
> **ACM = Data in Transit**
> **KMS = Data at Rest**

---

### AWS Certificate Manager vs AWS Secrets Manager


| AWS Certificate Manager           | AWS Secrets Manager                      |
| --------------------------------- | ---------------------------------------- |
| Stores SSL/TLS certificates       | Stores passwords, API keys, OAuth tokens |
| Used for HTTPS encryption         | Used for application credentials         |
| Certificates authenticate servers | Secrets authenticate applications        |

### When to Choose


* **Need SSL/TLS certificates?** → AWS Certificate Manager
* **Need database passwords or API keys?** → AWS Secrets Manager

---

### AWS Certificate Manager vs AWS CloudHSM


| AWS Certificate Manager            | AWS CloudHSM                                                   |
| ---------------------------------- | -------------------------------------------------------------- |
| Managed certificate lifecycle      | Dedicated Hardware Security Modules                            |
| No hardware management             | Customer controls HSM hardware                                 |
| Ideal for most AWS HTTPS workloads | Used for specialized compliance and cryptographic requirements |

### When to Choose


* **Need HTTPS certificates for AWS services?** → AWS Certificate Manager
* **Need dedicated cryptographic hardware?** → AWS CloudHSM

---

### AWS Certificate Manager vs Self-Managed Certificates


| AWS Certificate Manager                                             | Self-Managed Certificates                    |
| ------------------------------------------------------------------- | -------------------------------------------- |
| Automatic provisioning and renewal (ACM-issued public certificates) | Manual installation and renewal              |
| Native integration with supported AWS services                      | Administrator manages the complete lifecycle |
| Lower operational overhead                                          | Higher operational overhead                  |

### When to Choose


* **Using supported AWS services like ALB or CloudFront?** → AWS Certificate Manager
* **Running your own web server on EC2 or using an external environment?** → Self-managed certificates (or import into ACM where supported)

---

### Exam Decision Guide


| If the Question Says...                       | Choose                  |
| --------------------------------------------- | ----------------------- |
| Enable HTTPS for an Application Load Balancer | AWS Certificate Manager |
| Secure an Amazon CloudFront distribution      | AWS Certificate Manager |
| Secure an Amazon API Gateway endpoint         | AWS Certificate Manager |
| Encrypt an Amazon S3 bucket                   | AWS KMS                 |
| Store database credentials                    | AWS Secrets Manager     |
| Encrypt an Amazon EBS volume                  | AWS KMS                 |
| Need automatic certificate renewal            | AWS Certificate Manager |
| Need dedicated cryptographic hardware         | AWS CloudHSM            |

> **Exam Tip:** If the question mentions **SSL**, **TLS**, **HTTPS**, **certificate**, **domain validation**, or **automatic certificate renewal**, the answer is usually **AWS Certificate Manager**.

---

## 8. Real World Example

### Scenario


A company hosts an e-commerce website behind an Application Load Balancer.

Requirements:

* Serve the website over HTTPS.
* Automatically renew certificates.
* Minimize operational overhead.
* Distribute content globally using Amazon CloudFront.

### Solution


1. Request a public certificate in AWS Certificate Manager.
2. Validate domain ownership using **DNS validation**.
3. Attach the ACM certificate to the Application Load Balancer.
4. Associate the certificate with the CloudFront distribution.
5. AWS automatically renews the certificate before expiration.

### Benefits


* HTTPS enabled.
* Automatic certificate renewal.
* No manual certificate installation.
* Native AWS integration.
* Reduced administrative effort.

---

## 9. Pricing Basics

* **ACM-issued public certificates** are provided at **no additional charge**.
* You pay only for the AWS services (such as ALB or CloudFront) using the certificate.
* There are additional charges for **AWS Private CA** if you use private certificates within your organization.

Cost optimization:

* Use ACM-issued public certificates whenever possible.
* Prefer DNS validation for automatic renewal.
* Avoid unnecessary imported certificates if ACM can issue one directly.

> **Exam Tip:** Public ACM certificates are **free**.

---

## 10. SAA-C03 Exam Tips

* ACM manages **SSL/TLS certificates**, not encryption keys.
* ACM secures **data in transit**.
* AWS KMS secures **data at rest**.
* DNS validation is the recommended validation method.
* ACM automatically renews eligible ACM-issued public certificates.
* Imported certificates **must be renewed manually**.
* Common integrations include:

  * Application Load Balancer
  * Network Load Balancer (TLS listeners)
  * Amazon CloudFront
  * Amazon API Gateway
* ACM certificates cannot be installed directly on EC2 instances.

---

## 11. Common Exam Traps

### Trap 1: Confusing ACM with AWS KMS


AWS Certificate Manager:

* HTTPS
* SSL/TLS
* Certificates
* Data in transit

AWS KMS:

* Encryption keys
* Data at rest

---

### Trap 2: Assuming Imported Certificates Auto-Renew


❌ Wrong:

Import a third-party certificate and expect ACM to renew it automatically.

✅ Correct:

Only **ACM-issued public certificates** are automatically renewed.

---

### Trap 3: Installing ACM Certificates on EC2


Wrong:

Attach an ACM certificate directly to Apache or NGINX running on EC2.

Correct:

Use ACM with supported AWS services such as ALB, CloudFront, or API Gateway. For a web server running directly on EC2, install and manage the certificate yourself.

---

### Trap 4: Using ACM to Store Secrets


ACM stores certificates.

It does **not** store:

* API keys
* Passwords
* Database credentials

Use **AWS Secrets Manager** instead.

---

### Trap 5: Forgetting DNS Validation


DNS validation:

* Supports automatic renewal.
* Is the AWS-recommended method.
* Requires a DNS record proving domain ownership.

---

### Trap 6: Using KMS for HTTPS


HTTPS requires **SSL/TLS certificates**, not encryption keys.

Choose **AWS Certificate Manager**, not AWS KMS.

---

## 12. Frequently Asked Exam Scenarios

### Scenario 1


A company wants HTTPS for an Application Load Balancer with automatic certificate renewal.

**Answer:**

Use an ACM-issued public certificate with DNS validation.

---

### Scenario 2


An organization needs HTTPS for a CloudFront distribution.

**Answer:**

Attach an ACM certificate to the CloudFront distribution.

---

### Scenario 3


A company needs to encrypt Amazon S3 objects.

**Answer:**

Use AWS KMS or SSE-S3, **not** AWS Certificate Manager.

---

### Scenario 4


An administrator imports a third-party SSL certificate into ACM.

**Answer:**

The administrator is responsible for renewing and replacing the certificate before it expires.

---

### Scenario 5


A web application running on Amazon EC2 uses Apache.

**Answer:**

Install and manage the certificate on the EC2 instance yourself. ACM certificates cannot be directly attached to EC2 web servers.

---

## 13. Summary

| Topic               | Key Point                                            |
| ------------------- | ---------------------------------------------------- |
| Purpose             | Manage SSL/TLS certificates                          |
| Protects            | Data in transit                                      |
| Validation Methods  | DNS (recommended), Email                             |
| Automatic Renewal   | ACM-issued public certificates only                  |
| Common Integrations | ALB, NLB (TLS), CloudFront, API Gateway              |
| Pricing             | Public certificates are free                         |
| Most Tested Concept | ACM vs KMS                                           |
| Common Trap         | Assuming ACM encrypts data at rest or stores secrets |

---

## Revision Checklist

- [ ] Memory Tip
### AWS SAA-C03 Notes – Part 5: AWS Certificate Manager (ACM) (Part 2)


- [ ] 


- [ ] Before moving on, make sure you can answer:

- [ ] What is AWS Certificate Manager used for?
- [ ] What is the difference between ACM and AWS KMS?
- [ ] Why is DNS validation recommended?
- [ ] Which certificates are automatically renewed?
- [ ] Can ACM certificates be installed directly on EC2?
- [ ] Which AWS services commonly integrate with ACM?
- [ ] When should you use Secrets Manager instead of ACM?
- [ ] When should you use CloudHSM instead of ACM?

- [ ] 

### Memory Tip


- [ ] Think of AWS Certificate Manager as answering this question:

- [ ] > **"How do I securely enable HTTPS for my AWS applications with minimal operational effort?"**

- [ ] Remember these associations:

- [ ] **ACM** → SSL/TLS certificates.
- [ ] **HTTPS** → Data in transit.
- [ ] **DNS Validation** → Automatic renewal.
- [ ] **CloudFront / ALB / API Gateway** → Native ACM integrations.
- [ ] **AWS KMS** → Data at rest.
- [ ] **Secrets Manager** → Passwords and API keys.
- [ ] **CloudHSM** → Dedicated cryptographic hardware.

### Quick Decision Cheat Sheet


- [ ] **Enable HTTPS?** → AWS Certificate Manager
- [ ] **Need automatic certificate renewal?** → ACM-issued public certificate
- [ ] **Encrypt S3, EBS, or RDS?** → AWS KMS
- [ ] **Store API keys or passwords?** → AWS Secrets Manager
- [ ] **Need dedicated HSM hardware?** → AWS CloudHSM
- [ ] **Run Apache/NGINX directly on EC2?** → Self-manage certificates on the instance
