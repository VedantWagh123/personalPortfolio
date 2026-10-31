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
const roles = ["Software Developer", "Android Developer", "UI/UX Designer"];
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
          ctx.fillStyle = "#ffd700";
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
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        if (cvModal) {
          cvModal.style.display = "flex";
          setTimeout(() => { cvModal.style.opacity = "1"; }, 10);
        } else {
          showNotificationToast("CV Download", "The CV download feature is currently being updated!");
        }
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
        s.style.color = val <= score ? "#ffd700" : "rgba(255,255,255,0.2)";
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
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const firstName = document.getElementById("firstName")?.value.trim();
      const lastName = document.getElementById("lastName")?.value.trim();
      const email = document.getElementById("email")?.value.trim();
      const message = document.getElementById("message")?.value.trim();
      const submitBtn = form.querySelector(".submit-btn");

      if (!firstName || !lastName || !email || !message) {
        alert("Please complete all required fields.");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert("Please enter a valid email address.");
        return;
      }

      const origText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Sending...</span> <i class="fas fa-spinner fa-spin"></i>`;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = origText;

        if (modal) {
          modal.classList.add("show");
          document.body.style.overflow = "hidden";
        } else {
          alert("Thank you! Your message has been sent successfully.");
        }

        form.reset();
      }, 1200);
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
