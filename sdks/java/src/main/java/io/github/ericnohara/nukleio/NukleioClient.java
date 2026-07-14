package io.github.ericnohara.nukleio;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Objects;

/** Thread-safe client for the Nukleio public API. */
public final class NukleioClient {
    public static final URI DEFAULT_API_URI = URI.create(
            "https://portfolio-website-editor.vercel.app/api/public/getUserData");

    private final String apiKey;
    private final URI apiUri;
    private final HttpClient httpClient;
    private final String targetUserId;
    private final ObjectMapper mapper;

    public NukleioClient(String apiKey) {
        this(apiKey, DEFAULT_API_URI, HttpClient.newHttpClient(), null);
    }

    public NukleioClient(String apiKey, URI apiUri, HttpClient httpClient) {
        this(apiKey, apiUri, httpClient, null);
    }

    public NukleioClient(String apiKey, URI apiUri, HttpClient httpClient, String targetUserId) {
        if (apiKey == null || apiKey.trim().isEmpty()) {
            throw new IllegalArgumentException("A non-empty Nukleio API key is required");
        }
        this.apiKey = apiKey;
        this.apiUri = Objects.requireNonNull(apiUri, "apiUri");
        this.httpClient = Objects.requireNonNull(httpClient, "httpClient");
        this.targetUserId = targetUserId;
        this.mapper = new ObjectMapper()
                .setPropertyNamingStrategy(PropertyNamingStrategies.SNAKE_CASE)
                .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    }

    public UserData getUserData() throws IOException, InterruptedException {
        return getUserData(targetUserId);
    }

    public UserData getUserData(String requestedTargetUserId)
            throws IOException, InterruptedException {
        HttpRequest.Builder request = HttpRequest.newBuilder(apiUri)
                .header("Accept", "application/json")
                .header("Authorization", "Bearer " + apiKey)
                .header("User-Agent", "nukleio-java")
                .GET();
        if (requestedTargetUserId != null && !requestedTargetUserId.isBlank()) {
            request.header("X-Target-User-Id", requestedTargetUserId);
        }

        HttpResponse<String> response = httpClient.send(
                request.build(), HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() < 200 || response.statusCode() >= 300) {
            throw new NukleioApiException(
                    readErrorMessage(response.body(), response.statusCode()),
                    response.statusCode(),
                    response.body());
        }

        UserDataEnvelope envelope;
        try {
            envelope = mapper.readValue(response.body(), UserDataEnvelope.class);
        } catch (IOException error) {
            throw new NukleioApiException(
                    "Nukleio returned an invalid response body", response.statusCode(), response.body());
        }
        if (envelope.userInfo == null) {
            throw new NukleioApiException(
                    "Nukleio returned an invalid response body", response.statusCode(), response.body());
        }
        return envelope.userInfo;
    }

    private String readErrorMessage(String body, int statusCode) {
        try {
            JsonNode node = mapper.readTree(body);
            if (node.hasNonNull("message") && node.get("message").isTextual()) {
                return node.get("message").asText();
            }
        } catch (IOException ignored) {
            // Use the status-based fallback below.
        }
        return "Nukleio API request failed with status " + statusCode;
    }

    private static final class UserDataEnvelope {
        @JsonProperty("userInfo")
        public UserData userInfo;
    }
}
