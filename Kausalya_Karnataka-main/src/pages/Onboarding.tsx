import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, ChevronRight, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase";
import type { Service } from "../types";

export default function Onboarding() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: auth.currentUser?.displayName || "",
    category: "Electrician",
    bio: "",
    location: "",
    yearsExperience: 1,
    services: [] as Service[],
    portfolio: [
      { imageUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800", description: "Main Switchboard Installation" },
      { imageUrl: "https://images.unsplash.com/photo-1558444479-27519c3d21c7?q=80&w=800", description: "Industrial Wiring Project" }
    ] as any[]
  });
  const [loading, setLoading] = useState(false);
  const [tempService, setTempService] = useState({ title: "", price: "" });
  const [suggestion, setSuggestion] = useState("");

  const handleRegister = async () => {
    if (!profile.name || !profile.bio || !auth.currentUser) return alert("Please fill at least name and bio");
    setLoading(true);
    try {
      const workerData = {
        ...profile,
        rating: 5.0,
        reviewCount: 0,
        profileImageUrl: auth.currentUser.photoURL || "",
        userId: auth.currentUser.uid,
        verified: false,
        totalJobsDone: 0,
        updatedAt: serverTimestamp()
      };
      await setDoc(doc(db, "workers", auth.currentUser.uid), workerData);
      navigate(`/profile/${auth.currentUser.uid}`);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const askGemini = async () => {
    if (!tempService.title) return;
    setSuggestion("Brewing AI Suggestion...");
    try {
      const res = await fetch("/api/gemini/suggest-service", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trade: profile.category, task: tempService.title })
      });
      const data = await res.json();
      setSuggestion(data.suggestion);
    } catch (e) {
      setSuggestion("GenAI Insight Unavailable");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-4xl mx-auto pb-20 mt-12"
    >
      <div className="flex items-center justify-between mb-12">
        <div className="space-y-1">
          <h2 className="text-4xl font-black tracking-tight leading-none">Craft Your <span className="text-orange-600">Pro Portfolio</span></h2>
          <p className="text-gray-400 font-medium">Showcase your skills to your local community.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <section className="bg-white rounded-[3rem] p-10 border border-[#E5E7EB] shadow-2xl shadow-gray-100/50 space-y-8">
            <h3 className="font-black text-xl tracking-tight border-b border-gray-50 pb-4">Personal Details</h3>
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest pl-1">Professional Name</label>
                <input 
                  value={profile.name}
                  onChange={e => setProfile({...profile, name: e.target.value})}
                  placeholder="e.g. Anand Kumar"
                  className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl p-5 font-bold focus:ring-4 focus:ring-orange-600/5 focus:border-orange-600/20 transition-all outline-none" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest pl-1">Primary Skill Category</label>
                <select 
                  value={profile.category}
                  onChange={e => setProfile({...profile, category: e.target.value})}
                  className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl p-5 font-bold focus:ring-4 focus:ring-orange-600/5 focus:border-orange-600/20 outline-none appearance-none cursor-pointer"
                >
                  <option>Electrician</option>
                  <option>Plumber</option>
                  <option>Carpenter</option>
                  <option>Painter</option>
                  <option>Mechanic</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest pl-1">Bio / Experience Story</label>
                <textarea 
                  value={profile.bio}
                  onChange={e => setProfile({...profile, bio: e.target.value})}
                  placeholder="Tell neighbors about your years of work..."
                  className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl p-5 h-40 font-medium focus:ring-4 focus:ring-orange-600/5 focus:border-orange-600/20 transition-all resize-none outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest pl-1">Location</label>
                <input 
                  value={profile.location}
                  onChange={e => setProfile({...profile, location: e.target.value})}
                  placeholder="e.g. Indiranagar, Bengaluru"
                  className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl p-5 font-bold focus:ring-4 focus:ring-orange-600/5 focus:border-orange-600/20 transition-all outline-none" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest pl-1">Years of Experience</label>
                <input 
                  type="number"
                  value={profile.yearsExperience}
                  onChange={e => setProfile({...profile, yearsExperience: parseInt(e.target.value) || 0})}
                  className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl p-5 font-bold focus:ring-4 focus:ring-orange-600/5 focus:border-orange-600/20 transition-all outline-none" 
                />
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-8 text-left">
          <section className="bg-white rounded-[3rem] p-10 border border-[#E5E7EB] shadow-2xl shadow-gray-100/50 space-y-8">
            <div className="flex items-center justify-between border-b border-gray-50 pb-4">
              <h3 className="font-black text-xl tracking-tight">Price List Cards</h3>
              <Sparkles className="w-5 h-5 text-orange-600 animate-pulse" />
            </div>

            <div className="space-y-6">
               <div className="bg-orange-50/50 p-6 rounded-[2rem] border border-orange-100 space-y-4">
                  <div className="flex gap-3">
                    <input 
                      placeholder="Task (e.g. Tap Repair)" 
                      value={tempService.title}
                      onChange={e => setTempService({...tempService, title: e.target.value})}
                      className="flex-1 bg-white border border-orange-100 rounded-xl px-4 py-3 text-sm font-bold placeholder:text-orange-200 outline-none" 
                    />
                    <input 
                      placeholder="₹Price" 
                      value={tempService.price}
                      onChange={e => setTempService({...tempService, price: e.target.value})}
                      className="w-24 bg-white border border-orange-100 rounded-xl px-4 py-3 text-sm font-black text-orange-600 placeholder:text-orange-200 text-center outline-none" 
                    />
                  </div>
                  
                  {suggestion && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-orange-600 text-white text-[10px] font-black uppercase tracking-wider p-3 rounded-xl">
                       {suggestion}
                    </motion.div>
                  )}

                  <div className="flex gap-2">
                    <button 
                      onClick={askGemini}
                      disabled={!tempService.title}
                      className="flex-1 bg-white text-orange-600 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border border-orange-200 hover:bg-orange-100 transition-all flex items-center justify-center gap-2 group disabled:opacity-30"
                    >
                      <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" /> AI Suggest Price
                    </button>
                    <button 
                      onClick={() => {
                        if (tempService.title) {
                          setProfile({...profile, services: [...profile.services, tempService]});
                          setTempService({ title: "", price: "" });
                          setSuggestion("");
                        }
                      }}
                      className="w-14 bg-orange-600 text-white rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg"
                    >
                      <Plus className="w-6 h-6" />
                    </button>
                  </div>
               </div>

               <div className="grid grid-cols-1 gap-3">
                 {profile.services.map((s, i) => (
                   <div key={i} className="flex justify-between items-center bg-gray-50 px-6 py-4 rounded-2xl border border-gray-100 group transition-all">
                     <span className="font-bold text-sm">{s.title}</span>
                     <div className="flex items-center gap-4">
                        <span className="text-orange-600 font-black">{s.price}</span>
                        <button onClick={() => setProfile({...profile, services: profile.services.filter((_, idx) => idx !== i)})} className="text-gray-300 hover:text-red-600">
                          <Plus className="w-5 h-5 rotate-45" />
                        </button>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          </section>

          <button 
            onClick={handleRegister}
            disabled={loading}
            className="w-full bg-[#1A1A1A] text-white py-8 rounded-[3rem] font-black text-2xl hover:bg-black transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-4 group disabled:opacity-50 uppercase tracking-[0.2em]"
          >
            {loading ? "SAVING..." : (
              <>
                PUBLISH <ChevronRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
