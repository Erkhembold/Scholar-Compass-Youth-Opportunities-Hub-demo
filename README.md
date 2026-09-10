# ScholarCompass

A student opportunity discovery platform — scholarships, competitions,
volunteering, internships, IELTS, SAT, and academic guidance in one place.
Built with React + Vite, ready to deploy to GitHub Pages.

## Running locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## Project structure

```
src/
  main.jsx                 entry point
  App.jsx                  page composition
  assets/
    student-raising-hand.png   hero image (bundled by Vite)
  data/
    config.js               nav links, footer categories, Instagram/email
    opportunities.js        mock opportunity board data + filters
    reads.js                mock Suggested Reads data
  components/
    Header.jsx               sticky nav + mobile menu
    Hero.jsx                 headline, CTAs, category strip
    TiltImage.jsx             3D perspective hero image treatment
    OpportunityBoard.jsx     board section
    FilterBar.jsx             category filter chips
    OpportunityCard.jsx       single opportunity card
    NotificationSection.jsx  "Don't miss the deadline" email capture
    SuggestedReads.jsx        editorial reads section (15 slots)
    ReadCard.jsx               single read card + placeholder art
    AboutSection.jsx          "ScholarCompass exists to..." section
    Footer.jsx                 footer shell
    FollowBar.jsx              "Follow ScholarCompass" bar (Instagram)
    ContactSection.jsx         Instagram + email contact links
  styles/
    index.css                 all design tokens + component styles
public/
  assets/favicon.svg
```

## Connecting real data later

Nothing here is wired to a backend yet, and nothing pretends to be:

- **Opportunity Board** — reads from `src/data/opportunities.js`. Replace
  the exported array with the response from a real API (same shape: `title`,
  `category`, `deadline`, `location`, `eligibility`, `description`, `link`)
  and the board, filters, and cards keep working unchanged.
- **Suggested Reads** — reads from `src/data/reads.js`. Add a real `image`
  path to any entry and `ReadCard` will use it instead of the placeholder
  art automatically.
- **Email notifications** — `NotificationSection.jsx` currently validates
  the email and saves it to the browser's `localStorage` only, and says so
  in the UI. Replace the `saveEmail()` function with a call to Firebase,
  Supabase, Resend, Mailchimp, or ConvertKit's "add subscriber" endpoint to
  make it live.

## Logo asset — action needed

The real ScholarCompass profile photo from
[instagram.com/scholarcompass_mongolia](https://www.instagram.com/scholarcompass_mongolia/)
could **not** be retrieved automatically — Instagram doesn't expose profile
photos to unauthenticated tools, and fabricating a placeholder logo would
misrepresent the brand. The current header/footer use a simple compass mark
instead of the real logo.

To use the real logo:

1. Save the actual profile image as `src/assets/scholarcompass-logo.png`.
2. In `src/components/Header.jsx`, replace the inline SVG mark with:
   ```jsx
   import logo from "../assets/scholarcompass-logo.png";
   // ...
   <img src={logo} alt="" className="wordmark__mark" width="26" height="26" />
   ```

## Configuration

`src/data/config.js` centralizes the values you're most likely to change:
navigation links, footer category list, the Instagram URL, and a
placeholder contact email (`hello@scholarcompass.mn` — replace with the
real inbox before launch).

## Deploying: GitHub + Vercel

**1. Push this project to a new GitHub repository.**

From inside this folder:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```
(Create the empty repo on GitHub first, or use `gh repo create` if you have the GitHub CLI installed.)

**2. Import it into Vercel.**

- Go to [vercel.com/new](https://vercel.com/new) and import the GitHub repository.
- Vercel auto-detects this as a Vite project. Leave the defaults:
  - Build command: `npm run build` (or `vite build`)
  - Output directory: `dist`
- Click Deploy.

`vite.config.js` has `base: "/"`, which is correct for Vercel (it serves from the domain root). If you later also want a GitHub Pages *project page* deployment (`https://<user>.github.io/<repo>/`), change `base` to `"/<repo-name>/"` for that build only — the two hosts need different values.

Every subsequent push to `main` will auto-deploy on Vercel.

## Accessibility notes

- Semantic landmarks (`header`, `nav`, `main`, `section`, `article`,
  `footer`) throughout.
- Visible focus states on all interactive elements.
- The Instagram link carries `aria-label="ScholarCompass on Instagram"`,
  `target="_blank"`, and `rel="noopener noreferrer"`.
- The hero's 3D tilt animation is skipped entirely under
  `prefers-reduced-motion: reduce` — the frame renders directly in its
  resting, tilted state.
- Form fields use associated `<label>` elements and `aria-describedby` for
  status messages.
