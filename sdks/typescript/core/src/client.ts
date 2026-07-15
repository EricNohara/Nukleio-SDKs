import type { UserData, UserDataResponse } from "./models";

export const DEFAULT_API_URL =
  "https://portfolio-website-editor.vercel.app/api/public/getUserData";

export interface NukleioClientOptions {
  apiKey: string;
  apiUrl?: string;
  fetch?: typeof globalThis.fetch;
  targetUserId?: string;
}

export interface GetUserDataOptions {
  signal?: AbortSignal;
  targetUserId?: string;
}

export class NukleioApiError extends Error {
  readonly status: number;
  readonly responseBody: unknown;

  constructor(message: string, status: number, responseBody?: unknown) {
    super(message);
    this.name = "NukleioApiError";
    this.status = status;
    this.responseBody = responseBody;
  }
}

function assertUserDataResponse(
  value: unknown,
): asserts value is UserDataResponse {
  if (
    typeof value !== "object" ||
    value === null ||
    !("userInfo" in value) ||
    typeof value.userInfo !== "object" ||
    value.userInfo === null
  ) {
    throw new NukleioApiError(
      "Nukleio returned an invalid response body",
      200,
      value,
    );
  }
}

async function readResponseBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

function errorMessage(body: unknown, status: number): string {
  if (
    typeof body === "object" &&
    body !== null &&
    "message" in body &&
    typeof body.message === "string"
  ) {
    return body.message;
  }
  return `Nukleio API request failed with status ${status}`;
}

export class NukleioClient {
  readonly apiUrl: string;
  private readonly apiKey: string;
  private readonly fetchImplementation: typeof globalThis.fetch;
  private readonly targetUserId?: string;

  constructor(options: NukleioClientOptions) {
    if (!options.apiKey?.trim()) {
      throw new TypeError("A non-empty Nukleio API key is required");
    }

    const fetchImplementation =
      options.fetch ?? globalThis.fetch?.bind(globalThis);

    if (typeof fetchImplementation !== "function") {
      throw new TypeError(
        "This runtime does not provide fetch; pass a fetch implementation",
      );
    }

    this.apiKey = options.apiKey;
    this.apiUrl = options.apiUrl ?? DEFAULT_API_URL;
    this.fetchImplementation = fetchImplementation;
    this.targetUserId = options.targetUserId;
  }

  async getUserData(options: GetUserDataOptions = {}): Promise<UserData> {
    const headers = new Headers({
      Accept: "application/json",
      Authorization: `Bearer ${this.apiKey}`,
    });
    const targetUserId = options.targetUserId ?? this.targetUserId;
    if (targetUserId) headers.set("X-Target-User-Id", targetUserId);

    const response = await this.fetchImplementation(this.apiUrl, {
      method: "GET",
      headers,
      signal: options.signal,
    });
    const body = await readResponseBody(response);

    if (!response.ok) {
      throw new NukleioApiError(
        errorMessage(body, response.status),
        response.status,
        body,
      );
    }

    assertUserDataResponse(body);
    return body.userInfo;
  }
}
