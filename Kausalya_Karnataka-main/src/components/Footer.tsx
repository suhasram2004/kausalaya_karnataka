import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-8">
        <div className="flex justify-center gap-3 opacity-50 grayscale hover:grayscale-0 transition-all cursor-crosshair">
           <div className="w-12 h-12 bg-gray-200 rounded-2xl" />
           <div className="w-12 h-12 bg-gray-200 rounded-2xl" />
           <div className="w-12 h-12 bg-gray-200 rounded-2xl" />
        </div>
        <p className="text-gray-400 text-sm font-medium max-w-sm mx-auto">
          Professionalizing local skilled labor through verified portfolios and a transparent trust economy.
        </p>
        <div className="flex justify-center flex-wrap gap-8 text-[11px] font-black text-gray-300 uppercase tracking-[0.2em]">
          <Link to="/onboarding" className="hover:text-orange-600 transition-colors">Join as Worker</Link>
          <Link to="/impact" className="hover:text-orange-600 transition-colors">Safety Center</Link>
          <Link to="/impact" className="hover:text-orange-600 transition-colors">Our Mission</Link>
        </div>
        <div className="pt-8 text-[10px] font-bold text-gray-300">© 2026 KAUSHALYA KARNATAKA. ALL RIGHTS VERIFIED.</div>
      </div>
    </footer>
  );
}
