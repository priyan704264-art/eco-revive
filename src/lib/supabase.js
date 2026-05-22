import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

const isSupabaseConfigured = 
  supabaseUrl && 
  supabaseUrl !== "your_supabase_url" && 
  supabaseUrl.trim() !== "" &&
  supabaseAnonKey && 
  supabaseAnonKey !== "your_supabase_anon_key" &&
  supabaseAnonKey.trim() !== "";

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// ==========================================
// HIGH-FIDELITY LOCAL STORAGE FALLBACK DB
// ==========================================

const initLocalStorageDB = () => {
  if (!localStorage.getItem("db_users")) {
    localStorage.setItem("db_users", JSON.stringify([
      {
        id: "mock-user-1",
        name: "Priyanshu Kumar",
        email: "priyanshu@example.com",
        city: "Delhi",
        lang_pref: "en",
        verified: true,
        avatar_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
        created_at: new Date().toISOString()
      },
      {
        id: "mock-seller-2",
        name: "Arjun Sharma",
        email: "arjun@example.com",
        city: "Mumbai",
        lang_pref: "hi",
        verified: true,
        avatar_url: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&h=150&q=80",
        created_at: new Date().toISOString()
      }
    ]));
  }

  if (!localStorage.getItem("db_devices")) {
    localStorage.setItem("db_devices", JSON.stringify([
      {
        id: "dev-1",
        user_id: "mock-user-1",
        type: "laptop/pc",
        brand: "Dell",
        photo_url: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=400&q=80",
        scan_result: [],
        created_at: new Date().toISOString()
      }
    ]));
  }

  if (!localStorage.getItem("db_components")) {
    localStorage.setItem("db_components", JSON.stringify([
      {
        id: "comp-1",
        device_id: "dev-1",
        user_id: "mock-seller-2",
        name: "Crucial 8GB DDR4 RAM",
        hindi_name: "क्रूशियल 8GB DDR4 रैम",
        grade: "A",
        reuse_potential: "High",
        safety_risk: "Safe",
        estimated_value_inr: 1500,
        image_url: "https://images.unsplash.com/photo-1562408590-e32931084e23?auto=format&fit=crop&w=300&h=200&q=80",
        status: "in_inventory",
        created_at: new Date().toISOString()
      },
      {
        id: "comp-2",
        device_id: "dev-1",
        user_id: "mock-seller-2",
        name: "Samsung 870 EVO 500GB SSD",
        hindi_name: "सैमसंग 870 ईवीओ 500GB एसएसडी",
        grade: "B",
        reuse_potential: "High",
        safety_risk: "Safe",
        estimated_value_inr: 2100,
        image_url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=300&h=200&q=80",
        status: "in_inventory",
        created_at: new Date().toISOString()
      }
    ]));
  }

  if (!localStorage.getItem("db_listings")) {
    localStorage.setItem("db_listings", JSON.stringify([
      {
        id: "list-1",
        component_id: "comp-1",
        seller_id: "mock-seller-2",
        price_inr: 1399,
        listing_type: "sell",
        description: "Excellent condition RAM. Pulled from working Dell Inspiron laptop. Clean contacts.",
        city: "Mumbai",
        status: "active",
        created_at: new Date().toISOString()
      },
      {
        id: "list-2",
        component_id: "comp-2",
        seller_id: "mock-seller-2",
        price_inr: 1950,
        listing_type: "sell",
        description: "Fully working SATA III SSD. Clean smart report with 94% health remaining.",
        city: "Mumbai",
        status: "active",
        created_at: new Date().toISOString()
      }
    ]));
  }

  if (!localStorage.getItem("db_messages")) {
    localStorage.setItem("db_messages", JSON.stringify([
      {
        id: "msg-1",
        listing_id: "list-1",
        sender_id: "mock-seller-2",
        receiver_id: "mock-user-1",
        message: "Hi! Standard components are tested and ready. Do you have any questions?",
        read: false,
        created_at: new Date(Date.now() - 3600000).toISOString()
      }
    ]));
  }

  if (!localStorage.getItem("db_impact")) {
    localStorage.setItem("db_impact", JSON.stringify([
      {
        id: "imp-1",
        user_id: "mock-user-1",
        components_recovered: 4,
        co2_saved_kg: 1.2,
        landfill_diverted_kg: 0.6,
        total_earnings_inr: 0,
        updated_at: new Date().toISOString()
      },
      {
        id: "imp-2",
        user_id: "mock-seller-2",
        components_recovered: 6,
        co2_saved_kg: 1.8,
        landfill_diverted_kg: 0.9,
        total_earnings_inr: 3349,
        updated_at: new Date().toISOString()
      }
    ]));
  }
};

