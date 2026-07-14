# Migrating from `portfolio-manager-toolkit`

The old package mixed API access, React hooks, styled UI components, and themes. The new SDK deliberately separates transport/data concerns from React state and does not carry forward the opinionated UI components.

## Package changes

```bash
npm uninstall portfolio-manager-toolkit
npm install @nukleio/core
# React applications also use:
npm install @nukleio/react react
```

Use `@nukleio/core` from any JavaScript or TypeScript runtime. Add `@nukleio/react` only when the application needs context and hooks.

## Hook migration

Before:

```tsx
const user = useUserData(userEmail, apiKey);
```

After:

```tsx
<UserProvider apiKey={apiKey}>
  <App />
</UserProvider>
```

```tsx
const user = useUserData();
const { loading, error, refetch } = useUserContext();
```

The current public API authenticates the API key directly, so `userEmail` is no longer sent. Loading and failure states are explicit instead of both appearing as `null`.

For code outside React:

```ts
const user = await new NukleioClient({ apiKey }).getUserData();
```

## Type changes

`IUserData` is now `UserData`. The new model follows the live Nukleio API: it adds `current_company`, `current_address`, `x_url`, and `subscription`; uses the API's string experience IDs; and correctly marks nullable course fields.

The former `Greeting`, table, social icon, resume/transcript icon, theme, and styled-component exports are intentionally removed. Applications keep full control of presentation and render the typed data returned by core or React.
