"use client";

import { Copy, Instagram, Share2 } from "lucide-react";

export default function ShareUX({ listing, formTitle }) {
  
  const generateIGCaption = () => {
    return `🔥 Ada yang baru nih di Depok!\n\n${formTitle}\n\n📍 Cek lokasinya di Depok Hyperlocal Market sekarang!\n#DepokMarket #UMKMDepok #InfoDepok`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateIGCaption());
    alert("Copied to clipboard! You can paste it on Instagram or TikTok.");
  };

  return (
    <div className="w-full max-w-sm mt-4 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden text-left">
      <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <Share2 className="w-4 h-4 text-blue-500" />
          Share to Social
        </h3>
      </div>
      
      <div className="p-5">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Instagram / TikTok Caption</p>
        <div className="bg-gray-50 p-4 rounded-xl text-sm text-gray-700 whitespace-pre-wrap border border-gray-100 font-mono mb-4">
          {generateIGCaption()}
        </div>
        
        <button 
          onClick={handleCopy}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-orange-400 text-white font-bold py-3 px-4 rounded-xl shadow-md hover:opacity-90 transition-opacity"
        >
          <Copy className="w-5 h-5" />
          Copy & Share Story
        </button>
      </div>
    </div>
  );
}
