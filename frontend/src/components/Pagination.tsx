interface Props {
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, total, onPageChange }: Props) {
  return (
    <div className="flex items-center justify-between rounded-lg border bg-white px-4 py-3 text-xs">
      <span>
        Page <strong>{page}</strong> of <strong>{Math.max(1, totalPages)}</strong> ({total} total)
      </span>

      <div className="flex gap-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="rounded-md border px-3 py-1 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="rounded-md border px-3 py-1 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
