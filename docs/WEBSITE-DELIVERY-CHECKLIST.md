# Website & Web App Delivery Checklist

> Repo copy of `D:\Ruth Proj\studio\checklists\website-delivery.md` (studio canonical source).
> This is the record for this repository. Verified state and evidence live in
> `docs/WEBSITE-DELIVERY-STATUS.md`. Never tick an item from intent.

Practical baseline for shipping a professional website or web application. Use it
with `release-readiness.md`, which remains the mandatory release gate for any app
reaching real users or a store/public launch.

## How to use

- **Pick a profile** before you start. Mark every item `Done`, `N/A - reason`, or
  `Blocked`. Do not tick from intent.
- **Evidence required**: URL, screenshot, command output, ticket, config record,
  or scan report. A chat claim is not evidence.
- **Legal items are not legal advice**. Verify jurisdiction, industry, and age
  requirements with counsel or an authoritative source before launch.
- **Re-open on change**: a new domain, payment flow, auth flow, region, data
  category, or major UI release re-opens affected sections.

## Profiles

| Profile | Use when | Key emphasis |
|---|---|---|
| **Public / B2C** | Open marketing site, consumer product, public docs, community site | Trust, clarity, SEO, accessibility, legal disclosures, support |
| **Corporate / Enterprise / B2B** | Internal tool, employee portal, partner portal, enterprise SaaS | SSO/RBAC, auditability, SLAs, procurement/security docs, data controls |
| **Both** | Public product with authenticated workspace, or any professional web property | Common baseline below plus applicable profile sections |

---

## A. Common baseline (all profiles)

### A1. Product clarity & content
- [ ] Clear value proposition on primary landing/home page.
- [ ] Primary CTA is obvious; no dead ends.
- [ ] Navigation is consistent; current page/state is visible.
- [ ] Content is accurate, dated where needed, and free of placeholder/lorem/test copy.
- [ ] Brand name, logo, favicon, app icons, and social preview image are correct.
- [ ] Contact/support route is easy to find from header/footer or help area.

### A2. Core pages & trust
- [ ] Custom **404 Not Found** page with navigation/home/search/help action.
- [ ] Custom **500/error** page with safe retry/support path; no stack trace or secrets.
- [ ] **Contact/Support** page or clearly visible support channel (email, form, help desk). Tested end-to-end.
- [ ] **About/Company/Product** context is present where users need to trust the site.
- [ ] **Privacy Policy** is public, current, and linked from footer and relevant forms.
- [ ] **Terms of Service/Use** or equivalent legal terms are present where applicable.
- [ ] Copyright, legal entity/owner name, and year are correct.

### A3. Forms, feedback & states
- [ ] Every form validates input, shows field-level errors, and preserves entered data.
- [ ] Success, loading, empty, error, and no-permission states exist.
- [ ] Destructive actions require confirmation where appropriate.
- [ ] Email/notification flows are tested (confirmation, reset, receipt, support ticket).
- [ ] No duplicate submission on retry/double click/refresh.

### A4. Accessibility (WCAG-minded baseline)
- [ ] Semantic HTML, heading order, landmarks, labels, and keyboard operability.
- [ ] Visible focus, sufficient contrast, no color-only meaning.
- [ ] Images have meaningful alt text; decorative images are hidden from assistive tech.
- [ ] 200% text zoom / responsive reflow works without clipping or lost content.
- [ ] Reduced-motion respected; no autoplaying media that blocks comprehension.
- [ ] Screen-reader pass on primary flows; automated scan (axe/Lighthouse/Accessibility Scanner equivalent) reviewed.

### A5. Responsive & browser/device quality
- [ ] Works at narrow mobile, tablet, and desktop widths; no horizontal overflow.
- [ ] Tested on current Chrome/Edge/Safari/Firefox as supported; mobile Safari/Chrome checked.
- [ ] Touch targets, hover-only interactions, and keyboard-only flows are usable.
- [ ] Fonts, icons, and images load correctly on slow connections and high-DPI screens.

### A6. Performance & reliability
- [ ] Core pages load fast on representative network/device; images/fonts optimized.
- [ ] No blocking third-party script without justification; lazy-load non-critical media.
- [ ] Caching, compression, and CDN/static asset strategy configured.
- [ ] 404/redirects for moved URLs; no major broken internal links.
- [ ] Error monitoring, uptime checks, and basic logging/alerting configured.

### A7. Security baseline
- [ ] HTTPS everywhere; HSTS/certificates valid; no mixed content.
- [ ] Secrets never in client bundle, repo, logs, or public source maps.
- [ ] Auth/session handling secure (HttpOnly/SameSite cookies, CSRF protection, expiry, logout).
- [ ] Input validation and output encoding on server; no XSS/SQLi/injection basics missed.
- [ ] Dependency vulnerability scan run; critical issues fixed or explicitly accepted.
- [ ] Backups/restore path exists for any important data; admin access least-privilege.

### A8. Privacy, data & analytics
- [ ] Data inventory: what is collected, why, where stored, who receives it, retention.
- [ ] Analytics/cookies/trackers documented; consent banner/controls added where required.
- [ ] Forms collect minimum data; sensitive data has explicit purpose and protection.
- [ ] Data deletion/export/support process defined where applicable.
- [ ] Third-party scripts/SDKs reviewed for privacy and policy impact.

