/**
 * Vedant - Web Designer & Developer Portfolio
 * Consolidated Single-Page Interactive Scripts
 */

// ============================================================
// 1. PRELOADER & HERO FADE-IN (EXACT 3 SECONDS DURATION)
// ============================================================
function ensureHeroVisible() {
  const hero = document.querySelector(".hero-section");
  if (hero) {
    hero.classList.add("fade-in");
  }
}

// Ensure hero is visible as soon as DOM loads
document.addEventListener("DOMContentLoaded", ensureHeroVisible);

window.addEventListener("load", () => {
  ensureHeroVisible();
  const preloader = document.getElementById("preloader");
  if (!preloader) return;

  const hidePreloader = () => {
    preloader.classList.add("loaded");
    preloader.style.transition = "opacity 0.6s ease, visibility 0.6s ease";
    preloader.style.opacity = "0";
    preloader.style.visibility = "hidden";
    setTimeout(() => {
      preloader.classList.add("hidden");
      preloader.style.display = "none";
      ensureHeroVisible();
      if (window.AOS) window.AOS.refresh();
    }, 600);
  };

  // Always show preloader animation for exactly 3 seconds on every load/refresh
  sessionStorage.removeItem("hasVisited");
  setTimeout(hidePreloader, 3000);
});

// ============================================================
// 2. HERO TYPEWRITER EFFECT
// ============================================================
const roles = ["Software Development Engineer", "Full-Stack Engineer", "Backend & Microservices Developer", "React & Node.js Specialist"];
let roleIndex = 0;
let charIndex = 0;
const typingTarget = document.querySelector(".typing-role");

function typeEffect() {
  if (!typingTarget) return;

  if (charIndex < roles[roleIndex].length) {
    typingTarget.textContent += roles[roleIndex].charAt(charIndex);
    charIndex += 1;
    setTimeout(typeEffect, 90);
    return;
  }

  setTimeout(eraseEffect, 1500);
}

function eraseEffect() {
  if (!typingTarget) return;

  if (charIndex > 0) {
    typingTarget.textContent = roles[roleIndex].substring(0, charIndex - 1);
    charIndex -= 1;
    setTimeout(eraseEffect, 50);
    return;
  }

  roleIndex = (roleIndex + 1) % roles.length;
  setTimeout(typeEffect, 300);
}

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(typeEffect, 1200);
});

// ============================================================
// 3. BACKGROUND CANVAS PARTICLES (OPTIMIZED RAF LOOP)
// ============================================================
(function() {
  const canvas = document.getElementById("particle-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const modes = [
    "orange-glow",
    "yellow-glow",
    "blue-bubble",
    "red-pulse",
    "electric-purple",
  ];

  let currentMode = modes[2]; // soft blue
  const particles = [];
  let isAnimating = false;

  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas, { passive: true });

  class Particle {
    constructor(x, y, mode) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 2.5 + 1;
      this.speedX = (Math.random() - 0.5) * 1.5;
      this.speedY = (Math.random() - 0.5) * 1.5;
      this.alpha = 0.8;
      this.mode = mode;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.alpha -= 0.015;
      this.size -= 0.02;
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.alpha);

      switch (this.mode) {
        case "orange-glow":
          ctx.fillStyle = "#ff6b35";
          // shadowBlur removed for 60fps
          
          break;
        case "yellow-glow":
          ctx.fillStyle = "#f59e0b";
          // shadowBlur removed for 60fps
          
          break;
        case "blue-bubble":
          ctx.fillStyle = "#2563eb";
          // shadowBlur removed for 60fps
          
          break;
        case "red-pulse":
          ctx.fillStyle = "#ec4899";
          // shadowBlur removed for 60fps
          
          break;
        case "electric-purple":
          ctx.fillStyle = "#7c3aed";
          // shadowBlur removed for 60fps
          
          break;
        default:
          ctx.fillStyle = "#2563eb";
          // shadowBlur removed for 60fps
          
      }

      ctx.beginPath();
      ctx.arc(this.x, this.y, Math.max(0.2, this.size), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  let lastMoveTime = 0;
  document.addEventListener("mousemove", (e) => {
    const now = Date.now();
    if (now - lastMoveTime > 35 && particles.length < 40) {
      lastMoveTime = now;
      particles.push(new Particle(e.clientX, e.clientY, currentMode));
      if (!isAnimating) {
        isAnimating = true;
        requestAnimationFrame(animate);
      }
    }
  }, { passive: true });

  function handleParticles() {
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
      if (particles[i].alpha <= 0 || particles[i].size < 0.2) {
        particles.splice(i, 1);
        i--;
      }
    }
  }

  function animate() {
    if (particles.length === 0) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      isAnimating = false;
      return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handleParticles();
    requestAnimationFrame(animate);
  }

  setInterval(() => {
    const idx = modes.indexOf(currentMode);
    currentMode = modes[(idx + 1) % modes.length];
  }, 5000);
})();

// ============================================================
// 4. NAVIGATION, SCROLLSPY & ULTRA-SMOOTH SCROLLING
// ============================================================
window.toggleMenu = function() {
  const nav = document.getElementById("navLinks");
  const menuIcon = document.querySelector(".menu-icon");
  if (nav) nav.classList.toggle("show");
  if (menuIcon) menuIcon.classList.toggle("active");
};

// NATIVE SMOOTH SCROLL (uses browser-native smooth scrolling - zero lag)
function smoothScrollTo(targetY) {
  window.scrollTo({
    top: Math.max(0, Math.round(targetY)),
    behavior: 'smooth'
  });
}



