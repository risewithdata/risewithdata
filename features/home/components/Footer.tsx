export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">

        <div className="grid gap-12 lg:grid-cols-5">

          {/* Brand */}
          <div className="lg:col-span-2">
            <a href="/" className="text-xl font-bold text-white">
              RiseWithData
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed">
              Live, cohort-based Power BI and data analytics training designed to get
              you job-ready in 8 weeks.
            </p>
            <div className="mt-6 flex gap-4 text-sm">
              <a href="#" className="hover:text-white">Twitter</a>
              <a href="#" className="hover:text-white">LinkedIn</a>
              <a href="#" className="hover:text-white">Instagram</a>
            </div>
          </div>

          {/* Fellowships */}
          <div>
            <p className="font-semibold text-white">Fellowships</p>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a href="/fellowships/power-bi-data-analyst-fellowship" className="hover:text-white">
                  Power BI Fellowship
                </a>
              </li>
              <li>
                <a href="/fellowships/cohort-washington" className="hover:text-white">
                  Cohort Washington
                </a>
              </li>
              <li>
                <a href="/fellowships/cohort-lincoln" className="hover:text-white">
                  Cohort Lincoln
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="font-semibold text-white">Company</p>
            <ul className="mt-4 space-y-3 text-sm">
              <li><a href="/about" className="hover:text-white">About Us</a></li>
              <li><a href="/contact" className="hover:text-white">Contact</a></li>
              <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
              <li><a href="#" className="hover:text-white">Blog</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <p className="font-semibold text-white">Support</p>
            <ul className="mt-4 space-y-3 text-sm">
              <li><a href="/contact" className="hover:text-white">Help Center</a></li>
              <li><a href="/terms" className="hover:text-white">Terms of Service</a></li>
              <li><a href="/privacy" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="/cookies" className="hover:text-white">Cookie Policy</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col gap-4 border-t border-slate-800 pt-8 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} RiseWithData. All rights reserved.</p>
          <p>
            Built for data professionals by data professionals.{' '}
            <a href="mailto:risewithdatausa@gmail.com" className="hover:text-white">
              risewithdatausa@gmail.com
            </a>
          </p>
        </div>

      </div>
    </footer>
  );
}
