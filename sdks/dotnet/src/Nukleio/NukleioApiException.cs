namespace Nukleio;

/// <summary>An unsuccessful or malformed response from the Nukleio API.</summary>
public sealed class NukleioApiException : Exception
{
    public NukleioApiException(string message, int? statusCode = null, string? responseBody = null)
        : base(message)
    {
        StatusCode = statusCode;
        ResponseBody = responseBody;
    }

    public int? StatusCode { get; }
    public string? ResponseBody { get; }
}
