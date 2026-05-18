import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth } from "./firebase";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Explore from "./pages/Explore";
import WorkerDetail from "./pages/WorkerDetail";
import Onboarding from "./pages/Onboarding";
import Impact from "./pages/Impact";

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-[#F8F9FA] font-sans text-[#1A1A1A]">
        <Header user={user} />
        
        <main className="max-w-7xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Explore />} />
            <Route path="/profile/:id" element={<WorkerDetail />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/impact" element={<Impact />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}
