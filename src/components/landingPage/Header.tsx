"use client";
import Link from "next/link";
import React, { useState } from "react";

import { Button } from "../ui/button";

const routes = [
  {
    title: "Features",
    href: "#Fetures",
  },
  {
    title: "Resources",
    href: "#Resources",
  },
  {
    title: "Pricing",
    href: "#Pricing",
  },
  {
    title: "Testimonials",
    href: "#Testimonials",
  },
];

function Header() {
  const [path, setPath] = useState("#products");
  return (
    <header className="p-4 flex items-center md:justify-between w-full">
      <Link href={"/"} className="flex items-center gap-2">
        <span className="text-3xl font-semibold">
          Arc<span className="text-purple-400">ane</span>
        </span>
      </Link>
      <nav className=" gap-6 justify-center text-sm flex-1 hidden md:flex">
        {routes.map((route) => (
          <Link
            href={route.href}
            key={route.title}
            className="hover:text-purple-400 transition-colors"
          >
            {route.title}
          </Link>
        ))}
      </nav>
      <div className=" items-center gap-4 hidden md:flex">
        <Link href={"/login"}>
          <Button variant={"link"} className="cursor-pointer">
            Login
          </Button>
        </Link>
        <Link href={"/signup"}>
          <Button className="cursor-pointer">Sign Up</Button>
        </Link>
      </div>
    </header>
  );
}

export default Header;
