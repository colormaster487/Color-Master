// ========== MOBILE MENU ==========
const burger = document.getElementById("burger");
const mobileMenu = document.getElementById("mobileMenu");

burger?.addEventListener("click", () => {
  const isOpen = burger.getAttribute("aria-expanded") === "true";
  burger.setAttribute("aria-expanded", String(!isOpen));
  mobileMenu.hidden = isOpen;
});

mobileMenu?.addEventListener("click", (e) => {
  if (e.target.tagName === "A") {
    burger.setAttribute("aria-expanded", "false");
    mobileMenu.hidden = true;
  }
});

// ========== CONTACT FORM CON EMAILJS ==========
const form = document.getElementById("contactForm");
const msg = document.getElementById("formMsg");

form?.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Validar campos requeridos
  const requiredIds = ["firstName", "lastName", "email", "phone", "message", "address1", "city", "state", "zip"];

  for (const id of requiredIds) {
    const el = document.getElementById(id);
    if (!el?.value.trim()) {
      el?.focus();
      msg.textContent = "Please fill out all required fields.";
      msg.style.color = "rgba(255, 90, 90, .95)";
      return;
    }
  }

  // Validar al menos un servicio seleccionado
  const selectedServices = Array.from(form.querySelectorAll('input[name="service"]:checked'))
    .map(cb => cb.value);
  
  if (selectedServices.length === 0) {
    msg.textContent = "Please select at least one service.";
    msg.style.color = "rgba(255, 90, 90, .95)";
    return;
  }

  // Recopilar datos del formulario
  const formData = {
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    services: selectedServices.join(", "),
    preferredDate: document.getElementById("preferredDate").value || "Not specified",
    message: document.getElementById("message").value,
    address1: document.getElementById("address1").value,
    address2: document.getElementById("address2").value || "N/A",
    city: document.getElementById("city").value,
    state: document.getElementById("state").value,
    zip: document.getElementById("zip").value
  };

  // Mostrar mensaje de envío
  msg.textContent = "Sending message...";
  msg.style.color = "#666";

  try {
    // IMPORTANTE: Reemplaza estos valores con los tuyos de EmailJS
    const serviceID = "service_rpiymwi";  // Obtener de EmailJS dashboard
    const templateID = "template_b5az24r"; // Obtener de EmailJS dashboard
    const publicKey = "HIMXBYfW707wE3UDV";   // Obtener de EmailJS dashboard

    // Enviar correo usando EmailJS
    const response = await emailjs.send(serviceID, templateID, {
      from_name: `${formData.firstName} ${formData.lastName}`,
      from_email: formData.email,
      phone: formData.phone,
      services: formData.services,
      preferred_date: formData.preferredDate,
      message: formData.message,
      address_line1: formData.address1,
      address_line2: formData.address2,
      city: formData.city,
      state: formData.state,
      zip: formData.zip,
      to_email: "colormaster487@gmail.com"
    }, publicKey);

    // Éxito
    msg.textContent = "✅ Message sent successfully! We'll contact you soon.";
    msg.style.color = "rgba(18, 183, 106, .95)";
    form.reset();

  } catch (error) {
    console.error("Error sending email:", error);
    msg.textContent = "❌ Failed to send message. Please try again or contact us directly.";
    msg.style.color = "rgba(255, 90, 90, .95)";
  }
});

