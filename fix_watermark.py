import re

def update_watermark(filepath):
    with open(filepath, "r") as f:
        text = f.read()
    
    old_watermark_logic = """        // Add Watermark
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'; // 40% opacity white
        ctx.font = `bold ${Math.floor(img.width * 0.1)}px sans-serif`; // 10% of image width
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Rotate and draw in center
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(-Math.PI / 6); // slight diagonal
        ctx.fillText('MegaElan', 0, 0);"""

    new_watermark_logic = """        // Add Watermark (Highly visible, with shadow)
        const fontSize = Math.floor(img.width * 0.15);
        ctx.font = `bold ${fontSize}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Add strong drop shadow for contrast on white/bright images
        ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
        ctx.shadowBlur = 15;
        ctx.shadowOffsetX = 5;
        ctx.shadowOffsetY = 5;

        // Semi-transparent white text
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';

        // Rotate and draw in center
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(-Math.PI / 6);
        ctx.fillText('MegaElan.az', 0, 0);
        
        // Add a smaller sub-watermark
        ctx.font = `bold ${Math.floor(fontSize * 0.3)}px sans-serif`;
        ctx.fillText('Ödənişsiz Elan Saytı', 0, fontSize);"""
    
    if old_watermark_logic in text:
        text = text.replace(old_watermark_logic, new_watermark_logic)
        with open(filepath, "w") as f:
            f.write(text)
        print(f"Updated {filepath}")
    else:
        print(f"Pattern not found in {filepath}")

update_watermark("src/app/yeni-elan/page.tsx")
update_watermark("src/app/redakte/[id]/page.tsx")
