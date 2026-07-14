package nukleio

import (
	"context"
	"errors"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"testing"
)

func TestGetUserData(t *testing.T) {
	fixture, err := os.ReadFile(filepath.Join("..", "..", "specification", "fixtures", "user-data.json"))
	if err != nil {
		t.Fatal(err)
	}
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, request *http.Request) {
		if got := request.Header.Get("Authorization"); got != "Bearer nk_test" {
			t.Errorf("Authorization = %q", got)
		}
		if got := request.Header.Get("X-Target-User-Id"); got != "user_123" {
			t.Errorf("X-Target-User-Id = %q", got)
		}
		w.Header().Set("Content-Type", "application/json")
		_, _ = w.Write(fixture)
	}))
	defer server.Close()

	client, err := NewClient("nk_test", WithAPIURL(server.URL), WithTargetUserID("user_123"))
	if err != nil {
		t.Fatal(err)
	}
	user, err := client.GetUserData(context.Background())
	if err != nil {
		t.Fatal(err)
	}
	if user.Name == nil || *user.Name != "Ada Lovelace" {
		t.Fatalf("Name = %#v", user.Name)
	}
	if len(user.Skills) != 1 || user.Skills[0].Name != "Mathematics" {
		t.Fatalf("Skills = %#v", user.Skills)
	}
}

func TestGetUserDataReturnsAPIError(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusUnauthorized)
		_, _ = w.Write([]byte(`{"message":"Unauthorized"}`))
	}))
	defer server.Close()

	client, err := NewClient("nk_test", WithAPIURL(server.URL))
	if err != nil {
		t.Fatal(err)
	}
	_, err = client.GetUserData(context.Background())
	var apiError *APIError
	if !errors.As(err, &apiError) {
		t.Fatalf("error = %T %v", err, err)
	}
	if apiError.StatusCode != http.StatusUnauthorized || apiError.Message != "Unauthorized" {
		t.Fatalf("APIError = %#v", apiError)
	}
}

func TestNewClientRejectsEmptyAPIKey(t *testing.T) {
	if _, err := NewClient(" "); err == nil {
		t.Fatal("expected an error")
	}
}