### A9. SEO & discoverability (public-facing pages)
- [ ] Unique title/description, canonical URL, Open Graph/Twitter metadata.
- [ ] `robots.txt`, XML sitemap, clean URLs, structured data where useful.
- [ ] Index/noindex correct for private, staging, or duplicate pages.
- [ ] 301 redirects for legacy URLs; search console/bing webmaster ready for launch.

### A10. Release & operations
- [ ] Staging/prod parity for critical config; production env vars/secrets verified.
- [ ] Domain, DNS, SSL, email sender/domain auth (SPF/DKIM/DMARC where relevant) verified.
- [ ] Rollback plan, owner on-call/support path, and launch smoke test prepared.
- [ ] Legal/support links, contact form, and transactional emails verified in production.

---

## B. Public / B2C additions

Use for sites/apps open to the general public.

### B1. Public trust & compliance
- [ ] **Age confirmation/gating** only when required: age-restricted content/services, alcohol, gambling, adult content, certain social/UGC, or child-data flows. Do not add fake age gates to ordinary sites.
- [ ] Cookie consent and ad/marketing consent match actual behavior and region.
- [ ] Clear pricing, taxes/fees, renewal/cancellation/refund terms before purchase.
- [ ] Testimonials, reviews, ratings, endorsements, and claims are real and verifiable.
- [ ] No dark patterns: no forced continuity, hidden costs, fake urgency, or confusing opt-outs.

### B2. Public support & safety
- [ ] Support channel has response expectation; abuse/report channel exists for UGC/community.
- [ ] Public status/help content for common issues where appropriate.
- [ ] Account deletion/closure and data request path accessible (not hidden behind support maze).
- [ ] Fraud/spam protection on public forms (rate limit, CAPTCHA or equivalent, abuse monitoring).

### B3. Regional/international readiness
- [ ] Supported regions/languages/currencies explicitly stated; unsupported regions handled clearly.
- [ ] Region-specific legal disclosures reviewed (privacy, consumer, cookies, e-commerce, tax).
- [ ] Time zone, date/number/currency formatting, and translated content verified per locale.
- [ ] Geo-restricted features fail clearly; no silent wrong behavior.

---

## C. Corporate / Enterprise / B2B additions

Use for internal systems, enterprise customers, or business procurement.

### C1. Identity, access & governance
- [ ] SSO/SAML/OIDC/MFA as required by customer/security policy.
- [ ] RBAC/least privilege; admin actions audited.
- [ ] Joiner/mover/leaver/deprovisioning flow tested.
- [ ] Session timeout, device/session management, and privileged-access controls defined.

### C2. Security & compliance evidence
- [ ] Security documentation available: architecture, data flow, subprocessors, retention, backups.
- [ ] Vulnerability management, patching SLA, incident response, and breach notification path defined.
- [ ] Logging/audit trails for sensitive actions; logs protected and retention-bounded.
- [ ] Pen test/security review/scanner evidence as required by procurement.

### C3. Enterprise operations
- [ ] SLA/support tiers, escalation path, maintenance windows, and status communication defined.
- [ ] Data export, tenant isolation, backup/restore, and disaster recovery expectations documented.
- [ ] Change management, release notes, versioning, and backward-compatibility policy clear.
- [ ] Contractual/legal docs ready: DPA, MSA/SOW, SLA, security addendum, subprocessors as applicable.

### C4. Enterprise UX
- [ ] No public SEO/indexing for private environments unless intentional.
- [ ] Admin/configuration UI has safe defaults, confirmations, and audit visibility.
- [ ] Accessibility and browser/device support match the enterprise's supported environment.

---

## D. Conditional modules (add when applicable)

- [ ] **Accounts/Auth**: signup/login/reset/MFA/session expiry/account recovery tested.
- [ ] **Payments/Billing**: pricing clarity, taxes, invoices/receipts, refunds, failed payment, webhook idempotency.
- [ ] **File upload**: type/size limits, malware/content checks, storage permissions, safe previews.
- [ ] **UGC/social**: moderation, reporting, blocking, terms acceptance, child-safety rules.
- [ ] **AI features**: disclosure, data minimization, prompt-injection/abuse tests, human review where needed.
- [ ] **Health/finance/legal advice**: disclaimers, regulatory review, professional boundaries, escalation paths.
- [ ] **Notifications/email/SMS**: opt-in/out, templates, bounce handling, rate limits, compliance.
- [ ] **Multi-tenant**: tenant isolation tested at DB/API/UI; no cross-tenant data leak.
- [ ] **PWA/mobile app**: install/update/offline/push/permissions/app-store policies per release-readiness.

## E. Sign-off

- [ ] Profile selected: Public / Corporate / Both.
- [ ] All applicable Common + Profile + Conditional items are Done or N/A with reason.
- [ ] Critical blockers resolved; known issues documented with owner and date.
- [ ] Owner/stakeholder sign-off recorded with release version, date, and evidence links.
