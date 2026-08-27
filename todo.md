# Fed-Poster — Ko-fi Widget Integration

## Setup
- [x] Research Ko-fi overlay widget API (scraped overlay-widget.js source)
- [x] Create `site/assets/kofi-widget.js` (loader + openKofiWidget function)

## Integration
- [ ] Add Ko-fi script tags (overlay-widget.js + kofi-widget.js) to all 7 HTML pages
- [ ] Add `data-kofi` attribute to pricing/upgrade CTA buttons
  - pricing.html "Go Pro" button
  - dashboard.html upgrade card
  - index.html "Choose Pro" button
  - settings.html Pricing link in About panel

## Verification
- [ ] Browser-test: floating "Support me" button appears
- [ ] Browser-test: clicking pricing CTA opens Ko-fi popup
- [ ] Redeploy site with Ko-fi changes
- [ ] Regenerate zip file

## Delivery
- [ ] Final delivery to user