// ========== SERVICES CAROUSEL ==========
(function() {
  const root = document.querySelector("[data-svc]");
  if (!root) return;

  const tabs = root.querySelectorAll("[data-service]");
  const titleEl = root.querySelector("[data-title]");
  const descEl = root.querySelector("[data-desc]");
  const listEl = root.querySelector("[data-list]");
  const track = root.querySelector("[data-track]");
  const prev = root.querySelector("[data-prev]");
  const next = root.querySelector("[data-next]");
  const dotsWrap = root.querySelector("[data-dots]");
  const slides = root.querySelectorAll(".svc__slide");

  const allImages = ["images/1.jpeg", "images/2.jpeg", "images/3.jpeg", "images/5.jpeg"];

  const DATA = {
    washing: {
      title: "Power Washing",
      desc: "Deep cleaning for driveways, walls, patios, and exterior surfaces to refresh and prep areas.",
      items: ["Driveways, patios, walkways", "Walls, siding, fences", "Prep before painting/coating"]
    },
    carpentry: {
      title: "Carpentry",
      desc: "Trim, framing, small builds, adjustments, and finish details — clean and precise.",
      items: ["Trim and finish work", "Small builds and adjustments", "Doors, frames, small fixes"]
    },
    painting: {
      title: "Painting",
      desc: "Interior and exterior painting with crisp edges, even coats, and modern finishes.",
      items: ["Interior painting", "Exterior painting", "Clean edges and smooth coats"]
    },
    drywall: {
      title: "Drywall",
      desc: "Patch, texture, repairs, and smooth finishes ready for paint — seamless results.",
      items: ["Patches and repairs", "Texture and smoothing", "Prep for painting"]
    },
    repairs: {
      title: "Repairs",
      desc: "Small fixes that make a big difference — clean, durable work that looks right.",
      items: ["General home repairs", "Fixes before painting", "Detail finishing touches"]
    }
  };

  let currentIndex = 0;
  let timer = null;
  let isTransitioning = false;

  function createDots() {
    dotsWrap.innerHTML = "";
    allImages.forEach((_, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "svc__dot" + (i === 0 ? " is-active" : "");
      btn.setAttribute("aria-label", `Go to image ${i + 1}`);
      btn.onclick = () => goToSlide(i);
      dotsWrap.appendChild(btn);
    });
  }

  function goToSlide(index, smooth = true) {
    if (isTransitioning) return;
    
    currentIndex = index;
    isTransitioning = true;

    if (smooth) {
      track.classList.add("transitioning");
    }

    const slideWidth = slides[0].offsetWidth;
    track.scrollLeft = slideWidth * index;

    setTimeout(() => {
      track.classList.remove("transitioning");
      isTransitioning = false;
    }, 400);
  }

  function updateDots() {
    if (isTransitioning) return;

    const dots = dotsWrap.querySelectorAll(".svc__dot");
    const slideWidth = slides[0].offsetWidth;
    const scrollPos = track.scrollLeft;
    const closestIndex = Math.round(scrollPos / slideWidth);

    currentIndex = Math.max(0, Math.min(closestIndex, slides.length - 1));
    dots.forEach((dot, i) => dot.classList.toggle("is-active", i === currentIndex));
  }

  function nextSlide() {
    const newIndex = (currentIndex + 1) % slides.length;
    goToSlide(newIndex, true);
  }

  function prevSlide() {
    const newIndex = (currentIndex - 1 + slides.length) % slides.length;
    goToSlide(newIndex, true);
  }

  function loadService(key) {
    const service = DATA[key];
    if (!service) return;

    tabs.forEach(tab => {
      const isActive = tab.dataset.service === key;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", isActive);
    });

    titleEl.textContent = service.title;
    descEl.textContent = service.desc;
    listEl.innerHTML = service.items.map(item => `<li>${item}</li>`).join("");
  }

  slides.forEach((slide, i) => {
    if (allImages[i]) {
      slide.style.backgroundImage = `
        radial-gradient(180px 120px at 25% 35%, rgba(255,255,255,.12), transparent 60%),
        radial-gradient(180px 120px at 75% 30%, rgba(29,88,120,.22), transparent 60%),
        linear-gradient(135deg, rgba(255,255,255,.05), rgba(255,255,255,.02)),
        url("${allImages[i]}")
      `;
    }
  });

  function startAuto() {
    stopAuto();
    timer = setInterval(nextSlide, 3500);
  }

  function stopAuto() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  tabs.forEach(btn => btn.addEventListener("click", () => {
    loadService(btn.dataset.service);
  }));

  prev?.addEventListener("click", () => { 
    stopAuto(); 
    prevSlide(); 
    startAuto(); 
  });

  next?.addEventListener("click", () => { 
    stopAuto(); 
    nextSlide(); 
    startAuto(); 
  });

  let scrollTimeout;
  track.addEventListener("scroll", () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(updateDots, 100);
  });

  track.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") { 
      stopAuto(); 
      prevSlide(); 
      startAuto(); 
    }
    if (e.key === "ArrowRight") { 
      stopAuto(); 
      nextSlide(); 
      startAuto(); 
    }
  });

  track.addEventListener("mouseenter", stopAuto);
  track.addEventListener("mouseleave", startAuto);
  track.addEventListener("touchstart", stopAuto, { passive: true });
  track.addEventListener("touchend", startAuto, { passive: true });

  track.addEventListener("touchmove", (e) => {
    e.stopPropagation();
  }, { passive: true });

  createDots();
  loadService("washing");
  goToSlide(0, false);
  startAuto();
})();

// Año en footer
document.getElementById("year").textContent = new Date().getFullYear();