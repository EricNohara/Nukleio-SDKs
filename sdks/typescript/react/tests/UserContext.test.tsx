import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { UserProvider, useUserContext, useUserData } from "../src";

afterEach(cleanup);

function Consumer() {
  const user = useUserData();
  const { loading, error } = useUserContext();
  if (loading) return <span>loading</span>;
  if (error) return <span>{error.message}</span>;
  return <span>{user?.name ?? "missing"}</span>;
}

describe("UserProvider", () => {
  it("loads data and makes it available to hooks", async () => {
    const fetchMock = vi.fn<typeof fetch>(async () =>
      new Response(
        JSON.stringify({
          userInfo: {
            email: "ada@example.com",
            name: "Ada Lovelace",
            skills: [],
            experiences: [],
            projects: [],
            education: [],
            subscription: null,
          },
        }),
        { status: 200 },
      ),
    );

    render(
      <UserProvider apiKey="nk_test" fetch={fetchMock}>
        <Consumer />
      </UserProvider>,
    );

    expect(screen.getByText("loading")).toBeTruthy();
    await waitFor(() => expect(screen.getByText("Ada Lovelace")).toBeTruthy());
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it("supports server-provided initial data without fetching", () => {
    const fetchMock = vi.fn<typeof fetch>();
    render(
      <UserProvider
        apiKey="nk_test"
        fetch={fetchMock}
        autoFetch={false}
        initialData={{
          email: "ada@example.com",
          name: "Ada Lovelace",
          bio: null,
          current_position: null,
          current_company: null,
          phone_number: null,
          current_address: null,
          github_url: null,
          linkedin_url: null,
          portrait_url: null,
          resume_url: null,
          transcript_url: null,
          facebook_url: null,
          instagram_url: null,
          x_url: null,
          skills: [],
          experiences: [],
          projects: [],
          education: [],
          subscription: null,
        }}
      >
        <Consumer />
      </UserProvider>,
    );

    expect(screen.getByText("Ada Lovelace")).toBeTruthy();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
