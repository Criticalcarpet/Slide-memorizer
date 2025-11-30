const navbar = document.getElementById("navbar");
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");
const navLinks = document.querySelectorAll(".nav-link");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("active");
  document.body.style.overflow = navMenu.classList.contains("active")
    ? "hidden"
    : "";
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.forEach((l) => l.classList.remove("active"));
    link.classList.add("active");

    if (window.innerWidth <= 768) {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
      document.body.style.overflow = "";
    }
  });
});

window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
    document.body.style.overflow = "";
  }
});

document.addEventListener("click", (e) => {
  if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
    if (navMenu.classList.contains("active")) {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
      document.body.style.overflow = "";
    }
  }
});
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./service-worker.js", {type: 'module'})
      .then((reg) => console.log("Service Worker registered", reg))
      .catch((err) => console.log("Service Worker registration failed", err));
  });
}

let deferredPrompt;
const installBtn = document.getElementById("installBtn");
console.log("Install button found:", installBtn);

// Listen for PWA install availability
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault(); // Prevent default mini-infobar
  deferredPrompt = e;
  console.log("PWA install prompt available");
});

// Handle button click
installBtn.addEventListener("click", async () => {
  console.log("Prompting user to install PWA");
  if (!deferredPrompt) return;

  deferredPrompt.prompt(); // Show the browser install prompt

  const { outcome } = await deferredPrompt.userChoice;
  console.log(`User response to install: ${outcome}`);

  if (outcome === "accepted") {
    console.log("User accepted the PWA installation");
    installBtn.style.display = "none"; // Hide install button after acceptance
  } else {
    console.log("User dismissed the PWA installation");
  }
  deferredPrompt = null;
});

if (window.matchMedia("(display-mode: standalone)").matches) {
  // do things here
  // set a variable to be used when calling something
  // e.g. call Google Analytics to track standalone use
  console.log("App is running in standalone mode");
  installBtn.style.display = "none";
}
