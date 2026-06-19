# Code - OSS Fork Plan

FreeAI IDE starts as a VS Code extension. A standalone editor can be built later from Code - OSS after the extension is stable, tested, and packaged.

## Goals

- Bundle FreeAI as a built-in extension.
- Keep Ollama as the default provider.
- Keep cloud providers optional and BYOK.
- Preserve workspace-only tool access and user-approved edits.
- Avoid Microsoft VS Code branding.

## Branding Boundaries

Do not use Microsoft VS Code names, icons, marketplace branding, product identifiers, or update endpoints in a fork.

Areas to review in Code - OSS:

- `product.json`
- app name and bundle identifiers
- icons and splash assets
- extension gallery configuration
- update service configuration
- telemetry configuration
- license and notices

## Integration Steps

1. Build and package the FreeAI extension as `.vsix`.
2. Clone the correct Code - OSS upstream revision.
3. Add FreeAI as a built-in extension.
4. Replace product metadata and icons.
5. Disable or replace Microsoft-specific gallery and update endpoints.
6. Build the macOS app.
7. Verify the app launches without official VS Code branding.
8. Verify FreeAI chat opens, Ollama streams, and patch approval works.
9. Document third-party licenses and source availability.

## Release Checklist

- [ ] Extension compiles.
- [ ] Extension tests pass.
- [ ] `.vsix` builds.
- [ ] Code - OSS fork uses non-Microsoft branding.
- [ ] Built-in FreeAI extension activates.
- [ ] No telemetry is enabled by default.
- [ ] Ollama remains the default provider.
- [ ] Cloud context warning appears for external providers.
- [ ] Security boundaries match `SECURITY.md`.
