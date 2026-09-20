import re

with open("src/app/yeni-elan/page.tsx", "r") as f:
    text = f.read()

# Add addWatermark function
watermark_func = """
const addWatermark = (file: File): Promise<File> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(file);

        // Draw original image
        ctx.drawImage(img, 0, 0);

        // Add Watermark
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'; // 40% opacity white
        ctx.font = `bold ${Math.floor(img.width * 0.1)}px sans-serif`; // 10% of image width
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Rotate and draw in center
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(-Math.PI / 6); // slight diagonal
        ctx.fillText('MegaElan', 0, 0);

        canvas.toBlob((blob) => {
          if (blob) {
            resolve(new File([blob], file.name, { type: file.type }));
          } else {
            resolve(file); // fallback to original if blob fails
          }
        }, file.type, 0.9);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};
"""

text = text.replace("export default function NewAdPage() {", watermark_func + "\nexport default function NewAdPage() {")

# Apply watermark before upload
upload_old = """      // 1. Upload all files to ImgBB
      const uploadPromises = files.map(file => uploadImageToImgBB(file));"""
upload_new = """      // 1. Apply watermark and upload files to ImgBB
      const uploadPromises = files.map(async (file) => {
        const watermarkedFile = await addWatermark(file);
        return uploadImageToImgBB(watermarkedFile);
      });"""

text = text.replace(upload_old, upload_new)

with open("src/app/yeni-elan/page.tsx", "w") as f:
    f.write(text)
