import { data } from "./data.js";

const featureGrid = document.querySelector(".feature-grid");

data.slides.forEach((slide) => {
  const featureCard = document.createElement("div");
  featureCard.classList.add("feature-card");

  const featureImage = document.createElement("div");
  featureImage.classList.add("feature-image");

  const slider = document.createElement("div");
  slider.classList.add("slider");

  const list = document.createElement("div");
  list.classList.add("list");

  // -----------------------------
  // ADD IMAGES
  // -----------------------------
  slide.image.forEach((image) => {
    const item = document.createElement("div");
    item.classList.add("item");

    const img = document.createElement("img");
    img.src = image;
    img.alt = "Slide image";

    item.appendChild(img);
    list.appendChild(item);
  });

  slider.appendChild(list);

  // -----------------------------
  // BUTTONS
  // -----------------------------
  const buttons = document.createElement("div");
  buttons.classList.add("buttons");

  const prev = document.createElement("button");
  prev.classList.add("prev");
  prev.textContent = "<";

  const next = document.createElement("button");
  next.classList.add("next");
  next.textContent = ">";

  buttons.appendChild(prev);
  buttons.appendChild(next);
  slider.appendChild(buttons);

  // -----------------------------
  // DOTS
  // -----------------------------
  const dots = document.createElement("ul");
  dots.classList.add("dots");

  slide.image.forEach((_, index) => {
    const dot = document.createElement("li");
    if (index === 0) dot.classList.add("active");
    dots.appendChild(dot);
  });

  slider.appendChild(dots);

  featureImage.appendChild(slider);

  // -----------------------------
  // HIDE ARROWS & DOTS IF ONLY ONE IMAGE
  // -----------------------------
  if (slide.image.length <= 1) {
    buttons.style.display = "none";
    dots.style.display = "none";
  }

  // -----------------------------
  // TITLE
  // -----------------------------
  const title = document.createElement("h3");
  title.classList.add("feature-title");
  title.textContent = slide.name;

  featureCard.appendChild(featureImage);
  featureCard.appendChild(title);
  featureGrid.appendChild(featureCard);

  // -----------------------------
  // INIT SLIDER ONLY IF >1 IMAGE
  // -----------------------------
  if (slide.image.length > 1) {
    initSlider(slider);
  }
});

// ============================================
// SLIDER FUNCTION
// ============================================
function initSlider(slider) {
  const list = slider.querySelector(".list");
  const items = Array.from(slider.querySelectorAll(".item"));
  const dots = Array.from(slider.querySelectorAll(".dots li"));
  const prev = slider.querySelector(".prev");
  const next = slider.querySelector(".next");

  let active = 0;
  const max = items.length - 1;

  function reload() {
    const left = items[active].offsetLeft;
    list.style.left = -left + "px";

    // Update dots
    slider.querySelector(".dots li.active")?.classList.remove("active");
    dots[active].classList.add("active");
  }

  // Next
  next.addEventListener("click", () => {
    active = active >= max ? 0 : active + 1;
    reload();
  });

  // Prev
  prev.addEventListener("click", () => {
    active = active <= 0 ? max : active - 1;
    reload();
  });

  // Dot click
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      active = index;
      reload();
    });
  });

  // Fix initial left position after images load
  window.addEventListener("resize", reload);
  setTimeout(reload, 200);
}

// ============================================
// IMAGE ENLARGER
// ============================================
const imageEnlarger = document.querySelector(".image-enlarger");
const enlargedImage = document.querySelector(".enlarged-image");
const closeBtn = document.querySelector(".close-btn");

document.querySelectorAll(".feature-image img").forEach((img) => {
  img.addEventListener("click", () => {
    enlargedImage.src = img.src;
    imageEnlarger.style.display = "flex";
  });
});

closeBtn.addEventListener("click", () => {
  imageEnlarger.style.display = "none";
  enlargedImage.src = "";
});

imageEnlarger.addEventListener("click", (e) => {
  if (e.target === imageEnlarger) {
    imageEnlarger.style.display = "none";
    enlargedImage.src = "";
  }
});
