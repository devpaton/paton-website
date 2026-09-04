# paton.ch

The PATON marketing site. A small [Eleventy](https://www.11ty.dev/) static site, deployed to
Firebase Hosting. There is no backend, no database and no tracking.

Editing a page is a pull request against one readable file.

## Run it

```sh
nvm use          # Node 22, see .nvmrc
npm ci
npm run dev      # http://localhost:8080, rebuilds on save
npm run build    # writes public/
```

`public/` is build output and is git-ignored. CI rebuilds it before every deploy.

## Where things live

| Path | What |
| --- | --- |
| `src/de/`, `src/en/` | One file per page per language. Front matter sets the title, description and URL. |
| `src/de/de.json`, `src/en/en.json` | Directory data: the one line that tells every page in the tree its language. |
| `src/_includes/layouts/` | `base.njk` (shell), `page.njk` (for the markdown legal pages). |
| `src/_includes/partials/` | Header, footer, logo, illustrations — shared by both languages. |
| `src/_data/site.js` | Language-neutral facts: contact details, social links, founding year. |
| `src/_data/ui.js` | Everything the shell says, in both languages: nav, footer headings, buttons. |
| `src/_data/art.js` | The words drawn inside the SVG illustrations, in both languages. |
| `src/_data/calculator.js` | Every default, limit and preset for the savings calculator. |
| `src/assets/` | CSS, JS and the favicon, copied through verbatim. |
| `eleventy.config.js` | Input `src/`, output `public/`, and the `inLanguage` filter. |
| `firebase.json` | Hosting root, redirects, cache and security headers. |

To add a page, drop a `.njk` or `.md` file in **both** `src/de/` and `src/en/` with a `permalink`
— the German one at the root, the English one under `/en/`. Both appear in `sitemap.xml`
automatically, already paired by `hreflang`; add the page to `nav` in `src/_data/ui.js` (both
languages) if it belongs in the menu.

## Languages

German is the default and sits at the root. English mirrors it, path for path, under `/en/`.
Nothing else about a page changes between the two, which is what makes the pairing cheap: the
`inLanguage` filter in `eleventy.config.js` turns any URL into its sibling in the other language,
and that one filter drives the `hreflang` tags in `<head>`, the DE/EN switcher in the nav — which
always points at the current page's translation, never at the homepage — and the sitemap's
alternates.

## Pages

| German URL | English URL | Source |
| --- | --- | --- |
| `/` | `/en/` | `index.njk` — problem, solution, evidence |
| `/challenge/` | `/en/challenge/` | `challenge.njk` |
| `/solution/` | `/en/solution/` | `solution.njk` |
| `/case-study/` | `/en/case-study/` | `case-study.njk` — pilot write-up |
| `/savings-calculator/` | `/en/savings-calculator/` | `savings-calculator.njk` |
| `/about/` | `/en/about/` | `about.njk` — deliberately image-free |
| `/legalnotice/` | `/en/legalnotice/` | `legal-notice.md` |
| `/privacy-policy/` | `/en/privacy-policy/` | `privacy-policy.md` |
| `/cookie-policy/` | `/en/cookie-policy/` | `cookie-policy.md` |
| `/404.html` | `/en/404.html` | `404.njk` — Firebase serves the root one |
| `/sitemap.xml`, `/robots.txt` | — | generated, one sitemap covering both languages |

Sources are relative to `src/de/` and `src/en/`.

## Redirects

The WordPress site's URLs are preserved where the content maps directly (`/`, `/about/`,
`/challenge/`, `/solution/`, `/legalnotice/`, `/privacy-policy/`). Everything else is redirected
301 in `firebase.json`:

| Old URL | New URL |
| --- | --- |
| `/cookie-richtlinie-eu/` | `/cookie-policy/` |
| `/page-sitemap.xml`, `/attachment-sitemap.xml`, `/default-sitemap.xsl` | `/sitemap.xml` |
| `/de_de/<page>/` | `/<page>/`, the German page at the root |
| any other `/de_de/…` | `/` |

**On `/de_de/`:** the old site had English at the root and German under `/de_de/`. The rebuild has
that the other way round — German is the default and sits at the root — so every `/de_de/` URL now
redirects to the root path with the same name, which is the German page it was always the German
version of, with a scoped catch-all for the rest of that tree.

The old English root URLs keep their addresses and now serve German. That is deliberate: the root
is the German canonical, and redirecting `/solution/` to `/en/solution/` would make the default
language unreachable at its own address. Readers who want English get there from the DE/EN switcher
in the nav, and search engines from the `hreflang` pair on every page.

The old `/wp-content/` and `/wp-includes/` asset URLs are intentionally left to 404. They were
images, scripts and stylesheets, not pages; redirecting them to a page would be worse than a 404.

## Deployment

Two workflows in `.github/workflows/`:

- `deploy.yml` — push to `main` builds and publishes to the live channel.
- `preview.yml` — a pull request builds and publishes to a preview channel, and the action comments
  the preview URL on the pull request.

Both authenticate with one repository secret:

```
FIREBASE_SERVICE_ACCOUNT_PATON_WEBSITE
```

It holds the JSON key of a service account with Firebase Hosting Admin on the `paton-website`
project. No credential is stored in this repository.

## Privacy stance

The site sets no cookies and loads no analytics, so it ships without a consent banner — there is
nothing to consent to. The savings calculator runs entirely in the browser; its optional "email me
this summary" button opens the visitor's own mail client and sends nothing to us. If anything that
collects data is ever added, the privacy and cookie policies must be updated first — in **both**
languages — and the non-essential part gated behind a real accept/reject choice.

## Before going fully live

- The three German legal pages (`src/de/legal-notice.md`, `src/de/privacy-policy.md`,
  `src/de/cookie-policy.md`) are translations of the English ones, not text drafted by a lawyer.
  The German version is the one a Swiss reader relies on, so it needs a review by a
  Swiss-qualified lawyer before launch. Each file carries an HTML comment saying so.
- The case study names the pilot clinic in both languages. Publishing the name needs the clinic's
  confirmed permission — see the comment at the top of `src/de/case-study.njk`.
- The case study's response-side figures are marked *Illustrative* / *Illustrativ*. Replace them
  with audited pilot numbers, or keep the label — in both languages.
- The ward-lead quote on the case study is a visible placeholder awaiting sign-off, in both
  languages. A real quote has to be signed off in the language it is published in.
- The DIN VDE 0834 sentence on `/solution/` is legally load-bearing and the German version is a
  deliberately literal translation of the English one. Neither may be reworded without the other,
  and not without a legal review.
- `patonCostPerBedPerYear` in `src/_data/calculator.js` is an indicative placeholder, not a price.
- The roadmap dates on `/about/` need confirming (see the comment in `src/de/about.njk`).
