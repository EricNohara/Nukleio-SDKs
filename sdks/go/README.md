# Nukleio for Go

Dependency-free Go client and typed models for the Nukleio public API.

```bash
go get github.com/EricNohara/Nukleio-SDK/sdks/go
```

```go
package main

import (
	"context"
	"log"
	"os"

	nukleio "github.com/EricNohara/Nukleio-SDK/sdks/go"
)

func main() {
	client, err := nukleio.NewClient(os.Getenv("NUKLEIO_API_KEY"))
	if err != nil {
		log.Fatal(err)
	}
	user, err := client.GetUserData(context.Background())
	if err != nil {
		log.Fatal(err)
	}
	log.Println(user.Name)
}
```

Use `WithAPIURL` and `WithHTTPClient` to configure an alternative deployment or HTTP transport. HTTP failures return `*APIError`.
