import { createNavigation } from "next-intl/navigation";

import { routing } from "./routing";

// Wrappers de navegación conscientes del locale (Link, router, etc.).
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
