document.addEventListener("DOMContentLoaded", () => {
  const yearNodes = document.querySelectorAll("[data-year]");
  const year = String(new Date().getFullYear());
  yearNodes.forEach((node) => {
    node.textContent = year;
  });

  setupPreloader();
  setupMobileNav();
  setupContactForm();
  setupParticles();
  setupSpeechBubble();
});

function setupPreloader() {
  const preloader = document.getElementById("preloader");
  if (!preloader) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasVisited = localStorage.getItem("hasVisited");

  if (hasVisited || reduceMotion) {
    preloader.hidden = true;
    return;
  }

  preloader.hidden = false;
  localStorage.setItem("hasVisited", "true");

  window.setTimeout(() => {
    preloader.style.opacity = "0";
    window.setTimeout(() => {
      preloader.hidden = true;
    }, 400);
  }, 900);
}

function setupMobileNav() {
  const toggleButton = document.getElementById("mobile-menu-toggle");
  const navLinks = document.getElementById("nav-links");
  if (!toggleButton || !navLinks) return;

  const closeMenu = () => {
    navLinks.classList.remove("open");
    toggleButton.setAttribute("aria-expanded", "false");
  };

  toggleButton.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    toggleButton.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  document.addEventListener("click", (event) => {
    if (!toggleButton.contains(event.target) && !navLinks.contains(event.target)) {
      closeMenu();
    }
  });
}

function setupSpeechBubble() {
  const bubble = document.getElementById("speech-bubble");
  if (!bubble) return;

  const messages = ["こんにちは!", "お元気ですか？", "今日一日楽しんでね！"];
  let index = 0;

  window.setInterval(() => {
    index = (index + 1) % messages.length;
    bubble.classList.remove("is-popping");
    void bubble.offsetWidth;
    bubble.textContent = messages[index];
    bubble.classList.add("is-popping");
  }, 10000);
}

function setupParticles() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  const canvas = document.createElement("canvas");
  canvas.id = "particles";
  canvas.setAttribute("aria-hidden", "true");
  document.body.prepend(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const colors = ["rgba(255, 204, 0, 0.7)", "rgba(0, 191, 255, 0.55)", "rgba(255, 255, 255, 0.35)"];
  let particles = [];
  let animationId = 0;

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const count = Math.min(90, Math.floor((canvas.width * canvas.height) / 18000));
    particles = Array.from({ length: count }, () => createParticle(true));
  };

  function createParticle(spread) {
    return {
      x: Math.random() * canvas.width,
      y: spread ? Math.random() * canvas.height : canvas.height + Math.random() * 40,
      size: Math.random() * 2.4 + 0.6,
      speedY: Math.random() * 0.45 + 0.12,
      speedX: (Math.random() - 0.5) * 0.35,
      color: colors[Math.floor(Math.random() * colors.length)],
      twinkle: Math.random() * Math.PI * 2,
    };
  }

  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((particle, i) => {
      particle.y -= particle.speedY;
      particle.x += particle.speedX;
      particle.twinkle += 0.02;

      if (particle.y < -10 || particle.x < -10 || particle.x > canvas.width + 10) {
        particles[i] = createParticle(false);
        return;
      }

      ctx.beginPath();
      ctx.fillStyle = particle.color;
      ctx.globalAlpha = 0.45 + Math.sin(particle.twinkle) * 0.25;
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    animationId = window.requestAnimationFrame(draw);
  };

  resize();
  draw();
  window.addEventListener("resize", resize);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      window.cancelAnimationFrame(animationId);
    } else {
      draw();
    }
  });
}

function setupContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const status = document.getElementById("form-status");
  const submitBtn = document.getElementById("submit-btn");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!status || !submitBtn) return;

    status.textContent = "";
    status.className = "form-status";
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });

      if (!response.ok) throw new Error("Request failed");

      form.reset();
      status.textContent = "Thanks — your message was sent.";
      status.classList.add("success");
    } catch (error) {
      status.textContent = "Something went wrong. Please email me directly.";
      status.classList.add("error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Send message";
    }
  });
}
