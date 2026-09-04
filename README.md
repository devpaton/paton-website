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
| `src/*.njk`, `src/*.md` | One file per page. Front matter sets the title, description and URL. |
| `src/_includes/layouts/` | `base.njk` (shell), `page.njk` (for the markdown legal pages). |
| `src/_includes/partials/` | Header, footer, logo, hero illustration. |
| `src/_data/site.js` | Navigation, contact details, social links. |
| `src/_data/calculator.js` | Every default, limit and preset for the savings calculator. |
| `src/assets/` | CSS, JS and the favicon, copied through verbatim. |
| `eleventy.config.js` | Input `src/`, output `public/`. |
| `firebase.json` | Hosting root, redirects, cache and security headers. |

To add a page, drop a `.njk` or `.md` file in `src/` with a `permalink`. It appears in
`sitemap.xml` automatically; add it to `site.nav` if it belongs in the menu.

## Pages

| URL | Source |
| --- | --- |
| `/` | `src/index.njk` — problem, solution, evidence |
| `/challenge/` | `src/challenge.njk` |
| `/solution/` | `src/solution.njk` |
| `/case-study/` | `src/case-study.njk` — pilot write-up |
| `/savings-calculator/` | `src/savings-calculator.njk` |
| `/about/` | `src/about.njk` — deliberately image-free |
| `/legalnotice/` | `src/legal-notice.md` |
| `/privacy-policy/` | `src/privacy-policy.md` |
| `/cookie-policy/` | `src/cookie-policy.md` |
| `/sitemap.xml`, `/robots.txt`, `/404.html` | generated |

## Redirects

The WordPress site's URLs are preserved where the content maps directly (`/`, `/about/`,
`/challenge/`, `/solution/`, `/legalnotice/`, `/privacy-policy/`). Everything else is redirected
301 in `firebase.json`:

| Old URL | New URL |
| --- | --- |
| `/cookie-richtlinie-eu/` | `/cookie-policy/` |
| `/page-sitemap.xml`, `/attachment-sitemap.xml`, `/default-sitemap.xsl` | `/sitemap.xml` |
| `/de_de/<page>/` | the English equivalent |
| any other `/de_de/…` | `/` |

**On `/de_de/`:** the rebuild ships in English only. Rather than leave the German mirror 404ing or
publish a machine translation nobody has reviewed, every `/de_de/` URL redirects to its English
equivalent, with a scoped catch-all for the rest of that tree. When German content is written, add
the pages and delete the matching redirects — the old URLs will then resolve to real content again.
The legal pages say a German version is available on request in the meantime.

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
collects data is ever added, `src/privacy-policy.md` and `src/cookie-policy.md` must be updated
first and the non-essential part gated behind a real accept/reject choice.

## Before going fully live

- `src/case-study.njk` names the pilot clinic. Publishing the name needs the clinic's confirmed
  permission — see the comment at the top of that file.
- The case study's response-side figures are marked *Illustrative*. Replace them with audited pilot
  numbers, or keep the label.
- The ward-lead quote on the case study is a visible placeholder awaiting sign-off.
- `patonCostPerBedPerYear` in `src/_data/calculator.js` is an indicative placeholder, not a price.
- The roadmap dates on `/about/` need confirming (see the comment in `src/about.njk`).
