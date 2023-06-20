# Face Recofnition System

A simple facial recognition system to identify and authenticate individuals based on their facial features.

## Get started

### Clone the repo

```shell
git clone https://github.com/hybridappdev/frs.git
cd frs
```

## Install npm packages

Install the `npm` packages described in the `package.json` at root level

```shell
npm install
```

## Client & Server

This repo contains both client and server. To install packages for both, you can the below script

```shell
npm run install-all-deps
```

## Generating clientSecret keys

The `clientSecret` is a secure random bytes secret key used for encrypting passwords

```bash
openssl rand -base64 17
```

<!--
## Build

Run `ng build` to build the project (uses prod environment always i.e., `src/environments/environment.prod.ts`). The build artifacts will be stored in the `dist/` directory.
`dist/replay-ui` can be deployed over server. -->

## Further help

Drop me a mail : syedarshad.js@gmail.com
