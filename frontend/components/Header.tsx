"use client"
import Container from './Container'
// useState ve useEffect import edildi
import React, { useState, useEffect } from 'react' 
import Logo from './Logo'
import HeaderMenu from './HeaderMenu'
import SearchBar from './SearchBar'
import FavoriteButton from './FavoriteButton'
import MobileMenu from './MobileMenu'
import { Language } from './Language'

// ======================================
// 1. INTERFACE TANIMLARI (TypeScript Zorunluluğu)
// ======================================

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoginSuccess: () => void;
}

interface AuthButtonProps {
    isLoggedIn: boolean;
    onLogout: () => void;
    onOpenModal: () => void;
}

// ======================================
// 2. YARDIMCI BİLEŞENLER
// ======================================

/**
 * Giriş Formunu ve API çağrısını yöneten Modal Bileşeni.
 */
const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
    // API adresi (önceki konuşmamızdan)
    const LOGIN_URL = '/api/auth/login';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        
        try {
            const response = await fetch(LOGIN_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username_or_email: email, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Başarılı giriş: Token'ı sakla
                localStorage.setItem('accessToken', data.access_token);
                onLoginSuccess(); // Üst bileşenin durumunu güncelle
                onClose(); // Modal'ı kapat
            } else {
                // Hatalı giriş (401, 422, vb.)
                setError(data.detail || 'Giriş bilgileri hatalı. Lütfen tekrar deneyin.');
            }
        } catch (err) {
            setError('Sunucuya bağlanılamadı. Ağ bağlantınızı kontrol edin.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-sm">
                <h2 className="text-2xl font-semibold mb-4 text-center">🔐 Giriş Yap</h2>
                <form onSubmit={handleSubmit}>
                    <input 
                        type="text"
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="E-posta veya Kullanıcı Adı" 
                        className="w-full p-3 mb-3 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Şifre" 
                        className="w-full p-3 mb-4 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                    {error && <p className="text-red-600 text-sm mb-3 font-medium">{error}</p>}
                    <div className="flex justify-between gap-3">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="flex-1 bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300 transition"
                        >
                            Kapat
                        </button>
                        <button 
                            type="submit" 
                            className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                        >
                            Giriş Yap
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


/**
 * Giriş Durumuna Göre Butonu Gösteren Bileşen.
 */
const AuthButton: React.FC<AuthButtonProps> = ({ isLoggedIn, onLogout, onOpenModal }) => {
    if (isLoggedIn) {
        return (
            <button 
                onClick={onLogout} 
                className="bg-red-500 text-white py-1.5 px-3 rounded text-sm hover:bg-red-600 transition"
            >
                Çıkış Yap
            </button>
        );
    }
    return (
        <button 
            onClick={onOpenModal} 
            className="bg-blue-500 text-white py-1.5 px-3 rounded text-sm hover:bg-blue-600 transition"
        >
            Giriş Yap
        </button>
    );
};

// ======================================
// 3. ANA BİLEŞEN
// ======================================

const Header = () => {
    // isModalOpen: Modalın açık/kapalı durumu.
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Hata düzeltildi: Başlangıç değeri false olmalı. Kontrol useEffect ile yapılacak.
    const [isLoggedIn, setIsLoggedIn] = useState(false); 

    // Bileşen yüklendiğinde (tarayıcıda) çalışır.
    useEffect(() => {
        // Bu kod sadece Client'ta (tarayıcıda) çalışır, SSR hatasını önler.
        if (localStorage.getItem('accessToken')) {
            setIsLoggedIn(true);
        }
    }, []); 

    // Giriş Başarılı Olduğunda Çalışır
    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
    };

    // Çıkış Yapıldığında Çalışır
    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        setIsLoggedIn(false);
    };

    return (
        <>
            <header className='bg-white py-5 border-b border-b-black/50'>
                <Container className='flex items-center justify-between'>
                    <div className='w-auto md:w-1/3 flex items-center gap-2.5 justify-start md:gap-0'>
                        <MobileMenu/>
                        <Logo/>
                    </div>
                    <HeaderMenu/>
                    <div className='w-auto md:w-1/3 flex items-center justify-end gap-3'>
                        <SearchBar/>
                        <FavoriteButton/>
                        <div className="hidden md:block">
                            <Language />
                        </div>
                        
                        {/* AuthButton ile Giriş/Çıkış butonu gösterimi */}
                        <AuthButton
                            isLoggedIn={isLoggedIn}
                            onLogout={handleLogout}
                            onOpenModal={() => setIsModalOpen(true)}
                        />
                    </div>
                </Container>
            </header>
            
            {/* Login Modalı */}
            <LoginModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                onLoginSuccess={handleLoginSuccess}
            />
        </>
    )
}

export default Header