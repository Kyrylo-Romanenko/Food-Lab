# Static Astro and Preact

## Status

Accepted.

## Context

Public recipes need readable HTML without a backend.

## Decision

Use Astro static output. Configure Preact for future meaningful islands. Follow C01 and C05.

## Consequences

Foundation pages ship no client runtime. Interactivity requires a bounded specification.
