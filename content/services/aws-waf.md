---
title: "AWS WAF"
slug: aws-waf
category: Identity & Security
priority: High
order: 1
---

# AWS SAA Notes

## 1. Purpose

**AWS WAF (Web Application Firewall)** is a managed security service that protects **web applications and APIs** from common web exploits by inspecting **HTTP and HTTPS requests**.

AWS WAF allows you to create rules that **allow, block, or count** incoming web requests before they reach your application.

> **Exam Keyword:** Layer 7 (Application Layer) Protection

---

## 2. How It Works

Every incoming HTTP/HTTPS request passes through AWS WAF before reaching your application.

AWS WAF evaluates the request against configured rules.

```text
Client
   │
HTTP/HTTPS Request
   │
AWS WAF
   │
Rule Evaluation
   │
 ├── Allow
 ├── Block
 └── Count
   │
Application
```

---

### Rule Evaluation Flow


```text
Incoming Request
       │
IP Rule
       │
Geo Rule
       │
Rate Limit Rule
       │
SQL Injection Rule
       │
Cross-Site Scripting Rule
       │
Final Action
```

The first matching rule determines the action depending on rule priority.

---

## 3. Architecture

Typical architecture:

```text
                 Internet
                     │
             HTTP/HTTPS Request
                     │
                 AWS WAF
                     │
      ┌──────────────┼──────────────┐
      │              │              │
Application     Amazon API     Amazon
Load Balancer     Gateway      CloudFront
      │
  EC2 / ECS / Lambda
```

---

### AWS Services Supported by WAF


AWS WAF can be attached to:

* Amazon CloudFront
* Application Load Balancer (ALB)
* Amazon API Gateway
* AWS AppSync
* Amazon Cognito User Pool

> **Exam Tip:** AWS WAF **cannot** be attached directly to EC2 instances or Network Load Balancers (NLB).

---


### Place WAF at the Edge


For globally distributed applications:

Internet → CloudFront → AWS WAF → ALB → Application

Benefits:

* Blocks malicious traffic before it reaches your infrastructure.
* Reduces backend load.
* Improves application availability.

---

### Use Managed Rule Groups


AWS provides managed rule groups for protection against common attacks.

Benefits:

* No need to write custom rules.
* Automatically updated by AWS.
* Covers common vulnerabilities.

---

### Enable Rate-Based Rules


Protect applications from:

* HTTP floods
* Login brute-force attacks
* API abuse

Example:

Block an IP address making more than **2,000 requests in 5 minutes**.

---

### Block by Geographic Location


Restrict traffic from specific countries when required.

Example:

Only allow requests from:

* India
* United States
* Canada

---

### Protect Login Pages


Create stricter rules for:

* Login endpoints
* Registration pages
* Payment pages

These are common attack targets.

---

## 4. Key Features

### Web ACL (Access Control List)


A Web ACL contains one or more rules that determine how requests are handled.

Actions:

* Allow
* Block
* Count
* CAPTCHA (supported where applicable)
* Challenge (supported where applicable)

---

### Rule Types


AWS WAF supports rules based on:

* IP address
* Geographic location
* HTTP headers
* Query strings
* URI paths
* HTTP methods
* Request body
* Rate limits

---

### Managed Rule Groups


Prebuilt protections for:

* SQL Injection (SQLi)
* Cross-Site Scripting (XSS)
* Known bad inputs
* Common vulnerabilities

---

### Custom Rules


Create application-specific rules.

Example:

Block requests where:

```text
User-Agent = BadBot
```

---

### Rate-Based Rules


Automatically block IP addresses exceeding a configured request rate.

Useful against:

* Bots
* Brute-force attacks
* Layer 7 DDoS attacks

---

### Logging


AWS WAF logs can be sent to services such as Amazon CloudWatch Logs for monitoring and analysis.

---

### When to Use


Use AWS WAF when:

* Hosting public web applications.
* Protecting REST APIs.
* Preventing SQL Injection attacks.
* Preventing Cross-Site Scripting (XSS).
* Blocking malicious bots.
* Restricting access by country.
* Limiting request rates.
* Protecting login pages.

---

### When NOT to Use


| Requirement                                      | Better AWS Service  |
| ------------------------------------------------ | ------------------- |
| DDoS protection at network/infrastructure layers | AWS Shield          |
| Encrypt application data                         | AWS KMS             |
| Store secrets                                    | AWS Secrets Manager |
| Authenticate customers                           | Amazon Cognito      |
| Detect compromised AWS accounts                  | Amazon GuardDuty    |

---

## 7. Comparison with Similar Services

Understanding the differences between AWS WAF and other AWS security services is essential because the SAA-C03 exam frequently tests which security service best fits a scenario.

