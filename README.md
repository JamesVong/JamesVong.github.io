# JamesVong.github.io

Personal portfolio site — a Vite + React SPA deployed to GitHub Pages.

## How it works

**Stack:** React 18, React Router v6, Vite 5, Three.js, `@mkkellogg/gaussian-splats-3d`

**Pages**
- `/` — Home: hero 3D scene, about, publications, experience, projects, education, skills
- `/resume` — Inline PDF resume viewer

**3D Hero (Gaussian Splatting)**

The hero section renders a photorealistic 3D scene of the SCU Imaginarium Space using [3D Gaussian Splatting](https://repo-sam.inria.fr/fungraph/3d-gaussian-splatting/). Two quality modes are available:

| Mode | File | Details |
|------|------|---------|
| Quality | `ckpt_last.compressed.ply` (29.6 MB) | Full degree-3 spherical harmonics — view-dependent color |
| Fast | `ckpt_last_lower.compressed.ply` (7.9 MB) | Base color only, no SH data |

Mobile defaults to Fast mode. Both files use the SuperSplat/PlayCanvas compressed PLY format (chunked quantization with optional `sh` element). The library reads the `sh` element's 45 `f_rest_*` coefficients and the viewer is initialized with `sphericalHarmonicsDegree: 2` for Quality mode so the GPU shader computes view-dependent color (the viewer caps at degree 2; degree 3 data in the file provides the full 45 coefficients, of which 24 are used).

**Data**

All resume content (education, experience, publications, projects, skills) lives in [`src/data/resumeData.js`](src/data/resumeData.js) — edit that file to update content without touching components.

## Running locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

**Other commands**

```bash
npm run build    # production build → dist/
npm run preview  # serve the dist/ build locally
```

**Deploying**

Push to the `main` branch. GitHub Pages serves the `dist/` output (configured in repo settings to deploy from the built files or via a workflow if one is added).
