export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <aside>{/* nav */}</aside>
      <section>{children}</section>
    </div>
  );
}
