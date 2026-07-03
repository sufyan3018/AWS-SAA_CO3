---
title: "AWS Shield"
slug: aws-shield
category: Identity & Security
priority: High
order: 1
---

# AWS SAA Notes

## 1. Purpose

**AWS Shield** is a managed **Distributed Denial of Service (DDoS) protection** service that safeguards AWS applications from attacks designed to overwhelm resources and make them unavailable.

AWS Shield continuously monitors network traffic and automatically detects and mitigates DDoS attacks with minimal impact on application availability.

> **Exam Keyword:** DDoS Protection

---

## 2. How It Works

AWS Shield sits at the AWS network edge and monitors incoming traffic.

When a DDoS attack is detected, Shield automatically applies mitigation techniques to filter malicious traffic while allowing legitimate user traffic to reach your application.

### DDoS Protection Flow


```text id="3df7tk"
Internet Traffic
        │
        │
 AWS Shield
        │
Detect DDoS Attack
        │
Filter Malicious Traffic
        │
Allow Legitimate Traffic
        │
AWS Application
```

---

### Types of AWS Shield


AWS Shield has **two tiers**:

### AWS Shield Standard


Included automatically with every AWS account.

Provides protection against common:

* Network Layer (Layer 3)
* Transport Layer (Layer 4)

DDoS attacks.

Examples:

* SYN Flood
* UDP Flood
* Reflection attacks

No additional configuration is required.

---

### AWS Shield Advanced


Paid service providing enhanced protection.

Additional features include:

* Larger DDoS mitigation capacity
* 24/7 access to the **AWS DDoS Response Team (DRT)**
* Advanced attack visibility and reporting
* Cost protection for scaling caused by eligible DDoS attacks
* Integration with AWS WAF for advanced application-layer protection

> **Exam Tip:** Shield Advanced is recommended for business-critical or internet-facing production workloads.

---

## 3. Architecture

Typical architecture:

```text id="k9x4mv"
            Internet
                 │
        DDoS Traffic
                 │
          AWS Shield
                 │
        ┌────────┼────────┐
        │        │        │
   CloudFront    Route53    Global Accelerator
                 │
         Application Load Balancer
                 │
             EC2 / ECS / Lambda
```

Shield protects supported AWS services that are exposed to the internet.

---

### AWS Services Protected


AWS Shield integrates with:

* Amazon CloudFront
* Amazon Route 53
* Elastic Load Balancing (ALB/NLB)
* AWS Global Accelerator
* Elastic IP addresses (Shield Advanced)

> **Exam Tip:** CloudFront + Shield is one of the most common architectures for protecting web applications.

---


### Use Shield Standard by Default


Every AWS customer automatically receives:

* Basic DDoS protection
* No additional charges
* Automatic activation

There is nothing to configure.

---

### Use Shield Advanced for Critical Applications


Choose Shield Advanced when:

* Running high-value public websites
* Hosting financial applications
* Supporting e-commerce platforms
* Protecting business-critical APIs
* Minimizing downtime during attacks

---

### Combine Shield with AWS WAF


A recommended architecture:

```text id="r4hx7n"
Internet
     │
AWS Shield
     │
AWS WAF
     │
CloudFront
     │
Application
```

Benefits:

* Shield blocks infrastructure-level DDoS attacks.
* WAF filters malicious HTTP/HTTPS requests.

> **Exam Tip:** **Shield protects against DDoS**, while **AWS WAF filters web requests**.

---

### Use CloudFront


CloudFront provides:

* Global edge locations
* Traffic distribution
* Additional resilience against DDoS attacks

Shield works seamlessly with CloudFront.

---

### Enable Monitoring


Shield Advanced provides:

* Attack metrics
* Detection reports
* Event visibility
* Integration with CloudWatch

---

## 4. Key Features

### Automatic DDoS Detection


Continuously monitors AWS network traffic.

No manual intervention is required for Shield Standard protections.

---

### Automatic Mitigation


Detects attacks and automatically filters malicious traffic.

Helps maintain application availability during attacks.

---

