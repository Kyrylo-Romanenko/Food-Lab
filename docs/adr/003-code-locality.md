# Code locality and shared correctness

## Status

Accepted.

## Context

Small coding agents need direct code and bounded context.

## Decision

Keep presentation local. Share integrity rules and contracts only as required by C03.

## Consequences

Small markup duplication is allowed. Domain algorithms must have one pure implementation when introduced.
