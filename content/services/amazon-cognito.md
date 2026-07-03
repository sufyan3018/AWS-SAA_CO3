---
title: "Amazon Cognito"
slug: amazon-cognito
category: Identity & Security
priority: High
order: 1
---

# AWS SAA Notes

## 1. Purpose

**Amazon Cognito** is a fully managed authentication and authorization service that enables **customers (application users)** to sign up, sign in, and securely access web and mobile applications.

Unlike IAM, which manages access to AWS resources for administrators and services, Cognito manages **customer identities**.

> **Exam Keyword:** Customer Authentication

---

## 2. How It Works

Amazon Cognito consists of two main components:

### User Pools


A **User Pool** is a user directory that manages:

* User registration (Sign Up)
* User authentication (Sign In)
* Password management
* Multi-Factor Authentication (MFA)
* Email and phone verification

Example:

```text
Customer
     │
Sign Up / Sign In
     │
Amazon Cognito User Pool
     │
Authentication
     │
JWT Token
     │
Application
```

After successful authentication, Cognito returns **JWT (JSON Web Token)** to the application.

---

### Identity Pools (Federated Identities)


Identity Pools provide **temporary AWS credentials** so authenticated users can access AWS resources.

Example:

```text
Customer
     │
Login
     │
User Pool
     │
JWT Token
     │
Identity Pool
     │
Temporary IAM Role
     │
Amazon S3
```

Identity Pools use **IAM Roles** behind the scenes.

> **Exam Tip:** User Pools authenticate users. Identity Pools authorize access to AWS resources.

---

### Federation


Amazon Cognito supports authentication using external identity providers such as:

* Google
* Apple
* Facebook
* Amazon
* OpenID Connect (OIDC)
* SAML providers

Example:

```text
Customer
     │
Login with Google
     │
Google Authentication
     │
Amazon Cognito
     │
Application Access
```

---

## 3. Architecture

Typical architecture:

```text
                Customer
                    │
             Login / Sign Up
                    │
          Amazon Cognito User Pool
                    │
            Authentication Success
                    │
                JWT Token
                    │
       Amazon Cognito Identity Pool
                    │
             IAM Role Assumed
                    │
 Amazon S3 / API Gateway / DynamoDB
```

---


### Separate Customer and Employee Authentication


Use:

* IAM Identity Center → Employees
* Amazon Cognito → Customers

Do not use IAM Users for application customers.

---

### Use User Pools for Authentication


User Pools should manage:

* Registration
* Login
* Password reset
* MFA
* Email verification

---

### Use Identity Pools for AWS Resource Access


If customers need access to AWS services like:

* Amazon S3
* Amazon DynamoDB
* API Gateway

Use Identity Pools.

---

### Grant Least Privilege


Identity Pools assume IAM Roles.

Assign only the minimum permissions required.

Example:

Customer uploads profile pictures.

IAM Role should allow only:

```text
s3:PutObject
```

Not:

```text
s3:*
```

---

### Support Social Login


Instead of creating another username/password, allow users to log in using:

* Google
* Apple
* Facebook

This improves user experience.

---

## 4. Key Features

### User Pools


Provides:

* Sign Up
* Sign In
* Password Reset
* User Directory
* MFA
* Email Verification
* Phone Verification

---

### Identity Pools


Provides:

* Temporary AWS Credentials
* IAM Role Mapping
* AWS Resource Access

---

### Federation


Supports:

* Google
* Apple
* Facebook
* Amazon
* OIDC
* SAML

---

### Multi-Factor Authentication


Supports:

* SMS MFA
* TOTP Authenticator Apps

---

### JWT Tokens


After authentication, Cognito returns:

* ID Token
* Access Token
* Refresh Token

Applications use these tokens for authentication and authorization.

---

### Device Tracking


Can remember trusted devices to reduce repeated authentication challenges.

---

### Hosted UI


Provides a ready-to-use login page without building authentication screens from scratch.

---

### When to Use


Use Amazon Cognito when:

* Building web applications.
* Building mobile applications.
* Authenticating customers.
* Supporting social login.
* Providing temporary AWS credentials to application users.
* Managing customer accounts securely.

---

### When NOT to Use


| Requirement                     | Better AWS Service            |
| ------------------------------- | ----------------------------- |
| Employee access to AWS accounts | IAM Identity Center           |
| AWS administrator access        | IAM                           |
| Store API keys                  | AWS Secrets Manager           |
| Manage encryption keys          | AWS KMS                       |
| SSL/TLS certificates            | AWS Certificate Manager (ACM) |

---

