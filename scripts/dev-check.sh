#!/usr/bin/env bash
set -e

echo "== Sales Copilot / Sprint 1 =="
echo "Checking project structure..."

test -f README.md
test -f apps/worker/src/index.ts
test -f apps/worker/src/domain/spin.ts
test -f supabase/migrations/001_initial_schema.sql

echo "OK: estrutura encontrada."
