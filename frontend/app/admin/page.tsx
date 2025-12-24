"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type AdminProfile = {
  username?: string;
  email?: string;
  shop_name?: string;
  location?: string;
  phone_number?: string;
  bio?: string;
};

export default function AdminPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<AdminProfile | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/");
      router.refresh();
      return;
    }

    const raw = localStorage.getItem("adminProfile");
    setProfile(raw ? JSON.parse(raw) : null);
  }, [router]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Page</h1>

      {!profile ? (
        <div className="p-4 border rounded-lg bg-yellow-50">
          Profil bilgisi bulunamadı. (Signup’tan sonra kaydedilir.)
        </div>
      ) : (
        <div className="p-5 border rounded-xl bg-white shadow-sm space-y-3">
          <Row label="Username" value={profile.username} />
          <Row label="Email" value={profile.email} />
          <Row label="Shop name" value={profile.shop_name} />
          <Row label="Location" value={profile.location} />
          <Row label="Phone number" value={profile.phone_number} />
          <Row label="Bio" value={profile.bio} />
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex gap-3">
      <div className="w-32 text-sm text-gray-500">{label}</div>
      <div className="flex-1 text-sm font-semibold break-words">
        {value || "-"}
      </div>
    </div>
  );
}
