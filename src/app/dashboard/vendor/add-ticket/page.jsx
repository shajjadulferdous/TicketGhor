"use client";

import { useState } from "react";
import { Button, Spinner } from "@heroui/react";
import {
  MdFlightTakeoff, MdDirectionsBus, MdDirectionsBoat, MdTrain,
  MdCloudUpload, MdAccessTime, MdCheckCircle,
} from "react-icons/md";
import {
  FaSnowflake, FaWifi, FaUtensils, FaChair, FaFilm,
  FaWheelchair, FaSuitcase, FaPlug,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/router";

const transportTypes = [
  { key: "bus",    label: "Bus",    icon: <MdDirectionsBus size={26} /> },
  { key: "train",  label: "Train",  icon: <MdTrain size={26} /> },
  { key: "flight", label: "Flight", icon: <MdFlightTakeoff size={26} /> },
  { key: "ferry",  label: "Ferry",  icon: <MdDirectionsBoat size={26} /> },
];

const PERKS = [
  { key: "ac",            label: "AC",            icon: <FaSnowflake /> },
  { key: "breakfast",     label: "Breakfast",     icon: <FaUtensils /> },
  { key: "wifi",          label: "WiFi",          icon: <FaWifi /> },
  { key: "recliner",      label: "Recliner seat", icon: <FaChair /> },
  { key: "entertainment", label: "Entertainment", icon: <FaFilm /> },
  { key: "accessible",    label: "Accessible",    icon: <FaWheelchair /> },
  { key: "luggage",       label: "Extra luggage", icon: <FaSuitcase /> },
  { key: "charging",      label: "Charging port", icon: <FaPlug /> },
];

// Mocked vendor session


// ── Ultra-Premium Custom Input ──
const PremiumInput = ({ label, id, startContent, required, readOnly, ...props }) => (
  <div className="flex flex-col gap-2 w-full">
    {label && (
      <label htmlFor={id} className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    )}
    <div className="relative flex items-center group">
      {startContent && (
        <div className="absolute left-4 text-gray-400 flex items-center justify-center transition-colors group-focus-within:text-[#35858E]">
          {startContent}
        </div>
      )}
      <input
        id={id}
        required={required}
        readOnly={readOnly}
        className={`w-full bg-gray-50/50 border border-gray-200 rounded-2xl px-5 py-3.5 text-[15px] font-medium text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#35858E] focus:bg-white focus:ring-4 focus:ring-[#35858E]/15 transition-all duration-300
          ${startContent ? 'pl-11' : ''} 
          ${readOnly ? 'bg-gray-100/70 cursor-not-allowed text-gray-500 border-transparent shadow-none' : 'hover:border-gray-300 hover:bg-white shadow-sm hover:shadow'}
        `}
        {...props}
      />
    </div>
  </div>
);

export default function AddTicketPage() {
  const [transport, setTransport] = useState("");
  const [perks, setPerks] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const [form, setForm] = useState({
    title: "", from: "", to: "", price: "", quantity: "", departure: "",
  });

  const { 
        data: session, 
        isPending, //loading state
        error, //error object
        refetch //refetch the session
    } = authClient.useSession() 
  const user = session?.user;
  const VENDOR ={}
  VENDOR.name = user?.name;
  VENDOR.email = user?.email;
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const togglePerk = (key) =>
    setPerks((p) => p.includes(key) ? p.filter((x) => x !== key) : [...p, key]);

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const uploadToImgbb = async (file) => {
    const fd = new FormData();
    fd.append("image", file);
    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_KEY}`,
      { method: "POST", body: fd }
    );
    const data = await res.json();
    return data.data?.url ?? null;
  };

  const handleSubmit = async () => {
    const requiredFields = ["title", "from", "to", "price", "quantity", "departure"];
    const missing = requiredFields.filter((k) => !form[k]);
    
    if (missing.length || !transport) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    try {
      let imageUrl = null;
      if (imageFile) {
        setUploading(true);
        imageUrl = await uploadToImgbb(imageFile);
        setUploading(false);
      }

      const payload = {
        ...form, transport, perks, imageUrl,
        vendorName: VENDOR.name,
        vendorEmail: VENDOR.email,
        status: "pending",
        createdAt: new Date().toISOString(),
      };
      const { data, error } = await authClient.token();

      const {token} = data;
      console.log(payload);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" , Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Server error");
      toast.success("Ticket successfully submitted for review!");
      router.push('/dashboard/vendor/tickets');
    } catch (error) {
  console.error(error);
  toast.error(error.message || "Something went wrong");
} finally {
      setSubmitting(false);
    }
  };

  return (
    isPending ? <div className="h-screen flex justify-center items-center ">
         <Spinner className="text-[#35858E]" size="xl" />
    </div>:
     <div className="min-h-screen bg-[#F4F7F8] pb-20 font-sans">
      
      {/* ── Premium Top Bar ── */}
      <div className="w-full h-[76px] px-8 flex items-center justify-between bg-white border-b border-gray-100 shadow-sm sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#35858E] to-[#256069] flex items-center justify-center text-white shadow-md shadow-[#35858E]/20">
            <MdFlightTakeoff size={22} />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-gray-900 leading-tight tracking-tight">Add New Ticket</h1>
            <p className="text-xs text-gray-500 font-medium mt-0.5">Create a new listing for your customers</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-200/60 text-amber-600 text-xs font-bold shadow-sm">
          <MdAccessTime size={15} />
          <span>Pending Admin Review</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-10 space-y-8">
        
        {/* ── Basic Info ── */}
        <PremiumSection title="Basic Details" icon="01">
          <PremiumInput id="title" label="Ticket Title" placeholder="e.g. Dhaka to Cox's Bazar Premium" required value={form.title} onChange={set("title")} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <PremiumInput id="from" label="Origin City" placeholder="Departure from" required value={form.from} onChange={set("from")} />
            <PremiumInput id="to" label="Destination City" placeholder="Arrival at" required value={form.to} onChange={set("to")} />
          </div>
          <div className="mt-6 w-full md:w-1/2 md:pr-3">
            <PremiumInput id="departure" type="datetime-local" label="Departure Date & Time" required value={form.departure} onChange={set("departure")} />
          </div>
        </PremiumSection>

        {/* ── Transport Type ── */}
        <PremiumSection title="Transport Type" icon="02">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {transportTypes.map((t) => {
              const selected = transport === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setTransport(t.key)}
                  className={`flex flex-col items-center justify-center gap-3 h-32 rounded-2xl border-2 transition-all duration-300 outline-none ${
                    selected 
                      ? "border-[#35858E] bg-[#35858E]/5 text-[#35858E] shadow-[0_8px_20px_rgb(53,133,142,0.12)]" 
                      : "border-gray-100 bg-gray-50/50 text-gray-400 hover:border-[#35858E]/40 hover:bg-white hover:text-[#35858E] hover:shadow-md"
                  }`}
                >
                  <span className={`transition-transform duration-300 ${selected ? 'scale-110' : ''}`}>
                    {t.icon}
                  </span>
                  <span className={`text-sm font-bold tracking-wide ${selected ? 'text-[#35858E]' : 'text-gray-500'}`}>{t.label}</span>
                </button>
              );
            })}
          </div>
        </PremiumSection>

        {/* ── Pricing & Availability ── */}
        <PremiumSection title="Pricing & Capacity" icon="03">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PremiumInput 
              id="price" type="number" label="Price per Ticket" placeholder="0.00" required min={0} 
              value={form.price} onChange={set("price")} 
              startContent={<span className="font-bold text-gray-400 group-focus-within:text-[#35858E] transition-colors">৳</span>} 
            />
            <PremiumInput 
              id="quantity" type="number" label="Total Available Seats" placeholder="e.g. 40" required min={1} 
              value={form.quantity} onChange={set("quantity")} 
            />
          </div>
        </PremiumSection>

        {/* ── Perks & Amenities ── */}
        <PremiumSection title="Included Amenities" icon="04">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {PERKS.map((p) => {
              const checked = perks.includes(p.key);
              return (
                <button
                  key={p.key}
                  onClick={() => togglePerk(p.key)}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border text-sm transition-all duration-300 text-left outline-none ${
                    checked 
                      ? "border-transparent bg-gradient-to-r from-[#35858E] to-[#28646b] text-white shadow-lg shadow-[#35858E]/30 transform -translate-y-0.5" 
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm"
                  }`}
                >
                  <span className={`text-[16px] ${checked ? "text-white" : "text-gray-400"}`}>{p.icon}</span>
                  <span className={`font-semibold flex-1 ${checked ? "text-white" : "text-gray-700"}`}>{p.label}</span>
                  {checked && <MdCheckCircle size={18} className="text-white drop-shadow-sm" />}
                </button>
              );
            })}
          </div>
        </PremiumSection>

        {/* ── Image Upload ── */}
        <PremiumSection title="Cover Image" icon="05">
          <label
            htmlFor="imgUpload"
            className={`group flex flex-col items-center justify-center gap-4 border-2 border-dashed rounded-3xl py-14 px-6 cursor-pointer transition-all duration-300 ${
              imagePreview 
                ? "border-[#35858E]/40 bg-[#35858E]/5" 
                : "border-gray-200 bg-gray-50/50 hover:bg-white hover:border-[#35858E]/50 hover:shadow-lg hover:shadow-[#35858E]/5"
            }`}
          >
            {imagePreview ? (
              <div className="flex flex-col items-center gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imagePreview} alt="Preview" className="h-48 object-cover rounded-2xl shadow-md border border-gray-200/50" />
                <span className="text-xs font-bold text-gray-500 bg-white px-4 py-1.5 rounded-full shadow-sm border border-gray-100">{imageFile?.name}</span>
                <span className="text-sm font-bold text-[#35858E] mt-1 group-hover:underline">Click to replace image</span>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-[#35858E] mb-4 group-hover:scale-110 transition-transform duration-300">
                  <MdCloudUpload size={32} />
                </div>
                <p className="text-base font-bold text-gray-800">Upload a ticket cover image</p>
                <p className="text-xs text-gray-400 mt-1.5 max-w-xs leading-relaxed font-medium">High resolution PNG or JPG up to 5MB. This will be hosted securely.</p>
              </div>
            )}
            <input id="imgUpload" type="file" accept="image/*" className="hidden" onChange={handleImage} />
          </label>
        </PremiumSection>

        {/* ── Vendor Details ── */}
        <PremiumSection title="Vendor Registration Info" icon="06">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PremiumInput id="vName" label="Registered Vendor Name" value={VENDOR.name} readOnly />
            <PremiumInput id="vEmail" label="Vendor Contact Email" value={VENDOR.email} readOnly />
          </div>
          <div className="mt-6 flex items-center gap-3 text-sm px-5 py-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/60 text-amber-800 w-fit shadow-sm">
            <MdAccessTime size={20} className="text-amber-500" />
            <p className="font-medium">Tickets are saved with a <span className="font-bold">Pending</span> status and require admin approval.</p>
          </div>
        </PremiumSection>

        {/* ── Submit Action ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4 pb-12">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Fields marked with <span className="text-red-500 text-sm">*</span> are required.
          </p>
          <Button
            size="lg"
            isLoading={submitting || uploading}
            onPress={handleSubmit}
            className="w-full sm:w-auto font-bold text-white text-base px-12 h-14 rounded-2xl shadow-xl shadow-[#35858E]/25 bg-gradient-to-r from-[#35858E] to-[#256069] hover:from-[#2a6a71] hover:to-[#1d4b52] transition-all transform hover:-translate-y-1"
            startContent={!(submitting || uploading) && <MdCheckCircle size={22} />}
          >
            {uploading ? "Uploading media..." : submitting ? "Publishing ticket..." : "Submit Ticket for Review"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Ultra-Premium Custom Section Wrapper ──
function PremiumSection({ title, icon, children }) {
  return (
    <div className="bg-white rounded-[2rem] p-6 md:p-10 shadow-sm border border-gray-100 hover:shadow-lg hover:shadow-gray-200/50 transition-shadow duration-500">
      <div className="flex items-center gap-4 mb-8">
        <span className="text-[13px] font-black w-10 h-10 rounded-[14px] flex items-center justify-center text-white bg-gradient-to-br from-[#35858E] to-[#256069] shadow-lg shadow-[#35858E]/30">
          {icon}
        </span>
        <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">
          {title}
        </h3>
      </div>
      <div className="w-full h-px bg-gradient-to-r from-gray-100 via-gray-100 to-transparent mb-8" />
      {children}
    </div>
  );
}