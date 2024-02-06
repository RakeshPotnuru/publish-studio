import { toast } from "@itsrakesh/ui";

export async function toggleFullscreen(html_id: string) {
  const element = document.querySelector(`#${html_id}`);

  if (document.fullscreenElement) {
    await document.exitFullscreen();
  } else {
    try {
      await element?.requestFullscreen();
    } catch (error) {
      console.log(error);
      toast.error("Error attempting to enable full-screen mode.");
    }
  }
}
