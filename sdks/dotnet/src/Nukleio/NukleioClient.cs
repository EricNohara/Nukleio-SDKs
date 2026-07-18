using System.Net.Http.Headers;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Nukleio;

/// <summary>Client for reading portfolio data from the Nukleio public API.</summary>
public sealed class NukleioClient
{
    public static readonly Uri DefaultApiUrl = new(
        "https://portfolio-website-editor.vercel.app/api/public/getUserData");

    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower,
        PropertyNameCaseInsensitive = true,
    };

    private readonly string _apiKey;
    private readonly HttpClient _httpClient;
    private readonly Uri _apiUrl;
    private readonly string? _targetUserId;

    public NukleioClient(
        string apiKey,
        HttpClient? httpClient = null,
        Uri? apiUrl = null,
        string? targetUserId = null)
    {
        if (string.IsNullOrWhiteSpace(apiKey))
            throw new ArgumentException("A non-empty Nukleio API key is required", nameof(apiKey));

        _apiKey = apiKey;
        _httpClient = httpClient ?? new HttpClient();
        _apiUrl = apiUrl ?? DefaultApiUrl;
        _targetUserId = targetUserId;
    }

    public async Task<UserData> GetUserDataAsync(
        string? targetUserId = null,
        CancellationToken cancellationToken = default)
    {
        using var request = new HttpRequestMessage(HttpMethod.Get, _apiUrl);
        request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);
        request.Headers.UserAgent.ParseAdd("nukleio-dotnet");
        var resolvedTarget = targetUserId ?? _targetUserId;
        if (!string.IsNullOrWhiteSpace(resolvedTarget))
            request.Headers.Add("X-Target-User-Id", resolvedTarget);

        using var response = await _httpClient.SendAsync(request, cancellationToken)
            .ConfigureAwait(false);
        var body = await response.Content.ReadAsStringAsync(cancellationToken).ConfigureAwait(false);

        if (!response.IsSuccessStatusCode)
        {
            throw new NukleioApiException(
                ReadErrorMessage(body, (int)response.StatusCode),
                (int)response.StatusCode,
                body);
        }

        try
        {
            var envelope = JsonSerializer.Deserialize<UserDataEnvelope>(body, JsonOptions);
            return envelope?.UserInfo
                ?? throw new NukleioApiException(
                    "Nukleio returned an invalid response body", (int)response.StatusCode, body);
        }
        catch (JsonException exception)
        {
            throw new NukleioApiException(
                $"Nukleio returned an invalid response body: {exception.Message}",
                (int)response.StatusCode,
                body);
        }
    }

    private static string ReadErrorMessage(string body, int statusCode)
    {
        try
        {
            using var document = JsonDocument.Parse(body);
            if (document.RootElement.TryGetProperty("message", out var message) &&
                message.ValueKind == JsonValueKind.String)
                return message.GetString()!;
        }
        catch (JsonException)
        {
            // Use the status-based fallback below.
        }
        return $"Nukleio API request failed with status {statusCode}";
    }

    private sealed class UserDataEnvelope
    {
        [JsonPropertyName("userInfo")]
        public UserData? UserInfo { get; init; }
    }
}
