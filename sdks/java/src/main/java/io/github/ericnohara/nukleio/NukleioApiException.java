package io.github.ericnohara.nukleio;

/** An unsuccessful or malformed response from the Nukleio API. */
public class NukleioApiException extends RuntimeException {
    private final int statusCode;
    private final String responseBody;

    public NukleioApiException(String message, int statusCode, String responseBody) {
        super(message);
        this.statusCode = statusCode;
        this.responseBody = responseBody;
    }

    public int getStatusCode() {
        return statusCode;
    }

    public String getResponseBody() {
        return responseBody;
    }
}
