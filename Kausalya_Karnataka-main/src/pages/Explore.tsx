import { useState, useEffect } from "react";
import { Search, MapPin, Star, ChevronRight, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import type { Worker } from "../types";

export default function Explore() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortBy, setSortBy] = useState<"rating" | "experience" | "trusted">("rating");
  const [insights, setInsights] = useState<any>(null);

  useEffect(() => {
    fetchWorkers();
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      const res = await fetch("/api/community/insights");
      const data = await res.json();
      setInsights(data);
    } catch (e) {
      console.error("Failed to fetch insights", e);
    }
  };

  const fetchWorkers = async () => {
    const q = query(collection(db, "workers"));
    const querySnapshot = await getDocs(q);
    const fetchedWorkers = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Worker));
    setWorkers(fetchedWorkers);
  };

  const filteredWorkers = workers.filter(w => {
    const matchesQuery = (w.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) || 
                         (w.category?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
                         (w.location?.toLowerCase() || "").includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "All" || w.category === categoryFilter;
    return matchesQuery && matchesCategory;
  }).sort((a, b) => {
    if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
    if (sortBy === "experience") return (b.yearsExperience || 0) - (a.yearsExperience || 0);
    if (sortBy === "trusted") return (b.reviewCount || 0) - (a.reviewCount || 0);
    return 0;
  });

  return (
    <div className="space-y-12">
      {/* Community Insights Dashboard */}
      {insights && (
        <motion.section 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1A1A1A] rounded-[3rem] p-8 md:p-12 text-white grid grid-cols-2 md:grid-cols-4 gap-8 relative overflow-hidden shadow-2xl shadow-black/20"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/10 blur-[100px] rounded-full -mr-32 -mt-32" />
          <div className="space-y-1">
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">Verified Pros</p>
            <p className="text-3xl font-black">{insights.totalPros}</p>
          </div>
          <div className="space-y-1">
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">Active Neighbors</p>
            <p className="text-3xl font-black">{insights.activeThisWeek}</p>
          </div>
          <div className="space-y-1">
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">Avg. Trust Rating</p>
            <p className="text-3xl font-black text-orange-500">{insights.communityRating}</p>
          </div>
          <div className="space-y-1">
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">Jobs Facilitated</p>
            <p className="text-3xl font-black">{insights.totalJobsFacilitated}+</p>
          </div>
          <div className="col-span-full pt-6 border-t border-white/5 flex items-center justify-between">
            <p className="text-gray-400 text-xs font-medium italic">"{insights.localImpact}"</p>
            <div className="flex items-center gap-2 text-green-400 text-[10px] font-black uppercase tracking-widest">
               <Sparkles className="w-4 h-4" /> Live Local Updates
            </div>
          </div>
        </motion.section>
      )}

      {/* Hero & Search */}
      <section className="text-center space-y-8 py-16">
        <div className="space-y-4">
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs font-black uppercase tracking-[0.3em] text-orange-600"
          >
            Supported by Kaushalya-Karnataka
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-8xl font-black tracking-tight leading-[0.9]"
          >
            Find Verified <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-400">Local Pros.</span>
          </motion.h2>
        </div>
        
        <div className="max-w-3xl mx-auto relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-600 transition-colors w-6 h-6" />
          <input 
            type="text" 
            placeholder="Search for electrician, plumber, carpenter..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border-2 border-gray-100 rounded-[2.5rem] py-6 pl-16 pr-8 text-xl shadow-2xl shadow-gray-200/50 focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:border-orange-600/20 transition-all placeholder:text-gray-300"
          />
        </div>

        <div className="flex flex-wrap justify-center gap-6 items-center">
          <div className="flex flex-wrap justify-center gap-3">
            {["All", "Electrician", "Plumber", "Carpenter", "Painter", "Mechanic"].map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-8 py-3 rounded-2xl text-sm font-black transition-all ${
                  categoryFilter === cat 
                  ? "bg-orange-600 text-white scale-105 shadow-xl shadow-orange-600/20" 
                  : "bg-white text-gray-500 border border-gray-100 hover:border-orange-200 hover:text-orange-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <div className="h-10 w-px bg-gray-200 hidden md:block" />
          
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Sort By:</span>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border-2 border-gray-50 rounded-xl px-4 py-2 text-xs font-black focus:outline-none focus:border-orange-400 transition-colors"
            >
              <option value="rating">Highest Rated</option>
              <option value="experience">Most Experienced</option>
              <option value="trusted">Most Trusted</option>
            </select>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
        {filteredWorkers.map((worker) => (
          <Link
            to={`/profile/${worker.id}`}
            key={worker.id}
            className="bg-white rounded-[2.5rem] p-8 border border-[#E5E7EB] shadow-sm hover:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-all cursor-pointer group flex flex-col justify-between h-[420px]"
          >
            <div>
              <div className="flex items-start justify-between mb-8">
                <div className="relative">
                  <img 
                    src={worker.profileImageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${worker.name}`} 
                    alt={worker.name} 
                    className="w-20 h-20 rounded-[1.5rem] object-cover bg-gray-50 border-2 border-white ring-1 ring-gray-100 group-hover:rotate-6 transition-transform"
                  />
                  <div className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-4 border-white ${worker.verified ? "bg-blue-500" : "bg-green-500"}`} />
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-1.5 bg-yellow-400/10 text-yellow-700 px-3 py-1.5 rounded-xl text-sm font-black">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    {worker.rating?.toFixed(1) || "5.0"}
                  </div>
                  {worker.verified && (
                    <div className="bg-blue-50 text-blue-600 px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">
                       Verified Pro
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                   <h3 className="font-black text-2xl tracking-tight leading-none">{worker.name}</h3>
                   <ChevronRight className="w-5 h-5 text-gray-200 group-hover:text-orange-600 group-hover:translate-x-1 transition-all" />
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-orange-600 py-1.5 px-3 bg-orange-50 rounded-xl">
                    {worker.category}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 py-1.5 px-3 bg-gray-50 rounded-xl flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {worker.location}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-wider text-green-600 py-1.5 px-3 bg-green-50 rounded-xl">
                    {worker.yearsExperience || 0} Years Exp
                  </span>
                </div>
                <p className="text-gray-400 text-sm font-medium leading-relaxed line-clamp-2">
                  {worker.bio}
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
               <div className="flex -space-x-2">
                {[1,2,3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 overflow-hidden">
                     <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${i+worker.name}`} className="w-full h-full object-cover" />
                  </div>
                ))}
                <div className="w-8 h-8 rounded-full border-2 border-white bg-orange-50 text-orange-600 flex items-center justify-center text-[10px] font-black">+{worker.reviewCount || 0}</div>
               </div>
               <div className="text-xs font-black text-gray-900 group-hover:text-orange-600 transition-colors uppercase tracking-widest">VIEW PORTFOLIO</div>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
