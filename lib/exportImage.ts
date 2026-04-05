import { toPng } from 'html-to-image';
import { toast } from 'sonner';

export const exportAsImage = async (elementId: string, fileName: string) => {
  const element = document.getElementById(elementId);
  if (!element) {
    toast.error("Could not find the element to export.");
    return;
  }

  // Use a slight delay to ensure all animations/fonts are rendered
  toast.loading("Preparing high-quality export...", { id: "export-toast" });

  try {
    const dataUrl = await toPng(element, {
      quality: 1.0,
      pixelRatio: 2,
      // Optional bypass for any crossOrigin issues if needed, but modern html-to-image handles it okay mostly.
    });

    const downloadLink = document.createElement("a");
    downloadLink.href = dataUrl;
    downloadLink.download = `${fileName}.png`;
    
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    toast.success("Image exported successfully!", { id: "export-toast" });
  } catch (error) {
    console.error("Error exporting image:", error);
    toast.error("Failed to export image. Ensure no external assets are blocking it.", { id: "export-toast" });
  }
};
