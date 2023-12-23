import {
    differenceInDays,
    differenceInHours,
    differenceInMinutes,
    differenceInSeconds,
    format,
} from "date-fns";

export default function formatTimestamp(timestamp: Date) {
    const now = new Date();
    const targetDate = new Date(timestamp);

    if (differenceInDays(targetDate, now) > 30 && differenceInDays(targetDate, now) < 365) {
        return format(targetDate, "Do MMM");
    } else if (differenceInDays(targetDate, now) >= 1) {
        return `${differenceInDays(targetDate, now)} days`;
    } else if (differenceInHours(targetDate, now) >= 1) {
        return `${differenceInHours(targetDate, now)} hrs`;
    } else if (differenceInMinutes(targetDate, now) >= 1) {
        return `${differenceInMinutes(targetDate, now)} min`;
    } else if (differenceInSeconds(targetDate, now) >= 1) {
        return `${differenceInSeconds(targetDate, now)} sec`;
    } else {
        return "0 sec";
    }
}
