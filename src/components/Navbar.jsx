import React from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import Button from "./Button";

export default function Navbar() {
  return (
    <div className="sticky top-0 z-50">
      <nav className="bg-dark flex flex-row italic items-center justify-between p-3 text-gray">
        <Link to="/">
          <Logo width={180} height={66} />
        </Link>
        <ul className="flex flex-row gap-6 items-center absolute left-1/2 transform -translate-x-1/2">
          <li>
            <Link
              to="/explore"
              className="hover:text-white cursor-pointer transition-colors"
            >
              Explore
            </Link>
          </li>
          <li>
            <Link
              to="/faq"
              className="hover:text-white cursor-pointer transition-colors"
            >
              FAQ
            </Link>
          </li>
          <li>
            <Link
              to="/store"
              className="hover:text-white cursor-pointer transition-colors"
            >
              Store
            </Link>
          </li>
          <li>
            <Link
              to="/blog"
              className="hover:text-white cursor-pointer transition-colors"
            >
              Blog
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className="hover:text-white cursor-pointer transition-colors"
            >
              About
            </Link>
          </li>
        </ul>
        <div className="w-[200px]"></div>
        <div className="flex flex-row gap-1">
          <Button
            hovering="darkBg"
            variant="secondary"
            className=" w-[120px] text-xs italic"
          >
            sign in
          </Button>
          <Button
            hovering="darkBg"
            variant="secondary"
            className=" w-[120px] text-xs italic"
          >
            join now
          </Button>
        </div>
      </nav>
    </div>
  );
}
