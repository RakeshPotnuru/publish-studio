export const shortenText = (
  text: string,
  length: number,
  splitAt: "middle" | "end" = "middle",
): string => {
  if (text.length <= length) {
    return text;
  } else {
    const ellipsesLength = 3;
    const halfEllipsesLength = Math.floor(ellipsesLength / 2);
    const leftHalf = text.slice(0, length / 2 - halfEllipsesLength);
    const rightHalf = text.slice(text.length - length / 2 + halfEllipsesLength);
    return splitAt === "middle"
      ? `${leftHalf}...${rightHalf}`
      : text.slice(0, length - ellipsesLength) + "...";
  }
};
