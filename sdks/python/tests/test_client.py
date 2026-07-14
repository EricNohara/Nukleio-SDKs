from __future__ import annotations

import json
import sys
import unittest
from pathlib import Path
from unittest.mock import patch
from urllib.error import HTTPError

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from nukleio import NukleioApiError, NukleioClient  # noqa: E402


FIXTURE = (
    Path(__file__).resolve().parents[3]
    / "specification"
    / "fixtures"
    / "user-data.json"
).read_bytes()


class FakeResponse:
    def __init__(self, body: bytes) -> None:
        self.body = body

    def __enter__(self) -> "FakeResponse":
        return self

    def __exit__(self, *_args: object) -> None:
        return None

    def read(self) -> bytes:
        return self.body

    def close(self) -> None:
        return None


class NukleioClientTests(unittest.TestCase):
    @patch("nukleio.client.urlopen")
    def test_returns_fixture_and_sends_credentials(self, urlopen_mock: object) -> None:
        urlopen_mock.return_value = FakeResponse(FIXTURE)  # type: ignore[attr-defined]
        client = NukleioClient("nk_test", target_user_id="user_123")

        user = client.get_user_data()

        self.assertEqual(user["name"], "Ada Lovelace")
        request = urlopen_mock.call_args.args[0]  # type: ignore[attr-defined]
        self.assertEqual(request.get_header("Authorization"), "Bearer nk_test")
        self.assertEqual(request.get_header("X-target-user-id"), "user_123")

    @patch("nukleio.client.urlopen")
    def test_raises_typed_http_error(self, urlopen_mock: object) -> None:
        body = json.dumps({"message": "Unauthorized"}).encode()
        urlopen_mock.side_effect = HTTPError(  # type: ignore[attr-defined]
            "https://example.test", 401, "Unauthorized", {}, FakeResponse(body)
        )

        with self.assertRaises(NukleioApiError) as raised:
            NukleioClient("nk_test").get_user_data()

        self.assertEqual(raised.exception.status_code, 401)
        self.assertEqual(str(raised.exception), "Unauthorized")

    def test_rejects_empty_api_key(self) -> None:
        with self.assertRaises(ValueError):
            NukleioClient(" ")


if __name__ == "__main__":
    unittest.main()