// Initialize if mock database is needed
if (!supabase) {
  initLocalStorageDB();
}

// Global active session simulation
let currentMockUser = (() => {
  const cached = sessionStorage.getItem("session_user");
  if (cached) return JSON.parse(cached);
  // Default logged in user to make app fully ready immediately
  const users = JSON.parse(localStorage.getItem("db_users") || "[]");
  const defaultUser = users[0] || null;
  if (defaultUser) {
    sessionStorage.setItem("session_user", JSON.stringify(defaultUser));
  }
  return defaultUser;
})();

const getFromLS = (key) => JSON.parse(localStorage.getItem(key) || "[]");
const saveToLS = (key, data) => localStorage.setItem(key, JSON.stringify(data));

// Event system for real-time messages when in mock mode
class LocalEventEmitter {
  constructor() {
    this.listeners = {};
  }
  on(event, cb) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(cb);
    return () => {
      this.listeners[event] = this.listeners[event].filter(x => x !== cb);
    };
  }
  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(data));
    }
  }
}
const localEventBus = new LocalEventEmitter();

// ── AUTH ──
export async function signUp(email, password, name, city) {
  if (supabase) {
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { name, city } }
    });
    if (error) throw error;

    if (data.user) {
      const { error: insertError } = await supabase.from("users").insert({
        id: data.user.id,
        name, email, city,
        lang_pref: "en"
      });
      if (insertError) console.error("Error creating user entry: ", insertError);
    }
    return data;
  } else {
    await new Promise(r => setTimeout(r, 600));
    const users = getFromLS("db_users");
    if (users.find(u => u.email === email)) {
      throw new Error("Email already registered!");
    }
    const newUser = {
      id: `user-${Date.now()}`,
      name, email, city,
      lang_pref: "en",
      avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`,
      created_at: new Date().toISOString()
    };
    users.push(newUser);
    saveToLS("db_users", users);
    
    currentMockUser = newUser;
    sessionStorage.setItem("session_user", JSON.stringify(newUser));
    return { user: newUser };
  }
}

export async function signIn(email, password) {
  if (supabase) {
    const { data, error } = await supabase.auth
      .signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  } else {
    await new Promise(r => setTimeout(r, 600));
    const users = getFromLS("db_users");
    const user = users.find(u => u.email === email);
    if (!user) {
      throw new Error("User not found or password incorrect.");
    }
    currentMockUser = user;
    sessionStorage.setItem("session_user", JSON.stringify(user));
    return { user };
  }
}

export async function signOut() {
  if (supabase) {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } else {
    currentMockUser = null;
    sessionStorage.removeItem("session_user");
  }
}

export async function getUser() {
  if (supabase) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Fetch profile
        let { data: profile, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();
        
        // If table exists but profile row is missing (e.g. signup sync failed previously because table was created late)
        if (!profile && (!error || error.code !== "PGRST205")) {
          const name = user.user_metadata?.name || user.email.split("@")[0];
          const city = user.user_metadata?.city || "Delhi";
          const { data: newProfile } = await supabase
            .from("users")
            .insert({
              id: user.id,
              name,
              email: user.email,
              city,
              lang_pref: "en"
            })
            .select()
            .single();
          if (newProfile) profile = newProfile;
        }
        
        return { ...user, ...profile };
      }
      return null;
    } catch (e) {
      console.warn("Error in getUser:", e);
      return null;
    }
  } else {
    return currentMockUser;
  }
}

// ── DEVICES ──
export async function saveDevice(deviceData) {
  if (supabase) {
    const { data, error } = await supabase
      .from("devices")
      .insert(deviceData)
      .select()
      .single();
    if (error) throw error;
    return data;
  } else {
    const devices = getFromLS("db_devices");
    const newDevice = {
      id: `dev-${Date.now()}`,
      ...deviceData,
      created_at: new Date().toISOString()
    };
    devices.push(newDevice);
    saveToLS("db_devices", devices);
    return newDevice;
  }
}

// ── COMPONENTS ──
export async function saveComponent(componentData) {
  if (supabase) {
    // Generate standard fallback uuid/identifier if not provided
    const componentId = componentData.id || `comp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const finalData = {
      id: componentId,
      ...componentData
    };
    const { data, error } = await supabase
      .from("components")
      .insert(finalData)
      .select()
      .single();
    if (error) throw error;
    return data;
  } else {
    const components = getFromLS("db_components");
    const newComponent = {
      id: `comp-${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      ...componentData,
      status: componentData.status || "in_inventory",
      created_at: new Date().toISOString()
    };
    components.push(newComponent);
    saveToLS("db_components", components);
    return newComponent;
  }
}

export async function getUserComponents(userId) {
  if (supabase) {
    const { data, error } = await supabase
      .from("components")
      .select("*, devices(*)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  } else {
    const components = getFromLS("db_components");
    const devices = getFromLS("db_devices");
    
    return components
      .filter(c => c.user_id === userId)
      .map(c => ({
        ...c,
        devices: devices.find(d => d.id === c.device_id) || null
      }))
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }
}

export async function uploadComponentImage(file, userId) {
  if (supabase) {
    const fileName = `${userId}/${Date.now()}_${file.name}`;
    try {
      const { data, error } = await supabase.storage
        .from("component-images")
        .upload(fileName, file);
      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from("component-images")
        .getPublicUrl(fileName);
      return urlData.publicUrl;
    } catch (storageErr) {
      console.warn("Storage upload failed (bucket 'component-images' may be missing). Using fallback image URL:", storageErr);
      return "https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=600&q=80";
    }
  } else {
    // Return a beautiful computer part image from Unsplash depending on file name search
    const lowerName = file.name.toLowerCase();
    let url = "https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=600&q=80"; // standard tech motherboard
    if (lowerName.includes("ram")) {
      url = "https://images.unsplash.com/photo-1562408590-e32931084e23?auto=format&fit=crop&w=600&q=80";
    } else if (lowerName.includes("ssd") || lowerName.includes("hdd")) {
      url = "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=600&q=80";
    } else if (lowerName.includes("cpu") || lowerName.includes("process")) {
      url = "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80";
    } else if (lowerName.includes("screen") || lowerName.includes("lcd")) {
      url = "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80";
    }
    return url;
  }
}

// ── LISTINGS ──
export async function createListing(listingData) {
  if (supabase) {
    const { data, error } = await supabase
      .from("listings")
      .insert(listingData)
      .select()
      .single();
    if (error) throw error;
    return data;
  } else {
    const listings = getFromLS("db_listings");
    const components = getFromLS("db_components");

    const newListing = {
      id: `list-${Date.now()}`,
      ...listingData,
      status: "active",
      created_at: new Date().toISOString()
    };
    listings.push(newListing);
    saveToLS("db_listings", listings);

    // Update component status to 'listed'
    const updatedComponents = components.map(c => {
      if (c.id === listingData.component_id) {
        return { ...c, status: "listed" };
      }
      return c;
    });
    saveToLS("db_components", updatedComponents);

    return newListing;
  }
}

export async function getUserListings(userId) {
  if (supabase) {
    const { data, error } = await supabase
      .from("listings")
      .select(`
        *,
        components(*)
      `)
      .eq("seller_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  } else {
    const listings = getFromLS("db_listings");
    const components = getFromLS("db_components");

    return listings
      .filter(l => l.seller_id === userId)
      .map(l => ({
        ...l,
        components: components.find(c => c.id === l.component_id) || null
      }))
      .filter(l => l.components !== null)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }
}

export async function getAllListings(filters = {}) {
  if (supabase) {
    let query = supabase
      .from("listings")
      .select(`
        *,
        components(*),
        users(name, city, avatar_url)
      `)
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (filters.city) query = query.eq("city", filters.city);
    if (filters.minPrice) query = query.gte("price_inr", filters.minPrice);
    if (filters.maxPrice) query = query.lte("price_inr", filters.maxPrice);
    if (filters.grade) query = query.eq("components.grade", filters.grade);
    if (filters.verifiedOnly) query = query.eq("users.verified", true);

    const { data, error } = await query;
    if (error) throw error;
    return data;
  } else {
    const listings = getFromLS("db_listings");
    const components = getFromLS("db_components");
    const users = getFromLS("db_users");

    let results = listings
      .filter(l => l.status === "active")
      .map(l => ({
        ...l,
        components: components.find(c => c.id === l.component_id) || null,
        users: users.find(u => u.id === l.seller_id) || { name: "Eco Seller", city: l.city, avatar_url: "https://api.dicebear.com/7.x/bottts/svg" }
      }))
      .filter(l => l.components !== null); // safety check

    // Apply memory filters
    if (filters.city) {
      results = results.filter(l => (l.city || "").toLowerCase() === filters.city.toLowerCase());
    }
    if (filters.minPrice) {
      results = results.filter(l => l.price_inr >= Number(filters.minPrice));
    }
    if (filters.maxPrice) {
      results = results.filter(l => l.price_inr <= Number(filters.maxPrice));
    }
    if (filters.grade) {
      results = results.filter(l => l.components && l.components.grade === filters.grade);
    }
    if (filters.verifiedOnly) {
      results = results.filter(l => l.users && l.users.verified === true);
    }

    return results.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }
}

// ── IMPACT ──
export async function updateImpact(userId, component) {
  const co2PerComponent = 0.3;
  const weightPerComponent = 0.15;

  if (supabase) {
    const { data: existing } = await supabase
      .from("impact")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (existing) {
      const { error } = await supabase
        .from("impact")
        .update({
          components_recovered: existing.components_recovered + 1,
          co2_saved_kg: existing.co2_saved_kg + co2PerComponent,
          landfill_diverted_kg: 
            existing.landfill_diverted_kg + weightPerComponent,
          updated_at: new Date().toISOString()
        })
        .eq("user_id", userId);
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from("impact")
        .insert({
          user_id: userId,
          components_recovered: 1,
          co2_saved_kg: co2PerComponent,
          landfill_diverted_kg: weightPerComponent,
        });
      if (error) throw error;
    }
  } else {
    const impacts = getFromLS("db_impact");
    const idx = impacts.findIndex(i => i.user_id === userId);
    
    if (idx !== -1) {
      impacts[idx] = {
        ...impacts[idx],
        components_recovered: (impacts[idx].components_recovered || 0) + 1,
        co2_saved_kg: Number((Number(impacts[idx].co2_saved_kg || 0) + co2PerComponent).toFixed(2)),
        landfill_diverted_kg: Number((Number(impacts[idx].landfill_diverted_kg || 0) + weightPerComponent).toFixed(2)),
        updated_at: new Date().toISOString()
      };
    } else {
      impacts.push({
        id: `imp-${Date.now()}`,
        user_id: userId,
        components_recovered: 1,
        co2_saved_kg: co2PerComponent,
        landfill_diverted_kg: weightPerComponent,
        total_earnings_inr: 0,
        updated_at: new Date().toISOString()
      });
    }
    saveToLS("db_impact", impacts);
  }
}

export async function getUserImpact(userId) {
  if (supabase) {
    const { data, error } = await supabase
      .from("impact")
      .select("*")
      .eq("user_id", userId)
      .single();
    if (error) return null;
    return data;
  } else {
    const impacts = getFromLS("db_impact");
    return impacts.find(i => i.user_id === userId) || {
      user_id: userId,
      components_recovered: 0,
      co2_saved_kg: 0,
      landfill_diverted_kg: 0,
      total_earnings_inr: 0
    };
  }
}

// ── MESSAGES (Realtime) ──
export async function getMessages(listingId) {
  if (supabase) {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("listing_id", listingId)
      .order("created_at", { ascending: true });
    if (error) throw error;
    return data || [];
  } else {
    const messages = getFromLS("db_messages");
    return messages
      .filter(m => m.listing_id === listingId)
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  }
}

export async function sendMessage(messageData) {
  if (supabase) {
    const { data, error } = await supabase
      .from("messages")
      .insert(messageData)
      .select()
      .single();
    if (error) throw error;
    return data;
  } else {
    const messages = getFromLS("db_messages");
    const newMessage = {
      id: `msg-${Date.now()}`,
      ...messageData,
      read: false,
      created_at: new Date().toISOString()
    };
    messages.push(newMessage);
    saveToLS("db_messages", messages);

    // Emit live event to channel listeners
    localEventBus.emit(`messages:${messageData.listing_id}`, newMessage);
    return newMessage;
  }
}

export function subscribeToMessages(listingId, callback) {
  if (supabase) {
    return supabase
      .channel(`messages:${listingId}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `listing_id=eq.${listingId}`
      }, (payload) => {
        callback({ new: payload.new });
      })
      .subscribe();
  } else {
    // Return mock subscription object with unsubscribe
    const unsubscribe = localEventBus.on(`messages:${listingId}`, (msg) => {
      // Simulate real-time insert payload format from Supabase
      callback({ new: msg });
    });
    return {
      unsubscribe
    };
  }
}

