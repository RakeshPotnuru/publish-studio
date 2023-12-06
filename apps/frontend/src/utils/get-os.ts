export default function getOs() {
    const userAgent = navigator.userAgent;

    if (userAgent.includes("Mac") || userAgent.includes("iPhone") || userAgent.includes("iPad")) {
        return "mac";
    } else {
        return "pc";
    }
}