**Next:** Part 2 will cover:

## 7. Comparison with Similar Services

* Exam Decision Guide

Understanding when to use Amazon Cognito instead of other AWS identity services is one of the most frequently tested concepts in the SAA-C03 exam.

---

### Amazon Cognito vs IAM


| Amazon Cognito                           | IAM                                      |
| ---------------------------------------- | ---------------------------------------- |
| Manages customer identities              | Manages AWS users and services           |
| Designed for web and mobile applications | Designed for AWS account administration  |
| Supports social login                    | Does not support customer authentication |
| Uses User Pools and Identity Pools       | Uses Users, Groups, Roles, and Policies  |

### When to Choose


* **Need customers to sign in to an application?** → Amazon Cognito
* **Need administrators to access AWS resources?** → IAM

---

### Amazon Cognito vs IAM Identity Center


| Amazon Cognito              | IAM Identity Center                    |
| --------------------------- | -------------------------------------- |
| Customer authentication     | Workforce authentication               |
| Mobile and web applications | Multiple AWS accounts                  |
| User Pools                  | Permission Sets                        |
| Supports social login       | Supports enterprise identity providers |

### When to Choose


* **Customers logging into an application?** → Amazon Cognito
* **Employees accessing AWS accounts?** → IAM Identity Center

---

### Amazon Cognito vs AWS Directory Service


| Amazon Cognito                     | AWS Directory Service               |
| ---------------------------------- | ----------------------------------- |
| Customer identity management       | Managed Microsoft Active Directory  |
| Web/mobile authentication          | Windows authentication              |
| Supports social identity providers | Supports Active Directory workloads |

### When to Choose


* **Web or mobile application users?** → Amazon Cognito
* **Windows domain or Active Directory integration?** → AWS Directory Service

---

### Amazon Cognito vs AWS Secrets Manager


| Amazon Cognito              | AWS Secrets Manager                |
| --------------------------- | ---------------------------------- |
| Authenticates users         | Stores secrets                     |
| Manages customer identities | Stores passwords, API keys, tokens |
| Issues JWT tokens           | Encrypts secrets using AWS KMS     |

### When to Choose


* **Need users to log in?** → Amazon Cognito
* **Need to store database passwords or API keys?** → AWS Secrets Manager

---

### Exam Decision Guide


| If the Question Says...                        | Choose                       |
| ---------------------------------------------- | ---------------------------- |
| Customers need to sign in to a mobile app      | Amazon Cognito User Pool     |
| Customers need temporary access to S3          | Amazon Cognito Identity Pool |
| Employees need access to multiple AWS accounts | IAM Identity Center          |
| EC2 needs access to S3                         | IAM Role                     |
| Store API keys securely                        | AWS Secrets Manager          |
| Customer wants to log in using Google          | Amazon Cognito Federation    |
| Secure customer authentication                 | Amazon Cognito               |

> **Exam Tip:** If the question mentions **customers**, **mobile apps**, **web applications**, **social login**, or **JWT tokens**, Amazon Cognito is usually the correct answer.

---

## 8. Real World Example

### Scenario


A company develops a photo-sharing mobile application.

Requirements:

* Customers should be able to sign up and sign in.
* Users should be able to log in with Google or Apple.
* Authenticated users should upload photos directly to Amazon S3.
* No long-term AWS credentials should be stored on mobile devices.

### Solution


1. Create an Amazon Cognito User Pool for authentication.
2. Enable Google and Apple as federated identity providers.
3. Create an Identity Pool.
4. Configure the Identity Pool to assume an IAM Role with permission to upload objects to a specific S3 bucket.
5. The application receives temporary AWS credentials after successful authentication.

### Benefits


* Secure authentication.
* Social login support.
* Temporary AWS credentials.
* No embedded AWS access keys.
* Least privilege access to AWS resources.

---

## 9. Pricing Basics

Amazon Cognito pricing is based primarily on:

* Monthly Active Users (MAUs) for User Pools.
* Identity Pool usage.
* Additional charges for advanced security features (if enabled).

Cost optimization:

* Use User Pools only when authentication is required.
* Grant least-privilege IAM Roles through Identity Pools.
* Monitor Monthly Active Users to estimate costs.

> **Exam Tip:** Cognito follows a pay-for-usage model based mainly on Monthly Active Users.

---

## 10. SAA-C03 Exam Tips

