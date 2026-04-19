export function createQueryString(name, value, searchParams, router, pathname) {
  const params = new URLSearchParams(searchParams.toString());

  params.set(name?.toLowerCase(), String(value)?.toLowerCase());
  router.push(`${pathname}?${params.toString()}`, { scroll: false });
}

export function removeQueryString(queryName, searchParams, router, pathname) {
  const params = new URLSearchParams(searchParams.toString());
  const multiDelete = Array.isArray(queryName);

  if (multiDelete) {
    queryName?.forEach((q) => params.delete(q.toLowerCase()));
  }
  if (!multiDelete) {
    params.delete(queryName?.toLowerCase());
  }

  router.push(`${pathname}?${params.toString()}`, { scroll: false });
}
