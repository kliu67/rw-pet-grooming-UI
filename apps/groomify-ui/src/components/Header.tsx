import React from "react";
import { useTranslation } from "react-i18next";
import { PawPrint, Menu, X } from "lucide-react";
import { useState } from "react";
import { LanguageSwitcher } from "./LanguageSwticher";

interface HeaderProps {
  onBookNow: () => void;
}

export function Header({ onBookNow }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <header className="fixed w-full bg-white/90 backdrop-blur-md z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <PawPrint className="h-8 w-8 text-teal-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">
              {t("Header.name")}
            </span>
          </div>

          <nav className="hidden md:flex space-x-8">
            <a
              href="#home"
              className="text-gray-600 hover:text-teal-600 font-medium transition-colors"
            >
              {t('header.home')}
            </a>
            <a
              href="#services"
              className="text-gray-600 hover:text-teal-600 font-medium transition-colors"
            >
              {t('header.services')}
            </a>
            {/* <a href="#about" className="text-gray-600 hover:text-teal-600 font-medium transition-colors">About</a> */}
            {/* <a href="#reviews" className="text-gray-600 hover:text-teal-600 font-medium transition-colors">Reviews</a> */}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher compact />
            <button
              onClick={onBookNow}
              className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded-full font-medium transition-all transform hover:scale-105 shadow-md"
            >
              {t('header.bookAppointment')}
            </button>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <LanguageSwitcher compact tiny />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col items-center">
            <a
              href="#home"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-gray-50 w-full text-center"
              onClick={() => setIsMenuOpen(false)}
            >
                            {t('header.home')}

            </a>
            <a
              href="#services"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-gray-50 w-full text-center"
              onClick={() => setIsMenuOpen(false)}
            >
                            {t('header.services')}

            </a>
            {/* <a
              href="#about"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-gray-50 w-full text-center"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </a>
            <a
              href="#reviews"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-gray-50 w-full text-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Reviews
            </a> */}
            <button
              onClick={() => {
                setIsMenuOpen(false);
                onBookNow();
              }}
              className="mt-4 w-[90%] bg-teal-600 text-white px-5 py-3 rounded-lg font-medium"
            >
              {t('header.bookAppointment')}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
