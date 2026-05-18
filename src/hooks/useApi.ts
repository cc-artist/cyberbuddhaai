'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';

interface UseApiOptions {
  onUnauthorized?: () => void;
  autoFetch?: boolean;
}

export function useApi<T>(
  url: string,
  options: UseApiOptions = {}
) {
  const { onUnauthorized, autoFetch = true } = options;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(url);

      if (response.status === 401) {
        if (onUnauthorized) {
          onUnauthorized();
        } else {
          signIn();
        }
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取数据失败');
      console.error('API fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const postData = async (body: any) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (response.status === 401) {
        if (onUnauthorized) {
          onUnauthorized();
        } else {
          signIn();
        }
        return null;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : '操作失败');
      console.error('API post error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const putData = async (body: any) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (response.status === 401) {
        if (onUnauthorized) {
          onUnauthorized();
        } else {
          signIn();
        }
        return null;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : '操作失败');
      console.error('API put error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteData = async (params?: Record<string, string>) => {
    try {
      setLoading(true);
      setError(null);

      let deleteUrl = url;
      if (params) {
        const searchParams = new URLSearchParams(params);
        deleteUrl = `${url}?${searchParams.toString()}`;
      }

      const response = await fetch(deleteUrl, {
        method: 'DELETE',
      });

      if (response.status === 401) {
        if (onUnauthorized) {
          onUnauthorized();
        } else {
          signIn();
        }
        return null;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : '操作失败');
      console.error('API delete error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [url, autoFetch]);

  return { data, loading, error, fetchData, postData, putData, deleteData };
}
