#!/usr/bin/env bash
set -Eeuo pipefail
release=${1:?Usage: release.sh COMMIT_SHA}
[[ "$release" =~ ^[a-f0-9]{40}$ ]] || { echo "Invalid release ID" >&2; exit 1; }
app=/root/cankonix-node/apps/sdmk-global
cd "$app"
exec 9>"$app/.deploy.lock"
flock -w 120 9
source_dir="$app/releases/$release"
test -f "$source_dir/index.html"
previous=''
if [[ -f "$app/current-release" ]]; then previous=$(cat "$app/current-release"); fi
docker network inspect cankonix-proxy >/dev/null
docker build -t "sdmk-global:$release" "$source_dir"
rollback() {
    if [[ "$previous" =~ ^[a-f0-9]{40}$ ]] && [[ -f "$app/releases/$previous/compose.yaml" ]]; then
        echo "Restoring previous release $previous" >&2
        IMAGE_TAG="$previous" docker compose -f "$app/releases/$previous/compose.yaml" up -d --wait --wait-timeout 60
    fi
}
trap 'rollback' ERR
IMAGE_TAG="$release" docker compose -f "$source_dir/compose.yaml" up -d --wait --wait-timeout 60
docker exec sdmk-global wget -q -O /dev/null http://127.0.0.1/landing-page.html
printf '%s\n' "$release" > "$app/current-release.tmp"
mv "$app/current-release.tmp" "$app/current-release"
trap - ERR
echo "Deployed $release"