### Layer 3 & Layer 4 Protection


Protects against attacks targeting:

* IP layer
* TCP layer
* UDP layer

Examples:

* SYN Floods
* UDP Floods
* Reflection attacks

---

### AWS DDoS Response Team (Shield Advanced)


Available only with Shield Advanced.

Provides:

* 24/7 expert assistance
* Attack investigation
* Mitigation guidance

---

### Cost Protection


Shield Advanced helps protect against unexpected scaling charges caused by eligible DDoS attacks.

---

### Integration with AWS Services


Works with:

* CloudFront
* Route 53
* Elastic Load Balancing
* Global Accelerator
* AWS WAF

---

### When to Use


Use AWS Shield when:

* Protecting public-facing applications.
* Running production websites.
* Hosting APIs exposed to the internet.
* Protecting CloudFront distributions.
* Protecting Application Load Balancers.
* Defending against DDoS attacks.

---

### When NOT to Use


| Requirement                                        | Better AWS Service   |
| -------------------------------------------------- | -------------------- |
| Filter SQL Injection or Cross-Site Scripting (XSS) | AWS WAF              |
| Manage firewall rules inside a VPC                 | AWS Network Firewall |
| Encrypt stored data                                | AWS KMS              |
| Store passwords or API keys                        | AWS Secrets Manager  |
| Manage IAM permissions                             | IAM                  |

> **Exam Tip:** AWS Shield protects against **DDoS attacks**, not application vulnerabilities like SQL injection or XSS.

---

**Next:** Part 2 covers:

## 7. Comparison with Similar Services

* Exam Decision Guide

Understanding the differences between AWS Shield and other AWS security services is a high-frequency SAA-C03 exam topic.

---

### AWS Shield vs AWS WAF


| AWS Shield                                              | AWS WAF                                         |
| ------------------------------------------------------- | ----------------------------------------------- |
| Protects against DDoS attacks                           | Protects against web application attacks        |
| Operates at Network Layer (L3) and Transport Layer (L4) | Operates at Application Layer (L7 - HTTP/HTTPS) |
| Automatically mitigates large-scale traffic floods      | Filters HTTP/HTTPS requests using rules         |
| Included as Shield Standard for all AWS customers       | Separate service that requires configuration    |

### Types of Attacks


**AWS Shield protects against:**

* SYN Flood
* UDP Flood
* Reflection attacks
* Network DDoS attacks

**AWS WAF protects against:**

* SQL Injection (SQLi)
* Cross-Site Scripting (XSS)
* HTTP Floods
* Malicious bots (using managed rule groups)
* IP blocking
* Geographic restrictions (Geo Match)

### When to Choose


* **Need DDoS protection?** → AWS Shield
* **Need to block SQL Injection or XSS?** → AWS WAF

> **Exam Tip:**
> **Shield = DDoS Protection**
> **WAF = Web Request Filtering**

---

### AWS Shield vs AWS Network Firewall


| AWS Shield                                               | AWS Network Firewall                |
| -------------------------------------------------------- | ----------------------------------- |
| Protects internet-facing AWS resources from DDoS attacks | Protects traffic inside Amazon VPCs |
| Managed DDoS protection                                  | Stateful network firewall           |
| Protects CloudFront, Route 53, ELB, Global Accelerator   | Protects subnets and VPC traffic    |

### When to Choose


* **Internet DDoS attack?** → AWS Shield
* **Control inbound/outbound VPC traffic?** → AWS Network Firewall

---

### AWS Shield vs Amazon CloudFront


| AWS Shield                         | Amazon CloudFront                        |
| ---------------------------------- | ---------------------------------------- |
| Security service                   | Content Delivery Network (CDN)           |
| Detects and mitigates DDoS attacks | Caches content at edge locations         |
| Always included with CloudFront    | Improves performance and reduces latency |

### When to Choose


* **Need DDoS protection?** → AWS Shield
* **Need faster content delivery?** → Amazon CloudFront

> **Exam Tip:** CloudFront automatically benefits from **AWS Shield Standard**.

---

