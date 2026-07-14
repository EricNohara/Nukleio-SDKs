# Nukleio for Java

Java 11+ client and data classes for the Nukleio public API.

```xml
<dependency>
  <groupId>io.github.ericnohara</groupId>
  <artifactId>nukleio</artifactId>
  <version>0.1.0</version>
</dependency>
```

```java
import io.github.ericnohara.nukleio.NukleioClient;
import io.github.ericnohara.nukleio.UserData;

NukleioClient client = new NukleioClient(System.getenv("NUKLEIO_API_KEY"));
UserData user = client.getUserData();
System.out.println(user.name);
```

HTTP failures throw `NukleioApiException`, which includes the status code and response body. An overload accepts a custom `URI` and `HttpClient` for alternative deployments and tests.
