'use strict'

const filters = document.querySelector('.filters');

filters.addEventListener('input', changeFiters);

function changeFiters(e) {
  e = e || window.event;

  const out = document.querySelector(`input[name=${e.target.name}] + output`)
  const img = document.querySelector('.editor img');
  const name = e.target.name;
  const size = e.target.dataset.sizing;
  out.innerHTML = e.target.value;

  img.style.setProperty(`--${name}`, `${e.target.value}${size}`);
}

const reset = document.querySelector('.btn-reset');
reset.addEventListener('click', resetSettings);

function resetSettings(e) {
  e = e || window.event;
  const all = filters.elements;
  const img = document.querySelector('.editor img');

  for (let i = 0; i < all.length; i++) {
    if (all[i].name === 'result' && all[i - 1].name === 'saturate') {
      all[i].value = 100;
    } else if (all[i].name === 'saturate') {
      all[i].value = 100;
    } else {
      all[i].value = 0;
    }
  }
  img.style = "";
}

const next = document.querySelector('.btn-next');
let count = 1;
next.addEventListener('click', changeImgSrc);

function changeImgSrc(e) {
  e = e || window.event;

  const img = document.querySelector('.editor img');
  const time = new Date();
  const image = new Image();
  let mid = '';
  if (time.getHours() >= 6 && time.getHours() < 12) {
    mid = 'morning'
  } else if (time.getHours() >= 12 && time.getHours() < 18) {
    mid = 'day';
  } else if (time.getHours() >= 18 && time.getHours() < 24) {
    mid = 'evening'
  } else {
    mid = 'night';
  }

  if (count < 10) {
    image.src = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${mid}/0${count}.jpg`;
  } else if (count > 19) {
    image.src = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${mid}/20.jpg`;
    count = 0;
  } else {
    image.src = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${mid}/${count}.jpg`;
  }
  image.onload = () => { img.src = image.src }
  count++;
}

const fullScreen = document.querySelector('.fullscreen')
let switchScreenMode = false;
fullScreen.addEventListener('click', function (e) {//Полноэкранный режим
  e = e || window.event;
  let element = document.documentElement;

  if (!switchScreenMode) {
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.webkitrequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.mozRequestFullscreen) {
      element.mozRequestFullScreen();
    }
    switchScreenMode = true;
  } else {
    document.webkitCancelFullScreen();
    switchScreenMode = false;
  }
})

const newFile = document.querySelector('input[type="file"]')

newFile.addEventListener('change', function (e) {
  const img = document.querySelector('.editor img');
  const file = newFile.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    img.src = reader.result;
  }
  reader.readAsDataURL(file);
  newFile.value = '';
});

const download = document.querySelector('.btn-save')
download.addEventListener('click', function (e) {
  const img = document.querySelector('.editor img');
  const canvas = document.querySelector('canvas');
  const link = document.createElement('a');
  const image = new Image();
  image.src = img.src;
  image.setAttribute('crossOrigin', 'anonymous');

  image.onload = function () {
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext("2d");
    ctx.filter = getComputedStyle(img).filter;
    ctx.drawImage(image, 0, 0);
    ctx.filter = 'none';
    link.download = 'down.png';
    link.href = canvas.toDataURL();
    link.click();
    link.delete;
  };
});