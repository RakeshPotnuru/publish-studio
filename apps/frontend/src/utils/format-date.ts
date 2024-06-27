import {
  endOfWeek,
  format,
  isThisYear,
  isToday,
  isTomorrow,
  isYesterday,
  startOfWeek,
} from "date-fns";

export function formatDate(date: Date): string {
  const today = new Date();
  const startOfNextWeek = startOfWeek(
    new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7),
    { weekStartsOn: 1 },
  );
  const endOfNextWeek = endOfWeek(startOfNextWeek, { weekStartsOn: 1 });

  if (isToday(date)) {
    return "Today";
  } else if (isYesterday(date)) {
    return "Yesterday";
  } else if (isTomorrow(date)) {
    return "Tomorrow";
  } else if (date >= startOfNextWeek && date <= endOfNextWeek) {
    return format(date, "EEEE");
  } else {
    const formattedDate = format(date, "MMMM d");
    const year = isThisYear(date) ? "" : `, ${format(date, "yyyy")}`;
    return `${formattedDate}${year}`;
  }
}
