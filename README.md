# Pacific Essences - Shopify theme

A custom Shopify storefront for [Pacific Essences](https://pacificessences.com), a maker of
vibrational flower, gem and sea essences. Built on Shopify's **Dawn** theme, then substantially
rebuilt: the product page, several content pages and a set of bespoke sections were redesigned
around the way these products are actually chosen - by how someone feels, not by specification.

## What's custom here

Fourteen purpose-built sections live alongside Dawn's defaults:

| Section | Purpose |
| --- | --- |
| `essence-energetics` | Surfaces each essence's emotional/energetic qualities as its own band |
| `essence-ingredients` | Shows what a combination essence is made of |
| `essence-reviews` | Customer reviews styled to match the product page bands |
| `essence-guide` | In-page guide, opened in a dialog |
| `essence-families` | The six essence families as six entry points |
| `essence-faq` | Grouped FAQ that opens in place |
| `essence-journal` | Blog/journal presentation |
| `essence-directory` | Distributors and facilitators as one directory |
| `essence-contact` | Contact form laid out beside store details |
| `essence-quiz` | Self-assessment quiz |
| `essence-inspiration` | Homepage "Daily Essence Inspiration" - a face-down card that flips |
| `card-picker` / `random-card-selector` | Flip-card pickers |
| `essence-chat` | Mount point for the AI shopping assistant (separate service) |

Store-wide styling is consolidated into `assets/pacess.css` with shared design tokens, replacing
CSS that had been scattered across templates.

## Notable work

- **Product page** rebuilt into distinct bands, with the buy box reworked around size, quantity
  and compare-at pricing behaviour.
- **Product gallery** shows the botanical source beside the bottle; painting moved off the main
  thread and repaint bugs fixed after the redesign introduced jank.
- **Content pages** restructured - Our Story as a chronological timeline, Learning Resources as a
  list, shop policies styled and cross-linked, search results and quiz pages given consistent
  image treatment.
- **Localization** - repaired trailing commas that had left three locale files as invalid JSON.

## Structure

Standard Shopify theme layout: `sections/`, `snippets/`, `blocks/`, `templates/`, `assets/`,
`config/`, `locales/`, `layout/`.

## Local development

```bash
shopify theme dev      # preview against the store
shopify theme push     # publish changes
```

Requires the [Shopify CLI](https://shopify.dev/docs/api/shopify-cli) and access to the store.
