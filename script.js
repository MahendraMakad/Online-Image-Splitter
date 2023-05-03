const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const imageInput = document.getElementById('imageInput');
const tilesContainer = document.getElementById('tilesContainer');
const downloadButton = document.getElementById('downloadButton');
const maxCanvasWidth = 500; // Maximum canvas width

imageInput.addEventListener('change', () => {
  const image = new Image();
  const file = imageInput.files[0];
  const reader = new FileReader();

  reader.onload = () => {
    image.onload = () => {
      tilesContainer.innerHTML = "";
      const { width, height } = image;
      let canvasWidth = width;
      let canvasHeight = height;
      if (width > maxCanvasWidth) {
        canvasWidth = maxCanvasWidth;
        canvasHeight = height * (maxCanvasWidth / width);
      }
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      ctx.drawImage(image, 0, 0, canvasWidth, canvasHeight);

      const x = 1; // Set the number of tiles horizontally
      const y = 2; // Set the number of tiles vertically
      const tiles = [];
      const tileWidth = Math.floor(width / x);
      const tileHeight = Math.floor(height / y);

      for (let i = 0; i < x; i++) {
        for (let j = 0; j < y; j++) {
          const tileCanvas = document.createElement('canvas');
          tileCanvas.width = tileWidth;
          tileCanvas.height = tileHeight;
          const tileCtx = tileCanvas.getContext('2d');
          tileCtx.drawImage(image, i * tileWidth, j * tileHeight, tileWidth, tileHeight, 0, 0, tileWidth, tileHeight);
          tiles.push(tileCanvas);
        }
      }

      // Add each tile to the page
      tiles.forEach((tile, index) => {
        const tileContainer = document.createElement('div');
        tileContainer.classList.add('tileContainer');
        const fileName = `tile_${index}.png`;
        const tileImage = document.createElement('img');
        tileImage.src = tile.toDataURL('image/png');
        tileImage.alt = fileName;
        const tileName = document.createElement('p');
        tileName.textContent = fileName;
        tileContainer.appendChild(tileImage);
        tileContainer.appendChild(tileName);
        tilesContainer.appendChild(tileContainer);
      });

      // Create a new zip file
      const zip = new JSZip();

      // Add each tile to the zip file
      tiles.forEach((tile, index) => {
        const fileName = `tile_${index}.png`;
        zip.file(fileName, tile.toDataURL('image/png').substr(22), { base64: true });
      });

      // Show the download button
      downloadButton.style.display = 'block';

      // Add event listener to the download button
      downloadButton.addEventListener('click', () => {
        // Generate the zip file and download it
        zip.generateAsync({ type: 'blob' }).then((content) => {
          const link = document.createElement('a');
          link.href = URL.createObjectURL(content);
          link.download = 'tiles.zip';
          link.click();
        });
      });
    }
    image.src = reader.result;
  }
  reader.readAsDataURL(file);
});
