export function detectBrowserLocale(): string {
  if (typeof window === "undefined") {
    return "en-US"; // Default fallback for non-browser environments
  }

  const nav = window.navigator;
  let locale: string = "en-US"; // Default fallback

  if (nav.languages?.length) {
    // Chrome, Firefox
    locale = nav.languages[0];
  } else if (nav.language) {
    // IE, Safari
    locale = nav.language;
  }

  return locale;
}
