export function FormSubmitButton({ children, loading }: { children: React.ReactNode; loading?: boolean }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="px-4 py-2 bg-brand-500 text-white rounded hover:bg-brand-500 disabled:opacity-50"
    >
      {loading ? 'Loading...' : children}
    </button>
  );
}
