import { Button } from "react-bootstrap";
import { match } from "ts-pattern";
import useThemeStore from "../stores/themeStore";
import { FaDesktop, FaMoon, FaSun } from "react-icons/fa";
import type { Theme } from "../types";

export default function ThemeToggle() {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const themes: Theme[] = ["dark", "light", "system"];

  const rotateTheme = () =>
    setTheme(
      theme ? themes[(themes.indexOf(theme) + 1) % themes.length] : "system",
    );

  return (
    <Button onClick={() => rotateTheme()} className="p-2 lh-1">
      {match(theme)
        .with("dark", () => <FaMoon size={20} />)
        .with("light", () => <FaSun size={20} />)
        .otherwise(() => (
          <FaDesktop size={20} />
        ))}
    </Button>
  );
}