// Scrollspy with Smooth Hide-on-Scroll & Reappear-on-Stop Navigation (Throttled & Non-blocking)
function initScrollspy() {
  const sections = Array.from(document.querySelectorAll("section[id]"));
  const navItems = Array.from(document.querySelectorAll(".nav-links ul li a"));
  const header = document.querySelector(".main-nav");
  const navLinks = document.getElementById("navLinks");

  let sectionBounds = [];
  function cacheSectionBounds() {
    sectionBounds = sections.map(sec => ({
      id: sec.getAttribute("id"),
      top: sec.offsetTop,
      bottom: sec.offsetTop + sec.offsetHeight
    }));
  }
  cacheSectionBounds();
  window.addEventListener("resize", cacheSectionBounds, { passive: true });
  window.addEventListener("load", cacheSectionBounds, { passive: true });

  let lastScrollY = window.pageYOffset || document.documentElement.scrollTop;
  let scrollStopTimer = null;
  const scrollThreshold = 70;
  let isTicking = false;

  function updateScrollState() {
    const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
    const scrollPos = currentScrollY + 140;

    // Fast bounds check without DOM reflow
    for (let i = 0; i < sectionBounds.length; i++) {
      const sec = sectionBounds[i];
      if (scrollPos >= sec.top && scrollPos < sec.bottom) {
        navItems.forEach(item => {
          if (item.getAttribute("href") === `#${sec.id}`) {
            item.classList.add("active-link");
          } else {
            item.classList.remove("active-link");
          }
        });
        break;
      }
    }

    // Sticky & Auto-hide Navbar logic
    if (header) {
      if (currentScrollY > 40) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }

      const isMobileMenuOpen = navLinks && navLinks.classList.contains("show");
      if (!isMobileMenuOpen) {
        if (scrollStopTimer) {
          clearTimeout(scrollStopTimer);
        }

        if (currentScrollY <= scrollThreshold) {
          header.classList.remove("nav-hidden");
        } else {
          if (currentScrollY > lastScrollY && currentScrollY > scrollThreshold) {
            header.classList.add("nav-hidden");
          } else if (currentScrollY < lastScrollY) {
            header.classList.remove("nav-hidden");
          }
        }

        scrollStopTimer = setTimeout(() => {
          header.classList.remove("nav-hidden");
        }, 400);
      }
    }

    lastScrollY = Math.max(0, currentScrollY);
    isTicking = false;
  }

  function onScroll() {
    if (!isTicking) {
      requestAnimationFrame(updateScrollState);
      isTicking = true;
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  updateScrollState();
}

// ============================================================
// 4.1 SCROLL-TRIGGERED FADE-IN ENTRANCE OBSERVER
// ============================================================
function initScrollReveal() {
  const aboutSection = document.getElementById("about");
  if (!aboutSection) return;

  const onIntersect = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        aboutSection.classList.add("is-revealed");
        aboutSection.classList.add("section-visible");
      }
    });
  };

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(onIntersect, {
      root: null,
      rootMargin: "0px 0px -40px 0px",
      threshold: 0.08
    });
    observer.observe(aboutSection);
  } else {
    aboutSection.classList.add("is-revealed");
  }


}

// Call initScrollReveal when DOM is ready
document.addEventListener("DOMContentLoaded", initScrollReveal);
window.addEventListener("load", () => {
  initScrollReveal();
  // If page was loaded directly on #about anchor, reveal immediately
  if (window.location.hash === "#about") {
    const sec = document.getElementById("about");
    if (sec) sec.classList.add("is-revealed", "section-visible");
  }
});

// Global Smooth Scrolling & Hero Scroll Down Handlers
document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll('a[href^="#"]');
  const navContainer = document.getElementById("navLinks");
  const menuIcon = document.querySelector(".menu-icon");
  const heroScrollBtn = document.getElementById("heroScrollDown");

  // Dedicated Hero Mouse Scroll Down Click with visual feedback & silky scroll animation
  if (heroScrollBtn) {
    heroScrollBtn.addEventListener("click", function(e) {
      e.preventDefault();
      e.stopPropagation();

      // Trigger animated mouse pulse & dot glide
      heroScrollBtn.classList.add("is-scrolling");
      setTimeout(() => {
        heroScrollBtn.classList.remove("is-scrolling");
      }, 1200);

      const aboutSection = document.querySelector("#about") || document.querySelector(".about");
      if (aboutSection) {
        const navHeight = 70;
        const targetPosition = aboutSection.getBoundingClientRect().top + window.pageYOffset - navHeight;
        smoothScrollTo(targetPosition, 1050);
      }
    });
  }

  // Smooth Scrolling for all hash links with cubic easing
  navLinks.forEach(link => {
    // Avoid double-binding if it's the hero scroll button
    if (link.id === "heroScrollDown") return;

    link.addEventListener("click", function(e) {
      const href = this.getAttribute("href");
      if (href === "#" || href === "") return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const navHeight = 70;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

        smoothScrollTo(targetPosition, 950);

        // Close mobile menu if open
        if (navContainer && navContainer.classList.contains("show")) {
          navContainer.classList.remove("show");
          if (menuIcon) menuIcon.classList.remove("active");
        }
      }
    });
  });
});

// Scrollspy with Smooth Hide-on-Scroll & Reappear-on-Stop Navigation (Throttled & Non-blocking)
// ============================================================
// 5. SOCIAL MEDIA POPUP MODAL
// ============================================================
function initSocialPopup() {
  const letsConnectBtn = document.getElementById("letsConnectBtn");
  const socialPopup = document.getElementById("socialPopup");
  const closeBtn = document.getElementById("closePopup");

  if (letsConnectBtn && socialPopup) {
    letsConnectBtn.addEventListener("click", (e) => {
      e.preventDefault();
      socialPopup.classList.add("active");
      document.body.style.overflow = "hidden";
    });
  }

  function closePopup() {
    if (socialPopup) {
      socialPopup.classList.remove("active");
      document.body.style.overflow = "";
    }
  }

  if (closeBtn) closeBtn.addEventListener("click", closePopup);

  if (socialPopup) {
    socialPopup.addEventListener("click", (e) => {
      if (e.target === socialPopup) closePopup();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && socialPopup && socialPopup.classList.contains("active")) {
      closePopup();
    }
  });
}

// ============================================================
// 6. CV & BLOG MODALS
// ============================================================
function initCvAndBlogModals() {
  const cvButtons = [document.getElementById("cvButton"), document.getElementById("cvButtonAbout")];
  const cvModal = document.getElementById("cvModal");
  const closeCvModal = document.getElementById("closeCvModal");

  const blogButton = document.getElementById("blogButton");
  const blogModal = document.getElementById("blogModal");
  const closeBlogModal = document.getElementById("closeBlogModal");

  cvButtons.forEach(btn => {
    if (btn) {
      btn.addEventListener("click", () => {
        // Direct native browser download of Vedant_Wagh_Resume.pdf
        showNotificationToast("Resume Download", "Downloading Vedant's resume...");
      });
    }
  });

  if (closeCvModal && cvModal) {
    closeCvModal.addEventListener("click", () => {
      cvModal.style.opacity = "0";
      setTimeout(() => { cvModal.style.display = "none"; }, 250);
    });
  }

  if (blogButton && blogModal) {
    blogButton.addEventListener("click", (e) => {
      e.preventDefault();
      blogModal.style.display = "flex";
      setTimeout(() => { blogModal.style.opacity = "1"; }, 10);
    });
  }

  if (closeBlogModal && blogModal) {
    closeBlogModal.addEventListener("click", () => {
      blogModal.style.opacity = "0";
      setTimeout(() => { blogModal.style.display = "none"; }, 250);
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (cvModal && cvModal.style.display === "flex") {
        cvModal.style.opacity = "0";
        setTimeout(() => { cvModal.style.display = "none"; }, 250);
      }
      if (blogModal && blogModal.style.display === "flex") {
        blogModal.style.opacity = "0";
        setTimeout(() => { blogModal.style.display = "none"; }, 250);
      }
    }
  });
}

