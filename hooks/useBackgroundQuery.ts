import { useState, useEffect, useRef } from 'react';
import { sendMessage } from '@/services/messages';
import type { MessageRequest, MessageResponseMap } from '@/services/messages';

interface QueryState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook for fetching data from the background script with React Query-like API
 * @param message - The message to send to the background script
 * @param enabled - Whether the query should run (default: true)
 */
export function useBackgroundQuery<T extends MessageRequest>(
  message: T,
  { enabled = true }: { enabled?: boolean } = {}
): QueryState<MessageResponseMap[T['type']]> {
  const [data, setData] = useState<MessageResponseMap[T['type']] | null>(null);
  const [isLoading, setIsLoading] = useState(enabled);
  const [error, setError] = useState<Error | null>(null);

  // Use ref to store the message to avoid infinite loops with object comparisons
  const messageRef = useRef(message);
  const messageKey = JSON.stringify(message);

  const fetchData = async () => {
    if (!enabled) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await sendMessage(messageRef.current);
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    messageRef.current = message;
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messageKey, enabled]);

  const refetch = async () => {
    await fetchData();
  };

  return { data, isLoading, error, refetch };
}

/**
 * Custom hook for mutations (actions that change data) with the background script
 */
export function useBackgroundMutation<T extends MessageRequest>() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (message: T): Promise<MessageResponseMap[T['type']] | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await sendMessage(message);
      return response;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error occurred');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, isLoading, error };
}
