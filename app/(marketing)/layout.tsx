export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <header>{/* marketing header */}</header>
      <main>{children}</main>
      <footer>{/* marketing footer */}</footer>
    </div>
  );
}