### AWS Shield Standard vs AWS Shield Advanced


| Shield Standard                                        | Shield Advanced                                               |
| ------------------------------------------------------ | ------------------------------------------------------------- |
| Free                                                   | Paid subscription                                             |
| Automatic for all AWS customers                        | Must be enabled                                               |
| Protects against common Layer 3 & Layer 4 DDoS attacks | Enhanced protection for larger and more sophisticated attacks |
| Basic monitoring                                       | Advanced attack visibility                                    |
| No DDoS Response Team (DRT)                            | Includes 24/7 AWS DDoS Response Team                          |
| No cost protection                                     | Cost protection for eligible scaling during DDoS attacks      |

### When to Choose


* **Basic DDoS protection** → Shield Standard
* **Mission-critical production workloads** → Shield Advanced

---

### Exam Decision Guide


| If the Question Says...                             | Choose               |
| --------------------------------------------------- | -------------------- |
| Protect against DDoS attacks                        | AWS Shield           |
| Protect against SQL Injection                       | AWS WAF              |
| Protect against Cross-Site Scripting (XSS)          | AWS WAF              |
| Secure traffic inside a VPC                         | AWS Network Firewall |
| Protect CloudFront from DDoS                        | AWS Shield Standard  |
| Need 24/7 DDoS experts                              | AWS Shield Advanced  |
| Need protection from scaling charges caused by DDoS | AWS Shield Advanced  |

> **Exam Tip:** If the question contains **SYN Flood**, **UDP Flood**, **Reflection Attack**, or **DDoS**, the answer is almost always **AWS Shield**.

---

## 8. Real World Example

### Scenario


An online shopping website experiences a large Distributed Denial of Service (DDoS) attack during a seasonal sale.

Requirements:

* Keep the website available.
* Filter malicious traffic automatically.
* Protect against SQL Injection.
* Use Amazon CloudFront to improve performance.

### Solution


1. Use **Amazon CloudFront** to distribute traffic globally.
2. Enable **AWS Shield Standard** (automatically included).
3. Use **AWS WAF** to block SQL Injection and Cross-Site Scripting attacks.
4. Upgrade to **AWS Shield Advanced** if the application is mission-critical and requires enhanced protection, DRT support, and cost protection.

### Benefits


* Automatic DDoS mitigation.
* Improved application availability.
* Protection against both infrastructure and application-layer attacks.
* Lower operational overhead.

---

## 9. Pricing Basics

### AWS Shield Standard


* Included automatically with every AWS account.
* No additional cost.

### AWS Shield Advanced


Paid subscription that includes:

* Enhanced DDoS protection.
* AWS DDoS Response Team (DRT).
* Advanced attack reporting.
* Cost protection for eligible scaling during attacks.

> **Exam Tip:** Shield Standard is **free**. Shield Advanced is a **paid** service.

---

## 10. SAA-C03 Exam Tips

* AWS Shield protects against **Distributed Denial of Service (DDoS)** attacks.
* Shield Standard is automatically enabled for all AWS customers.
* Shield protects at **Layer 3 (Network)** and **Layer 4 (Transport)**.
* AWS WAF protects at **Layer 7 (Application)**.
* Shield Advanced includes:

  * AWS DDoS Response Team (DRT)
  * Advanced attack visibility
  * Cost protection
* CloudFront, Route 53, Elastic Load Balancing, and Global Accelerator integrate directly with AWS Shield.

---

## 11. Common Exam Traps

### Trap 1: Using AWS WAF for Network DDoS Attacks


❌ Wrong:

Use AWS WAF to stop a SYN Flood.

✅ Correct:

Use AWS Shield.

---

### Trap 2: Using AWS Shield to Block SQL Injection


AWS Shield does **not** inspect HTTP requests for application vulnerabilities.

Use **AWS WAF** to protect against:

* SQL Injection
* Cross-Site Scripting (XSS)
* HTTP request filtering

---

### Trap 3: Forgetting Shield Standard Is Automatic


Many exam questions try to imply that Shield Standard must be enabled manually.

