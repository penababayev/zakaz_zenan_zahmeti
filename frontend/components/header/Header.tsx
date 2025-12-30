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

const AUTH_EVENT = "auth-changed";

const Header = () => {
  const router = useRouter();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthChoiceOpen, setIsAuthChoiceOpen] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      if (typeof window === "undefined") return;
      const token = window.localStorage.getItem("accessToken");
      setIsLoggedIn(Boolean(token));
    };

    checkAuth();
    window.addEventListener(AUTH_EVENT, checkAuth);
    return () => window.removeEventListener(AUTH_EVENT, checkAuth);
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("accessToken");
      window.localStorage.removeItem("tokenType");
      window.localStorage.removeItem("access_token");
      window.localStorage.removeItem("token_type");
    }

    setIsLoggedIn(false);
    window.dispatchEvent(new Event(AUTH_EVENT));

    router.push("/");
    router.refresh();
  };

  const openAuthChoice = () => setIsAuthChoiceOpen(true);

  const chooseLogin = () => {
    setIsAuthChoiceOpen(false);
    router.push("/auth/login"); // ✅ modal yok, login page var
  };

  const chooseSignup = () => {
    setIsAuthChoiceOpen(false);
    router.push("/auth/signup");
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
    </>
  );
};

export default Header;
