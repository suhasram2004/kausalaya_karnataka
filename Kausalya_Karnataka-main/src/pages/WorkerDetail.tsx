import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Star, ChevronRight, Phone, Image as ImageIcon, Plus } from "lucide-react";
import { motion } from "motion/react";
import { collection, query, getDocs, doc, getDoc, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import type { Worker, Review } from "../types";

export default function WorkerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [worker, setWorker] = useState<Worker | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [activeTab, setActiveTab] = useState<"services" | "portfolio" | "reviews">("services");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchWorkerData(id);
      fetchReviews(id);
    }
  }, [id]);

  const fetchWorkerData = async (workerId: string) => {
    const docRef = doc(db, "workers", workerId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setWorker({ id: docSnap.id, ...docSnap.data() } as Worker);
    }
    setLoading(false);
  };

  const fetchReviews = async (workerId: string) => {
    const q = query(collection(db, `workers/${workerId}/reviews`));
    const snap = await getDocs(q);
    setReviews(snap.docs.map(d => ({ id: d.id, ...d.data() } as Review)));
  };

  const handlePostReview = async () => {
    if (!newComment.trim() || !worker) return;
    await addDoc(collection(db, `workers/${worker.id}/reviews`), {
      workerId: worker.id,
      userName: auth.currentUser?.displayName || "Anonymous User",
      comment: newComment,
      rating: newRating,
      createdAt: serverTimestamp()
    });
    setNewComment("");
    fetchReviews(worker.id);
  };

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin" />
  </div>;

  if (!worker) return <div className="text-center py-20">Worker not found</div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12"
    >
      <button onClick={() => navigate(-1)} className="group flex items-center gap-3 text-gray-400 font-black text-xs uppercase tracking-widest hover:text-[#1A1A1A] transition-all">
        <div className="w-10 h-10 border border-gray-100 rounded-2xl flex items-center justify-center group-hover:border-gray-200 group-hover:-translate-x-1 transition-all">
          <ChevronRight className="w-5 h-5 rotate-180" />
        </div>
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-[3rem] p-10 border border-[#E5E7EB] shadow-2xl shadow-gray-100 space-y-8 sticky top-24">
            <div className="text-center space-y-4">
              <div className="relative inline-block">
                <img 
                  src={worker.profileImageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${worker.name}`} 
                  className="w-40 h-40 rounded-[2.5rem] object-cover ring-8 ring-orange-50 mx-auto"
                  alt={worker.name}
                />
                <div className="absolute top-0 right-0 bg-orange-600 text-white w-12 h-12 rounded-2xl border-4 border-white flex items-center justify-center">
                  <Star className="w-6 h-6 fill-white text-white" />
                </div>
              </div>
              <div className="space-y-1">
                <h2 className="text-3xl font-black tracking-tight">{worker.name}</h2>
                <p className="text-orange-600 font-black text-sm uppercase tracking-widest">{worker.category}</p>
              </div>
              <div className="flex items-center justify-center gap-2 bg-yellow-400/10 text-yellow-700 w-max mx-auto px-4 py-2 rounded-2xl font-black">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                {worker.rating?.toFixed(1) || "5.0"}
                <span className="text-yellow-600/50 hidden md:inline ml-1 font-bold text-xs uppercase">({worker.reviewCount || 0} Reviews)</span>
              </div>
            </div>

            <div className="space-y-6 border-t border-gray-50 pt-8">
               <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0 text-orange-600">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Base Location</h4>
                    <p className="font-bold text-sm">{worker.location}</p>
                  </div>
               </div>
               
               <p className="text-gray-400 text-sm font-medium leading-relaxed italic">
                 "{worker.bio}"
               </p>

               <button className="w-full bg-[#1A1A1A] text-white py-6 rounded-[2rem] font-black text-lg flex items-center justify-center gap-3 hover:bg-black transition-all active:scale-95 shadow-2xl shadow-gray-200 uppercase tracking-widest">
                  <Phone className="w-6 h-6" /> REQUEST CALL
               </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-10">
          <div className="flex gap-4 border-b border-gray-100 pb-2">
            {(["services", "portfolio", "reviews"] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-4 text-xs font-black uppercase tracking-[0.2em] transition-all relative ${
                  activeTab === tab ? "text-[#1A1A1A]" : "text-gray-300 hover:text-gray-900"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-0 right-0 h-1 bg-orange-600 rounded-full" />
                )}
              </button>
            ))}
          </div>

          <div className="min-h-[500px]">
             {activeTab === "services" && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {worker.services?.map((s, i) => (
                       <div key={i} className="bg-white p-8 rounded-[2rem] border border-gray-100 flex justify-between items-center group hover:border-orange-100 transition-colors">
                         <div className="space-y-1">
                           <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Fixed Service Card</p>
                           <h4 className="font-black text-xl tracking-tight">{s.title}</h4>
                         </div>
                         <div className="text-right">
                           <p className="text-2xl font-black text-orange-600">{s.price}</p>
                           <div className="text-[10px] font-black text-green-500 uppercase">Trusted Price</div>
                         </div>
                       </div>
                     ))}
                   </div>
                </motion.div>
             )}

             {activeTab === "portfolio" && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[250px]">
                      {worker.portfolio?.map((item, i) => (
                        <div key={i} className={`group relative rounded-[2rem] overflow-hidden bg-gray-100 shadow-xl shadow-gray-100 ${i % 3 === 0 ? "md:col-span-2 md:row-span-2" : ""}`}>
                          <img src={item.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-8">
                             <div className="space-y-1 translate-y-4 group-hover:translate-y-0 transition-transform">
                               <p className="text-white text-[10px] font-black uppercase tracking-widest opacity-60">Verified Work</p>
                               <h5 className="text-white font-bold leading-tight">{item.description}</h5>
                             </div>
                          </div>
                        </div>
                      ))}
                   </div>
                </motion.div>
             )}

             {activeTab === "reviews" && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8 pb-20">
                   <div className="grid grid-cols-1 gap-6">
                      {reviews.length === 0 && (
                        <div className="py-20 text-center bg-gray-50 rounded-[3rem] border-4 border-dashed border-gray-100">
                           <p className="text-gray-300 font-black uppercase text-xs tracking-widest">No feedback yet</p>
                        </div>
                      )}
                      {reviews.map(review => (
                        <div key={review.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6 text-left">
                           <div className="flex items-center justify-between">
                             <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center font-black text-gray-400">
                                  {review.userName[0]}
                                </div>
                                <div>
                                  <h4 className="font-black tracking-tight">{review.userName}</h4>
                                  <p className="text-[10px] text-gray-300 uppercase font-black tracking-widest">Resident Pro</p>
                                </div>
                             </div>
                             <div className="flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-100"}`} />
                                ))}
                             </div>
                           </div>
                           <p className="text-gray-500 font-medium italic">"{review.comment}"</p>
                        </div>
                      ))}
                   </div>

                   {auth.currentUser ? (
                      <div className="bg-[#1A1A1A] p-10 rounded-[3rem] shadow-2xl shadow-black/20 space-y-6 text-left">
                         <h4 className="text-2xl font-black text-white tracking-tight">Your Feedback</h4>
                         <textarea 
                           value={newComment}
                           onChange={(e) => setNewComment(e.target.value)}
                           placeholder="Share your experience..."
                           className="w-full bg-white/5 border border-white/10 rounded-[2rem] p-6 text-white focus:outline-none focus:ring-4 focus:ring-orange-600/20 text-lg placeholder:text-gray-700 h-40"
                         />
                         <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex gap-2">
                              {[1, 2, 3, 4, 5].map(r => (
                                <Star 
                                  key={r} 
                                  onClick={() => setNewRating(r)}
                                  className={`w-8 h-8 cursor-pointer transition-all ${r <= newRating ? "fill-yellow-400 text-yellow-400 scale-110" : "text-gray-800"}`} 
                                />
                              ))}
                            </div>
                            <button 
                              onClick={handlePostReview}
                              className="w-full md:w-auto bg-orange-600 text-white px-12 py-5 rounded-[2rem] font-black text-xl shadow-2xl active:scale-95 transition-all hover:bg-orange-700 uppercase tracking-widest"
                            >
                              Post Feedback
                            </button>
                         </div>
                      </div>
                   ) : (
                      <div className="bg-white p-12 rounded-[3.5rem] border-2 border-dashed border-gray-100 text-center">
                         <button onClick={() => signInWithPopup(auth, new GoogleAuthProvider())} className="text-orange-600 font-black text-xl hover:underline">Sign in to leave feedback</button>
                      </div>
                   )}
                </motion.div>
             )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
