# Prompt Lab Studio

Prompt Lab Studio is a browser-based workspace for editing and organizing image-generation prompts. It uses native HTML, CSS, and JavaScript modules, with Vite for local development and the PixAI Gradio client for image tagging.

## Features

- Prompt editor with syntax highlighting, validation, undo, and redo.
- Danbooru tag search.
- Prompt Cleaner with duplicate removal, exact/fuzzy blocking, and preview before applying.
- Image Tagger with file selection, drag and drop, clipboard paste, and optional browser-side image optimization.
- Tagger categories with confidence thresholds, tag selection, feature filters, sorting, copying, and output formatting.
- Local draft and preference persistence in browser storage.

## Requirements

- Node.js 20.19+ or 22.12+.
- npm.
- A modern browser.

## Run locally

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite.

## Deploy to GitHub Pages

The repository includes a GitHub Actions workflow that builds and deploys the site when changes are pushed to `main`.

1. Upload the project files, including `.github/workflows/deploy-pages.yml` and `vite.config.mjs`.
2. In the GitHub repository, open **Settings → Pages** and set the build source to **GitHub Actions**.
3. Push a commit to `main`, or run the workflow manually from the **Actions** tab.

The site will be published at `https://ruixikuik-1296.github.io/Prompt-Lab-Studio/`.

## Build and tests

```sh
npm run build
npm test
```

The tests use Node's built-in test runner and do not require a test framework dependency.

## Privacy and external services

- Prompt drafts and preferences are stored in the browser's local storage.
- When using the Tagger, the selected image (or its optimized copy, if enabled) is sent to the public `pixai-labs/pixai-tagger-demo` Gradio Space for processing. Its availability, behavior, and terms are controlled by that service.
- Danbooru tag search sends search requests to the Danbooru API.
- Image optimization, when enabled, happens locally in the browser before upload.
- Do not use this application with private prompts or images unless you are comfortable with these storage and external-service behaviors.

## Current limitations

- Tagger feature filters use a curated list of exact tag names and may not match every related tag.
- The `artist:` output option prefixes every tag in the Style category; the current API response does not identify artist tags separately.
- Public API availability and response formats may change outside this project's control.
- This project is a prototype. Review the code and service terms before relying on it for sensitive or production workflows.

## License

This project is licensed under the MIT License. See [LICENSE](./LICENSE).
