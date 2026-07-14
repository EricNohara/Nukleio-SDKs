# Nukleio SDKs

Official, small SDKs for reading a Nukleio user's public portfolio data with an API key. Every SDK calls the same endpoint and returns the same typed data model.

> Status: the monorepo starts at `0.1.0`. Packages are ready to build and publish, but registry accounts and trusted-publisher policies must be created by a repository owner before the first release.

## Packages

| Ecosystem               | Package                                      | Source                                           | Install                                             |
| ----------------------- | -------------------------------------------- | ------------------------------------------------ | --------------------------------------------------- |
| JavaScript / TypeScript | `@nukleio/core`                              | [`sdks/typescript/core`](sdks/typescript/core)   | `npm install @nukleio/core`                         |
| React                   | `@nukleio/react`                             | [`sdks/typescript/react`](sdks/typescript/react) | `npm install @nukleio/react @nukleio/core`          |
| Python                  | `nukleio`                                    | [`sdks/python`](sdks/python)                     | `pip install nukleio`                               |
| Java                    | `io.github.ericnohara:nukleio`               | [`sdks/java`](sdks/java)                         | Maven or Gradle                                     |
| .NET                    | `Nukleio`                                    | [`sdks/dotnet`](sdks/dotnet)                     | `dotnet add package Nukleio`                        |
| Go                      | `github.com/EricNohara/Nukleio-SDKs/sdks/go` | [`sdks/go`](sdks/go)                             | `go get github.com/EricNohara/Nukleio-SDKs/sdks/go` |

The canonical HTTP contract is [`specification/openapi.yaml`](specification/openapi.yaml), with a representative response in [`specification/fixtures/user-data.json`](specification/fixtures/user-data.json).

## API credentials

Create an API key in Nukleio's **Connect / API Keys** page. SDKs send it as `Authorization: Bearer <key>` to:

```text
https://portfolio-website-editor.vercel.app/api/public/getUserData
```

The endpoint is configurable in every SDK. This is useful for local development or a future Nukleio domain migration.

Never commit an API key. Server-side use is safest. A React app necessarily exposes any key it uses to the browser, so use a dedicated, revocable read-only key and restrict where the site itself exposes the returned data.

## Quick starts

JavaScript / TypeScript:

```ts
import { NukleioClient } from "@nukleio/core";

const client = new NukleioClient({ apiKey: process.env.NUKLEIO_API_KEY! });
const user = await client.getUserData();
console.log(user.name);
```

React:

```tsx
import { UserProvider, useUserData } from "@nukleio/react";

function Profile() {
  const user = useUserData();
  return <h1>{user?.name ?? "Loading…"}</h1>;
}

export function App() {
  return (
    <UserProvider apiKey={import.meta.env.VITE_NUKLEIO_API_KEY}>
      <Profile />
    </UserProvider>
  );
}
```

Python:

```python
import os
from nukleio import NukleioClient

user = NukleioClient(os.environ["NUKLEIO_API_KEY"]).get_user_data()
print(user["name"])
```

Java:

```java
NukleioClient client = new NukleioClient(System.getenv("NUKLEIO_API_KEY"));
UserData user = client.getUserData();
System.out.println(user.name);
```

.NET:

```csharp
var client = new NukleioClient(Environment.GetEnvironmentVariable("NUKLEIO_API_KEY")!);
UserData user = await client.GetUserDataAsync();
Console.WriteLine(user.Name);
```

Go:

```go
client, err := nukleio.NewClient(os.Getenv("NUKLEIO_API_KEY"))
if err != nil { log.Fatal(err) }
user, err := client.GetUserData(context.Background())
```

## Development

Each SDK is intentionally independent so contributors only need the toolchain for the language they are changing. CI tests all six packages.

```bash
# TypeScript and React
corepack enable
pnpm install
pnpm check

# Python
python -m unittest discover -s sdks/python/tests -v

# Java
mvn --file sdks/java/pom.xml verify

# .NET
dotnet test sdks/dotnet/tests/Nukleio.Tests/Nukleio.Tests.csproj

# Go
cd sdks/go && go test ./...
```

See [`MIGRATION.md`](MIGRATION.md) when moving from `portfolio-manager-toolkit`, [`RELEASING.md`](RELEASING.md) for one-time registry setup and exact release commands, and [`CONTRIBUTING.md`](CONTRIBUTING.md) before submitting changes.

## License

ISC
