export enum THEMES_ENUM {
  light = "light",
  dark = "dark",
  mono = "mono",
}

export const THEMES = Object.keys(THEMES_ENUM).map((item) => {
  return {
    title: item,
  };
});
