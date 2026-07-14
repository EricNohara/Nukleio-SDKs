package io.github.ericnohara.nukleio;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.URI;
import java.net.http.HttpClient;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.atomic.AtomicReference;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class NukleioClientTest {
    private HttpServer server;

    @AfterEach
    void stopServer() {
        if (server != null) server.stop(0);
    }

    @Test
    void returnsFixtureAndSendsCredentials() throws Exception {
        String fixture = new String(
                getClass().getResourceAsStream("/user-data.json").readAllBytes(),
                StandardCharsets.UTF_8);
        AtomicReference<String> authorization = new AtomicReference<>();
        AtomicReference<String> target = new AtomicReference<>();
        URI uri = serve(200, fixture, exchange -> {
            authorization.set(exchange.getRequestHeaders().getFirst("Authorization"));
            target.set(exchange.getRequestHeaders().getFirst("X-Target-User-Id"));
        });

        NukleioClient client = new NukleioClient("nk_test", uri, HttpClient.newHttpClient());
        UserData user = client.getUserData("user_123");

        assertEquals("Ada Lovelace", user.name);
        assertEquals("Mathematics", user.skills.get(0).name);
        assertEquals("Bearer nk_test", authorization.get());
        assertEquals("user_123", target.get());
    }

    @Test
    void throwsTypedApiError() throws Exception {
        URI uri = serve(401, "{\"message\":\"Unauthorized\"}", exchange -> {});
        NukleioClient client = new NukleioClient("nk_test", uri, HttpClient.newHttpClient());

        NukleioApiException error = assertThrows(
                NukleioApiException.class, client::getUserData);
        assertEquals(401, error.getStatusCode());
        assertEquals("Unauthorized", error.getMessage());
    }

    private URI serve(int status, String body, ExchangeObserver observer) throws IOException {
        server = HttpServer.create(new InetSocketAddress(0), 0);
        server.createContext("/user", exchange -> {
            observer.observe(exchange);
            byte[] bytes = body.getBytes(StandardCharsets.UTF_8);
            exchange.getResponseHeaders().set("Content-Type", "application/json");
            exchange.sendResponseHeaders(status, bytes.length);
            exchange.getResponseBody().write(bytes);
            exchange.close();
        });
        server.start();
        return URI.create("http://127.0.0.1:" + server.getAddress().getPort() + "/user");
    }

    @FunctionalInterface
    private interface ExchangeObserver {
        void observe(HttpExchange exchange);
    }
}
