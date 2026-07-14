# `@nukleio/react`

React context provider and hooks for loading typed Nukleio user data.

```bash
npm install @nukleio/react @nukleio/core
```

```tsx
import { UserProvider, useUserContext, useUserData } from "@nukleio/react";

function Profile() {
  const user = useUserData();
  const { loading, error, refetch } = useUserContext();
  if (loading) return <p>Loading…</p>;
  if (error) return <button onClick={() => void refetch()}>Retry</button>;
  return <h1>{user?.name}</h1>;
}

export function App() {
  return (
    <UserProvider apiKey={import.meta.env.VITE_NUKLEIO_API_KEY}>
      <Profile />
    </UserProvider>
  );
}
```

`useUserData()` returns `UserData | null`. `useUserContext()` additionally exposes `loading`, `error`, and `refetch`. Set `autoFetch={false}` on the provider when data should only load after an explicit call to `refetch`.

Browser code cannot keep an API key secret. Use a dedicated, revocable key and do not render private data into a public site.