// ============================================================
// 7. ABOUT SECTION TABS
// ============================================================
window.showTab = function(tabId) {
  document.querySelectorAll(".tab-btn, .about-tab-btn").forEach(btn => btn.classList.remove("active"));
  document.querySelectorAll(".tab-content").forEach(tab => tab.classList.remove("active"));

  const targetBtns = document.querySelectorAll(`[onclick*="showTab('${tabId}')"]`);
  const targetTab = document.getElementById(tabId);

  targetBtns.forEach(btn => btn.classList.add("active"));
  if (targetTab) targetTab.classList.add("active");
};

// ============================================================
// 8. SERVICES COUNTDOWN & NOTIFY MODAL
// ============================================================
function initServiceCountdown() {
  const targetDate = new Date("2026-06-01T00:00:00").getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      if (document.getElementById("days")) document.getElementById("days").textContent = "00";
      if (document.getElementById("hours")) document.getElementById("hours").textContent = "00";
      if (document.getElementById("minutes")) document.getElementById("minutes").textContent = "00";
      if (document.getElementById("seconds")) document.getElementById("seconds").textContent = "00";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const dEl = document.getElementById("days");
    const hEl = document.getElementById("hours");
    const mEl = document.getElementById("minutes");
    const sEl = document.getElementById("seconds");

    if (dEl) dEl.textContent = String(days).padStart(2, "0");
    if (hEl) hEl.textContent = String(hours).padStart(2, "0");
    if (mEl) mEl.textContent = String(minutes).padStart(2, "0");
    if (sEl) sEl.textContent = String(seconds).padStart(2, "0");
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

window.openNotifyForm = function() {
  const modal = document.getElementById("notifyModalOverlay");
  if (modal) {
    modal.classList.add("show");
    document.body.style.overflow = "hidden";
  }
};

window.closeNotifyForm = function() {
  const modal = document.getElementById("notifyModalOverlay");
  if (modal) {
    modal.classList.remove("show");
    document.body.style.overflow = "";
    setTimeout(() => {
      const form = document.getElementById("notifyForm");
      const success = document.getElementById("notifySuccess");
      if (form) {
        form.style.display = "block";
        form.reset();
      }
      if (success) {
        success.classList.remove("show");
      }
    }, 300);
  }
};

window.handleNotifySubmit = function(event) {
  event.preventDefault();
  const emailInput = document.getElementById("notifyEmail");
  const email = emailInput ? emailInput.value.trim() : "";
  const form = document.getElementById("notifyForm");
  const success = document.getElementById("notifySuccess");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    alert("Please enter a valid email address");
    return;
  }

  const emails = JSON.parse(localStorage.getItem("notifyEmails") || "[]");
  emails.push({ email, date: new Date().toISOString() });
  localStorage.setItem("notifyEmails", JSON.stringify(emails));

  if (form) form.style.display = "none";
  if (success) success.classList.add("show");

  setTimeout(() => {
    closeNotifyForm();
  }, 3500);
};

// ============================================================
// 9. PROJECTS STAT COUNTER & 3D TILT
// ============================================================
function initProjectsStats() {
  const counters = document.querySelectorAll(".stat-number");
  if (counters.length === 0) return;

  function animateCounter(el, target) {
    let current = 0;
    const duration = 1200;
    const step = target / (duration / 20);

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        const isSatisfaction = el.parentElement.querySelector(".stat-label")?.textContent.includes("Satisfaction");
        el.textContent = target + (isSatisfaction ? "%" : "+");
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current);
      }
    }, 20);
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.getAttribute("data-count"), 10);
        if (!isNaN(target)) animateCounter(entry.target, target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

function initCardTilt() {
  const cards = document.querySelectorAll(".master-project-card, .project-card");

  cards.forEach(card => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)";
    });
  });
}

