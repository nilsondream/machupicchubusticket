"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Coins, Globe, Settings as SettingsIcon, Check } from "lucide-react";
import ButtonTheme from "./button-theme";
//import { useI18n } from "@/providers/i18n";
import { usePathname, useRouter } from "@/i18n/navigation";
//import { useLocale } from "next-intl";
//import { useTransition } from "react";

type Panel = "main" | "currency" | "language";

const Settings = () => {
  const [openSettings, setOpenSettings] = useState(false);
  const [panel, setPanel] = useState<Panel>("main");
  const containerRef = useRef<HTMLDivElement>(null);

  //const router = useRouter();
  //const pathname = usePathname();
  //const locale = useLocale();
  //const [, startTransition] = useTransition();

  /*const {
    t,
    currency,
    languages,
    currencies,
    setCurrency,
  } = useI18n();*/

  /*const changeLanguage = (code: string) => {
    startTransition(() => {
      // Navega a la misma ruta con el nuevo idioma (en="/", es="/es").
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      router.replace(pathname, { locale: code });
    });
  };*/

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

  //const currentLanguage = languages.find((l) => l.code === locale);

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
        <div className="absolute z-50 p-2 border shadow-xl mt-2 rounded-3xl w-80 max-md:w-64 right-0 bg-background text-foreground">
          {panel === "main" && (
            <>
              <span className="font-semibold text-xs text-muted-foreground px-3 py-2">
                Settings
              </span>
              <div className="space-y-1.5 mt-2">
                <button
                  onClick={() => setPanel("currency")}
                  className="flex items-center justify-between w-full px-3 py-2 hover:bg-muted rounded-xl cursor-not-allowed opacity-50"
                  disabled
                >
                  <div className="flex items-center gap-2 font-bold">
                    <Coins size={20} />
                    Currency
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    USD
                    <ChevronRight size={20} />
                  </div>
                </button>
                <button
                  onClick={() => setPanel("language")}
                  className="flex items-center justify-between w-full px-3 py-2 hover:bg-muted rounded-xl cursor-not-allowed opacity-50"
                  disabled
                >
                  <div className="flex items-center gap-2 font-semibold">
                    <Globe size={20} />
                    Language
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    English
                    <ChevronRight size={20} />
                  </div>
                </button>
                <ButtonTheme />
              </div>
            </>
          )}

          {/*panel === "currency" && (
            <>
              <button
                onClick={() => setPanel("main")}
                className="flex items-center gap-1 font-semibold text-xs text-muted-foreground px-2 py-2 hover:text-foreground"
              >
                <ChevronLeft size={16} />
                {t("settings.currency", "Currency")}
              </button>
              <div className="space-y-1 mt-1 max-h-72 overflow-y-auto">
                {currencies.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => { setCurrency(c.code); setPanel("main"); }}
                    className="flex items-center justify-between w-full px-3 py-2 hover:bg-muted rounded-lg"
                  >
                    <div className="flex items-center gap-2 font-medium">
                      <span className="w-6 text-left text-muted-foreground">{c.symbol}</span>
                      {c.name}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      {c.code}
                      {currency?.code === c.code && <Check size={16} className="text-foreground" />}
                    </div>
                  </button>
                ))}
              </div>
            </>
          )*/}

          {panel === "language" && (
            <>
              <button
                onClick={() => setPanel("main")}
                className="flex items-center gap-1 font-semibold text-xs text-muted-foreground px-2 py-2 hover:text-foreground"
              >
                <ChevronLeft size={16} />
                Language
              </button>
              <div className="space-y-1 mt-1 max-h-72 overflow-y-auto">
                {/*languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => { changeLanguage(l.code); setPanel("main"); }}
                    className="flex items-center justify-between w-full px-3 py-2 hover:bg-muted rounded-lg"
                  >
                    <div className="flex items-center gap-2 font-medium">
                      <span className="uppercase w-6 text-left text-muted-foreground">{l.code}</span>
                      {l.nativeName}
                    </div>
                    {locale === l.code && <Check size={16} className="text-foreground" />}
                  </button>
                ))*/}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default Settings