This is incorrect.

Every AWS customer automatically receives Shield Standard.

---

### Trap 4: Assuming CloudFront Replaces Shield


CloudFront is a CDN.

Shield is a DDoS protection service.

They complement each other and are commonly deployed together.

---

### Trap 5: Choosing Shield Advanced for Every Workload


For most applications, **Shield Standard** is sufficient.

Choose **Shield Advanced** only when requirements include:

* Mission-critical applications
* Large-scale DDoS protection
* AWS DDoS Response Team (DRT)
* Cost protection

---

### Trap 6: Confusing Network Firewall with Shield


AWS Network Firewall:

* Protects VPC traffic.
* Stateful firewall.
* Rule-based inspection.

AWS Shield:

* Protects internet-facing AWS resources.
* Defends against DDoS attacks.

---

## 12. Frequently Asked Exam Scenarios

### Scenario 1


A company wants automatic protection against SYN Flood attacks on its Application Load Balancer.

**Answer:**

AWS Shield Standard.

---

### Scenario 2


An application must block SQL Injection and Cross-Site Scripting attacks.

**Answer:**

AWS WAF.

---

### Scenario 3


A business-critical application needs access to AWS DDoS experts during an attack.

**Answer:**

AWS Shield Advanced.

---

### Scenario 4


A company wants to protect its CloudFront distribution against DDoS attacks.

**Answer:**

AWS Shield Standard (included automatically).

---

### Scenario 5


An organization wants protection against unexpected AWS scaling charges caused by eligible DDoS attacks.

**Answer:**

AWS Shield Advanced.

---

## 13. Summary

| Topic               | Key Point                                              |
| ------------------- | ------------------------------------------------------ |
| Purpose             | Protect against DDoS attacks                           |
| Protection Layers   | Layer 3 (Network) & Layer 4 (Transport)                |
| Standard            | Free and enabled automatically                         |
| Advanced            | Paid, enhanced protection with DRT and cost protection |
| Common Integrations | CloudFront, Route 53, ELB, Global Accelerator          |
| Most Tested Concept | AWS Shield vs AWS WAF                                  |
| Common Trap         | Using Shield to block SQL Injection or XSS             |

---

## Revision Checklist

- [ ] Memory Tip

### AWS SAA-C03 Notes – Part 6: AWS Shield (Part 2)


- [ ] 


- [ ] Before moving on, make sure you can answer:

- [ ] What types of attacks does AWS Shield protect against?
- [ ] What is the difference between Shield Standard and Shield Advanced?
- [ ] How does AWS Shield differ from AWS WAF?
- [ ] Which AWS services integrate with Shield?
- [ ] What additional benefits does Shield Advanced provide?
- [ ] When should you choose Network Firewall instead of Shield?
- [ ] Is Shield Standard enabled automatically?

- [ ] 

### Memory Tip


- [ ] Think of AWS Shield as answering this question:

- [ ] > **"How do I protect my internet-facing AWS applications from Distributed Denial of Service (DDoS) attacks?"**

- [ ] Remember these associations:

- [ ] **AWS Shield** → DDoS protection.
- [ ] **Shield Standard** → Free, automatic Layer 3 & Layer 4 protection.
- [ ] **Shield Advanced** → Enhanced protection, DRT support, cost protection.
- [ ] **AWS WAF** → SQL Injection, XSS, HTTP request filtering.
- [ ] **CloudFront** → CDN that automatically benefits from Shield Standard.
- [ ] **Network Firewall** → Protects VPC traffic, not internet DDoS.

### Quick Decision Cheat Sheet


- [ ] **SYN Flood / UDP Flood / DDoS?** → AWS Shield
- [ ] **SQL Injection / XSS?** → AWS WAF
- [ ] **Need DDoS experts (DRT)?** → Shield Advanced
- [ ] **Need protection from DDoS scaling costs?** → Shield Advanced
- [ ] **Protect VPC traffic?** → AWS Network Firewall
- [ ] **Protect CloudFront or ALB from DDoS?** → AWS Shield Standard
