import { useState, useEffect, useRef } from "react";
import { 
  sendMessage, 
  subscribeToMessages, 
  getUser,
  getMessages
} from "../lib/supabase";
import { Send, User, Check, ShieldAlert, Loader2 } from "lucide-react";

export default function ChatBox({ listing, onClose }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);

  // Scroll to bottom on new messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    async function initChat() {
      const user = await getUser();
      setCurrentUser(user);

      // Load initial messages from Supabase or localStorage fallback
      try {
        const msgs = await getMessages(listing.id);
        setMessages(msgs || []);
      } catch {
        // Fallback to localStorage cache
        const cachedMessages = localStorage.getItem("db_messages");
        if (cachedMessages) {
          const allMsgs = JSON.parse(cachedMessages);
          const filtered = allMsgs.filter(m => m.listing_id === listing.id);
          setMessages(filtered);
        }
      }
      setLoading(false);
      setTimeout(scrollToBottom, 100);
    }

    initChat();
  }, [listing]);

  // Subscribe to real-time messages
  useEffect(() => {
    const channel = subscribeToMessages(listing.id, (payload) => {
      const newMsg = payload.new;
      setMessages(prev => {
        // avoid duplicates
        if (prev.find(m => m.id === newMsg.id)) return prev;
        return [...prev, newMsg];
      });
      setTimeout(scrollToBottom, 100);
    });

    return () => {
      if (channel && typeof channel.unsubscribe === "function") {
        channel.unsubscribe();
      }
    };
  }, [listing]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !currentUser) return;

    const messagePayload = {
      listing_id: listing.id,
      sender_id: currentUser.id,
      receiver_id: listing.seller_id,
      message: inputText.trim()
    };

    setInputText("");

    try {
      // Save locally/Supabase
      await sendMessage(messagePayload);

      // In mock mode, simulate an automated seller response if user is the buyer
      if (currentUser.id !== listing.seller_id) {
        setIsTyping(true);
        setTimeout(async () => {
          setIsTyping(false);
          const sellerResponses = [
            "Haan bhai, active hai! component bilkul working condition mein hai. Aap kahan se ho?",
            "Yes, listing active hai. Maine isko full check kiya hai, benchmarks perfectly normal hain.",
            "Bhai price thoda bohot negotiate ho jayega agar aap local pickup karoge.",
            "Working fine, bubble wrap mein packed rakha hai safely. Kab tak chahiye aapko?"
          ];
          const randomResponse = sellerResponses[Math.floor(Math.random() * sellerResponses.length)];
          
          const replyPayload = {
            listing_id: listing.id,
            sender_id: listing.seller_id,
            receiver_id: currentUser.id,
            message: randomResponse
          };
          await sendMessage(replyPayload);
        }, 2000);
      }
    } catch (err) {
      console.error("Error sending message: ", err);
    }
  };

  return (
    <div className="glass-panel rounded-2xl overflow-hidden border border-slate-700/60 shadow-2xl flex flex-col h-[500px] max-w-md mx-auto animate-float-subtle">
      {/* Active listing header */}
      <div className="bg-slate-900/90 border-b border-slate-800 p-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/10">
            {listing.components?.name?.substring(0, 2).toUpperCase() || "⚙️"}
          </div>
          <div>
            <h4 className="text-sm font-bold text-white truncate max-w-[180px]" title={listing.components?.name}>
              {listing.components?.name}
            </h4>
            <p className="text-xs text-slate-400">
              Seller: <span className="text-blue-400 font-semibold">{listing.users?.name || "Eco Seller"}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/25">
            ₹{listing.price_inr}
          </span>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 hover:bg-slate-800 rounded-lg transition"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-slate-950/40 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-full text-slate-500">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500 mr-2" />
            <span>Connecting secured channel...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 text-center p-6">
            <p className="text-sm font-semibold text-slate-400">Start the Conversation 💬</p>
            <p className="text-xs text-slate-500 mt-1">Inquire about grading reports, benchmarks, or delivery hubs.</p>
          </div>
        ) : (
          messages.map((msg, i) => {
            const isMe = currentUser && msg.sender_id === currentUser.id;
            return (
              <div
                key={msg.id || i}
                className={`flex ${isMe ? "justify-end" : "justify-start"} animate-fadeIn`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm shadow-md transition-all duration-300
                    ${isMe 
                      ? "bg-blue-600 text-white rounded-tr-none" 
                      : "bg-slate-800/90 text-slate-100 border border-slate-700/50 rounded-tl-none"}`}
                >
                  <p className="leading-relaxed font-medium">{msg.message}</p>
                  <div className={`text-[10px] mt-1 flex items-center justify-end gap-1
                    ${isMe ? "text-blue-200" : "text-slate-400"}`}>
                    <span>
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {isMe && <Check className="w-3 h-3 stroke-[3px]" />}
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* Simulated Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start animate-pulse-subtle">
            <div className="bg-slate-800 text-slate-300 border border-slate-700/50 rounded-2xl rounded-tl-none px-4 py-2.5 text-xs flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-400" />
              <span>Seller is typing a reply...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input footer */}
      <form onSubmit={handleSend} className="p-3 bg-slate-900/90 border-t border-slate-800 flex gap-2 flex-shrink-0">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask seller a question..."
          className="flex-1 bg-slate-950 text-sm text-slate-100 rounded-xl px-4 py-2 border border-slate-850 focus:outline-none focus:border-blue-500 placeholder-slate-500 transition-colors"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white disabled:bg-slate-800 disabled:text-slate-500 transition shadow-lg hover:shadow-blue-500/10"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
