
window.addEventListener("load", function () {
  const hasVisited = localStorage.getItem("hasVisited");

  if (!hasVisited) {
    // First-time visit: show preloader
    localStorage.setItem("hasVisited", "true");

    setTimeout(() => {
      const preloader = document.getElementById("preloader");
      preloader.style.opacity = "0";

      setTimeout(() => {
        preloader.style.display = "none";
        document.getElementById("content").style.display = "block";
      }, 500); // time for fade-out transition
    }, 3000); // show preloader for 3 seconds
  } else {
    // Skip preloader and show content immediately
    document.getElementById("preloader").style.display = "none";
    document.getElementById("content").style.display = "block";
  }
});


document.addEventListener("DOMContentLoaded", () => {
  const toggleButton = document.getElementById("mobile-menu-toggle");
  const navLinks = document.getElementById("nav-links");

  toggleButton.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });
});

