"use client";
import React from "react";

interface AuthChoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChooseLogin: () => void;
  onChooseSignup: () => void;
}

const AuthChoiceModal: React.FC<AuthChoiceModalProps> = ({
  isOpen,
  onClose,
  onChooseLogin,
  onChooseSignup,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-sm">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-2xl font-semibold">Devam Et</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 transition"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <p className="text-sm text-gray-600 mt-2">
          Hesabın varsa giriş yap, yoksa kayıt ol.
        </p>

        <div className="mt-5 flex flex-col gap-3">
          <button
            onClick={onChooseLogin}
            className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition font-semibold"
          >
            🔐 Giriş Yap
          </button>

          <button
            onClick={onChooseSignup}
            className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition font-semibold"
          >
            ✍️ Kayıt Ol (Sign up)
          </button>

          <button
            onClick={onClose}
            className="w-full bg-gray-100 text-gray-800 py-3 rounded hover:bg-gray-200 transition"
          >
            Vazgeç
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthChoiceModal;
