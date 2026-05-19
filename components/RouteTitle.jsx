"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const titles = {
  "/": "IdeaVault | Home",
  "/ideas": "IdeaVault | Ideas",
  "/add-idea": "IdeaVault | Add Idea",
  "/my-ideas": "IdeaVault | My Ideas",
  "/my-interactions": "IdeaVault | My Interactions",
  "/profile": "IdeaVault | Profile",
  "/bookmarks": "IdeaVault | Bookmarks",
  "/login": "IdeaVault | Login",
  "/register": "IdeaVault | Register",
};

export default function RouteTitle() {
  const pathname = usePathname();

  useEffect(() => {
    document.title = pathname.startsWith("/ideas/") ? "IdeaVault | Idea Details" : titles[pathname] || "IdeaVault";
  }, [pathname]);

  return null;
}
