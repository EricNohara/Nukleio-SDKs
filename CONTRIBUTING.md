# Contributing

Thank you for improving the Nukleio SDKs.

1. Keep the HTTP behavior consistent across every language. Update `specification/openapi.yaml` and the shared fixture first when the API changes.
2. Add or update a contract test in each affected SDK.
3. Never put a real Nukleio API key in tests, examples, fixtures, commits, or CI logs.
4. Run the tests for every package you change. The commands are listed in the root README.
5. Keep public APIs backward compatible within a major version. Additive response fields should not break deserialization.

Package versions are deliberately independent by ecosystem. Release tags and version files must agree; `scripts/verify_release_versions.py` enforces this in CI.