// ── PURCHASES ──
export async function recordPurchase(purchaseData) {
  if (supabase) {
    const { data, error } = await supabase
      .from("purchases")
      .insert(purchaseData)
      .select()
      .single();
    if (error) throw error;

    // Mark listing as sold
    await supabase.from("listings").update({ status: 'sold' }).eq("id", purchaseData.listing_id);

    // Update seller earnings in impact table
    try {
      const { data: listing } = await supabase
        .from("listings")
        .select("seller_id, price_inr")
        .eq("id", purchaseData.listing_id)
        .single();
      if (listing) {
        const netEarning = Math.round(listing.price_inr * 0.97);
        const { data: existingImpact } = await supabase
          .from("impact")
          .select("*")
          .eq("user_id", listing.seller_id)
          .single();
        if (existingImpact) {
          await supabase.from("impact").update({
            total_earnings_inr: (existingImpact.total_earnings_inr || 0) + netEarning,
            updated_at: new Date().toISOString()
          }).eq("user_id", listing.seller_id);
        } else {
          await supabase.from("impact").insert({
            user_id: listing.seller_id,
            components_recovered: 0,
            co2_saved_kg: 0,
            landfill_diverted_kg: 0,
            total_earnings_inr: netEarning
          });
        }
      }
    } catch (e) {
      console.warn("Could not update seller earnings:", e);
    }

    return data;
  } else {
    const purchases = getFromLS("db_purchases");
    const newPurchase = {
      id: `purch-${Date.now()}`,
      ...purchaseData,
      status: "completed",
      created_at: new Date().toISOString()
    };
    purchases.push(newPurchase);
    saveToLS("db_purchases", purchases);

    // Mark listing as sold
    const listings = getFromLS("db_listings");
    const idx = listings.findIndex(l => l.id === purchaseData.listing_id);
    if (idx !== -1) {
      const soldListing = listings[idx];
      listings[idx].status = 'sold';
      saveToLS("db_listings", listings);

      // Update seller earnings in impact
      const netEarning = Math.round((soldListing.price_inr || 0) * 0.97);
      const impacts = getFromLS("db_impact");
      const impIdx = impacts.findIndex(i => i.user_id === soldListing.seller_id);
      if (impIdx !== -1) {
        impacts[impIdx].total_earnings_inr = (impacts[impIdx].total_earnings_inr || 0) + netEarning;
        impacts[impIdx].updated_at = new Date().toISOString();
      } else {
        impacts.push({
          id: `imp-${Date.now()}`,
          user_id: soldListing.seller_id,
          components_recovered: 0,
          co2_saved_kg: 0,
          landfill_diverted_kg: 0,
          total_earnings_inr: netEarning,
          updated_at: new Date().toISOString()
        });
      }
      saveToLS("db_impact", impacts);
    }

    return newPurchase;
  }
}

