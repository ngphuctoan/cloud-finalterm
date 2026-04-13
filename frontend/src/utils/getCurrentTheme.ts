import type { Theme } from "../types";

export default function getCurrentTheme(theme: Theme) {
  return theme !== "system"
    ? theme
    : window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
}
