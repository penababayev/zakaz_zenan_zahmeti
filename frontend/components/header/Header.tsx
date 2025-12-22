"use client";

import Container from "../Container";
import React, { useEffect, useState } from "react";
import Logo from "../Logo";
import HeaderMenu from "../HeaderMenu";
import SearchBar from "../SearchBar";
import FavoriteButton from "../FavoriteButton";
import MobileMenu from "../MobileMenu";
import { Language } from "../Language";
import { useRouter } from "next/navigation";

import AuthButton from "./AuthButton";
import AuthChoiceModal from "./AuthChoiceModal";
import LoginModal from "../header/LogicModal";

const Header = () => {
  const router = useRouter();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Modals
  const [isAuthChoiceOpen, setIsAuthChoiceOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("accessToken");
      setIsLoggedIn(!!token);
    };

    checkAuth(); // ilk açılışta kontrol

    // ✅ login/signup/logout sonrası tetiklemek için
    window.addEventListener("auth-changed", checkAuth);

    return () => {
      window.removeEventListener("auth-changed", checkAuth);
    };
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    window.dispatchEvent(new Event("auth-changed"));
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("tokenType");
    // eski key kullandıysan temizle:
    localStorage.removeItem("access_token");
    localStorage.removeItem("token_type");

    setIsLoggedIn(false);
    window.dispatchEvent(new Event("auth-changed"));

    router.push("/");
    router.refresh();
  };

  const openAuthChoice = () => setIsAuthChoiceOpen(true);

  const chooseLogin = () => {
    setIsAuthChoiceOpen(false);
    setIsLoginOpen(true);
  };

  const chooseSignup = () => {
    setIsAuthChoiceOpen(false);
    router.push("/signup");
  };

  return (
    <>
      <header className="bg-white py-5 border-b border-b-black/50">
        <Container className="flex items-center justify-between gap-3 md:gap-0">
          <div className="w-auto md:w-1/3 flex items-center gap-2.5 justify-start md:gap-0">
            <MobileMenu />
            <Logo />
          </div>

          <HeaderMenu />

          <div className="w-auto md:w-1/3 flex items-center justify-end gap-3">
            <SearchBar />
            <FavoriteButton />
            <div className="hidden md:block">
              <Language />
            </div>

            <AuthButton
              isLoggedIn={isLoggedIn}
              onLogout={handleLogout}
              onOpenAuthChoice={openAuthChoice}
            />
          </div>
        </Container>
      </header>

      <AuthChoiceModal
        isOpen={isAuthChoiceOpen}
        onClose={() => setIsAuthChoiceOpen(false)}
        onChooseLogin={chooseLogin}
        onChooseSignup={chooseSignup}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
};

export default Header;
