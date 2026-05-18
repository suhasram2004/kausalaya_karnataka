import { Plus, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { GoogleAuthProvider, signInWithPopup, signOut, User as FirebaseUser } from "firebase/auth";

interface HeaderProps {
  user: FirebaseUser | null;
}

export default function Header({ user }: HeaderProps) {
  const navigate = useNavigate();

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleLogout = () => signOut(auth);

  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-4 h-18 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 cursor-pointer">
          <div className="w-11 h-11 bg-orange-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-600/20 rotate-3 transition-transform hover:rotate-0">
            <Plus className="w-7 h-7 rotate-45" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-orange-600 italic">Kaushalya<span className="text-gray-900 not-italic">Karnataka</span></h1>
        </Link>

        <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest">
          <Link to="/" className="hidden md:block hover:text-orange-600 transition-colors">Explore</Link>
          <Link to="/impact" className="hidden md:block hover:text-orange-600 transition-colors">Impact</Link>
          
          <div className="h-6 w-px bg-gray-200 mx-2 hidden md:block" />

          {user ? (
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate("/onboarding")}
                className="hidden md:flex items-center gap-2 bg-[#1A1A1A] text-white px-5 py-2.5 rounded-2xl text-[10px] font-bold hover:bg-black transition-all active:scale-95"
              >
                <Plus className="w-3 h-3" /> My Profile
              </button>
              <div className="group relative">
                <img src={user.photoURL || ""} alt={user.displayName || ""} className="w-10 h-10 rounded-2xl border border-[#E5E7EB] cursor-pointer" />
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-[#E5E7EB] opacity-0 group-hover:opacity-100 transition-opacity p-2 translate-y-2 group-hover:translate-y-0 duration-200">
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl flex items-center gap-2">
                     <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button 
              onClick={handleLogin}
              className="bg-orange-600 text-white px-7 py-3 rounded-2xl shadow-xl shadow-orange-600/20 hover:bg-orange-700 transition-all active:scale-95"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
