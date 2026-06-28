# Software Requirement Specification (SRS) - Vizolane Web Platform

**Product Name:** Vizolane Technologies Platform  
**Company:** Vizolane Technologies Pvt Ltd / LLP  
**Document Version:** 2.0.0  
**Target Deployment:** Vercel Serverless Platform  

---

## 1. Executive Overview & Scope

Vizolane Technologies develops AI-powered smart city infrastructure and digital solutions, specializing in intelligent traffic management, smart tolling systems, urban transportation automation, web development, and enterprise data analytics.

This document specifies the complete software, architectural, functional, security, and deployment requirements for the unified **Vizolane Web Platform**. The platform transitions legacy static sites and legacy Express backends into a unified, high-performance, serverless **Next.js 15+ (App Router)** application backed by **MongoDB Atlas** and hosted entirely on **Vercel**.

---

## 2. Architecture & Technology Stack Specifications

### 2.1 Technology Stack Matrix

| Layer | Technology / Specification |
| :--- | :--- |
| **Framework** | Next.js 15+ (App Router) |
| **Language** | TypeScript (Strict Mode enabled) |
| **UI Library** | React 19 |
| **Styling Framework** | Tailwind CSS v3/v4 with custom design tokens |
| **Database** | MongoDB Atlas (Cloud Database) |
| **ODM / ORM** | Mongoose v8+ (with connection caching for Serverless) |
| **Icons & Micro-interactions** | Lucide React |
| **Deployment & Hosting** | Vercel (Serverless Functions & Global Edge Network) |
| **Validation & Security** | Zod schema validation, HTML input sanitization, NoSQL injection guards |

### 2.2 Prohibited Dependencies
Per architectural guidelines, the platform MUST NOT use:
* Python / Django / Flask backends
* Standalone Express.js or Node server processes
* External email services (Gmail SMTP, Nodemailer, SendGrid, Resend, Brevo)
* Google Forms or Google Sheets APIs

---

## 3. Core Functional Requirements

### 3.1 Public Presentation & Solutions Showcase (`/`)
* **Hero & Vision Section**: High-impact modern SaaS UI showcasing Vizolane's mission in smart city AI infrastructure.
* **Core Solutions Showcase**:
  1. *Intelligent Traffic Management Systems* (AI signal optimization, real-time congestion monitoring).
  2. *Smart Tolling Solutions* (Automatic vehicle identification, barrierless electronic tolling).
  3. *AI Urban Transportation* (Transit analytics, route optimization).
  4. *Enterprise Digital Transformation & Web Development*.
* **Interactive Metrics & Achievements**: Dynamic visual counters and company statistics.
* **Founders Portfolio Integration**: Dedicated leadership profile showcases for:
  * **Rasheswar Sharma** (Co-Founder & Web Developer - Full-Stack, UI/UX, Data Analytics)
  * **Vithika** (Co-Founder)

---

### 3.2 Contact Us Module (`/contact`)

#### 3.2.1 User Interface & Interaction
* **Responsive Layout**: Full dark/light mode SaaS aesthetic.
* **Input Fields**:
  * Full Name (Required)
  * Email Address (Required, format validated)
  * Phone Number (Optional, standard format)
  * Subject (Required)
  * Message (Required, minimum length enforced)
* **Client-Side Validation**: Immediate feedback on invalid inputs before server submission.
* **State Handling**:
  * Active submit loading spinner.
  * Prevention of duplicate submissions (button disabled while pending).
  * Automatic form reset on success.
* **Success Presentation (`ContactSuccess.tsx`)**:
  * Replaces form upon successful API response.
  * Displays generated **Reference ID** (e.g., `CNT-20260628-0001`).
  * Displays confirmation notice and button to submit another inquiry.

#### 3.2.2 Serverless Contact API (`POST /api/contact`)
* **Input Validation & Sanitization**: Server-side validation against malicious script injection.
* **Reference ID Generation**: Unique sequential string format `CNT-YYYYMMDD-XXXX`.
* **Database Persistence**: Writes to MongoDB Atlas `contacts` collection. Default status set to `New`.
* **Rate Limiting**: IP-based sliding window rate-limiting to prevent spam.

