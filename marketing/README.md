# Planet Studio

Marketing material generator for Kids Planet school.

## Quick Start

```bash
cd marketing
node planet-studio.js              # Generate all materials
node planet-studio.js --type flyer     # Flyers only
node planet-studio.js --type instagram # Instagram posts only
node planet-studio.js --type story     # Instagram stories only
node planet-studio.js --type brochure  # Brochures only
```

## Output

All files are generated in `output/` as HTML. Open in Chrome and:
- **Flyers/Brochures**: Print → Save as PDF
- **Instagram Posts**: Set browser to 1080x1080 → Screenshot
- **Instagram Stories**: Set browser to 1080x1920 → Screenshot

## Materials Generated

| File | Format | Use |
|------|--------|-----|
| `flyer-admission.html` | A4 Portrait | Print flyer for admissions |
| `brochure-school.html` | A4, 2-page | School brochure (print double-sided) |
| `instagram-admission.html` | 1080x1080 | Instagram ad — admissions open |
| `instagram-whyUs.html` | 1080x1080 | Instagram ad — why choose us |
| `instagram-testimonial.html` | 1080x1080 | Instagram ad — parent reviews |
| `instagram-seats.html` | 1080x1080 | Instagram ad — limited seats urgency |
| `instagram-founder.html` | 1080x1080 | Instagram ad — founder story |
| `story-admission.html` | 1080x1920 | Instagram story — admissions |
| `story-dayInLife.html` | 1080x1920 | Instagram story — daily schedule |

## Adding Real Photos

Replace placeholder content in `planet-studio.js`:
1. Add image paths to the templates
2. Update school data (teacher names, fees, etc.)
3. Re-run `node planet-studio.js`
