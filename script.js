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
    // Credenciales de EmailJS
    const serviceID = "service_rpiymwi";
    const templateID = "template_b5az24r";
    const publicKey = "HIMXBYfW707wE3UDV";

    // Enviar correo usando EmailJS
    await emailjs.send(serviceID, templateID, {
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

    // Éxito - Mostrar alerta bonita
    msg.textContent = "";
    showAlert("success", "Message sent successfully!", "We'll contact you within 24 hours. Thank you!");
    form.reset();

  } catch (error) {
    console.error("Error sending email:", error);
    msg.textContent = "";
    showAlert("error", "Oops! Something went wrong", "Please try again or contact us directly at colormaster487@gmail.com");
  }
});

// ========== FUNCIÓN PARA ALERTAS MODERNAS ==========
function showAlert(type, title, message) {
  // Crear el overlay
  const overlay = document.createElement("div");
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    animation: fadeIn 0.2s ease;
  `;

  // Definir colores según el tipo
  const colors = {
    success: {
      bg: "#12b76a",
      icon: "✓",
      gradient: "linear-gradient(135deg, #12b76a 0%, #0ea76a 100%)"
    },
    error: {
      bg: "#f04438",
      icon: "✕",
      gradient: "linear-gradient(135deg, #f04438 0%, #d92d20 100%)"
    }
  };

  const style = colors[type];

  // Crear la alerta
  const alert = document.createElement("div");
  alert.style.cssText = `
    background: white;
    border-radius: 16px;
    padding: 0;
    max-width: 420px;
    width: 90%;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    animation: slideUp 0.3s ease;
    overflow: hidden;
  `;

  alert.innerHTML = `
    <div style="background: ${style.gradient}; padding: 32px 24px; text-align: center;">
      <div style="
        width: 64px;
        height: 64px;
        background: rgba(255, 255, 255, 0.25);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 16px;
        font-size: 32px;
        font-weight: bold;
        color: white;
        backdrop-filter: blur(10px);
      ">${style.icon}</div>
      <h2 style="
        color: white;
        margin: 0;
        font-size: 24px;
        font-weight: 700;
      ">${title}</h2>
    </div>
    <div style="padding: 24px;">
      <p style="
        color: #475467;
        font-size: 16px;
        line-height: 1.6;
        margin: 0 0 24px 0;
        text-align: center;
      ">${message}</p>
      <button id="alertBtn" style="
        width: 100%;
        background: ${style.bg};
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        font-family: inherit;
      ">Got it!</button>
    </div>
  `;

  // Agregar animaciones CSS
  if (!document.getElementById("alertStyles")) {
    const styleSheet = document.createElement("style");
    styleSheet.id = "alertStyles";
    styleSheet.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(20px) scale(0.95);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
      #alertBtn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }
      #alertBtn:active {
        transform: translateY(0);
      }
    `;
    document.head.appendChild(styleSheet);
  }

  overlay.appendChild(alert);
  document.body.appendChild(overlay);

  // Cerrar al hacer clic en el botón o en el overlay
  const closeAlert = () => {
    overlay.style.animation = "fadeIn 0.2s ease reverse";
    setTimeout(() => overlay.remove(), 200);
  };

  document.getElementById("alertBtn").addEventListener("click", closeAlert);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeAlert();
  });

  // Cerrar con tecla ESC
  const handleEsc = (e) => {
    if (e.key === "Escape") {
      closeAlert();
      document.removeEventListener("keydown", handleEsc);
    }
  };
  document.addEventListener("keydown", handleEsc);
}

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