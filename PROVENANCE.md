# Haticons Asset Provenance & Intellectual Property Manifest

**Version**: 1.0.2  
**Published**: October 29, 2026  
**Maintainer**: [PebbleBenders](https://pebblebenders.com/)  
**Framework Partner**: [boodoo CSS Framework](https://www.boodooframework.com/)  
**Official Repository**: [github.com/prashmaybe/haticons](https://github.com/prashmaybe/haticons)  

---

## 1. Overview & Dual-Licensing Architecture

Haticons is an open-source icon suite engineered for web, mobile, and desktop application developers. To provide total legal clarity and ensure unrestricted adoption in commercial, proprietary, non-profit, and open-source software, Haticons employs a clear, structured intellectual property model:

1. **Software & Build Tooling (GPL-3.0)**:
   All compiler scripts, build automation, package generators, SCSS/LESS preprocessors, website code, and the CLI executable are licensed under the **GNU General Public License v3.0**.
2. **Original Vector Artwork, Font Glyphs & Components (GPL-3.0 with Font & Asset Embedding Exception)**:
   All 256 original vector icons designed by PebbleBenders across the 13 general UI categories are distributed under GPL-3.0 supplemented with the **Font & Asset Embedding Exception** (detailed in Section 3). This explicitly ensures that embedding Haticons webfonts (`.woff2`, `.woff`, `.ttf`), SVGs, or framework components (`haticons/react`, `haticons/vue`) into proprietary, commercial, or closed-source applications does **not** subject the host application or its proprietary source code to copyleft or GPL obligations.
3. **Third-Party Brand & Tech Stack Logos (Nominative Fair Use)**:
   The 313 icons contained in the `brands` category are trademarks and registered trademarks of their respective owners. They are included strictly for nominative fair use and editorial identification by software developers (e.g., social links, third-party authentication buttons, technology badges). They are not owned by PebbleBenders and are not licensed under GPL-3.0.

---

## 2. Category Inventory & Provenance Breakdown

| Category | Icon Count | Origin & Authorship | Applicable License | Commercial & Proprietary Usage |
| :--- | :---: | :--- | :--- | :--- |
| **`brands`** | 313 | Respective trademark owners / Public brand vectors | Nominative Fair Use / Trademark guidelines | Permitted for identification (OAuth, social links, tech stacks) |
| **`commerce`** | 18 | PebbleBenders design team | GPL-3.0 w/ Font Exception | Unrestricted in web, mobile, & SaaS apps |
| **`communication`** | 11 | PebbleBenders design team | GPL-3.0 w/ Font Exception | Unrestricted in web, mobile, & SaaS apps |
| **`devices`** | 14 | PebbleBenders design team | GPL-3.0 w/ Font Exception | Unrestricted in web, mobile, & SaaS apps |
| **`directional`** | 16 | PebbleBenders design team | GPL-3.0 w/ Font Exception | Unrestricted in web, mobile, & SaaS apps |
| **`editor`** | 19 | PebbleBenders design team | GPL-3.0 w/ Font Exception | Unrestricted in web, mobile, & SaaS apps |
| **`feedback`** | 21 | PebbleBenders design team | GPL-3.0 w/ Font Exception | Unrestricted in web, mobile, & SaaS apps |
| **`files`** | 14 | PebbleBenders design team | GPL-3.0 w/ Font Exception | Unrestricted in web, mobile, & SaaS apps |
| **`interface`** | 93 | PebbleBenders design team | GPL-3.0 w/ Font Exception | Unrestricted in web, mobile, & SaaS apps |
| **`media`** | 15 | PebbleBenders design team | GPL-3.0 w/ Font Exception | Unrestricted in web, mobile, & SaaS apps |
| **`navigation`** | 9 | PebbleBenders design team | GPL-3.0 w/ Font Exception | Unrestricted in web, mobile, & SaaS apps |
| **`security`** | 10 | PebbleBenders design team | GPL-3.0 w/ Font Exception | Unrestricted in web, mobile, & SaaS apps |
| **`time`** | 7 | PebbleBenders design team | GPL-3.0 w/ Font Exception | Unrestricted in web, mobile, & SaaS apps |
| **`users`** | 9 | PebbleBenders design team | GPL-3.0 w/ Font Exception | Unrestricted in web, mobile, & SaaS apps |
| **Total** | **569** | — | — | **Fully Audited & Verified** |

---

## 3. Font & Asset Embedding Exception

The following formal exception accompanies the GNU General Public License v3.0 for all Haticons webfonts, vector glyphs, SVGs, and precompiled framework components:

> ### FONT & ASSET EMBEDDING EXCEPTION
> As a special exception, if you create a document, web application, mobile application (iOS, Android, React Native, Flutter), desktop application (Electron, Tauri), or digital artwork which uses this font or its compiled vector assets (including SVG, TTF, WOFF, WOFF2, EOT, JSON paths, or framework component wrappers such as React or Vue components), and embed this font or compiled vector assets into the resulting application, bundle, or document, this font and vector assets do not by themselves cause the resulting application, document, or host source code to be covered by the GNU General Public License.
>
> This exception does not however invalidate any other reasons why the document or executable work might be covered by the GNU General Public License. If you modify this font or its underlying vector glyph sources, you may extend this exception to your version of the font, but you are not obligated to do so. If you do not wish to do so, delete this exception statement from your version.

---

## 4. Brand Icons & Trademark Policy

The `brands` category includes 313 modern technology emblems, developer tools, AI platforms, and social network logos:

- **Featured Brands**: Google, Apple, Microsoft, GitHub, React, Vue, Python, Docker, Kubernetes, Anthropic (Claude), OpenAI (ChatGPT), Google Antigravity (`hi-antigravity`), Boodoo (`hi-boodoo`), Cursor (`hi-cursor`), Trae (`hi-trae`), Windsurf (`hi-windsurf`), Copilot, DeepSeek, Mistral, Ollama, Perplexity, Groq, Replit, Hugging Face, v0, LangChain, Astro, Prisma, Resend, shadcn/ui, X/Twitter, Bluesky, Threads, Discord, Telegram, Stripe, Figma, and others.
- **Nominative Fair Use**: These brand marks are provided solely to allow developers to reference external services, link to social profiles, represent OAuth authentication methods ("Sign in with Google / Apple / GitHub"), or indicate technology stacks ("Built with React / Next.js").
- **No Affiliation or Endorsement**: PebbleBenders and Haticons are not affiliated with, sponsored by, or endorsed by any of the trademark owners represented in the `brands` category.
- **Trademark Compliance**: When utilizing brand icons in your applications, you remain responsible for adhering to each respective company's brand asset and trademark guidelines. You may not alter trademarked brand logos in ways that mislead users or misrepresent your affiliation.

---

## 5. Redistribution Rights & Clean-Room Verification

- All icon paths in Haticons were verified through automated tooling (`scripts/verify-release.js`).
- No proprietary, commercial font files or non-redistributable icon assets are included.
- Source vectors are normalized to a consistent `1024x1024` grid with standard glyph baseline offsets (`translate(0, -960)`).
- Every advertised glyph maps to a verified vector path in `dist/fonts/haticons.svg` and standalone files in `dist/svg/*.svg`.

---

## 6. How to Give Attribution (Optional but Appreciated)

While embedding Haticons in your applications does not require public credit under the Font Exception, attribution is appreciated:

```html
<!-- In your README or application credits -->
Icons by <a href="https://haticons.com/">Haticons</a> by <a href="https://pebblebenders.com/">PebbleBenders</a>.
```

