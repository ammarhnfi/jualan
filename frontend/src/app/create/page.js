"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Navigation, Send, ArrowLeft, Building2, Utensils, Construction } from "lucide-react";
import Link from "next/link";
import ShareUX from "@/components/ShareUX";

export default function CreateListing() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category_id: 1,
    price: "",
    contact: "",
  });
  
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [locating, setLocating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [createdListing, setCreatedListing] = useState(null);

  const categories = [
    { id: 1, name: "Food", icon: <Utensils className="w-5 h-5"/> },
    { id: 2, name: "Services", icon: <Construction className="w-5 h-5"/> },
    { id: 3, name: "Retail", icon: <Building2 className="w-5 h-5"/> }
  ];

  const [deviceId, setDeviceId] = useState("");

  useEffect(() => {
    // Auto detect location on load
    handleLocate();
    
    // Setup Device ID Fingerprint
    let currentDevice = localStorage.getItem("device_id");
    if (!currentDevice) {
      currentDevice = "dev_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      localStorage.setItem("device_id", currentDevice);
    }
    setDeviceId(currentDevice);
  }, []);

  const handleLocate = () => {
    setLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLocating(false);
        },
        (error) => {
          console.error("Error getting location", error);
          setLocating(false);
          // Fallback to Depok Center if blocked for demo
          setLocation({ lat: -6.4025, lng: 106.7942 });
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      setLocating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!location.lat || !location.lng) {
      alert("Location is required. Please allow location access.");
      return;
    }
    
    setSubmitting(true);
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || `http://${window.location.hostname}:4000/api`;
      const res = await fetch(`${apiUrl}/listings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          latitude: location.lat,
          longitude: location.lng,
          device_id: deviceId
        })
      });

      if (res.ok) {
        const data = await res.json();
        setCreatedListing(data);
        setSuccess(true);
      } else {
        alert("Failed to create listing");
      }
    } catch (error) {
      console.error(error);
      alert("Error submitting. Are you offline?");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
          <Send className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
          Posted Successfully!
        </h1>
        <p className="text-gray-600 mb-8 max-w-sm">
          Your listing is now live on the map and visible to people nearby in Depok.
        </p>

        <ShareUX listing={createdListing} formTitle={formData.title} />

        <button 
          onClick={() => router.push('/')}
          className="mt-6 font-medium text-blue-600 hover:text-blue-800"
        >
          View Map
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="px-4 py-4 bg-white border-b sticky top-0 z-20 flex items-center gap-3">
        <Link href="/" className="p-2 rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </Link>
        <h1 className="font-bold text-xl">Post Near You</h1>
      </header>

      <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto pb-24 space-y-5">
        
        {/* Location Card */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-full shadow-sm">
              <MapPin className="text-blue-600 w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">Location</p>
              <p className="text-xs text-gray-500">
                {locating ? "Detecting..." : location.lat ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : "Location not set"}
              </p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={handleLocate}
            disabled={locating}
            className="text-white bg-blue-600 p-2 rounded-full hover:bg-blue-700 disabled:opacity-50"
          >
            <Navigation className={`w-4 h-4 ${locating ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Input Fields */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">What are you offering?</label>
            <input 
              required
              type="text" 
              placeholder="e.g. Nasi Goreng, AC Repair" 
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-colors"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">Category</label>
            <div className="grid grid-cols-3 gap-2">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setFormData({...formData, category_id: cat.id})}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border ${
                    formData.category_id === cat.id 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-200 bg-white text-gray-600'
                  }`}
                >
                  {cat.icon}
                  <span className="text-xs font-semibold">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">WhatsApp Number</label>
            <div className="flex bg-gray-50 border border-gray-200 rounded-xl overflow-hidden focus-within:border-blue-500 transition-colors">
              <span className="px-4 py-3 text-gray-500 font-medium bg-gray-100 border-r border-gray-200">+62</span>
              <input 
                required
                type="tel" 
                placeholder="8123456789" 
                className="w-full bg-transparent px-4 py-3 outline-none"
                value={formData.contact}
                onChange={e => setFormData({...formData, contact: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">Price (Optional)</label>
            <input 
              type="number" 
              placeholder="Rp 0" 
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-colors"
              value={formData.price}
              onChange={e => setFormData({...formData, price: e.target.value})}
            />
          </div>

        </div>

        {/* Submit */}
        <div className="fixed bottom-0 left-0 w-full p-4 bg-white border-t">
          <button 
            type="submit"
            disabled={submitting || !location.lat}
            className="w-full max-w-md mx-auto block bg-blue-600 text-white font-bold text-lg py-4 rounded-xl shadow-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Posting..." : "Post Now (30s)"}
          </button>
        </div>
      </form>
    </div>
  );
}
