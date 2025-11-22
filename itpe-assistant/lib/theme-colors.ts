export const themeColors = [
  {
    name: "scholars-spectrum",
    label: "Scholar's Spectrum",
    activeColor: {
      light: "hsl(180, 80%, 27%)", // Teal
      dark: "hsl(200, 100%, 65%)", // Cyan
    },
  },
  {
    name: "slate",
    label: "Slate",
    activeColor: {
      light: "hsl(215, 16%, 47%)",
      dark: "hsl(215, 20%, 65%)",
    },
  },
  {
    name: "rose",
    label: "Rose",
    activeColor: {
      light: "hsl(346, 77%, 50%)",
      dark: "hsl(346, 77%, 65%)",
    },
  },
  {
    name: "blue",
    label: "Blue",
    activeColor: {
      light: "hsl(221, 83%, 53%)",
      dark: "hsl(217, 91%, 60%)",
    },
  },
  {
    name: "green",
    label: "Green",
    activeColor: {
      light: "hsl(142, 71%, 45%)",
      dark: "hsl(142, 76%, 60%)",
    },
  },
  {
    name: "orange",
    label: "Orange",
    activeColor: {
      light: "hsl(25, 95%, 53%)",
      dark: "hsl(31, 97%, 62%)",
    },
  },
  {
    name: "violet",
    label: "Violet",
    activeColor: {
      light: "hsl(262, 83%, 58%)",
      dark: "hsl(263, 70%, 65%)",
    },
  },
  {
    name: "yellow",
    label: "Yellow",
    activeColor: {
      light: "hsl(48, 96%, 53%)",
      dark: "hsl(48, 96%, 60%)",
    },
  },
] as const;

export type ThemeColor = (typeof themeColors)[number]["name"];
