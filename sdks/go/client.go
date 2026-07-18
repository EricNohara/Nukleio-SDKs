package nukleio

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"strings"
)

const DefaultAPIURL = "https://portfolio-website-editor.vercel.app/api/public/getUserData"

// APIError is an unsuccessful or malformed response from the Nukleio API.
type APIError struct {
	Message    string
	StatusCode int
	Body       []byte
}

func (e *APIError) Error() string { return e.Message }

// Client reads portfolio data from the Nukleio public API.
type Client struct {
	apiKey       string
	apiURL       string
	httpClient   *http.Client
	targetUserID string
}

type Option func(*Client) error

func WithAPIURL(apiURL string) Option {
	return func(client *Client) error {
		if strings.TrimSpace(apiURL) == "" {
			return errors.New("Nukleio API URL cannot be empty")
		}
		client.apiURL = apiURL
		return nil
	}
}

func WithHTTPClient(httpClient *http.Client) Option {
	return func(client *Client) error {
		if httpClient == nil {
			return errors.New("Nukleio HTTP client cannot be nil")
		}
		client.httpClient = httpClient
		return nil
	}
}

func WithTargetUserID(targetUserID string) Option {
	return func(client *Client) error {
		client.targetUserID = targetUserID
		return nil
	}
}

func NewClient(apiKey string, options ...Option) (*Client, error) {
	if strings.TrimSpace(apiKey) == "" {
		return nil, errors.New("a non-empty Nukleio API key is required")
	}
	client := &Client{
		apiKey:     apiKey,
		apiURL:     DefaultAPIURL,
		httpClient: http.DefaultClient,
	}
	for _, option := range options {
		if option == nil {
			return nil, errors.New("Nukleio client option cannot be nil")
		}
		if err := option(client); err != nil {
			return nil, err
		}
	}
	return client, nil
}

func (c *Client) GetUserData(ctx context.Context) (*UserData, error) {
	return c.getUserData(ctx, c.targetUserID)
}

func (c *Client) GetUserDataFor(ctx context.Context, targetUserID string) (*UserData, error) {
	return c.getUserData(ctx, targetUserID)
}

func (c *Client) getUserData(ctx context.Context, targetUserID string) (*UserData, error) {
	request, err := http.NewRequestWithContext(ctx, http.MethodGet, c.apiURL, nil)
	if err != nil {
		return nil, fmt.Errorf("create Nukleio request: %w", err)
	}
	request.Header.Set("Accept", "application/json")
	request.Header.Set("Authorization", "Bearer "+c.apiKey)
	request.Header.Set("User-Agent", "nukleio-go")
	if targetUserID != "" {
		request.Header.Set("X-Target-User-Id", targetUserID)
	}

	response, err := c.httpClient.Do(request)
	if err != nil {
		return nil, fmt.Errorf("request Nukleio user data: %w", err)
	}
	defer response.Body.Close()
	body, err := io.ReadAll(response.Body)
	if err != nil {
		return nil, fmt.Errorf("read Nukleio response: %w", err)
	}

	if response.StatusCode < 200 || response.StatusCode >= 300 {
		var errorBody struct {
			Message string `json:"message"`
		}
		_ = json.Unmarshal(body, &errorBody)
		if errorBody.Message == "" {
			errorBody.Message = fmt.Sprintf("Nukleio API request failed with status %d", response.StatusCode)
		}
		return nil, &APIError{
			Message: errorBody.Message, StatusCode: response.StatusCode, Body: body,
		}
	}

	var envelope struct {
		UserInfo *UserData `json:"userInfo"`
	}

	if err := json.Unmarshal(body, &envelope); err != nil {
		return nil, &APIError{
			Message:    fmt.Sprintf("Nukleio returned an invalid response body: %v", err),
			StatusCode: response.StatusCode,
			Body:       body,
		}
	}

	if envelope.UserInfo == nil {
		return nil, &APIError{
			Message:    "Nukleio response did not contain userInfo",
			StatusCode: response.StatusCode,
			Body:       body,
		}
	}

	return envelope.UserInfo, nil
}
