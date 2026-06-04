export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-4">
          <div>
            <p className="text-xl font-semibold text-white">RiseWithData</p>
            <p className="mt-4 max-w-xs text-sm leading-6">Premium education for ambitious product professionals, designed to scale careers and teams.</p>
          </div>
          <div>
            <p className="font-semibold text-white">Resources</p>
            <ul className="mt-4 space-y-3 text-sm">
              <li><a href="#courses" className="hover:text-white">Courses</a></li>
              <li><a href="#community" className="hover:text-white">Community</a></li>
              <li><a href="#programs" className="hover:text-white">Programs</a></li>
              <li><a href="#about" className="hover:text-white">Blog</a></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-white">Company</p>
            <ul className="mt-4 space-y-3 text-sm">
              <li><a href="#about" className="hover:text-white">About</a></li>
              <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
              <li><a href="/contact" className="hover:text-white">Contact</a></li>
              <li><a href="/careers" className="hover:text-white">Careers</a></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-white">Legal</p>
            <ul className="mt-4 space-y-3 text-sm">
              <li><a href="/terms" className="hover:text-white">Terms</a></li>
              <li><a href="/privacy" className="hover:text-white">Privacy</a></li>
              <li><a href="/cookies" className="hover:text-white">Cookies</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-16 flex flex-col gap-6 border-t border-slate-800 pt-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 RiseWithData. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4">
            <a href="#" className="hover:text-white">Twitter</a>
            <a href="#" className="hover:text-white">LinkedIn</a>
            <a href="#" className="hover:text-white">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
