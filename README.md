# Ceres

The official GoGoPool data harvesting daemon.

## Architecture

See [ARCHITECTURE](docs/ARCHITECTURE.md).

## Misc

> Why the name?

Ceres is the Roman god of harvest.

## Prerequisites 

* [Deno](https://deno.land/)
* [Just](https://just.systems/man/en/)
* [Docker](https://www.docker.com/)

## Available Just Recipes

```
$ just --list
Available recipes:
    add mode="dashboard" name="" # adds a new deployment or dashboard
    build                        # builds the executable
    build-docker                 # builds the docker image
    clean                        # cleans the build artifacts
    compile                      # alias for build
    copy-contracts artifacts="../gogopool-contracts/artifacts" # copies the contracts.json file from the specified hardhat artifacts directory
    default                      # default task
    down mode="dev"              # stops the daemon
    dump                         # runs the executable in dump mode
    logs mode="dev"              # shows daemon logs
    run                          # runs the executable in stout mode
    run-docker mode="stout"      # runs the executable in docker
    serve                        # runs the executable in serve mode
    up mode="dev"                # starts the daemon. Specify mode=prod to run in production mode (without grafana)
```
