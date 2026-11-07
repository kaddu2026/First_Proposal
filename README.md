# For Kaddu 💌

A small, handcrafted proposal website. React + Vite + plain CSS, no backend, no database,
and only two runtime dependencies (`react`, `react-dom`). The music is synthesised in the
browser, so there are no audio files either. The build is about 55 KB gzipped.

**The journey:** opening screen → heartfelt messages → tap-the-hearts surprises (with a little
pumpkin, since *Kaddu* means pumpkin) → the big question → celebration.

## Project structure

```
kaddu-proposal/
├── .github/workflows/deploy.yml   # auto-deploy to GitHub Pages on every push to main
├── public/favicon.svg
├── src/
│   ├── main.jsx                   # entry point
│   ├── App.jsx                    # the journey (stage state machine) + tap bursts
│   ├── components/
│   │   ├── Ambient.jsx            # gradient, floating hearts, petals, sparkles
│   │   ├── Intro.jsx              # 1. opening
│   │   ├── Feelings.jsx           # 2. messages, one by one
│   │   ├── Surprises.jsx          # 3. clickable hearts + pumpkin
│   │   ├── Question.jsx           # 4. the big question + the runaway NO button
│   │   ├── Celebration.jsx        # 5. confetti, heart explosion, final message, replay
│   │   ├── Pumpkin.jsx            # the SVG pumpkin character
│   │   ├── Heart.jsx, BurstLayer.jsx, MusicControl.jsx
│   ├── hooks/useMusicBox.js       # Web Audio music box + mute/play logic
│   ├── lib/dodge.js               # where the NO button jumps next
│   ├── lib/confetti.js            # tiny canvas particle engine
│   ├── data/messages.js           # ALL the words: edit this to change the text
│   └── styles/                    # global.css, ambient.css, scenes.css
├── index.html
├── vite.config.js
└── package.json
```

## Run it locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in ./dist
npm run preview    # serve the production build locally
```

Needs Node 18+ (the workflow uses Node 22).

## Make it yours

* **Messages**: everything she reads is in `src/data/messages.js` (feelings, the sweet
  surprises, the NO button's remarks). The question and the final letter are in
  `src/components/Question.jsx` and `src/components/Celebration.jsx`.
* **Colours**: the tokens at the top of `src/styles/global.css`.
* **Music**: the melody is the `BARS` array in `src/hooks/useMusicBox.js`.
  Prefer a real song? Put an `.mp3` you have the rights to in `public/` and swap the hook for a
  plain `<audio>` element started from the YES click.

## Deploy to GitHub Pages

### 1. Push the project

Create an empty repository on GitHub (any name, e.g. `kaddu-proposal`; don't add a README or
.gitignore there), then run this inside the project folder:

```bash
git init
git add .
git commit -m "A little surprise for Kaddu"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

### 2. Enable GitHub Pages (one time)

1. On GitHub open the repository → **Settings** → **Pages**.
2. Under **Build and deployment → Source**, choose **GitHub Actions**.
3. Open the **Actions** tab. The *Deploy to GitHub Pages* workflow runs on its own (or push
   again / press *Run workflow*). After about a minute your link appears in the run summary and
   under Settings → Pages:

   `https://<your-username>.github.io/<your-repo>/`

From then on, every `git push` to `main` redeploys automatically.

### About the base path

`vite.config.js` sets `base: './'`, so all asset URLs are relative and the site works on any Pages
address: a project site (`/<repo>/`), a user site (`<user>.github.io`) or a custom domain, with
nothing to edit. If you would rather use an absolute path:
`VITE_BASE=/<your-repo>/ npm run build`.

### Troubleshooting

* **Blank page or 404 on assets**: Pages source must be *GitHub Actions* (not "Deploy from a
  branch"), and the latest workflow run must be green.
* **Workflow fails at `npm ci`**: make sure `package-lock.json` was committed.
* **No music**: browsers only allow sound after a tap. It starts when she presses YES, and the
  round button in the top-right corner mutes or plays it at any time.
* **Fonts look plain**: the typefaces (Fraunces, Nunito, Caveat) load from Google Fonts, so they
  need an internet connection. Georgia and system fonts are the fallbacks.
