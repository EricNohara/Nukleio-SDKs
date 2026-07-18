using System.Net;
using System.Text;
using Xunit;

namespace Nukleio.Tests;

public sealed class NukleioClientTests
{
    [Fact]
    public async Task ReturnsFixtureAndSendsCredentials()
    {
        var fixture = await File.ReadAllTextAsync(Path.Combine(AppContext.BaseDirectory, "user-data.json"));
        var handler = new StubHandler(_ => new HttpResponseMessage(HttpStatusCode.OK)
        {
            Content = new StringContent(fixture, Encoding.UTF8, "application/json"),
        });
        var client = new NukleioClient(
            "nk_test", new HttpClient(handler), new Uri("https://example.test/user"));

        var user = await client.GetUserDataAsync("user_123");

        Assert.Equal("Ada Lovelace", user.Name);
        Assert.Equal("Mathematics", user.Skills[0].Name);
        Assert.Equal("3.94", user.Education[0].Gpa);
        Assert.Equal("Bearer", handler.LastRequest!.Headers.Authorization!.Scheme);
        Assert.Equal("nk_test", handler.LastRequest.Headers.Authorization.Parameter);
        Assert.Equal("user_123", handler.LastRequest.Headers.GetValues("X-Target-User-Id").Single());
    }

    [Fact]
    public async Task ThrowsTypedApiError()
    {
        var handler = new StubHandler(_ => new HttpResponseMessage(HttpStatusCode.Unauthorized)
        {
            Content = new StringContent("{\"message\":\"Unauthorized\"}"),
        });
        var client = new NukleioClient("nk_test", new HttpClient(handler));

        var error = await Assert.ThrowsAsync<NukleioApiException>(() => client.GetUserDataAsync());

        Assert.Equal(401, error.StatusCode);
        Assert.Equal("Unauthorized", error.Message);
    }

    private sealed class StubHandler(Func<HttpRequestMessage, HttpResponseMessage> response)
        : HttpMessageHandler
    {
        public HttpRequestMessage? LastRequest { get; private set; }

        protected override Task<HttpResponseMessage> SendAsync(
            HttpRequestMessage request,
            CancellationToken cancellationToken)
        {
            LastRequest = request;
            return Task.FromResult(response(request));
        }
    }
}