export async function getUserPurchases(userId) {
  if (supabase) {
    const { data, error } = await supabase
      .from("purchases")
      .select(`
        *,
        listings(
          id, price_inr, description,
          components(name, hindi_name, image_url)
        )
      `)
      .eq("buyer_id", userId)
      .order("created_at", { ascending: false });
    if (error) return [];
    return data;
  } else {
    const purchases = getFromLS("db_purchases");
    const listings = getFromLS("db_listings");
    const components = getFromLS("db_components");

    return purchases
      .filter(p => p.buyer_id === userId)
      .map(p => {
        const listing = listings.find(l => l.id === p.listing_id) || null;
        const comp = listing ? components.find(c => c.id === listing.component_id) : null;
        return {
          ...p,
          listings: listing ? {
            ...listing,
            components: comp
          } : null
        };
      })
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }
}

// ── ADMIN ──
export async function isAdmin() {
  if (supabase) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;
      const { data } = await supabase
        .from("users")
        .select("is_admin")
        .eq("id", user.id)
        .single();
      return data?.is_admin === true;
    } catch { return false; }
  } else {
    return currentMockUser?.is_admin === true;
  }
}

export async function getAdminStats() {
  if (supabase) {
    const { data } = await supabase.from("admin_stats").select("*").single();
    return data;
  } else {
    const users     = getFromLS("db_users");
    const listings  = getFromLS("db_listings");
    const purchases = getFromLS("db_purchases");
    const impacts   = getFromLS("db_impact");
    const components = getFromLS("db_components");
    return {
      total_users:      users.length,
      total_listings:   listings.length,
      active_listings:  listings.filter(l => l.status === "active").length,
      sold_listings:    listings.filter(l => l.status === "sold").length,
      total_purchases:  purchases.length,
      total_revenue_inr: purchases.reduce((s, p) => s + (p.amount_inr || 0), 0),
      total_components: components.length,
      total_co2_saved:  impacts.reduce((s, i) => s + (i.co2_saved_kg || 0), 0),
    };
  }
}