---

### AWS WAF vs AWS Shield


| AWS WAF                                         | AWS Shield                                                    |
| ----------------------------------------------- | ------------------------------------------------------------- |
| Protects against Layer 7 (HTTP/HTTPS) attacks   | Protects against Layer 3 & Layer 4 DDoS attacks               |
| Filters web requests using rules                | Detects and mitigates DDoS attacks automatically              |
| Blocks SQL Injection, XSS, bots, IPs, countries | Protects against SYN floods, UDP floods, volumetric attacks   |
| Configurable Web ACLs                           | Standard is automatic; Advanced offers additional protections |

### When to Choose


* **Protect web applications from SQL injection or XSS?** → AWS WAF
* **Protect against DDoS attacks?** → AWS Shield

> **Exam Tip:** WAF and Shield are often used **together**, not as alternatives.

---

### AWS WAF vs AWS Network Firewall


| AWS WAF                                                    | AWS Network Firewall                  |
| ---------------------------------------------------------- | ------------------------------------- |
| Layer 7 protection                                         | Network-layer firewall for Amazon VPC |
| Inspects HTTP/HTTPS traffic                                | Inspects IP, TCP, UDP traffic         |
| Protects web applications                                  | Protects entire VPC networks          |
| Attached to CloudFront, ALB, API Gateway, AppSync, Cognito | Deployed inside a VPC                 |

### When to Choose


* **Protect websites and APIs?** → AWS WAF
* **Protect VPC network traffic?** → AWS Network Firewall

---

### AWS WAF vs Amazon GuardDuty


| AWS WAF                         | Amazon GuardDuty                                     |
| ------------------------------- | ---------------------------------------------------- |
| Prevents malicious web requests | Detects suspicious AWS account and workload activity |
| Blocks attacks                  | Generates security findings and alerts               |
| Real-time request filtering     | Threat detection using logs and machine learning     |

### When to Choose


* **Block malicious HTTP requests?** → AWS WAF
* **Detect compromised AWS resources?** → Amazon GuardDuty

---

### Exam Decision Guide


| If the Question Says...                               | Choose                  |
| ----------------------------------------------------- | ----------------------- |
| Block SQL Injection attacks                           | AWS WAF                 |
| Prevent Cross-Site Scripting (XSS)                    | AWS WAF                 |
| Block requests from specific countries                | AWS WAF                 |
| Limit excessive HTTP requests                         | AWS WAF Rate-Based Rule |
| Protect against DDoS attacks                          | AWS Shield              |
| Secure a VPC network                                  | AWS Network Firewall    |
| Detect suspicious AWS account activity                | Amazon GuardDuty        |
| Protect an Application Load Balancer from web attacks | AWS WAF                 |

> **Exam Tip:** If the question specifically mentions **HTTP**, **HTTPS**, **SQL Injection**, **XSS**, **API protection**, **Web ACL**, or **rate limiting**, the answer is usually **AWS WAF**.

---

## 8. Real World Example

### Scenario


A company hosts an e-commerce website behind an Application Load Balancer.

Requirements:

* Prevent SQL Injection attacks.
* Block Cross-Site Scripting (XSS).
* Limit brute-force login attempts.
* Block requests from countries where the company does not operate.

### Solution


1. Attach AWS WAF to the Application Load Balancer.
2. Enable AWS Managed Rule Groups.
3. Create a Rate-Based Rule for the login page.
4. Configure Geographic Match rules.
5. Enable logging to Amazon CloudWatch Logs.

### Benefits


* Protects against common web exploits.
* Reduces malicious traffic reaching the application.
* Improves application availability.
* Minimal operational overhead.

---

## 9. Pricing Basics

AWS WAF pricing is based on:

* Number of Web ACLs.
* Number of rules.
* Number of web requests inspected.

Additional charges may apply for:

* AWS Managed Rule Groups.
* CAPTCHA or Challenge actions (where used).

Cost optimization:

* Reuse Web ACLs where appropriate.
* Use managed rules instead of creating many custom rules.
* Apply WAF only to internet-facing applications that require protection.

> **Exam Tip:** You pay for **Web ACLs, rules, and requests inspected**.

---

## 10. SAA-C03 Exam Tips

* AWS WAF protects **Layer 7 (Application Layer)**.
* Filters only **HTTP/HTTPS** traffic.
* Uses **Web ACLs** containing rules.
* Can **Allow**, **Block**, **Count**, **CAPTCHA**, or **Challenge** requests.
* Supports **Managed Rule Groups**.
* Supports **Rate-Based Rules**.
* Commonly integrated with CloudFront, ALB, API Gateway, AppSync, and Cognito User Pools.
* Cannot be attached directly to EC2 instances or Network Load Balancers.

