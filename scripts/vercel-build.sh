#!/usr/bin/env bash
# scripts/vercel-build.sh
#
# Safety net for Vercel deployments: Vercel's own "Git LFS Support" project
# setting is the documented, supported way to get LFS-tracked files
# (public/audio-models/*.onnx, public/ort/*.wasm) resolved to real binaries
# before the build — that setting should be enabled in Project Settings.
#
# This script is a redundant fallback in case that setting is off, missing,
# or the build image's checkout didn't run LFS smudge for some other
# reason. It tries `git lfs pull` itself, then verifies the files are
# actually real binaries (not ~130-byte pointer text) before letting the
# Next.js build proceed — a broken LFS checkout should fail the build
# loudly here, not ship a broken .onnx/.wasm file to production silently.
set -euo pipefail

LFS_FILES=(
  "public/audio-models/Kim_Vocal_2.onnx"
  "public/ort/ort-wasm-simd-threaded.wasm"
)
MIN_BYTES=1000000 # 1MB — comfortably above a pointer file (~130 bytes), well below real size (13-67MB)

if command -v git-lfs >/dev/null 2>&1; then
  echo "[vercel-build] git-lfs found, running git lfs pull..."
  git lfs pull || echo "[vercel-build] git lfs pull failed or was a no-op — continuing to verification."
else
  echo "[vercel-build] git-lfs binary not found in this build image — skipping pull, continuing to verification."
fi

failed=0
for f in "${LFS_FILES[@]}"; do
  if [ ! -f "$f" ]; then
    echo "[vercel-build] MISSING: $f"
    failed=1
    continue
  fi
  size=$(wc -c < "$f" | tr -d ' ')
  if [ "$size" -lt "$MIN_BYTES" ]; then
    echo "[vercel-build] STILL AN LFS POINTER (only $size bytes): $f"
    failed=1
  else
    echo "[vercel-build] OK ($size bytes): $f"
  fi
done

if [ "$failed" -eq 1 ]; then
  echo ""
  echo "[vercel-build] ERROR: one or more Git LFS files did not resolve to real binaries."
  echo "[vercel-build] Fix: enable 'Git LFS Support' in Vercel Project Settings -> Git,"
  echo "[vercel-build] then redeploy. (git lfs pull was attempted here as a fallback and"
  echo "[vercel-build] was not sufficient — likely because git-lfs isn't installed in this"
  echo "[vercel-build] build image, or the checkout didn't include LFS remote access.)"
  exit 1
fi

echo "[vercel-build] All LFS files verified. Running next build..."
npx next build
