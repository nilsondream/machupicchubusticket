import { useTheme } from "next-themes";
import { ChevronRight, Moon, Sun } from "lucide-react";

const ButtonTheme = () => {
  const { theme, setTheme } = useTheme();

  return (
    <button
      className="flex items-center justify-between w-full px-3 py-2 hover:bg-muted rounded-xl cursor-pointer"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <div className="flex items-center gap-2 font-semibold">
        <span className="hidden dark:block"><Sun size={20} /></span>
        <span className="block dark:hidden"><Moon size={20} /></span>
        Theme
      </div>
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