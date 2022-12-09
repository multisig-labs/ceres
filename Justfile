TEMPLATE_DASHBOARD := '// deno-lint-ignore-file no-explicit-any
import { Metrics } from \"../lib/types.ts\";

export default [
  {
    type: \"contract\",
    metric: {
      source: \"eth\",
      contract: \"Contract\",
      method: \"method\",
      args: [],
      formatter: (value: any) => value,
      title: \"Title\",
      desc: \"Description\",
    },
  } as Metrics,
];'

default:
    @just --list --unsorted

copy-contracts artifacts="../gogopool-contracts/artifacts":
    #!/usr/bin/env bash
    set -euo pipefail
    mkdir -p config
    cat {{ artifacts }}/contracts/contract/*.sol/*.json {{ artifacts }}/contracts/contract/tokens/*.sol/*.json \
    | jq  'select(.contractName != null and (.contractName|startswith("Base")|not)) | {(.contractName): {abi: .abi}}' \
    | jq -s add > config/contracts.json

build:
    deno compile main.ts

compile: build

run:
    deno run main.ts

add mode="dashboard" name="":
    #!/bin/bash
    set -euo pipefail
    if [ {{mode}} = "dashboard" ]; then
      mkdir -p dashboards
      echo -e "{{TEMPLATE_DASHBOARD}}" > dashboards/{{ name }}.ts
    elif [ {{mode}} = "deployment" ]; then
      deno run scripts/newDeployment.ts
    else
      echo "Unknown mode: {{mode}}"
    fi
