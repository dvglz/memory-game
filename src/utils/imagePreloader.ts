export const preloadImages = (urls: string[]) => {
  urls.forEach(url => {
    if (!url) return;
    const img = new Image();
    img.src = url;
  });
};