---

### 3.3 Admin Management Dashboard (`/admin`)

#### 3.3.1 Security & Authentication
* Protected via secret authorization key (`ADMIN_API_KEY`) checked via HTTP headers or session token.

#### 3.3.2 Metric KPI Cards (`DashboardCards.tsx`)
* Real-time calculation and display of submission counts:
  * **Total Contacts**
  * **New**
  * **In Progress**
  * **Resolved**

#### 3.3.3 Data Table & Filtering (`ContactTable.tsx`, `SearchBar.tsx`)
* **Live Search**: Instant client/server search by Name, Email, or Reference ID.
* **Status Filter**: Multi-state toggle (`All`, `New`, `In Progress`, `Resolved`).
* **Table Columns**: Reference ID, Name, Email, Subject, Status Badge, Submission Date, Action Buttons.
* **Interactive Actions**:
  * *View Detail*: Opens modal displaying full message history and contact details.
  * *Update Status*: Inline dropdown to transition states (`New` $\rightarrow$ `In Progress` $\rightarrow$ `Resolved`).
  * *Delete Record*: Triggers modal confirmation dialog before executing permanent removal.
* **Pagination**: Server-assisted or smooth paginated data views.

---

## 4. Database Schema Requirements (`models/Contact.ts`)

MongoDB Atlas collection `contacts` schema definition:

```typescript
{
  _id: ObjectId,
  referenceId: { type: String, required: true, unique: true, index: true },
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, trim: true, default: "" },
  subject: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true },
  status: { 
    type: String, 
    enum: ["New", "In Progress", "Resolved"], 
    default: "New",
    index: true 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```

---

## 5. Security & Protection Specifications

1. **Serverless Connection Pooling**: Implement global caching for Mongoose connections (`lib/mongodb.ts`) to avoid connection exhaustion under Vercel's concurrent lambdas.
2. **XSS Prevention**: All user inputs sanitized to encode HTML entities prior to storage or UI rendering.
3. **NoSQL Injection Guard**: Strict schema type casting and query object sanitization on all search parameters.
4. **Rate Limiting**: Restrict `/api/contact` submissions per IP to maximum 5 requests per 15-minute window.
5. **Secrets Management**: Credentials (`MONGODB_URI`, `ADMIN_API_KEY`) stored strictly in Vercel Environment Variables.

---

## 6. Project Directory Structure

```
vizolane-website/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── contact/
│   │   └── page.tsx
│   ├── admin/
│   │   └── page.tsx
│   └── api/
│       ├── contact/
│       │   └── route.ts
│       └── admin/
│           ├── contacts/
│           │   └── route.ts
│           └── contact/
│               └── [id]/
│                   └── route.ts
├── components/
│   ├── ContactForm.tsx
│   ├── ContactSuccess.tsx
│   ├── ContactTable.tsx
│   ├── DashboardCards.tsx
│   ├── SearchBar.tsx
│   ├── Toast.tsx
│   └── ConfirmDialog.tsx
├── lib/
│   ├── mongodb.ts
│   ├── referenceId.ts
│   └── security.ts
├── models/
│   └── Contact.ts
├── types/
│   └── contact.ts
├── .env.example
├── REQUIREMENTS.md
├── package.json
└── tailwind.config.ts
```

---

## 7. Non-Functional & Quality Requirements

* **Performance**: 90+ score on Google Lighthouse across Performance, Accessibility, Best Practices, and SEO.
* **SEO & Metadata**: Semantic HTML5 markup, canonical URL structures, dynamic OpenGraph cards for social sharing.
* **Responsiveness**: Pixel-perfect layout adaptation from 320px mobile viewports to 4K ultra-wide displays.
* **Reliability**: 99.9% uptime powered by Vercel Serverless multi-region infrastructure and MongoDB Atlas cloud auto-scaling.