export async function adminGetAllUsers() {
  if (supabase) {
    const { data, error } = await supabase
      .from("users")
      .select("*, impact(*)")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  } else {
    const users   = getFromLS("db_users");
    const impacts = getFromLS("db_impact");
    return users.map(u => ({
      ...u,
      impact: impacts.find(i => i.user_id === u.id) || null
    }));
  }
}

export async function adminGetAllListings() {
  if (supabase) {
    const { data, error } = await supabase
      .from("listings")
      .select("*, components(*), users(name, email, city)")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  } else {
    const listings   = getFromLS("db_listings");
    const components = getFromLS("db_components");
    const users      = getFromLS("db_users");
    return listings.map(l => ({
      ...l,
      components: components.find(c => c.id === l.component_id) || null,
      users:      users.find(u => u.id === l.seller_id) || null,
    }));
  }
}

export async function adminGetAllPurchases() {
  if (supabase) {
    const { data, error } = await supabase
      .from("purchases")
      .select("*, listings(price_inr, components(name)), users!buyer_id(name, email)")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  } else {
    const purchases  = getFromLS("db_purchases");
    const listings   = getFromLS("db_listings");
    const components = getFromLS("db_components");
    const users      = getFromLS("db_users");
    return purchases.map(p => {
      const listing = listings.find(l => l.id === p.listing_id);
      const comp    = listing ? components.find(c => c.id === listing?.component_id) : null;
      const buyer   = users.find(u => u.id === p.buyer_id);
      return { ...p, listings: listing ? { ...listing, components: comp } : null, users: buyer || null };
    });
  }
}