// ============================================================
// 10. TESTIMONIALS CAROUSEL & STAR RATINGS
// ============================================================
function initTestimonials() {
  const track = document.querySelector(".carousel-track");
  const prevBtn = document.querySelector(".carousel-btn.prev");
  const nextBtn = document.querySelector(".carousel-btn.next");

  // Render Star Ratings
  document.querySelectorAll(".star-rating").forEach(ratingEl => {
    const score = parseInt(ratingEl.getAttribute("data-rating"), 10) || 5;
    ratingEl.innerHTML = "★".repeat(score) + "☆".repeat(5 - score);
  });

  if (!track) return;
  const cards = Array.from(track.children);
  if (cards.length === 0) return;

  const cardWidth = () => (cards[0].getBoundingClientRect().width + 25);
  let autoTimer = null;

  function startAutoScroll() {
    stopAutoScroll();
    autoTimer = setInterval(() => {
      const maxScroll = track.scrollWidth - track.clientWidth;
      if (track.scrollLeft >= maxScroll - 5) {
        track.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        track.scrollBy({ left: cardWidth(), behavior: "smooth" });
      }
    }, 4000);
  }

  function stopAutoScroll() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  startAutoScroll();

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      stopAutoScroll();
      const maxScroll = track.scrollWidth - track.clientWidth;
      if (track.scrollLeft >= maxScroll - 5) {
        track.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        track.scrollBy({ left: cardWidth(), behavior: "smooth" });
      }
      setTimeout(startAutoScroll, 5000);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      stopAutoScroll();
      if (track.scrollLeft <= 5) {
        track.scrollTo({ left: track.scrollWidth - track.clientWidth, behavior: "smooth" });
      } else {
        track.scrollBy({ left: -cardWidth(), behavior: "smooth" });
      }
      setTimeout(startAutoScroll, 5000);
    });
  }

  track.addEventListener("mouseenter", stopAutoScroll);
  track.addEventListener("mouseleave", startAutoScroll);

  // Touch Swipe
  let touchStartX = 0;
  track.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoScroll();
  }, { passive: true });

  track.addEventListener("touchend", (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0 && nextBtn) nextBtn.click();
      else if (diff < 0 && prevBtn) prevBtn.click();
    }
    startAutoScroll();
  }, { passive: true });

  // Feedback form star picker
  const starContainer = document.getElementById("starRating");
  const ratingInput = document.getElementById("ratingValue");
  if (starContainer && ratingInput) {
    const stars = starContainer.querySelectorAll(".star");

    function highlightStars(score) {
      stars.forEach(s => {
        const val = parseInt(s.getAttribute("data-rating"), 10);
        s.style.color = val <= score ? "#f59e0b" : "#cbd5e1";
      });
    }

    highlightStars(5);

    stars.forEach(star => {
      star.addEventListener("click", () => {
        const selected = parseInt(star.getAttribute("data-rating"), 10);
        ratingInput.value = selected;
        highlightStars(selected);
      });

      star.addEventListener("mouseenter", () => {
        highlightStars(parseInt(star.getAttribute("data-rating"), 10));
      });
    });

    starContainer.addEventListener("mouseleave", () => {
      highlightStars(parseInt(ratingInput.value, 10) || 5);
    });
  }

  // Feedback form submit
  const feedbackForm = document.getElementById("feedbackForm");
  const feedbackSuccess = document.getElementById("successMessage");
  if (feedbackForm) {
    feedbackForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const submitBtn = feedbackForm.querySelector(".submit-btn");
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>Submitting...</span> <i class="fas fa-spinner fa-spin"></i>`;
      }

      setTimeout(() => {
        feedbackForm.style.display = "none";
        if (feedbackSuccess) feedbackSuccess.style.display = "block";
      }, 1000);
    });
  }
}

// ============================================================
// 11. CONTACT SECTION FORM & MODAL
// ============================================================
function initContactForm() {
  const form = document.getElementById("contactForm");
  const modal = document.getElementById("successModal");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const firstName = document.getElementById("firstName")?.value.trim() || "";
      const lastName = document.getElementById("lastName")?.value.trim() || "";
      const email = document.getElementById("email")?.value.trim() || "";
      const phone = document.getElementById("phone")?.value.trim() || "Not provided";
      const subject = document.getElementById("subject")?.value || "General Inquiry";
      const message = document.getElementById("message")?.value.trim() || "";
      const newsletter = document.getElementById("newsletter")?.checked ? "Subscribed" : "No";
      const submitBtn = form.querySelector(".submit-btn");

      if (!firstName || !lastName || !email || !message) {
        showNotificationToast("Form Error", "Please fill in all required fields.");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showNotificationToast("Invalid Email", "Please enter a valid email address.");
        return;
      }

      const origText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Sending...</span> <i class="fas fa-spinner fa-spin"></i>`;

      try {
        const payload = {
          "Sender Name": `${firstName} ${lastName}`,
          "Email Address": email,
          "Phone Number": phone,
          "Subject": subject,
          "Message": message,
          "Newsletter": newsletter,
          "_captcha": "false",
          "_template": "table",
          "_subject": `New Portfolio Message from ${firstName} ${lastName} (${subject})`
        };

        const res = await fetch("https://formsubmit.co/ajax/waghvedant28@gmail.com", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(payload)
        });

        submitBtn.disabled = false;
        submitBtn.innerHTML = origText;

        if (modal) {
          modal.classList.add("show");
          document.body.style.overflow = "hidden";
        } else {
          showNotificationToast("Message Sent", "Thank you! Your message has been sent to Vedant.");
        }

        form.reset();
      } catch (err) {
        console.warn("AJAX submit fallback to native submit:", err);
        try {
          form.action = "https://formsubmit.co/waghvedant28@gmail.com";
          form.method = "POST";
          form.submit();
        } catch (e2) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = origText;
          if (modal) {
            modal.classList.add("show");
            document.body.style.overflow = "hidden";
          }
          form.reset();
        }
      }
    });
  }
}

window.closeContactModal = function() {
  const modal = document.getElementById("successModal");
  if (modal) {
    modal.classList.remove("show");
    document.body.style.overflow = "";
  }
};

// ============================================================
// 12. BACK TO TOP BUTTON
// ============================================================
function initBackToTop() {
  const btn = document.getElementById("backToTop");
  if (!btn) return;

  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 350) {
      btn.classList.add("visible");
    } else {
      btn.classList.remove("visible");
    }
  }, { passive: true });

  btn.addEventListener("click", () => {
    smoothScrollTo(0, 950);
  });
}

