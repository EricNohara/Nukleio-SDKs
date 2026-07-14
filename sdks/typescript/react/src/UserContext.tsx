import {
  NukleioClient,
  type UserData,
  type NukleioClientOptions,
} from "@nukleio/core";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export interface UserProviderProps
  extends Pick<NukleioClientOptions, "apiKey" | "apiUrl" | "fetch" | "targetUserId"> {
  children: ReactNode;
  autoFetch?: boolean;
  initialData?: UserData | null;
}

export interface UserContextValue {
  data: UserData | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<UserData | null>;
}

const UserContext = createContext<UserContextValue | null>(null);

function asError(value: unknown): Error {
  return value instanceof Error ? value : new Error("Unable to load Nukleio user data");
}

export function UserProvider({
  apiKey,
  apiUrl,
  fetch,
  targetUserId,
  children,
  autoFetch = true,
  initialData = null,
}: UserProviderProps) {
  const client = useMemo(
    () => new NukleioClient({ apiKey, apiUrl, fetch, targetUserId }),
    [apiKey, apiUrl, fetch, targetUserId],
  );
  const [data, setData] = useState<UserData | null>(initialData);
  const [loading, setLoading] = useState(autoFetch && initialData === null);
  const [error, setError] = useState<Error | null>(null);
  const request = useRef<AbortController | null>(null);

  const refetch = useCallback(async (): Promise<UserData | null> => {
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    setLoading(true);
    setError(null);

    try {
      const nextData = await client.getUserData({ signal: controller.signal });
      if (!controller.signal.aborted) setData(nextData);
      return nextData;
    } catch (caught) {
      if (controller.signal.aborted) return null;
      const nextError = asError(caught);
      setData(null);
      setError(nextError);
      return null;
    } finally {
      if (!controller.signal.aborted) setLoading(false);
      if (request.current === controller) request.current = null;
    }
  }, [client]);

  useEffect(() => {
    if (autoFetch) {
      void refetch();
    } else {
      setLoading(false);
    }

    return () => request.current?.abort();
  }, [autoFetch, refetch]);

  const value = useMemo<UserContextValue>(
    () => ({ data, loading, error, refetch }),
    [data, loading, error, refetch],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUserContext(): UserContextValue {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used inside a UserProvider");
  }
  return context;
}

export function useUserData(): UserData | null {
  return useUserContext().data;
}
