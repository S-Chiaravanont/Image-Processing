const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

const grayscale = document.getElementById('grayscale');
const monotone = document.getElementById('monotone');
const reset = document.getElementById('reset');
// const download = document.getElementById('download');
const input = document.getElementById('image');

let imageWidth = null;
let imageHeight = null;
let originalData = null;

const image = new Image();
image.addEventListener('load', () => {
  imageWidth = image.width;
  imageHeight = image.height;
  if (imageWidth > 700) {
    canvas.width = 700;
    canvas.height = 700;
    var hRatio = canvas.width / image.width;
    var vRatio = canvas.height / image.height;
    var ratio = Math.min(hRatio, vRatio);
    // var centerShiftX = (canvas.width - image.width * ratio) / 2;
    // var centerShiftY = (canvas.height - image.height * ratio) / 2;
    context.drawImage(image, 0, 0, image.width, image.height, 0, 0, image.width * ratio, image.height * ratio);
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

grayscale.addEventListener('click', applyGrayscale);
monotone.addEventListener('click', applyMonotone);
reset.addEventListener('click', resetFilter);
