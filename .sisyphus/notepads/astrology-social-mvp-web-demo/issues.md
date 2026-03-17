## Task 1: Bootstrap Issues (2026-03-17)

### create-next-app Conflict
- Issue: `create-next-app` refused to scaffold in directory with existing files (.sisyphus/, docx)
- Resolution: Manual scaffold by creating all config files individually

### Vitest Import Error
- Issue: `import { defineConfig } from "vitest"` caused TypeScript error during build
- Resolution: Changed to `import { defineConfig } from "vitest/config"`

### tsconfig.json Type Conflicts
- Issue: vitest.config.ts and playwright.config.ts were being type-checked by Next.js
- Resolution: Added both files to tsconfig.json exclude list

### Vitest --runInBand Flag
- Issue: Vitest 3.x doesn't support `--runInBand` flag (Jest-style)
- Resolution: Just run `vitest run` without the flag (sequential by default)

### Missing Favicon (404 Error)
- Issue: Browser console error on homepage load - favicon.ico returned 404
- Resolution: Created minimal 16x16 favicon.ico in app/ directory using ImageMagick