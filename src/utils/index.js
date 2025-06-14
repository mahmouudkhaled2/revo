// Utility function for image handling
export const getImageSrc = (image, defaultImage = '/assets/images/restaurant-placeholder.jpg') => {
    if (!image) return defaultImage;
    if (image.startsWith('data:image/')) return image;
    if (image.startsWith('http')) return image;
    try {
      return `data:image/jpeg;base64,${image}`;
    } catch (error) {
      console.error('Invalid base64 image:', error);
      return defaultImage;
    }
  };