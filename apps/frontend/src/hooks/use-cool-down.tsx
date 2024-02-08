import { useEffect, useState } from "react";

export function useCoolDown() {
  const [coolDown, setCoolDown] = useState(0);

  useEffect(() => {
    if (coolDown > 0) {
      const interval = setInterval(() => {
        setCoolDown((prev) => prev - 1);
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [coolDown]);

  return { coolDown, setCoolDown };
}
