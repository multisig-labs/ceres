default: build 
    ./ceres

copy-contracts artifacts="../gogopool-contracts/artifacts":
    #!/usr/bin/env bash
    set -euo pipefail
    mkdir -p config
    cat {{ artifacts }}/contracts/contract/*.sol/*.json {{ artifacts }}/contracts/contract/tokens/*.sol/*.json \
    | jq  'select(.contractName != null and (.contractName|startswith("Base")|not)) | {(.contractName): {abi: .abi}}' \
    | jq -s add > config/contracts.json

check:
    #!/bin/bash
    set -euo pipefail
    if [ ! -f config/contracts.json ]; then
      echo "Please run 'just copy-contracts' to create a contracts.json file"
      exit 1
    fi
    if [ ! -f config/deployment.json ]; then
      echo "Please run 'just add deployment' to create a deployment.json file"
      exit 1
    fi

build: check
    deno compile --allow-net main.ts

compile: build

clean:
    rm -rf ceres

run: check
    deno run --allow-net main.ts

serve: check
    deno run --allow-net main.ts --mode serve

add mode="dashboard" name="":
    #!/bin/bash
    set -euo pipefail
    if [ {{mode}} = "dashboard" ]; then
      mkdir -p dashboards
      if [ -f dashboards/{{ name }}.ts ]; then
        echo "Dashboard already exists: dashboards/{{ name }}.ts"
        exit 1
      fi
      cp templates/dashboard.ts dashboards/{{ name }}.ts
    elif [ {{mode}} = "deployment" ]; then
      deno run --allow-write scripts/newDeployment.ts
    else
      echo "Unknown mode: {{mode}}"
    fi