* Cognito is designed for **application users**, not AWS administrators.
* User Pools authenticate users.
* Identity Pools provide temporary AWS credentials.
* Identity Pools use IAM Roles.
* Cognito supports Google, Apple, Facebook, Amazon, OIDC, and SAML federation.
* JWT tokens are issued after successful authentication.
* Cognito integrates well with API Gateway, Lambda, S3, and DynamoDB.
* Do not create IAM Users for every application customer.

---

## 11. Common Exam Traps

### Trap 1: Using IAM Users for Application Customers


❌ Wrong:

Create one IAM User for every customer.

✅ Correct:

Use Amazon Cognito User Pools.

---

### Trap 2: Confusing User Pools with Identity Pools


**User Pool**

* Authentication
* User directory
* JWT tokens

**Identity Pool**

* AWS credentials
* IAM Roles
* AWS resource access

Remember:

**User Pool = Who are you?**

**Identity Pool = What AWS resources can you access?**

---

### Trap 3: Assuming Cognito Stores Application Secrets


Amazon Cognito manages users.

Store:

* Database passwords
* API keys
* OAuth client secrets

in **AWS Secrets Manager**.

---

### Trap 4: Using IAM Identity Center for Customer Login


IAM Identity Center is designed for workforce users.

Amazon Cognito is designed for application customers.

---

### Trap 5: Giving Broad IAM Permissions


Identity Pools assume IAM Roles.

Grant only the permissions required.

Example:

Allow:

```text
s3:PutObject
```

Instead of:

```text
s3:*
```

---

### Trap 6: Forgetting Federation Support


If a question mentions:

* Login with Google
* Login with Apple
* Login with Facebook

Amazon Cognito is usually the correct solution.

---

## 12. Frequently Asked Exam Scenarios

### Scenario 1


A mobile application allows users to sign in using Google.

**Answer:**

Use Amazon Cognito with Google Federation.

---

### Scenario 2


Authenticated users need temporary access to an Amazon S3 bucket.

**Answer:**

Use an Identity Pool that assumes an IAM Role with the required S3 permissions.

---

### Scenario 3


Customers need to register, reset passwords, and enable MFA.

**Answer:**

Use an Amazon Cognito User Pool.

---

### Scenario 4


Employees need Single Sign-On across multiple AWS accounts.

**Answer:**

Use IAM Identity Center, not Amazon Cognito.

---

### Scenario 5


A web application requires secure customer authentication and direct uploads to Amazon S3.

**Answer:**

Use a User Pool for authentication and an Identity Pool with an IAM Role for S3 access.

---

## 13. Summary

| Topic                 | Key Point                                   |
| --------------------- | ------------------------------------------- |
| Purpose               | Customer authentication                     |
| Authentication        | User Pools                                  |
| AWS Resource Access   | Identity Pools                              |
| Temporary Credentials | IAM Roles                                   |
| Federation            | Google, Apple, Facebook, Amazon, OIDC, SAML |
| Tokens                | JWT                                         |
| Best For              | Web and mobile application users            |
| Pricing               | Monthly Active Users (MAUs)                 |
| Most Tested Concept   | User Pools vs Identity Pools                |
| Common Trap           | Using IAM instead of Cognito for customers  |

---

## Revision Checklist

- [ ] Memory Tip

### AWS SAA-C03 Notes – Part 6: Amazon Cognito (Part 2)


- [ ] 


- [ ] Before moving on, make sure you can answer:

- [ ] What is the difference between User Pools and Identity Pools?
- [ ] Which component authenticates users?
- [ ] Which component provides temporary AWS credentials?
- [ ] How does Cognito integrate with IAM Roles?
- [ ] When should you use Cognito instead of IAM?
- [ ] When should you use IAM Identity Center instead of Cognito?
- [ ] Which external identity providers does Cognito support?
- [ ] Why should you avoid creating IAM Users for application customers?

- [ ] 

### Memory Tip


- [ ] Think of Amazon Cognito as answering this question:

- [ ] > **"How do customers securely sign in to my application?"**

- [ ] Remember these associations:

- [ ] **User Pool** → Authentication
- [ ] **Identity Pool** → Temporary AWS Credentials
- [ ] **IAM Role** → Access to AWS resources
- [ ] **JWT Token** → Proof of authentication
- [ ] **Federation** → Google, Apple, Facebook, Amazon, OIDC, SAML

### Quick Decision Cheat Sheet


- [ ] **Customer login?** → Amazon Cognito User Pool
- [ ] **Customer access to AWS resources?** → Identity Pool
- [ ] **Employee SSO?** → IAM Identity Center
- [ ] **AWS administrator?** → IAM
- [ ] **Store API keys?** → AWS Secrets Manager
- [ ] **Encrypt data?** → AWS KMS
