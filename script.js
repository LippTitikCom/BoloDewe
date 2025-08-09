const sliderContainer = document.getElementById("slider-container");
const slides = sliderContainer.children;
const totalSlides = slides.length;
let currentSlide = 0;

let isDragging = false;
let startPos = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let animationID = 0;

let autoSlide = setInterval(() => {
  currentSlide = (currentSlide + 1) % totalSlides;
  setPositionByIndex();
}, 3000);

// Prevent default drag image
for (const slide of slides) {
  slide.addEventListener("dragstart", (e) => e.preventDefault());
}

// Mouse events
sliderContainer.addEventListener("mousedown", dragStart);
sliderContainer.addEventListener("mousemove", dragMove);
sliderContainer.addEventListener("mouseup", dragEnd);
sliderContainer.addEventListener("mouseleave", dragEnd);

// Touch events
sliderContainer.addEventListener("touchstart", dragStart);
sliderContainer.addEventListener("touchmove", dragMove);
sliderContainer.addEventListener("touchend", dragEnd);

function dragStart(event) {
  isDragging = true;
  startPos = getPositionX(event);
  sliderContainer.style.transition = "none";
  cancelAnimationFrame(animationID);
  clearInterval(autoSlide);
}

function dragMove(event) {
  if (!isDragging) return;
  const currentPos = getPositionX(event);
  currentTranslate = prevTranslate + currentPos - startPos;
  setSliderPosition();
}

function dragEnd() {
  if (!isDragging) return;
  isDragging = false;
  const movedBy = currentTranslate - prevTranslate;

  if (movedBy < -50 && currentSlide < totalSlides - 1) currentSlide++;
  if (movedBy > 50 && currentSlide > 0) currentSlide--;

  setPositionByIndex();

  autoSlide = setInterval(() => {
    currentSlide = (currentSlide + 1) % totalSlides;
    setPositionByIndex();
  }, 3000);
}

function getPositionX(event) {
  return event.type.includes("mouse") ? event.clientX : event.touches[0].clientX;
}

function setSliderPosition() {
  sliderContainer.style.transform = `translateX(${currentTranslate}px)`;
}

function setPositionByIndex() {
  sliderContainer.style.transition = "transform 0.3s ease-out";
  currentTranslate = -currentSlide * sliderContainer.clientWidth;
  prevTranslate = currentTranslate;
  setSliderPosition();
}
