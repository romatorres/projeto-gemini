"use client";

import { useAuthStore } from "@/store/authStore";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const { role, clearToken } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const handleLogout = () => {
    clearToken();
    router.push("/login");
  };

  const isActive = (path: string) => {
    return pathname.startsWith(path) ? "bg-blue-700" : "";
  };

  const isSettingsActive = () => {
    return pathname.startsWith("/dashboard/settings") ? true : false;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const MobileMenuButton = () => (
    <button
      onClick={toggleMobileMenu}
      className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-blue-600 text-white"
      aria-label="Menu"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        {isMobileMenuOpen ? (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        ) : (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        )}
      </svg>
    </button>
  );

  return (
    <>
      <MobileMenuButton />

      <div
        className={cn(
          "h-screen bg-gray-900 text-white flex flex-col",
          "fixed md:static z-40 transition-all duration-300 ease-in-out",
          isMobile
            ? isMobileMenuOpen
              ? "w-64 left-0"
              : "-left-64 w-64"
            : "w-64",
          isMobileMenuOpen && "shadow-xl"
        )}
      >
        <div className="p-4 border-b border-gray-800">
          <h2 className="text-xl font-bold">Painel de Controle</h2>
          <p className="text-xs text-blue-400">{role}</p>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            <li>
              <Link
                href="/dashboard"
                className={`block p-2 rounded hover:bg-blue-700 transition ${
                  isActive("/dashboard") && pathname === "/dashboard"
                    ? "bg-blue-700"
                    : ""
                }`}
                onClick={() => isMobile && setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
            </li>

            <li>
              <div className="space-y-1">
                <button
                  onClick={() => setSettingsOpen(!settingsOpen)}
                  className={`w-full flex items-center justify-between p-2 rounded hover:bg-blue-700 transition ${
                    isSettingsActive() ? "bg-blue-700" : ""
                  }`}
                >
                  <span>Configurações</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 transition-transform ${
                      settingsOpen || isSettingsActive() ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                <div
                  className={`pl-4 space-y-1 ${
                    settingsOpen || isSettingsActive() ? "block" : "hidden"
                  }`}
                >
                  <Link
                    href="/dashboard/settings"
                    className={`block p-2 rounded hover:bg-blue-600 transition ${
                      pathname === "/dashboard/settings" ? "bg-blue-600" : ""
                    }`}
                    onClick={() => isMobile && setIsMobileMenuOpen(false)}
                  >
                    Configurações Gerais
                  </Link>
                  <Link
                    href="/dashboard/settings/profile"
                    className={`block p-2 rounded hover:bg-blue-600 transition ${
                      pathname === "/dashboard/settings/profile"
                        ? "bg-blue-600"
                        : ""
                    }`}
                    onClick={() => isMobile && setIsMobileMenuOpen(false)}
                  >
                    Meu Perfil
                  </Link>
                </div>
              </div>
            </li>
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full p-2 bg-red-600 hover:bg-red-700 rounded text-white transition"
          >
            Sair
          </button>
        </div>
      </div>

      {isMobile && isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
