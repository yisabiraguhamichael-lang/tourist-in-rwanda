export default function Footer() {
  return (
    <footer className="bg-dark text-slate-300 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-white text-xl font-bold mb-3">🌍 Tourist in Rwanda</h3>
          <p className="text-sm">
            Discover, book and experience the beauty of Rwanda — from anywhere in the world.
          </p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-secondary">Home</a></li>
            <li><a href="/browse" className="hover:text-secondary">Browse</a></li>
            <li><a href="/dashboard" className="hover:text-secondary">My Bookings</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Contact</h4>
          <p className="text-sm">Kigali, Rwanda</p>
          <p className="text-sm">info@touristinrwanda.rw</p>
        </div>
      </div>
      <div className="border-t border-slate-700 text-center text-xs py-4">
        © {new Date().getFullYear()} Tourist in Rwanda. All rights reserved.
      </div>
    </footer>
  );
}