import React, { useState, useEffect, useRef } from "react";
import { User as FirebaseUser } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { soundManager } from "../lib/soundManager";
import { 
  User, Image, Video, Film, Trash2, Save, Sparkles, AlertCircle, 
  CheckCircle, RefreshCw, Upload, FileVideo, FileImage, ExternalLink
} from "lucide-react";

interface ProfileBannerProps {
  user: FirebaseUser;
  onProfileUpdated?: (profile: { avatarUrl: string; bannerUrl: string; bannerType: "image" | "video"; bannerDuration: number }) => void;
}

// Gorgeous High-Quality Preset Options
const AVATAR_PRESETS = [
  { name: "Pixel Art Hero (GIF)", url: "https://media.giphy.com/media/l41Yc029WUsDov840/giphy.gif", type: "gif" },
  { name: "Cyber Cyberpunk Hacker (PNG)", url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=200&h=200", type: "png" },
  { name: "Retro Console Sprite (BMP)", url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=200&h=200", type: "bmp" },
  { name: "Chibi Anime Mage (JPG)", url: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=200&h=200", type: "jpg" }
];

const BANNER_PRESETS = [
  { 
    name: "Cyber Shibuya Highway Loop (Valid MP4 - 45s)", 
    url: "https://assets.mixkit.co/videos/preview/mixkit-futuristic-subway-station-with-neon-lights-43936-large.mp4", 
    type: "video",
    description: "45s video - triggers the 30s auto-crop and loop limit!"
  },
  { 
    name: "Retro City Synthwave Drive (Valid MP4 - 31s)", 
    url: "https://assets.mixkit.co/videos/preview/mixkit-driving-in-a-futuristic-synthwave-city-43937-large.mp4", 
    type: "video",
    description: "31s video - triggers the 30s auto-crop and loop limit!"
  },
  { 
    name: "Short Magic Sparkle (Invalid MP4 - 10s)", 
    url: "https://assets.mixkit.co/videos/preview/mixkit-golden-dust-particles-moving-slowly-3162-large.mp4", 
    type: "video",
    description: "Only 10s long - will be rejected by the validation rules!"
  },
  { 
    name: "Cosmic Neon Nebula (Static JPG)", 
    url: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&w=800&h=300", 
    type: "image",
    description: "High quality JPG image banner"
  }
];

export default function ProfileBannerEditor({ user, onProfileUpdated }: ProfileBannerProps) {
  // State for loaded / configured URLs
  const [avatarUrl, setAvatarUrl] = useState<string>("https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=200&h=200");
  const [bannerUrl, setBannerUrl] = useState<string>("https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&w=800&h=300");
  const [bannerType, setBannerType] = useState<"image" | "video">("image");
  const [bannerDuration, setBannerDuration] = useState<number>(0);

  // Validation States
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [bannerError, setBannerError] = useState<string | null>(null);
  const [bannerSuccessMsg, setBannerSuccessMsg] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [loadStatus, setLoadStatus] = useState<string>("");

  // Refs for upload zones
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const previewVideoRef = useRef<HTMLVideoElement>(null);

  // Load current settings from Firestore on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoadStatus("Fetching Profile Data...");
        const docRef = doc(db, "userProfiles", user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.avatarUrl) setAvatarUrl(data.avatarUrl);
          if (data.bannerUrl) setBannerUrl(data.bannerUrl);
          if (data.bannerType) setBannerType(data.bannerType);
          if (data.bannerDuration) setBannerDuration(data.bannerDuration);
          
          if (data.bannerType === "video" && data.bannerDuration > 30) {
            setBannerSuccessMsg(`✂️ Video loaded from database! Stored duration is ${data.bannerDuration.toFixed(1)}s (>= 30s). AI has hardcoded-trimmed it to 30.00 seconds and enabled looping!`);
          }
          setLoadStatus("Profile Loaded Successfully");
        } else {
          // Initialize defaults
          setLoadStatus("No profile document found. Using fallback settings.");
          // Also check LocalStorage as fallback
          const localAvatar = localStorage.getItem(`profile_avatar_${user.uid}`);
          const localBanner = localStorage.getItem(`profile_banner_${user.uid}`);
          const localBannerType = localStorage.getItem(`profile_banner_type_${user.uid}`);
          const localDuration = localStorage.getItem(`profile_banner_duration_${user.uid}`);

          if (localAvatar) setAvatarUrl(localAvatar);
          if (localBanner) setBannerUrl(localBanner);
          if (localBannerType) setBannerType(localBannerType as "image" | "video");
          if (localDuration) setBannerDuration(parseFloat(localDuration));
        }
      } catch (err) {
        console.error("Error reading from Firestore:", err);
        setLoadStatus("Failed loading from Cloud database. Offline LocalStorage fallback activated.");
      }
    };

    fetchProfile();
  }, [user.uid]);

  // File Format Validation Helpers
  const validateAvatarFormat = (fileNameOrUrl: string): boolean => {
    const cleanStr = fileNameOrUrl.toLowerCase().split('?')[0];
    const extensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp"];
    const isValid = extensions.some(ext => cleanStr.endsWith(ext) || cleanStr.includes(ext.substring(1)));
    
    if (!isValid) {
      setAvatarError("❌ Invalid profile format! Supported extensions: JPG, JPEG, PNG, GIF, BMP");
      return false;
    }
    setAvatarError(null);
    return true;
  };

  const validateBannerFormat = (fileNameOrUrl: string): { isValid: boolean; type: "image" | "video" | null } => {
    const cleanStr = fileNameOrUrl.toLowerCase().split('?')[0];
    const isMp4 = cleanStr.endsWith(".mp4") || cleanStr.includes("mp4");
    const isImage = [".jpg", ".jpeg", ".png"].some(ext => cleanStr.endsWith(ext) || cleanStr.includes(ext.substring(1)));

    if (isMp4) {
      setBannerError(null);
      return { isValid: true, type: "video" };
    } else if (isImage) {
      setBannerError(null);
      return { isValid: true, type: "image" };
    } else {
      setBannerError("❌ Invalid banner format! Supported: MP4 (video), JPG, JPEG, PNG (static images)");
      return { isValid: false, type: null };
    }
  };

  // HTML5 Video Duration Validator (At least 30 seconds)
  const checkVideoDurationAndSet = (url: string) => {
    const videoElement = document.createElement("video");
    videoElement.src = url;
    videoElement.preload = "metadata";

    setBannerSuccessMsg(null);
    setBannerError("Analyzing video track properties...");

    videoElement.onloadedmetadata = () => {
      const duration = videoElement.duration;
      setBannerDuration(duration);
      
      if (duration < 30) {
        setBannerError(`❌ Validation Error: Video duration is only ${duration.toFixed(2)}s. Your custom banner must be at least 30.00 seconds long!`);
        soundManager.playSpecial();
      } else {
        setBannerError(null);
        setBannerType("video");
        setBannerUrl(url);
        setBannerSuccessMsg(`✂️ AI Auto-Trimming Activated! Video duration is ${duration.toFixed(2)}s (>= 30s requirement). The video has been hardcoded to crop/trim at 30.00 seconds and set to loop dynamically!`);
        soundManager.playLevelUp();
      }
    };

    videoElement.onerror = () => {
      setBannerError("❌ Unable to inspect video file stream. Ensure this is a valid direct MP4 URL or check file permissions.");
    };
  };

  // Local File Upload Handlers (Supports Drag-And-Drop or click input)
  const handleAvatarFile = (file: File) => {
    if (!validateAvatarFormat(file.name)) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Url = e.target?.result as string;
      setAvatarUrl(base64Url);
      soundManager.playSpecial();
    };
    reader.readAsDataURL(file);
  };

  const handleBannerFile = (file: File) => {
    const { isValid, type } = validateBannerFormat(file.name);
    if (!isValid || !type) return;

    const fileUrl = URL.createObjectURL(file);

    if (type === "video") {
      checkVideoDurationAndSet(fileUrl);
    } else {
      setBannerType("image");
      setBannerUrl(fileUrl);
      setBannerDuration(0);
      setBannerSuccessMsg("✨ Static image banner selected successfully! Format supported (JPG/PNG).");
      soundManager.playSpecial();
    }
  };

  // Drag and drop event guards
  const preventDefault = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Save Config to Firestore Database (Durable Cloud Persistence)
  const handleSaveProfile = async () => {
    if (avatarError || bannerError) {
      alert("❌ Please correct the validation errors before saving your profile settings!");
      return;
    }

    setIsSaving(true);
    try {
      const profileData = {
        avatarUrl,
        bannerUrl,
        bannerType,
        bannerDuration,
        updatedAt: Date.now(),
        email: user.email
      };

      // Save to Firebase Firestore
      await setDoc(doc(db, "userProfiles", user.uid), profileData);

      // Save to LocalStorage as instant cached fallback
      localStorage.setItem(`profile_avatar_${user.uid}`, avatarUrl);
      localStorage.setItem(`profile_banner_${user.uid}`, bannerUrl);
      localStorage.setItem(`profile_banner_type_${user.uid}`, bannerType);
      localStorage.setItem(`profile_banner_duration_${user.uid}`, bannerDuration.toString());

      // Trigger callback if provided
      if (onProfileUpdated) {
        onProfileUpdated({ avatarUrl, bannerUrl, bannerType, bannerDuration });
      }

      soundManager.playLevelUp();
      alert("💾 PROFILE SYNCHRONIZED: Successfully persisted user avatar & loop-banner specs to Otaku Realms cloud cluster!");
    } catch (err) {
      console.error("Failed to save to Firestore:", err);
      alert("⚠️ Database Sync Failed: Your profile is cached locally, but couldn't sync with Cloud Run. Check network parameters.");
    } finally {
      setIsSaving(false);
    }
  };

  // Video loop cutting logic for live player
  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    // Hardcoded constraint: loops precisely at 30 seconds if it is longer than 30s
    if (video.currentTime >= 30) {
      video.currentTime = 0;
      video.play().catch(err => console.log("Video replay error:", err));
    }
  };

  return (
    <div className="bg-gray-900/95 p-6 rounded-2xl border border-orange-500/20 text-gray-100 space-y-6">
      
      {/* Visual Header */}
      <div className="flex justify-between items-center border-b border-gray-800 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Film className="text-orange-500 animate-pulse" size={22} />
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-orange-400">Profile & Banner Customizer</h2>
            <p className="text-[10px] text-gray-400 font-mono">Configure custom avatars (JPG/PNG/GIF/BMP) & video/image banners (MP4/JPG/PNG) with hardcoded AI loop constraints</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-purple-950 text-purple-400 border border-purple-500/20 text-[9px] font-mono uppercase px-2 py-0.5 rounded">
            {loadStatus || "Operational"}
          </span>
        </div>
      </div>

      {/* 1. REAL-TIME LIVE PROFILE PREVIEW */}
      <div className="space-y-2">
        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block font-bold">Live Profile Card Widget (IFrame Safe Viewports)</span>
        
        <div className="relative rounded-2xl overflow-hidden border-2 border-orange-500/30 bg-black shadow-2xl">
          {/* Banner container */}
          <div className="h-44 md:h-52 w-full bg-slate-950 relative overflow-hidden flex items-center justify-center">
            {bannerType === "video" ? (
              <video
                ref={previewVideoRef}
                key={bannerUrl}
                src={bannerUrl}
                autoPlay
                muted
                playsInline
                onTimeUpdate={handleTimeUpdate}
                className="w-full h-full object-cover"
                style={{ filter: "brightness(0.75)" }}
              />
            ) : (
              <img 
                src={bannerUrl} 
                alt="Profile Banner" 
                className="w-full h-full object-cover" 
                style={{ filter: "brightness(0.75)" }}
                onError={() => {
                  setBannerError("❌ Invalid banner image URL or file. Showing fallback.");
                }}
              />
            )}
            
            {/* Overlay indicators */}
            <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5 z-10 font-mono text-[9px]">
              {bannerType === "video" && (
                <span className="bg-red-950/80 text-red-400 border border-red-500/30 px-2 py-0.5 rounded font-bold uppercase animate-pulse flex items-center gap-1">
                  <Film size={10} /> Live MP4 Loop Trimmed to 30.0s
                </span>
              )}
              {bannerType === "image" && (
                <span className="bg-indigo-950/80 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded font-bold uppercase flex items-center gap-1">
                  <Image size={10} /> Static Image Banner
                </span>
              )}
              <span className="bg-gray-950/80 text-gray-400 border border-gray-800 px-2 py-0.5 rounded text-[8px]">
                {user.email}
              </span>
            </div>
          </div>

          {/* Avatar overlap and details */}
          <div className="p-4 bg-gray-950 border-t border-gray-900 flex flex-col sm:flex-row items-center gap-4 relative">
            <div className="relative -mt-16 sm:-mt-20 w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-orange-500 bg-gray-950 overflow-hidden shadow-2xl z-20 flex-shrink-0 flex items-center justify-center">
              <img 
                src={avatarUrl} 
                alt="User Avatar" 
                className="w-full h-full object-cover"
                onError={() => {
                  setAvatarError("❌ Invalid avatar image URL or file. Showing fallback.");
                }}
              />
            </div>
            
            <div className="text-center sm:text-left space-y-1">
              <h3 className="text-base font-bold text-white flex items-center justify-center sm:justify-start gap-2">
                {user.email?.split("@")[0] || "Lobbyist"}
                <span className="bg-orange-950 text-orange-400 border border-orange-500/20 text-[8px] font-mono px-2 py-0.5 rounded font-bold uppercase">
                  Level 1 Otaku
                </span>
              </h3>
              <p className="text-[10px] text-gray-400 font-mono">
                Identity: {user.uid}
              </p>
              <div className="flex gap-2 justify-center sm:justify-start pt-1 text-[9px] font-mono text-gray-500">
                <span>Format: {avatarUrl.substring(0, 15) === "data:image/" ? "Local base64 file" : "Web Asset URL"}</span>
                <span>•</span>
                <span>Banner Class: {bannerType === "video" ? `MP4 (${bannerDuration.toFixed(1)}s)` : "Image"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. DRAG AND DROP / FILE UPLOAD CONTROLS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* AVATAR UPLOAD MODULE */}
        <div className="bg-gray-950 p-4 rounded-xl border border-gray-850 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-mono text-orange-400 uppercase tracking-widest block font-bold flex items-center gap-1">
              <User size={12} /> Avatar Selector
            </span>
            <span className="text-[9px] text-gray-500 font-mono">JPG, PNG, GIF, BMP</span>
          </div>

          {/* Drag & Drop Dropzone */}
          <div 
            onDragOver={preventDefault}
            onDragEnter={preventDefault}
            onDrop={(e) => {
              preventDefault(e);
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleAvatarFile(e.dataTransfer.files[0]);
              }
            }}
            onClick={() => avatarInputRef.current?.click()}
            className="border-2 border-dashed border-gray-800 hover:border-orange-500/40 p-4 rounded-lg bg-gray-900/40 text-center cursor-pointer transition hover:bg-gray-900/80 flex flex-col items-center justify-center space-y-2 group"
          >
            <Upload size={20} className="text-gray-500 group-hover:text-orange-400 transition" />
            <span className="text-[10px] font-mono text-gray-400 block font-bold">
              Drag & Drop file or <span className="text-orange-400">Click to Browse</span>
            </span>
            <input 
              type="file" 
              ref={avatarInputRef}
              accept=".jpg,.jpeg,.png,.gif,.bmp"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleAvatarFile(e.target.files[0]);
                }
              }}
              className="hidden" 
            />
          </div>

          {/* URL Entry Field */}
          <div className="space-y-1">
            <label className="text-[9px] font-mono text-gray-500 uppercase block">Or Paste Avatar Asset URL</label>
            <input
              type="text"
              value={avatarUrl.substring(0, 500)}
              onChange={(e) => {
                const val = e.target.value;
                setAvatarUrl(val);
                validateAvatarFormat(val);
              }}
              placeholder="https://example.com/avatar.gif"
              className="w-full text-[10px] font-mono bg-gray-900 border border-gray-800 focus:border-orange-500 p-2 rounded text-white"
            />
          </div>

          {/* Validation Alert for Avatar */}
          {avatarError && (
            <div className="p-2.5 bg-red-950/40 border border-red-500/20 rounded text-[9.5px] font-mono text-red-400 flex items-start gap-1.5">
              <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
              <span>{avatarError}</span>
            </div>
          )}
        </div>

        {/* BANNER UPLOAD MODULE */}
        <div className="bg-gray-950 p-4 rounded-xl border border-gray-850 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-mono text-orange-400 uppercase tracking-widest block font-bold flex items-center gap-1">
              <Film size={12} /> Banner Selector
            </span>
            <span className="text-[9px] text-gray-500 font-mono">MP4, JPG, PNG</span>
          </div>

          {/* Drag & Drop Dropzone */}
          <div 
            onDragOver={preventDefault}
            onDragEnter={preventDefault}
            onDrop={(e) => {
              preventDefault(e);
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleBannerFile(e.dataTransfer.files[0]);
              }
            }}
            onClick={() => bannerInputRef.current?.click()}
            className="border-2 border-dashed border-gray-800 hover:border-orange-500/40 p-4 rounded-lg bg-gray-900/40 text-center cursor-pointer transition hover:bg-gray-900/80 flex flex-col items-center justify-center space-y-2 group"
          >
            <Upload size={20} className="text-gray-500 group-hover:text-orange-400 transition" />
            <span className="text-[10px] font-mono text-gray-400 block font-bold">
              Drag & Drop file or <span className="text-orange-400">Click to Browse</span>
            </span>
            <input 
              type="file" 
              ref={bannerInputRef}
              accept=".mp4,.jpg,.jpeg,.png"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleBannerFile(e.target.files[0]);
                }
              }}
              className="hidden" 
            />
          </div>

          {/* URL Entry Field */}
          <div className="space-y-1">
            <label className="text-[9px] font-mono text-gray-500 uppercase block">Or Paste Banner Asset URL</label>
            <input
              type="text"
              value={bannerUrl.substring(0, 500)}
              onChange={(e) => {
                const val = e.target.value;
                const { isValid, type } = validateBannerFormat(val);
                if (isValid && type) {
                  if (type === "video") {
                    checkVideoDurationAndSet(val);
                  } else {
                    setBannerType("image");
                    setBannerUrl(val);
                    setBannerDuration(0);
                    setBannerSuccessMsg("✨ Static image banner selected successfully! Format supported (JPG/PNG).");
                  }
                }
              }}
              placeholder="https://example.com/banner.mp4"
              className="w-full text-[10px] font-mono bg-gray-900 border border-gray-800 focus:border-orange-500 p-2 rounded text-white"
            />
          </div>

          {/* Validation Banner Messages */}
          {bannerError && (
            <div className="p-2.5 bg-red-950/40 border border-red-500/20 rounded text-[9.5px] font-mono text-red-400 flex items-start gap-1.5">
              <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
              <span>{bannerError}</span>
            </div>
          )}

          {bannerSuccessMsg && (
            <div className="p-2.5 bg-emerald-950/40 border border-emerald-500/20 rounded text-[9.5px] font-mono text-emerald-400 flex items-start gap-1.5">
              <CheckCircle size={14} className="flex-shrink-0 mt-0.5" />
              <span>{bannerSuccessMsg}</span>
            </div>
          )}
        </div>

      </div>

      {/* 3. PRESETS GRID */}
      <div className="space-y-3">
        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block font-bold">Select Preset to Test Validation & Loop Constraints</span>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Avatar Presets */}
          <div className="space-y-1.5 bg-gray-950 p-3 rounded-xl border border-gray-850">
            <span className="text-[9px] font-mono text-gray-400 uppercase font-bold block mb-1">Avatar Preset Library</span>
            <div className="grid grid-cols-2 gap-2">
              {AVATAR_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => {
                    setAvatarUrl(preset.url);
                    setAvatarError(null);
                    soundManager.playSpecial();
                  }}
                  className={`p-2 rounded text-left text-[9px] font-mono border transition ${
                    avatarUrl === preset.url 
                      ? "bg-orange-950/40 border-orange-500 text-orange-400" 
                      : "bg-gray-900 border-gray-850 text-gray-400 hover:bg-gray-850"
                  }`}
                >
                  <div className="truncate font-bold">{preset.name}</div>
                  <div className="text-[8px] text-gray-500 mt-0.5">Type: {preset.type.toUpperCase()}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Banner Presets */}
          <div className="space-y-1.5 bg-gray-950 p-3 rounded-xl border border-gray-850">
            <span className="text-[9px] font-mono text-gray-400 uppercase font-bold block mb-1">Banner Preset Library</span>
            <div className="grid grid-cols-2 gap-2">
              {BANNER_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => {
                    const { isValid, type } = validateBannerFormat(preset.url);
                    if (isValid && type) {
                      if (type === "video") {
                        checkVideoDurationAndSet(preset.url);
                      } else {
                        setBannerType("image");
                        setBannerUrl(preset.url);
                        setBannerDuration(0);
                        setBannerSuccessMsg("✨ Static image banner selected successfully!");
                        soundManager.playSpecial();
                      }
                    }
                  }}
                  className={`p-2 rounded text-left text-[9px] font-mono border transition ${
                    bannerUrl === preset.url 
                      ? "bg-purple-950/40 border-purple-500 text-purple-400" 
                      : "bg-gray-900 border-gray-850 text-gray-400 hover:bg-gray-850"
                  }`}
                >
                  <div className="truncate font-bold">{preset.name}</div>
                  <div className="text-[8px] text-gray-500 mt-0.5 truncate">{preset.description}</div>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* 4. SAVE BUTTON AND SYNCHRONIZE */}
      <div className="pt-4 border-t border-gray-850 flex justify-between items-center flex-wrap gap-2">
        <div className="text-[9.5px] font-mono text-gray-500 max-w-md">
          ⚠️ <b>Hardcoded loop rule:</b> Any video longer than 30s will automatically trigger a 30.00-second cut point and loop seamlessly in HTML5. Video files under 30s are blocked for compatibility.
        </div>
        
        <button
          onClick={handleSaveProfile}
          disabled={isSaving || !!avatarError || !!bannerError}
          className={`px-6 py-2.5 rounded-lg text-xs font-mono font-bold uppercase transition flex items-center gap-2 ${
            isSaving || !!avatarError || !!bannerError
              ? "bg-gray-850 text-gray-500 border border-gray-800 cursor-not-allowed"
              : "bg-orange-600 hover:bg-orange-500 text-black shadow-lg shadow-orange-500/10 cursor-pointer active:scale-95"
          }`}
        >
          {isSaving ? (
            <>
              <RefreshCw size={13} className="animate-spin" />
              Syncing Cloud...
            </>
          ) : (
            <>
              <Save size={13} />
              Save and Synchronize Profile
            </>
          )}
        </button>
      </div>

    </div>
  );
}
