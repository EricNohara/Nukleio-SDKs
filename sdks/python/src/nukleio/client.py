from __future__ import annotations

import json
from typing import Any, cast
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from .models import UserData

DEFAULT_API_URL = (
    "https://portfolio-website-editor.vercel.app/api/public/getUserData"
)


class NukleioApiError(Exception):
    """An HTTP, network, or response-format error from the Nukleio API."""

    def __init__(
        self,
        message: str,
        status_code: int | None = None,
        response_body: Any = None,
    ) -> None:
        super().__init__(message)
        self.status_code = status_code
        self.response_body = response_body


def _decode_body(raw: bytes) -> Any:
    text = raw.decode("utf-8", errors="replace")
    if not text:
        return None
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        return text


def _message(body: Any, fallback: str) -> str:
    if isinstance(body, dict) and isinstance(body.get("message"), str):
        return cast(str, body["message"])
    return fallback


class NukleioClient:
    def __init__(
        self,
        api_key: str,
        *,
        api_url: str = DEFAULT_API_URL,
        target_user_id: str | None = None,
    ) -> None:
        if not api_key or not api_key.strip():
            raise ValueError("A non-empty Nukleio API key is required")
        self._api_key = api_key
        self.api_url = api_url
        self._target_user_id = target_user_id

    def get_user_data(
        self,
        *,
        target_user_id: str | None = None,
        timeout: float = 30,
    ) -> UserData:
        headers = {
            "Accept": "application/json",
            "Authorization": f"Bearer {self._api_key}",
            "User-Agent": "nukleio-python",
        }
        resolved_target = target_user_id or self._target_user_id
        if resolved_target:
            headers["X-Target-User-Id"] = resolved_target

        request = Request(self.api_url, method="GET", headers=headers)
        try:
            with urlopen(request, timeout=timeout) as response:
                body = _decode_body(response.read())
        except HTTPError as error:
            body = _decode_body(error.read())
            raise NukleioApiError(
                _message(body, f"Nukleio API request failed with status {error.code}"),
                error.code,
                body,
            ) from error
        except URLError as error:
            raise NukleioApiError(f"Unable to reach the Nukleio API: {error.reason}") from error

        if (
            not isinstance(body, dict)
            or "userInfo" not in body
            or not isinstance(body["userInfo"], dict)
        ):
            raise NukleioApiError("Nukleio returned an invalid response body", 200, body)
        return cast(UserData, body["userInfo"])
