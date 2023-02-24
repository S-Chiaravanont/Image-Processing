const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

const grayscale = document.getElementById('grayscale');
const monotone = document.getElementById('monotone');
const reset = document.getElementById('reset');
// const download = document.getElementById('download');
const input = document.getElementById('image');
const lowPoly = document.getElementById('lowpoly');

let imageWidth = null;
let imageHeight = null;
let originalData = null;

const image = new Image();
image.addEventListener('load', () => {
  imageWidth = image.width;
  imageHeight = image.height;
  if (imageWidth > 700) {
    canvas.width = 700;
    var hRatio = canvas.width / image.width;
    canvas.height = image.height * hRatio;
    // var vRatio = canvas.height / image.height;
    // var ratio = Math.min(hRatio, vRatio);
    // var centerShiftX = (canvas.width - image.width * ratio) / 2;
    // var centerShiftY = (canvas.height - image.height * ratio) / 2;
    context.drawImage(image, 0, 0, image.width, image.height, 0, 0, image.width * hRatio, image.height * hRatio);
  } else {
    canvas.width = imageWidth;
    canvas.height = imageHeight;
    context.drawImage(image, 0, 0);
  }

});

const reader = new FileReader();
reader.addEventListener('load', () => {
  image.src = reader.result;
  originalData = reader.result;
});

input.addEventListener('change', () => {
  reader.readAsDataURL(input.files[0]);
});

const applyGrayscale = () => {
  const image = context.getImageData(0, 0, imageWidth, imageHeight);
  const imgData = image.data;

  for (let i = 0; i < imgData.length; i += 4) {
    const red = imgData[i];
    const green = imgData[i + 1];
    const blue = imgData[i + 2];

    const grayValue = (red + green + blue) / 3;
    imgData[i] = grayValue;
    imgData[i + 1] = grayValue;
    imgData[i + 2] = grayValue;
  }
  context.putImageData(image, 0, 0);
};

const applyMonotone = () => {
  const image = context.getImageData(0, 0, imageWidth, imageHeight);
  const imgData = image.data;

  for (let i = 0; i < imgData.length; i += 4) {
    const red = imgData[i];
    const green = imgData[i + 1];
    const blue = imgData[i + 2];

    const grayValue = (red + green + blue) / 3;
    imgData[i] = grayValue - 40;
    imgData[i + 1] = grayValue - 40;
    imgData[i + 2] = grayValue + 80;
  }
  context.putImageData(image, 0, 0);
};

const resetFilter = () => {
  if (!image || !context || !originalData) {
    return alert('There is nothing to reset');
  }

  image.src = originalData;
  context.drawImage(image, 0, 0);
};

const applyLowpoly = () => {
  const image = context.getImageData(0, 0, imageWidth, imageHeight);
  const imgData = image.data;
  const pixel = 10;
  for (let y = 0; y < image.height; y += pixel) {
    for (let x = 0; x < image.width; x += pixel) {
      let counter = 0;
      let counter2 = 0;
      let redPixel = 0;
      let greenPixel = 0;
      let bluePixel = 0;
      while (counter < pixel) {
        for (let i = 0; i < pixel; i++) {
          redPixel += imgData[((y + i) * 4 * image.width) + (x * 4 + (4 * counter))];
          greenPixel += imgData[((y + i) * 4 * image.width) + (x * 4 + 1 + (4 * counter))];
          bluePixel += imgData[((y + i) * 4 * image.width) + (x * 4 + 2 + (4 * counter))];
        }
        counter++;
      }
      const avgRed = redPixel / (pixel * pixel);
      const avgGreen = greenPixel / (pixel * pixel);
      const avgBlue = bluePixel / (pixel * pixel);

      while (counter2 < pixel) {
        for (let i = 0; i < pixel; i++) {
          imgData[((y + i) * 4 * image.width) + (x * 4 + (4 * counter2))] = avgRed;
          imgData[((y + i) * 4 * image.width) + (x * 4 + 1 + (4 * counter2))] = avgGreen;
          imgData[((y + i) * 4 * image.width) + (x * 4 + 2 + (4 * counter2))] = avgBlue;
        }
        counter2++;
      }
    }
  }
  context.putImageData(image, 0, 0);
};

grayscale.addEventListener('click', applyGrayscale);
monotone.addEventListener('click', applyMonotone);
reset.addEventListener('click', resetFilter);
lowPoly.addEventListener('click', applyLowpoly);
