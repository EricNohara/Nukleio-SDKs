# Nukleio for .NET

.NET 8 client and typed models for the Nukleio public API.

```bash
dotnet add package Nukleio
```

```csharp
using Nukleio;

var client = new NukleioClient(Environment.GetEnvironmentVariable("NUKLEIO_API_KEY")!);
UserData user = await client.GetUserDataAsync();
Console.WriteLine(user.Name);
```

HTTP failures throw `NukleioApiException`, which includes `StatusCode` and `ResponseBody`. Inject an `HttpClient` and pass `apiUrl` to integrate with an existing HTTP pipeline or alternative deployment.
