"use client";
import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function useQueryParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const params = useMemo(() => {
    return new URLSearchParams(searchParams.toString());
  }, [searchParams]);

  const get = useCallback((key: string) => params.get(key), [params]);

  const getAll = useCallback(() => {
    const result: Record<string, string> = {};
    params.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }, [params]);

  const set = useCallback(
    (key: string, value: string | number | boolean) => {
      const newParams = new URLSearchParams(params.toString());
      newParams.set(key, String(value));

      router.push(`${pathname}?${newParams.toString()}`, {
        scroll: false,
      });
    },
    [router, pathname, params]
  );

  const remove = useCallback(
    (key: string) => {
      const newParams = new URLSearchParams(params.toString());
      newParams.delete(key);

      router.push(`${pathname}?${newParams.toString()}`, {
        scroll: false,
      });
    },
    [router, pathname, params]
  );

  const clear = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [router, pathname]);

  const has = searchParams.toString().length > 0;

  return {
    get,
    getAll,
    set,
    has,
    remove,
    clear,
  };
}
