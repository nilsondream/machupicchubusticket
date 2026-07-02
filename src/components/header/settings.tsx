"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Coins, Globe, Settings as SettingsIcon, Check } from "lucide-react";
import ButtonTheme from "./button-theme";

type Panel = "main" | "currency" | "language";

const Settings = () => {
  const [openSettings, setOpenSettings] = useState(false);
  const [panel, setPanel] = useState<Panel>("main");
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleSettings = () => setOpenSettings((prev) => !prev);
  const closeSettings = () => {
    setOpenSettings(false);
    setPanel("main");
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        closeSettings();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <Button
        variant={"ghost"}
        size={"icon"}
        onClick={toggleSettings}
      >
        <SettingsIcon />
        <span className="sr-only">Settings Theme</span>
      </Button>

      {openSettings && (
        <div className="absolute z-50 p-1.5 border shadow-lg mt-2 rounded-2xl w-60 max-md:w-64 right-0 bg-popover text-foreground animate-in fade-in-50 slide-in-from-top-1">
          {panel === "main" && (
            <div className="space-y-1">
              <button
                onClick={() => setPanel("currency")}
                className="flex items-center justify-between gap-2 w-full px-3 py-2 text-sm rounded-xl hover:bg-muted transition-all opacity-50"
                disabled
              >
                <span>                  Currency                </span>
                <div className="flex items-center text-muted-foreground">
                  USD
                  <ChevronRight size={20} />
                </div>
              </button>
              <hr />
              <button
                onClick={() => setPanel("language")}
                className="flex items-center justify-between gap-2 w-full px-3 py-2 text-sm rounded-xl hover:bg-muted transition-all opacity-50"
                disabled
              >
                <span>Language</span>
                <div className="flex items-center text-muted-foreground">
                  English
                  <ChevronRight size={20} />
                </div>
              </button>
              <hr />
              <ButtonTheme />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Settings