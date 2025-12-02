import React from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import FooterLogo from "../icons/FooterLogo";

// הוראות להחלפת קישורים:
// החלף את href="#" בכל הקישורים עם הכתובות האמיתיות שלך
// למשל: href="/home", href="/about", href="https://facebook.com/yourpage" וכו'

export default function Footer() {
  return (
    <footer
      className=" footer bg-dark pb-4 text-white relative"
      style={{
        height: "350px",
        fontFamily: "Montserrat Alternates, sans-serif",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center">
        {/* Four Columns Layout */}
        <div
          className="grid gap-6 w-full"
          style={{ gridTemplateColumns: "1.5fr 5.5fr 1fr 1fr" }}
        >
          {/* Contact Us Section */}
          <div className="text-left">
            <h3 className="text-green text-sm font-bold mb-6 uppercase tracking-wider">
              CONTACT US
            </h3>
            <div className="space-y-3">
              <div className="text-gray-300 hover:text-white cursor-pointer">info@3d-fly.com</div>
              <div className="text-gray-300 hover:text-white cursor-pointer">+972-5000000</div>
              <div className="text-gray-300 hover:text-white cursor-pointer">Sunday-Thursday</div>
              <div className="text-gray-300 hover:text-white cursor-pointer">09:00-18:00</div>
            </div>
          </div>

          {/* Logo Section */}
          <div className="flex ml-20 justify-center items-center">
            <FooterLogo />
          </div>

          {/* Menu Section */}
          <div className="text-left">
            <h3 className="text-green text-sm font-bold mb-6 uppercase tracking-wider">
              MENU
            </h3>
            <div className="space-y-3">
              <Link
                to="/"
                className="block text-gray-300 hover:text-white transition-colors uppercase text-sm"
              >
                HOME
              </Link>
              <Link
                to="/explore"
                className="block text-gray-300 hover:text-white transition-colors uppercase text-sm"
              >
                EXPLORE
              </Link>
              <Link
                to="/faq"
                className="block text-gray-300 hover:text-white transition-colors uppercase text-sm"
              >
                FAQ
              </Link>
              <Link
                to="/store"
                className="block text-gray-300 hover:text-white transition-colors uppercase text-sm"
              >
                STORE
              </Link>
              <Link
                to="/about"
                className="block text-gray-300 hover:text-white transition-colors uppercase text-sm"
              >
                ABOUT
              </Link>
              <a
                href="#"
                className="block text-gray-300 hover:text-white transition-colors uppercase text-sm"
              >
                PRIVACY POLICY
              </a>
              <a
                href="#"
                className="block text-gray-300 hover:text-white transition-colors uppercase text-sm"
              >
                TERMS OF USE
              </a>
            </div>
          </div>

          {/* Follow Us Section */}
          <div className="text-left">
            <h3 className="text-green text-sm font-bold mb-6 uppercase tracking-wider">
              FOLLOW US
            </h3>
            <div className="space-y-3">
              <a
                href="#"
                className="block text-gray-300 hover:text-white transition-colors uppercase text-sm"
              >
                FACEBOOK
              </a>
              <a
                href="#"
                className="block text-gray-300 hover:text-white transition-colors uppercase text-sm"
              >
                INSTAGRAM
              </a>
              <a
                href="#"
                className="block text-gray-300 hover:text-white transition-colors uppercase text-sm"
              >
                LINKEDIN
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div
          className="w-full left-1/2 -translate-x-1/2 absolute"
          style={{ bottom: "45px" }}
        >
          <div className="-10 w-full border-t border-gray"></div>
        </div>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <p className="text-gray-400 text-xs">
            © 2025 3D-FLY ALL RIGHTS RESERVED
          </p>
        </div>
      </div>
    </footer>
  );
}
