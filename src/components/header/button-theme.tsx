import { useTheme } from "next-themes";
import { ChevronRight, Moon, Sun } from "lucide-react";

const ButtonTheme = () => {
  const { theme, setTheme } = useTheme();

  return (
    <button
      className="cursor-pointer flex items-center justify-between gap-2 w-full px-3 py-2 text-sm rounded-xl hover:bg-muted transition-all"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <span>
        Theme
      </span>
      <div className="flex items-center text-muted-foreground">
        <span className="hidden dark:block">Light</span>
        <span className="block dark:hidden">Dark</span>
        <ChevronRight size={20} />
      </div>
      <span className="sr-only">Button Theme</span>
    </button>
  );
}
export default ButtonTheme