export async function adminDeleteListing(id) {
  if (supabase) {
    const { error } = await supabase.from("listings").delete().eq("id", id);
    if (error) throw error;
  } else {
    const listings = getFromLS("db_listings").filter(l => l.id !== id);
    saveToLS("db_listings", listings);
  }
}

export async function adminToggleUserBan(userId, banned) {
  if (supabase) {
    const { error } = await supabase
      .from("users")
      .update({ is_banned: banned })
      .eq("id", userId);
    if (error) throw error;
  } else {
    const users = getFromLS("db_users").map(u =>
      u.id === userId ? { ...u, is_banned: banned } : u
    );
    saveToLS("db_users", users);
  }
}

export async function adminToggleVerified(userId, verified) {
  if (supabase) {
    const { error } = await supabase
      .from("users")
      .update({ verified })
      .eq("id", userId);
    if (error) throw error;
  } else {
    const users = getFromLS("db_users").map(u =>
      u.id === userId ? { ...u, verified } : u
    );
    saveToLS("db_users", users);
  }
}

export async function adminUpdateListingStatus(id, status) {
  if (supabase) {
    const { error } = await supabase.from("listings").update({ status }).eq("id", id);
    if (error) throw error;
  } else {
    const listings = getFromLS("db_listings").map(l =>
      l.id === id ? { ...l, status } : l
    );
    saveToLS("db_listings", listings);
  }
}
