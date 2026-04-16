import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      <main className="flex flex-col flex-1 items-center justify-center px-6">
        {/* Logo/Branding */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tighter mb-2">shop.</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Your next favorite thing is here.</p>
        </div>

        {/* Main Action Box */}
        <div className="w-full max-w-sm p-8 border border-zinc-100 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/50 dark:border-zinc-800 shadow-sm">
          <div className="flex flex-col gap-4">
            <Link 
              href="/signup" 
              className="flex items-center justify-center w-full bg-zinc-900 text-white h-12 rounded-xl font-medium hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-all"
            >
              Get Started
            </Link>
            
            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-zinc-200 dark:border-zinc-800"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-zinc-50 px-2 text-zinc-500 dark:bg-zinc-900">Already a member?</span>
              </div>
            </div>

            <Link 
              href="/login" 
              className="flex items-center justify-center w-full border border-zinc-200 h-12 rounded-xl font-medium hover:bg-white dark:border-zinc-700 dark:hover:bg-zinc-800 transition-all"
            >
              Log In
            </Link>
          </div>
        </div>

        {/* Subtle Footer */}
        <p className="mt-12 text-xs text-zinc-400 tracking-widest uppercase">
          Curated Excellence • 2026
        </p>
      </main>
    </div>
  );
}