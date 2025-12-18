"use client";
import React from "react";

interface AuthButtonProps {
  isLoggedIn: boolean;
  onLogout: () => void;
  onOpenAuthChoice: () => void;
}

const AuthButton: React.FC<AuthButtonProps> = ({
  isLoggedIn,
  onLogout,
  onOpenAuthChoice,
}) => {
  if (isLoggedIn) {
    return (
      <button
        onClick={onLogout}
        className="bg-red-500 text-white py-1.5 px-3 rounded text-sm hover:bg-red-600 transition whitespace-nowrap"
      >
        Çıkış Yap
      </button>
    );
  }

  return (
    <button
      onClick={onOpenAuthChoice}
      className="flex items-center text-white text-sm bg-blue-500 hover:bg-blue-400 transition justify-center px-3 py-2 md:px-5 md:py-2.5 rounded-lg md:rounded md:text-base whitespace-nowrap"
    >
      Giriş Yap
    </button>
  );
};

export default AuthButton;
