# Regal Rest Cleaning — Houston, TX

Single-page marketing website for **Regal Rest Cleaning**, an insured, eco-friendly
residential and commercial cleaning company serving Houston and the surrounding areas.

## Stack

Vanilla HTML, CSS and JavaScript — no build step, no dependencies, no environment
variables. Open `index.html` in a browser or serve the directory statically.

```bash
python3 -m http.server 8000
```

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Entry point — all page sections and structured data |
| `styles.css` | Design tokens, layout, components, responsive rules |
| `script.js` | Mobile nav, sticky header, smooth scroll, scroll reveal, form validation |
| `favicon.svg` | Favicon placeholder |
| `robots.txt` | Crawler directives |
| `sitemap.xml` | Single-URL sitemap |

## Sections

Hero with call-to-action · availability strip · stats · services overview (6 services) ·
how it works · why Regal Rest · service area · testimonials · CTA band · contact with
quote form · footer.

## Contact details used

- **Phone:** (832) 871-3873
- **Email:** info@regalrestllc.com
- **Address:** 3815 Eastside St, Ste 3011, Houston, TX
- **Hours:** Mon–Fri 8:00 AM – 6:00 PM · Sat 9:00 AM – 4:00 PM · Sun closed

## Notes

- The quote form is client-side only. It validates input, then hands off to the
  visitor's mail client via a prefilled `mailto:` link. Wire it to a backend or form
  service if server-side delivery is needed.
- Photography is sourced from Pexels and selected per section subject. Replace with
  authentic photos of the Regal Rest team and completed jobs when available.
- Accessibility: skip link, semantic landmarks, labelled form controls, visible focus
  states, `prefers-reduced-motion` support.
