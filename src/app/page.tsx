import Link from "next/link";
import { ShoppingBag, Sparkles, ArrowRight, Star, Users, Package } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black">
      <main className="flex flex-col flex-1 items-center justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        {/* Hero Section */}
        <div className="w-full max-w-4xl text-center mb-16 space-y-8">
          <div className="space-y-6">
            {/* Badge */}
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Curated Excellence</span>
              </div>
            </div>

            {/* Main Title */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="block text-slate-900 dark:text-white">Discover</span>
              <span className="block text-slate-900 dark:text-white">Timeless</span>
              <span className="block text-slate-900 dark:text-white">Quality</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Handcrafted products that blend tradition with modern elegance. Each item tells a story of craftsmanship and attention to detail.
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="w-full max-w-md space-y-4 mb-16">
          {/* Primary CTA */}
          <Link
            href="/signup"
            className="flex items-center justify-center gap-2 w-full bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 h-12 sm:h-14 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <ShoppingBag className="w-5 h-5" />
            Start Your Journey
            <ArrowRight className="w-4 h-4 opacity-70" />
          </Link>

          {/* Divider */}
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200 dark:border-slate-700"></span>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white dark:bg-slate-950 px-3 text-xs uppercase text-slate-500 dark:text-slate-400 font-medium tracking-widest">
                Already with us?
              </span>
            </div>
          </div>

          {/* Secondary CTA */}
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 w-full border-2 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white h-12 sm:h-14 rounded-xl font-semibold hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-200 backdrop-blur-sm"
          >
            Welcome Back
            <ArrowRight className="w-4 h-4 opacity-70" />
          </Link>
        </div>

        {/* Features Grid */}
        <div className="w-full max-w-6xl mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <Package className="w-6 h-6 text-slate-600 dark:text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Curated Selection</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Every product is carefully selected for its quality and craftsmanship
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <Users className="w-6 h-6 text-slate-600 dark:text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Community Driven</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Join thousands of satisfied customers who trust our recommendations
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <Star className="w-6 h-6 text-slate-600 dark:text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Premium Quality</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Experience the difference that comes with attention to every detail
              </p>
            </div>
          </div>
        </div>

        {/* Social Proof / Stats */}
        <div className="grid grid-cols-3 gap-6 sm:gap-12 text-center w-full max-w-md">
          <div className="space-y-2">
            <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">500+</p>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 uppercase tracking-wider">Premium Products</p>
          </div>
          <div className="space-y-2">
            <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">10K+</p>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 uppercase tracking-wider">Happy Customers</p>
          </div>
          <div className="space-y-2">
            <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">⭐ 4.9</p>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 uppercase tracking-wider">Average Rating</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-8 px-4 border-t border-slate-200 dark:border-slate-800">
        <p className="font-medium tracking-wider uppercase text-slate-500 dark:text-slate-400">Craftsmanship • Quality • Excellence</p>
        <p className="text-sm text-slate-400 dark:text-slate-500 mt-2">© 2026 Curated Shop</p>
      </footer>
    </div>
  );
}