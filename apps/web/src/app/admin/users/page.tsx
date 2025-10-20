'use client';

import { api } from '@/lib/api';
import { ChevronLeft, ChevronRight, Loader2, Search } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

type UserRole = 'admin' | 'user';

type User = {
  id: string;
  email: string | null;
  name: string | null;
  picture: string | null;
  phoneNumber: string | null;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
};

type ApiMeta = {
  total: number;
  page: number; // 1-based
  limit: number;
  pages?: number;
};

type ApiShapeArray = User[];
type ApiShapeItemsMeta = { items: User[]; meta: ApiMeta };
type ApiShapeDataMeta = {
  data: User[];
  total: number;
  page: number;
  limit: number;
};
type AnyUsersResponse = ApiShapeArray | ApiShapeItemsMeta | ApiShapeDataMeta;

export default function UsersPage() {
  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Normalized state
  const [items, setItems] = useState<User[]>([]);
  const [meta, setMeta] = useState<ApiMeta>({
    total: 0,
    page: 1,
    limit: 10,
    pages: 1,
  });

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebounced(search.trim()), 350);
    return () => clearTimeout(t);
  }, [search]);

  // Refetch when page/limit/search changes
  const reqIdRef = useRef(0);
  useEffect(() => {
    const ctrl = new AbortController();
    const myReqId = ++reqIdRef.current;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get<AnyUsersResponse>('/users', {
          params: { page, limit, search: debounced || undefined },
          signal: ctrl.signal,
        });

        // Ignore stale responses
        if (myReqId !== reqIdRef.current) return;

        // ---- Normalize all supported shapes ----
        let nextItems: User[] = [];
        let nextMeta: ApiMeta = { total: 0, page, limit, pages: 1 };

        if (Array.isArray(data)) {
          // raw array: User[]
          nextItems = data as ApiShapeArray;
          nextMeta = {
            total: nextItems.length,
            page,
            limit,
            pages: Math.max(1, Math.ceil(nextItems.length / limit)),
          };
        } else if ('items' in (data as any) && 'meta' in (data as any)) {
          // { items, meta }
          const d = data as ApiShapeItemsMeta;
          nextItems = d.items ?? [];
          nextMeta = {
            total: d.meta?.total ?? nextItems.length,
            page: d.meta?.page ?? page,
            limit: d.meta?.limit ?? limit,
            pages:
              d.meta?.pages ??
              Math.max(
                1,
                Math.ceil(
                  (d.meta?.total ?? nextItems.length) / (d.meta?.limit ?? limit)
                )
              ),
          };
        } else if ('data' in (data as any)) {
          // { data, total, page, limit }
          const d = data as ApiShapeDataMeta;
          nextItems = d.data ?? [];
          const total = d.total ?? nextItems.length;
          const lim = d.limit ?? limit;
          const pg = d.page ?? page;
          nextMeta = {
            total,
            page: pg,
            limit: lim,
            pages: Math.max(1, Math.ceil(total / lim)),
          };
        }

        setItems(nextItems);
        setMeta(nextMeta);
      } catch (e: any) {
        if (ctrl.signal.aborted) return; // aborted due to remount (Strict Mode) or param change
        const msg =
          e?.response?.data?.message || e?.message || 'Failed to load users.';
        setError(Array.isArray(msg) ? msg.join(', ') : msg);
      } finally {
        if (!ctrl.signal.aborted) setLoading(false);
      }
    })();

    return () => ctrl.abort();
  }, [page, limit, debounced]);

  // Reset to first page on new search or page size change
  useEffect(() => {
    setPage(1);
  }, [debounced, limit]);

  const pageCount = Math.max(
    1,
    meta.pages ?? Math.ceil((meta.total || 0) / (meta.limit || 1))
  );
  const canPrev = meta.page > 1;
  const canNext = meta.page < pageCount;

  return (
    <div className='p-6 space-y-6'>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-2xl font-semibold'>Users</h1>
          <p className='text-sm text-muted-foreground'>
            Manage your application users. Filter by name and paginate results.
          </p>
        </div>

        <div className='flex items-center gap-3'>
          <div className='relative w-72'>
            <span className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2'>
              <Search size={16} className='text-muted-foreground' />
            </span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder='Filter by name…'
              className='w-full rounded-md border bg-white pl-9 pr-3 py-2 text-sm outline-none ring-0 focus:border-foreground'
            />
          </div>
          <select
            value={meta.limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className='h-9 rounded-md border bg-white px-2 text-sm'
          >
            {[10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n} / page
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className='overflow-hidden rounded-xl border bg-white'>
        <div className='relative min-h-[280px]'>
          {loading && (
            <div className='absolute inset-0 grid place-items-center bg-white/50'>
              <Loader2 className='h-5 w-5 animate-spin' />
            </div>
          )}

          {error ? (
            <div className='p-6 text-sm text-red-600'>{error}</div>
          ) : items.length === 0 ? (
            <div className='p-6 text-sm text-muted-foreground'>
              {debounced ? 'No users match your search.' : 'No users found.'}
            </div>
          ) : (
            <table className='w-full border-separate border-spacing-0'>
              <thead>
                <tr className='text-left text-xs uppercase text-muted-foreground'>
                  <th className='border-b px-4 py-3 font-medium'>User</th>
                  <th className='border-b px-4 py-3 font-medium'>Email</th>
                  <th className='border-b px-4 py-3 font-medium'>Phone</th>
                  <th className='border-b px-4 py-3 font-medium'>Role</th>
                  <th className='border-b px-4 py-3 font-medium'>Created</th>
                </tr>
              </thead>
              <tbody>
                {items.map((u) => (
                  <tr key={u.id} className='hover:bg-muted/40'>
                    <td className='border-b px-4 py-3'>
                      <div className='flex items-center gap-3'>
                        <div className='h-9 w-9 overflow-hidden rounded-full bg-muted'>
                          {u.picture ? (
                            <Image
                              src={u.picture}
                              alt={u.name || u.email || 'User'}
                              width={36}
                              height={36}
                              className='h-9 w-9 object-cover'
                            />
                          ) : (
                            <div className='grid h-9 w-9 place-items-center text-xs text-muted-foreground'>
                              {String(u.name || u.email || 'U')
                                .toUpperCase()
                                .charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className='leading-tight'>
                          <div className='text-sm font-medium'>
                            {u.name || '—'}
                          </div>
                          <div className='text-xs text-muted-foreground'>
                            {u.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className='border-b px-4 py-3 text-sm'>
                      {u.email || '—'}
                    </td>
                    <td className='border-b px-4 py-3 text-sm'>
                      {u.phoneNumber || '—'}
                    </td>
                    <td className='border-b px-4 py-3'>
                      <span
                        className={
                          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ' +
                          (u.role === 'admin'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-slate-100 text-slate-700')
                        }
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className='border-b px-4 py-3 text-sm text-muted-foreground'>
                      {u.createdAt
                        ? new Date(u.createdAt).toLocaleDateString()
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className='flex items-center justify-between border-t px-4 py-3'>
          <div className='text-sm text-muted-foreground'>
            Showing{' '}
            <span className='font-medium'>
              {meta.total === 0 ? 0 : (meta.page - 1) * meta.limit + 1}
              {'–'}
              {Math.min(meta.page * meta.limit, meta.total)}
            </span>{' '}
            of <span className='font-medium'>{meta.total}</span>
          </div>

          <div className='flex items-center gap-2'>
            <button
              className='inline-flex h-9 items-center gap-1 rounded-md border px-3 text-sm disabled:opacity-50'
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={!(meta.page > 1) || loading}
            >
              <ChevronLeft className='h-4 w-4' />
              Prev
            </button>
            <span className='min-w-[80px] text-center text-sm'>
              Page <span className='font-medium'>{meta.page}</span> /{' '}
              {pageCount}
            </span>
            <button
              className='inline-flex h-9 items-center gap-1 rounded-md border px-3 text-sm disabled:opacity-50'
              onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
              disabled={!(meta.page < pageCount) || loading}
            >
              Next
              <ChevronRight className='h-4 w-4' />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
