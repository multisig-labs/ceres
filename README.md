# Ceres

The official GoGoPool data harvesting daemon.

## Architecture

See [ARCHITECTURE](docs/ARCHITECTURE.md).

## Misc

> Why the name?

Ceres is the Roman god of harvest.

## Prerequisites

- [Deno](https://deno.land/)
- [Just](https://just.systems/man/en/)
- [Docker](https://www.docker.com/)

## Available Just Recipes

```
$ just --list
Available recipes:
    default                      # default task
    copy-contracts artifacts="../gogopool-contracts/artifacts" # copies the contracts.json file from the specified hardhat artifacts directory
    build                        # builds the executable
    build-docker                 # builds the docker image
    run-docker mode="stout"      # runs the executable in docker
    up mode="dev"                # starts the daemon. Specify mode=prod to run in production mode (without grafana)
    logs mode="dev"              # shows daemon logs
    down mode="dev"              # stops the daemon
    compile                      # alias for build
    clean                        # cleans the build artifacts
    run                          # runs the executable in stout mode
    serve                        # runs the executable in serve mode
    dump                         # runs the executable in dump mode
    add mode="dashboard" name="" # adds a new deployment or dashboard
```
