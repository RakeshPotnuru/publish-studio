export function toggleFullscreen(html_id: string) {
    const element = document.getElementById(html_id);

    if (!document.fullscreenElement) {
        try {
            element?.requestFullscreen();
        } catch (error) {
            console.log(error);
            alert("Error attempting to enable full-screen mode:");
        }
    } else {
        document.exitFullscreen();
    }
}
