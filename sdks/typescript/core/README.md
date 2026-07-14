# `@nukleio/core`

Dependency-free TypeScript client and response types for the Nukleio public API. It works in modern browsers, Node.js 18+, Deno, Bun, and other runtimes that provide `fetch`.

```bash
npm install @nukleio/core
```

```ts
import { NukleioClient, type UserData } from "@nukleio/core";

const client = new NukleioClient({ apiKey: process.env.NUKLEIO_API_KEY! });
const user: UserData = await client.getUserData();
```

For tests or alternative deployments, pass `apiUrl` or a custom `fetch` implementation to the constructor. Failed HTTP responses throw `NukleioApiError`, which includes `status` and `responseBody`.
