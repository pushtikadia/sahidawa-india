/**
 * Utility to compress and transcode images to WebP/JPEG completely on the client-side
 * before uploading to prevent network bottlenecks in low-bandwidth areas.
 */
export const compressImage = (file: File, maxWidth = 1200, quality = 0.75): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    // If it's not an image, skip processing entirely
    if (!file.type.startsWith('image/')) {
      return resolve(file);
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect ratio downscaling bounds
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Failed to create 2D canvas context'));
        }

        // Draw image smoothly onto downsized canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Determine best supported format (Fallback to progressive jpeg if webp isn't viable)
        const outputType = file.type === 'image/png' || file.type === 'image/webp' ? 'image/webp' : 'image/jpeg';

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              resolve(file); // Fallback to original file on error
            }
          },
          outputType,
          quality
        );
      };

      img.onerror = (err) => reject(err);
    };

    reader.onerror = (err) => reject(err);
  });
};