// ============================================================
// 13. UTILITY TOAST NOTIFICATION
// ============================================================
function showNotificationToast(title, message) {
  const existing = document.querySelector(".notification-toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = "notification-toast show";
  toast.innerHTML = `
    <div class="notification-content">
      <div class="notification-icon"><i class="fas fa-info-circle"></i></div>
      <div class="notification-text">
        <div class="notification-title">${title}</div>
        <div class="notification-message">${message}</div>
      </div>
    </div>
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}

// ============================================================
// 14. INITIALIZATION ON DOM READY
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  ensureHeroVisible();
  typeEffect();
  initScrollspy();
  initSocialPopup();
  initCvAndBlogModals();
  initServiceCountdown();
  initProjectsStats();
  initCardTilt();
  initTestimonials();
  initContactForm();
  initBackToTop();

  // Set current year in footer
  const yearEl = document.getElementById("currentYear");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

// ============================================================
// 15. LENIS ULTRA-SMOOTH INERTIAL SCROLL ENGINE
// ============================================================
(function initLenisScroll() {
  if (typeof Lenis === "undefined") {
    console.warn("Lenis library loading fallback to native smooth scroll");
    return;
  }

  const lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1.0,
    smoothTouch: false, // native hardware smooth touch on mobile & trackpads
    touchMultiplier: 1.5,
    infinite: false,
  });

  window.lenis = lenis;

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Sync all scroll listeners (scrollspy, AOS, navbar, back-to-top) with Lenis momentum
  lenis.on('scroll', (e) => {
    window.dispatchEvent(new Event('scroll'));
    if (window.AOS) window.AOS.refresh();
  });

  // Intercept hash anchor links for buttery glide
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#' && document.querySelector(targetId)) {
        e.preventDefault();
        const targetEl = document.querySelector(targetId);
        lenis.scrollTo(targetEl, { offset: -70, duration: 1.15 });

        // Close mobile nav if opened
        const nav = document.getElementById("navLinks");
        const menuIcon = document.querySelector(".menu-icon");
        if (nav && nav.classList.contains("show")) {
          nav.classList.remove("show");
          if (menuIcon) menuIcon.classList.remove("active");
        }
      }
    });
  });
})();

// ============================================================
// 16. AUTOMATIC VIRTUAL CURSOR DEMO ON HERO SECTION
// (Glide Up from Below -> Click Terminal -> Live Type -> Fade Out)
// ============================================================
(function initVirtualCursorDemo() {
  const cursor = document.getElementById("virtualCursor");
  const ripple = document.getElementById("vcRipple");
  const terminalCmd = document.getElementById("heroTerminalCmd");
  const terminalStatus = document.getElementById("heroTerminalStatus");
  const cardCode = document.querySelector(".card-code");
  const stage = document.querySelector(".hero-stage");

  if (!cursor || !stage || !terminalCmd) return;

  let isRunning = false;

  function moveCursor(x, y, duration = 1000) {
    return new Promise(resolve => {
      cursor.style.transition = `transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1), opacity 0.45s ease`;
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      setTimeout(resolve, duration);
    });
  }

  function clickAt() {
    return new Promise(resolve => {
      cursor.classList.add("vc-clicking");
      if (ripple) {
        ripple.classList.remove("active");
        void ripple.offsetWidth; // trigger reflow
        ripple.classList.add("active");
      }
      if (cardCode) {
        cardCode.classList.add("card-auto-active");
      }
      setTimeout(() => {
        cursor.classList.remove("vc-clicking");
        if (cardCode) {
          setTimeout(() => cardCode.classList.remove("card-auto-active"), 400);
        }
        resolve();
      }, 240);
    });
  }

  function liveType(element, text, speed = 55) {
    return new Promise(resolve => {
      element.innerHTML = '<span class="typing-caret"></span>';
      let i = 0;
      function nextChar() {
        if (i < text.length) {
          element.innerHTML = text.substring(0, i + 1) + '<span class="typing-caret"></span>';
          i++;
          setTimeout(nextChar, speed + Math.random() * 25);
        } else {
          setTimeout(() => {
            element.innerHTML = text;
            resolve();
          }, 350);
        }
      }
      nextChar();
    });
  }

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  async function runDemoLoop() {
    if (!isRunning) return;

    // Dynamically calculate the exact terminal coordinates inside hero-stage
    const stageRect = stage.getBoundingClientRect();
    const termRect = terminalCmd.getBoundingClientRect();

    let targetX = 145;
    let targetY = 220;

    if (stageRect.width > 0 && termRect.width > 0) {
      targetX = Math.round(termRect.left - stageRect.left + 15);
      targetY = Math.round(termRect.top - stageRect.top - 2);
    }

    const startX = targetX + 25;
    const startY = targetY + 230; // Visibly starts from below (niche se)

    // Step 0: Position below the card, invisible
    cursor.style.transition = "none";
    cursor.style.transform = `translate3d(${startX}px, ${startY}px, 0)`;
    cursor.style.opacity = "0";

    await sleep(250);
    if (!isRunning) return;

    // Step 1: Fade in and smoothly glide UPWARDS to the terminal line
    cursor.style.opacity = "1";
    await moveCursor(targetX, targetY, 1150);
    await sleep(280);

    // Step 2: Click on the terminal command line
    await clickAt();
    await sleep(200);

    // Step 3: Proper smooth typewriter animation
    await liveType(terminalCmd, "> npm run build --prod", 50);

    // Step 4: Show success confirmation with green check
    if (terminalStatus) {
      terminalStatus.style.transition = "opacity 0.3s ease, transform 0.3s ease";
      terminalStatus.style.opacity = "0";
      terminalStatus.style.transform = "translateY(4px)";
      await sleep(150);
      terminalStatus.innerHTML = '<span style="color:#10b981;font-weight:600;">✓ Compiled successfully in 0.2s</span>';
      terminalStatus.style.opacity = "1";
      terminalStatus.style.transform = "translateY(0)";
    }

    // Step 5: Pause so user can clearly see the typed command and success message
    await sleep(1200);

    // Step 6: Smoothly glide down-right and gracefully fade away
    const exitX = targetX + 130;
    const exitY = targetY + 220;
    cursor.style.opacity = "0";
    await moveCursor(exitX, exitY, 950);

    // Step 7: Wait before resetting and repeating
    await sleep(1400);

    // Reset terminal content back to original
    if (terminalCmd) terminalCmd.textContent = "> npm run dev";
    if (terminalStatus) terminalStatus.innerHTML = 'Compiled successfully <i class="fas fa-check"></i>';

    await sleep(2600);
    if (isRunning) {
      runDemoLoop();
    }
  }

  function start() {
    if (isRunning) return;
    isRunning = true;
    runDemoLoop();
  }

  // Start after preloader completes
  window.addEventListener("load", () => {
    setTimeout(start, 3200);
  });

  // Fallback trigger if page already loaded
  setTimeout(start, 3500);
})();


// ============================================================
// 17. DYNAMIC RANDOM RGB COLOR SHIMMER ON SERVICE HEADINGS
// ============================================================
(function initRandomServiceHeadingShimmer() {
  const titles = document.querySelectorAll(".service-title-rgb");
  if (titles.length === 0) return;

  function pulseRandomTitle() {
    const randomIndex = Math.floor(Math.random() * titles.length);
    const targetTitle = titles[randomIndex];
    if (targetTitle) {
      targetTitle.style.filter = "drop-shadow(0 2px 14px rgba(37, 99, 235, 0.5))";
      setTimeout(() => {
        targetTitle.style.filter = "none";
      }, 1900);
    }

    const nextInterval = 2400 + Math.random() * 2600;
    setTimeout(pulseRandomTitle, nextInterval);
  }

  setTimeout(pulseRandomTitle, 3000);
})();


// ============================================================
// PIXEL-PERFECT PROJECTS SECTION: FILTERS, TOGGLE & STATS
// ============================================================
function initProjectsInteractions() {
  const filterPills = document.querySelectorAll(".projects-filter-nav .filter-pill");
  const featuredCards = document.querySelectorAll(".featured-project-card");
  const compactCards = document.querySelectorAll(".compact-project-card");
  const toggleBtn = document.getElementById("toggleAllProjectsBtn");
  const toggleText = document.getElementById("toggleProjectsText");
  const toggleArrow = document.getElementById("toggleProjectsArrow");
  const extraCards = document.querySelectorAll(".compact-project-card.extra-project");

  let isExpanded = false;

  // Initial state: hide extra compact cards if in 'all' view
  function updateCardVisibility(currentFilter) {
    if (currentFilter === "all") {
      featuredCards.forEach(c => c.style.display = "");
      compactCards.forEach(c => {
        if (c.classList.contains("extra-project")) {
          c.style.display = isExpanded ? "flex" : "none";
        } else {
          c.style.display = "flex";
        }
      });
      if (toggleBtn) toggleBtn.parentElement.style.display = "flex";
    } else {
      // Filtered view: hide/show based on category
      featuredCards.forEach(c => {
        const cat = c.getAttribute("data-category") || "";
        c.style.display = cat.includes(currentFilter) ? "" : "none";
      });
      compactCards.forEach(c => {
        const cat = c.getAttribute("data-category") || "";
        c.style.display = cat.includes(currentFilter) ? "flex" : "none";
      });
      // In filtered view, hide the View All toggle button
      if (toggleBtn) toggleBtn.parentElement.style.display = "none";
    }
  }

  // Filter Pill Click
  filterPills.forEach(pill => {
    pill.addEventListener("click", () => {
      filterPills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      const filter = pill.getAttribute("data-filter");
      updateCardVisibility(filter);
    });
  });

  // Toggle View All Projects Click
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      isExpanded = !isExpanded;
      if (isExpanded) {
        extraCards.forEach(c => {
          c.style.display = "flex";
          c.style.opacity = "0";
          c.style.transform = "translateY(15px)";
          setTimeout(() => {
            c.style.transition = "opacity 0.4s ease, transform 0.4s ease";
            c.style.opacity = "1";
            c.style.transform = "translateY(0)";
          }, 50);
        });
        if (toggleText) toggleText.textContent = "Show Less";
        if (toggleArrow) toggleArrow.className = "fas fa-arrow-up";
      } else {
        extraCards.forEach(c => {
          c.style.display = "none";
        });
        if (toggleText) toggleText.textContent = "View All Projects (10+)";
        if (toggleArrow) toggleArrow.className = "fas fa-arrow-right";
        // Smooth scroll back to projects section
        const projSec = document.getElementById("projects");
        if (projSec) {
          projSec.scrollIntoView({ behavior: "smooth" });
        }
      }
    });
  }

  // Set initial visibility
  updateCardVisibility("all");

  // Animate 4 Stats in Bar with Ultra-Smooth requestAnimationFrame
  const statNums = document.querySelectorAll(".projects-stats-bar .stat-num");
  const statsBar = document.querySelector(".projects-stats-bar");

  if (statNums.length > 0 && statsBar && "IntersectionObserver" in window) {
    let hasAnimated = false;

    function runStatsCounter() {
      if (hasAnimated) return;
      hasAnimated = true;

      const duration = 1800; // 1.8 seconds for rich, engaging count
      const startTime = performance.now();

      const items = Array.from(statNums).map(el => {
        const target = parseInt(el.getAttribute("data-count"), 10) || 0;
        const isPct = el.parentElement.querySelector(".stat-lbl")?.textContent?.includes("Satisfaction") ||
                      el.nextElementSibling?.textContent?.includes("Satisfaction");
        return { el, target, isPct };
      });

      function update(now) {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);
        // ease-out quart for a very smooth deceleration
        const ease = 1 - Math.pow(1 - progress, 4);

        items.forEach(({ el, target, isPct }) => {
          const current = Math.round(target * ease);
          if (progress >= 1) {
            el.textContent = target + (isPct ? "%" : "+");
          } else {
            el.textContent = current + (isPct ? "%" : "+");
          }
        });

        if (progress < 1) {
          requestAnimationFrame(update);
        }
      }

      requestAnimationFrame(update);
    }

    const statObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          runStatsCounter();
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.25,
      rootMargin: "0px 0px -40px 0px"
    });

    statObserver.observe(statsBar);
  }
}

// Auto-run on DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initProjectsInteractions);
} else {
  initProjectsInteractions();
}


// ============================================================
// DYNAMIC SIDE-PREVIEW WINDOW (IMG-ONLY TRIGGER, 60FPS LERP PHYSICS, SMART LOWER-SIDE ALIGNMENT & PIN ZOOM)
// ============================================================
function initDraggableProjectPreview() {
  const modal = document.getElementById("floatingProjectPreview");
  const stage = document.getElementById("floatingImageStage");
  const cornerClose = document.getElementById("floatingCornerClose");
  const modalTitle = document.getElementById("floatingModalTitle");
  const modalImg = document.getElementById("floatingModalImg");
  const modalTag = document.getElementById("floatingModalTag");
  const liveBtn = document.getElementById("floatingLiveBtn");
  const ghBtn = document.getElementById("floatingGithubBtn");
  const timerPill = document.getElementById("previewCountdownPill");
  const timerSec = document.getElementById("previewSecondsCount");
  const pinBadge = document.getElementById("previewPinnedIndicator");
  const zoomToolbar = document.getElementById("previewZoomToolbar");
  const zoomLevelText = document.getElementById("previewZoomLevel");
  const zoomInBtn = document.getElementById("previewZoomIn");
  const zoomOutBtn = document.getElementById("previewZoomOut");
  const zoomResetBtn = document.getElementById("previewZoomReset");

  if (!modal) return;

  let countdownInterval = null;
  let countdownTimeout = null;
  let hoverLeaveTimeout = null;
  let isPinned = false;
  let currentCard = null;
  let isModalHovered = false;
  let isDragging = false;

  // LERP & RAF Smooth Physics State
  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;
  let targetTiltX = 0, targetTiltY = 0;
  let currentTiltX = 0, currentTiltY = 0;
  let isRafActive = false;
  let rafId = null;

  // Zoom & Pan State (Active when pinned)
  let zoomScale = 1.0;
  let panX = 0;
  let panY = 0;
  let isPanning = false;
  let startPanMouseX = 0;
  let startPanMouseY = 0;
  let initialPanX = 0;
  let initialPanY = 0;

  function applyZoom() {
    if (!modalImg) return;
    modalImg.style.transform = `translate3d(${panX}px, ${panY}px, 0) scale(${zoomScale})`;
    if (zoomLevelText) zoomLevelText.textContent = `${Math.round(zoomScale * 100)}%`;
    if (stage) {
      if (zoomScale > 1.0) {
        stage.classList.add("is-zoomed");
      } else {
        stage.classList.remove("is-zoomed");
      }
    }
  }

  function setZoom(newScale) {
    zoomScale = Math.max(1.0, Math.min(3.5, newScale));
    if (zoomScale === 1.0) {
      panX = 0;
      panY = 0;
    }
    applyZoom();
  }

  function resetZoom() {
    zoomScale = 1.0;
    panX = 0;
    panY = 0;
    applyZoom();
  }

  // Mouse wheel zoom when pinned
  if (stage) {
    stage.addEventListener("wheel", (e) => {
      if (!isPinned) return;
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.25 : -0.25;
      setZoom(zoomScale + delta);
    }, { passive: false });
  }

  // Zoom toolbar buttons
  if (zoomInBtn) zoomInBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    setZoom(zoomScale + 0.35);
  });
  if (zoomOutBtn) zoomOutBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    setZoom(zoomScale - 0.35);
  });
  if (zoomResetBtn) zoomResetBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    resetZoom();
  });

  function lerp(start, end, factor) {
    return start + (end - start) * factor;
  }

  function updateRafLoop() {
    if (!isRafActive) return;

    // 0.12 factor gives velvety-smooth 60fps/120fps glide
    const factor = 0.12;
    currentX = lerp(currentX, targetX, factor);
    currentY = lerp(currentY, targetY, factor);
    currentTiltX = lerp(currentTiltX, targetTiltX, factor);
    currentTiltY = lerp(currentTiltY, targetTiltY, factor);

    modal.style.left = currentX.toFixed(2) + "px";
    modal.style.top = currentY.toFixed(2) + "px";
    modal.style.transform = `perspective(1000px) rotateX(${currentTiltX.toFixed(2)}deg) rotateY(${currentTiltY.toFixed(2)}deg) scale(1.01)`;

    rafId = requestAnimationFrame(updateRafLoop);
  }

  function startRaf() {
    if (!isRafActive) {
      isRafActive = true;
      rafId = requestAnimationFrame(updateRafLoop);
    }
  }

  function stopRaf() {
    isRafActive = false;
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  function computeTargetPosition(card, imgTarget, clientX, clientY) {
    if (isPinned || isDragging || isModalHovered) return;
    if (!card) return;

    const cardRect = card.getBoundingClientRect();
    const modalW = modal.offsetWidth || 530;
    const modalH = modal.offsetHeight || 330;

    const roomRight = window.innerWidth - cardRect.right;
    const isRightmost = (roomRight < modalW + 24);

    let baseSideX = 0;
    if (!isRightmost) {
      // Normal left / middle cards: opens to the right
      baseSideX = cardRect.right + 20;
    } else {
      // Last / rightmost card: opens to the left
      baseSideX = cardRect.left - modalW - 20;
    }

    // Relative mouse position within the card's image target (-0.5 to +0.5)
    const targetRect = (imgTarget || card).getBoundingClientRect();
    let normX = 0;
    let normY = 0;
    if (clientX !== undefined && clientY !== undefined) {
      normX = Math.min(1, Math.max(0, (clientX - targetRect.left) / targetRect.width)) - 0.5;
      normY = Math.min(1, Math.max(0, (clientY - targetRect.top) / targetRect.height)) - 0.5;
    }

    targetX = baseSideX + (normX * 36);

    if (isRightmost) {
      // User requested: "last wale card pe hover krne ke bad preview us ke thoda niche se ke side mai khulna chaiye dusre card ke uppar nhi ok"
      // Position lower down below Card 2's image so Card 2's preview image is completely clear & unobstructed!
      const lowerBaseY = cardRect.top + Math.min(220, cardRect.height * 0.48);
      targetY = lowerBaseY + (normY * 20);
    } else {
      const pointerY = (clientY !== undefined) ? clientY : (targetRect.top + targetRect.height / 2);
      targetY = (pointerY - modalH * 0.45) + (normY * 26);
    }

    // Clamping within viewport
    targetX = Math.max(12, Math.min(window.innerWidth - modalW - 12, targetX));
    targetY = Math.max(15, Math.min(window.innerHeight - modalH - 15, targetY));

    // Dynamic 3D tilt target
    targetTiltX = (-normY * 9);
    targetTiltY = (normX * 9);
  }

  function openPreview(card, imgTarget, data, e) {
    currentCard = card;
    if (modalTitle) modalTitle.textContent = data.title || "Project Preview";
    if (modalImg) modalImg.src = data.img || "";
    if (modalTag) modalTag.textContent = data.tag || "Full Stack";
    if (liveBtn) liveBtn.href = data.live || "#";
    if (ghBtn) ghBtn.href = data.github || "#";

    // Reset countdown and light green live button
    if (countdownInterval) clearInterval(countdownInterval);
    if (countdownTimeout) clearTimeout(countdownTimeout);

    if (liveBtn) liveBtn.style.display = "none";
    if (timerPill) {
      timerPill.style.display = "inline-flex";
      let secondsLeft = 3;
      if (timerSec) timerSec.textContent = secondsLeft;

      countdownInterval = setInterval(() => {
        secondsLeft--;
        if (secondsLeft > 0) {
          if (timerSec) timerSec.textContent = secondsLeft;
        } else {
          clearInterval(countdownInterval);
        }
      }, 1000);

      countdownTimeout = setTimeout(() => {
        timerPill.style.display = "none";
        if (liveBtn) liveBtn.style.display = "inline-flex";
      }, 3000);
    }

    computeTargetPosition(card, imgTarget, e.clientX, e.clientY);

    // Direct initial placement so entrance has no jump
    currentX = targetX;
    currentY = targetY;
    currentTiltX = targetTiltX;
    currentTiltY = targetTiltY;

    modal.style.left = currentX.toFixed(2) + "px";
    modal.style.top = currentY.toFixed(2) + "px";
    modal.style.transform = `perspective(1000px) rotateX(${currentTiltX.toFixed(2)}deg) rotateY(${currentTiltY.toFixed(2)}deg) scale(1.01)`;
    modal.style.display = "block";
    modal.classList.remove("is-dragging");

    requestAnimationFrame(() => {
      modal.style.opacity = "1";
    });

    if (!isPinned) {
      if (pinBadge) pinBadge.style.display = "none";
      if (zoomToolbar) zoomToolbar.style.display = "none";
      startRaf();
    }
  }

  function closePreview() {
    modal.style.opacity = "0";
    setTimeout(() => {
      if (modal.style.opacity === "0") {
        modal.style.display = "none";
        modal.style.transform = "none";
      }
    }, 220);

    stopRaf();
    isPinned = false;
    currentCard = null;
    isModalHovered = false;
    resetZoom();
    if (pinBadge) pinBadge.style.display = "none";
    if (zoomToolbar) zoomToolbar.style.display = "none";
    if (stage) stage.classList.remove("is-pinned");
    if (countdownInterval) clearInterval(countdownInterval);
    if (countdownTimeout) clearTimeout(countdownTimeout);
    if (hoverLeaveTimeout) clearTimeout(hoverLeaveTimeout);
  }

  function setPinned(pinned) {
    isPinned = pinned;
    if (isPinned) {
      stopRaf();
      if (zoomToolbar) zoomToolbar.style.display = "inline-flex";
      if (pinBadge) pinBadge.style.display = "inline-flex";
      modal.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)";
      if (stage) stage.classList.add("is-pinned");
      if (hoverLeaveTimeout) clearTimeout(hoverLeaveTimeout);
    } else {
      if (zoomToolbar) zoomToolbar.style.display = "none";
      if (pinBadge) pinBadge.style.display = "none";
      if (stage) stage.classList.remove("is-pinned");
      resetZoom();
    }
  }

  // Corner cross close button
  if (cornerClose) cornerClose.addEventListener("click", (e) => {
    e.stopPropagation();
    closePreview();
  });

  // Double click on preview stage to pin (no text "Pinned" shown)
  function handleDoubleClick(e) {
    e.stopPropagation();
    setPinned(true);
  }
  if (stage) stage.addEventListener("dblclick", handleDoubleClick);
  if (modalImg) modalImg.addEventListener("dblclick", handleDoubleClick);

  // Outside click to dismiss
  document.addEventListener("pointerdown", (e) => {
    if (modal.style.display !== "none" && modal.style.opacity !== "0") {
      const isInsideModal = modal.contains(e.target);
      const isInsideImg = e.target.closest(".card-preview-area, .compact-thumb-wrap");
      if (!isInsideModal && !isInsideImg) {
        closePreview();
      }
    }
  });

  // ATTACH TRIGGERS STRICTLY TO THE CARD IMAGE PORTION
  const allCards = document.querySelectorAll(".featured-project-card, .compact-project-card");
  allCards.forEach(card => {
    const imgTarget = card.querySelector(".card-preview-area") || card.querySelector(".compact-thumb-wrap");
    if (!imgTarget) return;

    // Hover Enter on IMAGE ONLY
    imgTarget.addEventListener("mouseenter", (e) => {
      if (hoverLeaveTimeout) clearTimeout(hoverLeaveTimeout);
      if (isPinned && modal.style.display !== "none") return;

      const data = {
        title: card.getAttribute("data-title") || card.querySelector("h3, h4")?.textContent || "Project Preview",
        img: card.getAttribute("data-img") || card.querySelector("img")?.src || "",
        live: card.getAttribute("data-live") || card.querySelector(".btn-action.secondary")?.href || "#",
        github: card.getAttribute("data-github") || card.querySelector("a[href*='github']")?.href || "#",
        tag: card.getAttribute("data-tag") || card.querySelector(".category-pill-tag")?.textContent || "Project",
        desc: card.getAttribute("data-desc") || card.querySelector(".card-desc, .compact-desc")?.textContent || ""
      };

      openPreview(card, imgTarget, data, e);
    });

    // Mouse Move on IMAGE ONLY
    imgTarget.addEventListener("mousemove", (e) => {
      if (isPinned || isDragging || isModalHovered) return;
      if (modal.style.display === "none") return;
      computeTargetPosition(card, imgTarget, e.clientX, e.clientY);
    });

    // Hover Leave IMAGE
    imgTarget.addEventListener("mouseleave", () => {
      if (!isPinned && modal.style.display !== "none" && !isModalHovered) {
        hoverLeaveTimeout = setTimeout(() => {
          if (!isModalHovered) closePreview();
        }, 280);
      }
    });

    // Double-click on IMAGE pins preview
    imgTarget.addEventListener("dblclick", (e) => {
      e.stopPropagation();
      setPinned(true);
    });
  });

  // When mouse enters modal: keep open and smoothly level out
  modal.addEventListener("mouseenter", () => {
    isModalHovered = true;
    if (hoverLeaveTimeout) clearTimeout(hoverLeaveTimeout);
    targetTiltX = 0;
    targetTiltY = 0;
  });

  // When mouse leaves modal
  modal.addEventListener("mouseleave", () => {
    isModalHovered = false;
    if (!isPinned && modal.style.display !== "none") {
      hoverLeaveTimeout = setTimeout(() => {
        closePreview();
      }, 280);
    }
  });

  // Draggable logic for user to move anywhere & Pan when zoomed
  let startMouseX = 0;
  let startMouseY = 0;
  let initialModalLeft = 0;
  let initialModalTop = 0;

  function onPointerDown(e) {
    if (e.target.closest(".corner-cross-btn") || e.target.closest(".floating-live-btn-green") || e.target.closest(".floating-gh-mini-btn") || e.target.closest(".preview-zoom-toolbar")) {
      return;
    }

    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;

    // When pinned and zoomed in, dragging pans the zoomed image!
    if (isPinned && zoomScale > 1.0 && (e.target === modalImg || e.target === stage)) {
      isPanning = true;
      if (stage) stage.classList.add("is-panning");
      startPanMouseX = clientX;
      startPanMouseY = clientY;
      initialPanX = panX;
      initialPanY = panY;
      e.preventDefault();
      return;
    }

    // Otherwise, drag the preview window
    isDragging = true;
    stopRaf();
    modal.classList.add("is-dragging");
    startMouseX = clientX;
    startMouseY = clientY;
    const rect = modal.getBoundingClientRect();
    initialModalLeft = rect.left;
    initialModalTop = rect.top;
    if (stage) stage.style.cursor = "grabbing";
    e.preventDefault();
  }

  function onPointerMove(e) {
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;

    if (isPanning) {
      const deltaX = clientX - startPanMouseX;
      const deltaY = clientY - startPanMouseY;
      let nextPanX = initialPanX + deltaX;
      let nextPanY = initialPanY + deltaY;

      const maxPanX = ((zoomScale - 1) * (stage.offsetWidth || 500)) / 2;
      const maxPanY = ((zoomScale - 1) * (stage.offsetHeight || 300)) / 2;
      panX = Math.max(-maxPanX, Math.min(maxPanX, nextPanX));
      panY = Math.max(-maxPanY, Math.min(maxPanY, nextPanY));
      applyZoom();
      return;
    }

    if (isDragging) {
      const deltaX = clientX - startMouseX;
      const deltaY = clientY - startMouseY;

      let newLeft = initialModalLeft + deltaX;
      let newTop = initialModalTop + deltaY;

      const modalW = modal.offsetWidth;
      const modalH = modal.offsetHeight;
      newLeft = Math.max(10, Math.min(newLeft, window.innerWidth - modalW - 10));
      newTop = Math.max(10, Math.min(newTop, window.innerHeight - modalH - 10));

      currentX = newLeft;
      currentY = newTop;
      targetX = newLeft;
      targetY = newTop;
      modal.style.left = newLeft + "px";
      modal.style.top = newTop + "px";
    }
  }

  function onPointerUp() {
    if (isPanning) {
      isPanning = false;
      if (stage) stage.classList.remove("is-panning");
    }
    if (isDragging) {
      isDragging = false;
      modal.classList.remove("is-dragging");
      if (stage) stage.style.cursor = isPinned ? (zoomScale > 1.0 ? "grab" : "default") : "grab";
    }
  }

  if (stage) {
    stage.addEventListener("mousedown", onPointerDown);
    stage.addEventListener("touchstart", onPointerDown, { passive: false });
  }
  window.addEventListener("mousemove", onPointerMove);
  window.addEventListener("mouseup", onPointerUp);
  window.addEventListener("touchmove", onPointerMove, { passive: false });
  window.addEventListener("touchend", onPointerUp);
}

function initServicesAndPreview() {
  initDraggableProjectPreview();
  initServicesTypewriter();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initServicesAndPreview);
} else {
  initServicesAndPreview();
}
