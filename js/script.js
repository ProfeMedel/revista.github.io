const TOTAL = 10;
const magazine = document.getElementById('magazine');
const leftPage = document.getElementById('leftPage');
const rightPage = document.getElementById('rightPage');
const turnRight = document.getElementById('turnRight');
const turnLeft = document.getElementById('turnLeft');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pageInfo = document.getElementById('pageInfo');

let spread = 0; // 0 = Portada, 1 = Pág 2-3, 2 = Pág 4-5, 3 = Pág 6-7, 4 = Pág 8-9, 5 = Tapa Trasera
let downX = null;
let isDragging = false;
let isAnimating = false;

function src(n) { return `imagen/pagina${n}.png`; }

function render() {
  turnRight.classList.remove('active', 'animating');
  turnLeft.classList.remove('active', 'animating');
  magazine.classList.remove('cover-mode', 'back-cover-mode');

  if (spread === 0) {
    magazine.classList.add('cover-mode');
    leftPage.style.display = 'none';
    rightPage.style.display = 'block';
    rightPage.querySelector('img').src = src(1);
    pageInfo.textContent = 'Portada';
  } else if (spread === 5) {
    magazine.classList.add('back-cover-mode');
    leftPage.style.display = 'block';
    rightPage.style.display = 'none';
    leftPage.querySelector('img').src = src(10);
    pageInfo.textContent = 'Tapa Trasera';
  } else {
    const left = spread * 2;
    const right = left + 1;
    leftPage.style.display = 'block';
    rightPage.style.display = 'block';
    leftPage.querySelector('img').src = src(left);
    rightPage.querySelector('img').src = src(right);
    pageInfo.textContent = `Páginas ${left}–${right} de ${TOTAL}`;
  }

  prevBtn.disabled = (spread === 0);
  nextBtn.disabled = (spread === 5);
}

function next() {
  if (spread >= 5 || isAnimating) return;
  isAnimating = true;

  // Configurar las caras de la hoja que gira hacia la izquierda
  const frontImg = turnRight.querySelector('.front img');
  const backImg = turnRight.querySelector('.back img');

  if (spread === 0) {
    frontImg.src = src(1);
    backImg.src = src(2);
  } else if (spread === 4) {
    frontImg.src = src(9);
    backImg.src = src(10);
  } else {
    frontImg.src = src(spread * 2 + 1);
    backImg.src = src(spread * 2 + 2);
  }

  turnRight.classList.add('active', 'animating');

  setTimeout(() => {
    spread++;
    render();
    isAnimating = false;
  }, 700);
}

function prev() {
  if (spread <= 0 || isAnimating) return;
  isAnimating = true;

  // Configurar las caras de la hoja que gira hacia la derecha
  const frontImg = turnLeft.querySelector('.front img');
  const backImg = turnLeft.querySelector('.back img');

  if (spread === 1) {
    frontImg.src = src(2);
    backImg.src = src(1);
  } else if (spread === 5) {
    frontImg.src = src(10);
    backImg.src = src(9);
  } else {
    frontImg.src = src(spread * 2);
    backImg.src = src(spread * 2 - 1);
  }

  turnLeft.classList.add('active', 'animating');

  setTimeout(() => {
    spread--;
    render();
    isAnimating = false;
  }, 700);
}

nextBtn.addEventListener('click', next);
prevBtn.addEventListener('click', prev);

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') next();
  if (e.key === 'ArrowLeft') prev();
});

magazine.addEventListener('pointerdown', e => {
  if (isAnimating) return;
  downX = e.clientX;
  isDragging = false;
});

magazine.addEventListener('pointermove', e => {
  if (downX !== null && Math.abs(e.clientX - downX) > 10) {
    isDragging = true;
  }
});

magazine.addEventListener('pointerup', e => {
  if (downX === null || isAnimating) return;
  const dx = e.clientX - downX;

  if (isDragging && Math.abs(dx) > 45) {
    (dx < 0 ? next : prev)();
  } else if (!isDragging) {
    const rect = magazine.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    if (clickX > rect.width / 2) {
      next();
    } else {
      prev();
    }
  }

  downX = null;
  isDragging = false;
});

render();