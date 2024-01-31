export default function getOs() {
    const userAgent = navigator.userAgent;

    return userAgent.includes("Mac") || userAgent.includes("iPhone") || userAgent.includes("iPad")
        ? "mac"
        : "pc";
}
