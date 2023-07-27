set dotenv-load
IMAGE_NAME := "ghcr.io/multisig-labs/ceres:main"

# default task
default: 
    just --list

# copies the contracts.json file from the specified hardhat artifacts directory
copy-contracts artifacts="../gogopool/artifacts":
    #!/usr/bin/env bash
    set -euo pipefail
    mkdir -p config
    cat {{ artifacts }}/contracts/contract/*.sol/*.json {{ artifacts }}/contracts/contract/tokens/*.sol/*.json \
    | jq  'select(.contractName != null and (.contractName|startswith("Base")|not)) | {(.contractName): {abi: .abi}}' \
    | jq -s add > config/contracts.json

[private]
check:
    #!/bin/bash
    set -euo pipefail
    if [ ! -f config/contracts.json ]; then
      echo "Optional contracts.json file is missing. If you want to use the contracts, please run 'just copy-contracts <path to hardhat artifacts>'."
    fi
    if [ ! -f config/deployment.json ]; then
      echo "Please run 'just add deployment' to create a deployment.json file"
      exit 1
    fi

# builds the executable
build:
    deno compile --unstable --allow-net --allow-read --allow-write main.ts

# Formats the project
fmt:
    deno fmt

# Alias for fmt
format: fmt

# builds the docker image
build-docker:
    #!/bin/bash
    set -euo pipefail
    ARCH=$(uname -m)
    if [ $ARCH = "aarch64" ]; then
      ARCH="arm64"
    fi
    if [ $ARCH = "x86_64" ]; then
      ARCH="amd64"
    fi
    docker build -f docker/Dockerfile.$ARCH -t {{IMAGE_NAME}} .

build-docker-arm:
    #!/bin/bash
    set -euo pipefail
    docker build -f docker/Dockerfile.arm64 -t {{IMAGE_NAME}} .

build-docker-x86:
    #!/bin/bash
    set -euo pipefail
    docker build --platform linux/amd64 -f docker/Dockerfile.amd64 -t {{IMAGE_NAME}} .

build-docker-cross: build-docker-arm build-docker-x86

# runs the executable in docker
run-docker mode="stout": check
    docker run --rm -p 8080:8080 -v $(pwd)/config:/app/config {{IMAGE_NAME}} --mode {{mode}}

push-docker:
    docker push {{IMAGE_NAME}}

pull-docker:
    docker pull {{IMAGE_NAME}}

# starts the daemon. Specify mode=prod to run in production mode (without grafana)
up mode="dev": check
    #!/bin/bash
    set -euo pipefail
    # if dev mode, build the container
    if [ {{mode}} = "dev" ]; then
      just build-docker
    else 
      just pull-docker
    fi
    docker compose -f docker/docker-compose-{{mode}}.yml up -d

# shows daemon logs
logs mode="dev":
    docker compose -f docker/docker-compose-{{mode}}.yml logs -f

# stops the daemon
down mode="dev":
    docker compose -f docker/docker-compose-{{mode}}.yml down 

# alias for build
compile: build

# cleans the build artifacts
clean:
    rm -rf ceres

# runs the executable in stout mode
run *json: check
    deno run --unstable --allow-env --allow-net --allow-read --allow-sys main.ts {{json}}

# runs the executable in serve mode
serve: check
    deno run --unstable --allow-net --allow-read main.ts --mode serve

# runs the executable in dump mode
dump: check
    deno run --unstable --allow-write=. --allow-read --allow-net main.ts --mode dump

debug mode="stout": check
    deno run --unstable --inspect-brk --allow-net --allow-read main.ts --mode {{mode}}

# adds a new deployment or dashboard
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

updateAddrs storageAddr="0x1cEa17F9dE4De28FeB6A102988E12D4B90DfF1a9" rpcURL="https://api.avax.network/ext/bc/C/rpc" chainID="43114":
  deno run --unstable --allow-net --allow-read=config scripts/updateAddresses.ts -a {{storageAddr}} -u {{rpcURL}} -i {{chainID}}

dev-setup:
  #!/bin/bash
  # if config doesnt exist, copy it from the example folder
  if [ ! -d config ]; then
    cp examples/config config
  fi
  # if ../gogopool isnt cloned, clone it
  if [ ! -d ../gogopool ]; then
    git clone https://github.com/multisig-labs/gogopool.git ../gogopool
  fi
  cd ../gogopool
  yarn
  just build
  cd ../ceres
  just copy-contracts
  echo "Setup nearly complete. See Notion for next steps."