---

## 11. Common Exam Traps

### Trap 1: Confusing AWS WAF with AWS Shield


**AWS WAF**

* SQL Injection
* XSS
* HTTP filtering
* Web ACLs

**AWS Shield**

* DDoS protection
* Network attacks
* Volumetric attacks

Remember:

**WAF = Web attacks**

**Shield = DDoS attacks**

---

### Trap 2: Assuming WAF Protects All Protocols


AWS WAF protects only **HTTP/HTTPS** traffic.

It does not inspect:

* SSH
* FTP
* SMTP
* Generic TCP or UDP traffic

---

### Trap 3: Attaching WAF Directly to EC2


Wrong:

Attach AWS WAF directly to an EC2 instance.

Correct:

Attach WAF to:

* CloudFront
* Application Load Balancer
* API Gateway
* AWS AppSync
* Amazon Cognito User Pool

---

### Trap 4: Using WAF Instead of Network Firewall


AWS WAF protects web applications.

AWS Network Firewall protects VPC network traffic.

---

### Trap 5: Forgetting Rate-Based Rules


For brute-force login attacks or HTTP request floods, use **Rate-Based Rules**.

This is a common scenario in the exam.

---

### Trap 6: Thinking WAF Replaces Shield


They solve different problems and are commonly deployed together.

---

## 12. Frequently Asked Exam Scenarios

### Scenario 1


A public API must be protected from SQL Injection attacks.

**Answer:**

Attach AWS WAF to Amazon API Gateway and enable managed SQLi rules.

---

### Scenario 2


A company wants to block users from specific countries.

**Answer:**

Configure a Geographic Match rule in AWS WAF.

---

### Scenario 3


A login page is receiving thousands of requests from a single IP address.

**Answer:**

Create a Rate-Based Rule in AWS WAF.

---

### Scenario 4


An Application Load Balancer hosting an e-commerce site requires protection from common web exploits.

**Answer:**

Attach AWS WAF with AWS Managed Rule Groups.

---

### Scenario 5


A company wants protection against large-scale DDoS attacks.

**Answer:**

Use AWS Shield (and optionally AWS WAF for application-layer filtering).

---

## 13. Summary

| Topic               | Key Point                                                 |
| ------------------- | --------------------------------------------------------- |
| Purpose             | Protect web applications from common web exploits         |
| OSI Layer           | Layer 7 (Application Layer)                               |
| Traffic             | HTTP/HTTPS only                                           |
| Main Component      | Web ACL                                                   |
| Rule Actions        | Allow, Block, Count, CAPTCHA, Challenge                   |
| Integrates With     | CloudFront, ALB, API Gateway, AppSync, Cognito User Pools |
| Pricing             | Based on Web ACLs, rules, and requests                    |
| Most Tested Concept | WAF vs Shield                                             |
| Common Trap         | Confusing web attacks with DDoS attacks                   |

---

## Revision Checklist

- [ ] Before moving on, make sure you can answer:

- [ ] What is AWS WAF used for?
- [ ] Which OSI layer does AWS WAF protect?
- [ ] What is a Web ACL?
- [ ] Which AWS services integrate with AWS WAF?
- [ ] What is the difference between AWS WAF and AWS Shield?
- [ ] When should you use a Rate-Based Rule?
- [ ] Can AWS WAF be attached directly to an EC2 instance?
- [ ] Which attacks are commonly prevented by AWS WAF?

- [ ] 

### Memory Tip


- [ ] Think of AWS WAF as answering this question:

- [ ] > **"How do I stop malicious web requests before they reach my application?"**

- [ ] Remember these associations:

- [ ] **Web ACL** → Collection of WAF rules.
- [ ] **Managed Rule Groups** → AWS-managed protection against common attacks.
- [ ] **Rate-Based Rule** → Prevents brute-force attacks and HTTP floods.
- [ ] **Geo Match** → Blocks or allows traffic by country.
- [ ] **AWS Shield** → DDoS protection.
- [ ] **AWS Network Firewall** → VPC network protection.

### Quick Decision Cheat Sheet


- [ ] **SQL Injection?** → AWS WAF
- [ ] **Cross-Site Scripting (XSS)?** → AWS WAF
- [ ] **HTTP request rate limiting?** → AWS WAF Rate-Based Rule
- [ ] **Block countries?** → AWS WAF
- [ ] **DDoS protection?** → AWS Shield
- [ ] **Protect VPC traffic?** → AWS Network Firewall
- [ ] **Detect suspicious AWS activity?** → Amazon GuardDuty
