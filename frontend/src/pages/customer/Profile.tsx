import React, { useState, useRef } from "react";
import { User, Edit, Save, X, Camera } from "lucide-react";

const Profile: React.FC = () => {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@example.com");
  const [phone, setPhone] = useState("123-456-7890");
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Handle profile pic change and preview
  const handlePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePic(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Save changes and show confirmation
  const handleSave = () => {
    setEditing(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Cancel editing and reset values (for demo, reset to defaults)
  const handleCancel = () => {
    setEditing(false);
    setName("John Doe");
    setEmail("john.doe@example.com");
    setPhone("123-456-7890");
    setProfilePic(null);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-3xl font-semibold mb-8 flex items-center gap-3 text-gray-900">
        <User className="text-green-600" /> Profile & Settings
      </h2>

      <div className="flex flex-col items-center mb-8">
        <div className="relative w-32 h-32 rounded-full overflow-hidden shadow-md border-2 border-green-600 cursor-pointer hover:brightness-90 transition" onClick={() => fileInputRef.current?.click()}>
          {profilePic ? (
            <img
              src={profilePic}
              alt="Profile"
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-green-100 text-green-600 text-5xl">
              <User />
            </div>
          )}
          {editing && (
            <div className="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center text-white text-sm font-semibold">
              <Camera className="mr-1" /> Change
            </div>
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handlePicChange}
          disabled={!editing}
        />
      </div>

      <form className="space-y-6">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Name</label>
          {editing ? (
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
            />
          ) : (
            <p className="text-gray-900 text-lg">{name}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Email</label>
          {editing ? (
            <input
              type="email"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
            />
          ) : (
            <p className="text-gray-900 text-lg">{email}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Phone Number</label>
          {editing ? (
            <input
              type="tel"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="123-456-7890"
            />
          ) : (
            <p className="text-gray-900 text-lg">{phone}</p>
          )}
        </div>
      </form>

      <div className="mt-8 flex gap-4 justify-end">
        {editing && (
          <button
            onClick={handleCancel}
            className="px-5 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            <X className="inline mr-2" size={16} />
            Cancel
          </button>
        )}
        <button
          onClick={editing ? handleSave : () => setEditing(true)}
          className="px-6 py-2 rounded-md bg-green-600 text-white font-semibold flex items-center gap-2 hover:bg-green-700 transition"
        >
          {editing ? (
            <>
              <Save size={18} /> Save
            </>
          ) : (
            <>
              <Edit size={18} /> Edit
            </>
          )}
        </button>
      </div>

      {/* Toast */}
      {showToast && (
        <div className="fixed bottom-8 right-8 bg-green-600 text-white px-5 py-3 rounded shadow-lg animate-fadeInOut">
          Profile updated successfully!
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInOut {
          0%, 100% { opacity: 0; transform: translateY(20px); }
          10%, 90% { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInOut {
          animation: fadeInOut 3s ease forwards;
        }
      `}</style>
    </div>
  );
};

export default Profile;
