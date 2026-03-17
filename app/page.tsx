import UploadForm from "@/components/UploadForm";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* ─── Top Header ─── */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-moxo-border">
        <div className="max-w-5xl mx-auto px-6 md:px-10 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/moxo-icon.png" 
              alt="Moxo Icon" 
              className="w-10 h-10 object-contain drop-shadow-sm"
            />
            <div>
              <h1 className="text-base font-semibold text-moxo-heading tracking-tight leading-tight">
                Bulk Tag Updater
              </h1>
              <p className="text-2xs text-moxo-body-light hidden sm:block">
                Update workspace tags at scale
              </p>
            </div>
          </div>

          {/* Sample file downloads */}
          <div className="flex items-center gap-2.5">
            <a
              href="/api/sample-csv"
              className="inline-flex items-center gap-2 rounded-moxo border border-moxo-border px-4 py-2 text-sm font-medium text-moxo-heading hover:bg-moxo-bg transition-all duration-200 hover:shadow-moxo"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span className="hidden sm:inline">Sample</span> CSV
            </a>
            <a
              href="/api/sample-excel"
              className="inline-flex items-center gap-2 rounded-moxo border border-moxo-border px-4 py-2 text-sm font-medium text-moxo-heading hover:bg-moxo-bg transition-all duration-200 hover:shadow-moxo"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span className="hidden sm:inline">Sample</span> Excel
            </a>
          </div>
        </div>
      </header>

      {/* ─── Page Content ─── */}
      <main className="max-w-5xl mx-auto px-6 md:px-10 py-8">
        {/* Page header */}
        <div className="mb-8 animate-fade-in">
          <h2 className="text-2xl md:text-3xl font-semibold text-moxo-heading tracking-tight">
            Workspace Tag Update
          </h2>
          <p className="mt-2 text-sm text-moxo-body max-w-2xl leading-relaxed">
            Download the sample template, populate it with your workspace IDs and tag values, then upload it to apply bulk tag updates across launched flow workspaces.
          </p>
        </div>

        {/* Upload Section */}
        <UploadForm />

        {/* Logo at bottom */}
        <div className="mt-16 mb-8 flex items-center justify-center opacity-70">
          <img src="/moxo-logo.png" alt="Moxo Logo" className="h-8 md:h-10 object-contain" />
        </div>
      </main>
    </div>
  );
}
