# Releasing Nukleio SDKs

Releases are independent per ecosystem and are triggered by tags. A release workflow first verifies that the tag version matches the package manifest, then rebuilds and tests before publishing.

## One-time repository setup

Create GitHub environments named `npm`, `pypi`, `maven-central`, `nuget`, and `go`. Add required reviewers if you want a manual approval before a public release.

The package metadata assumes the public repository remains `EricNohara/Nukleio-SDKs`. If it is renamed, update every package's repository URL, the Go module path, registry trusted-publisher policies, and examples before publishing.

### npm (`@nukleio/core` and `@nukleio/react`)

1. Create or claim the `nukleio` npm organization/scope and enable account 2FA.
2. npm requires a package to exist before trusted publishing can be configured. For the initial `0.1.0` only, run the TypeScript checks and sign in with `npm login`. In each package directory, run `pnpm pack`, then manually publish the generated tarball with `npm publish <tarball> --access public`; publish core before React. Packing converts the local `workspace:^` dependency into a normal registry version range.
3. For each package, configure a GitHub Actions trusted publisher with owner `EricNohara`, repository `Nukleio-SDKs`, workflow `release-npm.yml`, environment `npm`, and permission to run `npm publish`.
4. No npm token is stored in GitHub. The workflow uses GitHub OIDC and npm-generated provenance.

### PyPI (`nukleio`)

1. Create a PyPI account with 2FA.
2. Create a pending trusted publisher (or configure it on the existing project) for owner `EricNohara`, repository `Nukleio-SDKs`, workflow `release-python.yml`, package `nukleio`, and environment `pypi`.
3. No PyPI token is required; the workflow uses OIDC.

### Maven Central (`io.github.ericnohara:nukleio`)

1. Create a Central Publisher Portal account and register/verify the `io.github.ericnohara` namespace.
2. Generate a Central user token and a GPG signing key.
3. Add GitHub environment secrets `CENTRAL_USERNAME`, `CENTRAL_PASSWORD`, `GPG_PRIVATE_KEY` (ASCII-armored private key), and `GPG_PASSPHRASE` to `maven-central`.
4. The Sonatype Central Maven plugin validates, uploads, and automatically publishes signed artifacts with source and Javadoc jars.

### NuGet (`Nukleio`)

1. Create a nuget.org account and add a Trusted Publishing policy for owner `EricNohara`, repository `Nukleio-SDKs`, workflow `release-dotnet.yml`, and environment `nuget`.
2. Store the nuget.org profile name (not the email address) as the `NUGET_USER` environment secret. It identifies the policy owner but is not a publish token.
3. The workflow exchanges GitHub's OIDC token for a one-hour NuGet API key immediately before publishing.

### Go

Go has no upload step. Pushing a correctly prefixed semantic-version tag publishes the module from the repository. Because the module lives in a subdirectory, its tags must be `sdks/go/vX.Y.Z`. The workflow tests the tagged source and creates a GitHub release.

## Publishing a version

First update the appropriate manifest and changelog in a normal pull request. For npm, keep both TypeScript package versions equal; the React package's `workspace:^` dependency is converted to that compatible core version when packed.

After that commit is on `main`, push exactly one ecosystem tag:

```bash
git tag npm-v0.1.1
git push origin npm-v0.1.1

git tag python-v0.1.1
git push origin python-v0.1.1

git tag java-v0.1.1
git push origin java-v0.1.1

git tag dotnet-v0.1.1
git push origin dotnet-v0.1.1

git tag sdks/go/v0.1.1
git push origin sdks/go/v0.1.1
```

Do not reuse or move a published tag. Public registries generally do not allow replacing a released version; increment the patch version to correct a failed or bad release.
