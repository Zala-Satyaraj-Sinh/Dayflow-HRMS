/* =======================
   THEME MANAGEMENT
======================= */

// Initialize theme on page load
document.addEventListener("DOMContentLoaded", () => {
  initializeTheme();
  initializeActiveLinks();
  initializeMobileMenu();
});

function initializeTheme() {
  const savedTheme = localStorage.getItem("theme") || "light";
  const html = document.documentElement;
  html.setAttribute("data-theme", savedTheme);
  
  const toggle = document.getElementById("themeToggle");
  if (toggle) {
    toggle.innerText = savedTheme === "dark" ? "☀️" : "🌙";
    toggle.addEventListener("click", toggleTheme);
  }
}

function toggleTheme() {
  const html = document.documentElement;
  const currentTheme = html.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  
  html.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  
  const toggle = document.getElementById("themeToggle");
  if (toggle) {
    toggle.innerText = newTheme === "dark" ? "☀️" : "🌙";
  }
  
  showToast("Theme changed to " + newTheme + " mode", "success");
}

/* =======================
   ACTIVE LINK HIGHLIGHTING
======================= */

function initializeActiveLinks() {
  const currentPath = window.location.pathname;
  const links = document.querySelectorAll(".sidebar a, nav a");
  
  links.forEach(link => {
    if (link.getAttribute("href") === currentPath.split("/").pop() || 
        link.getAttribute("href") === currentPath) {
      link.classList.add("active");
    }
  });
}

/* =======================
   MOBILE MENU
======================= */

function initializeMobileMenu() {
  if (window.innerWidth <= 1024) {
    const sidebar = document.querySelector(".sidebar");
    if (sidebar) {
      // Add mobile menu toggle button
      const menuBtn = document.createElement("button");
      menuBtn.innerHTML = "☰";
      menuBtn.className = "theme-btn";
      menuBtn.style.position = "fixed";
      menuBtn.style.top = "1rem";
      menuBtn.style.left = "1rem";
      menuBtn.style.zIndex = "1001";
      menuBtn.onclick = () => sidebar.classList.toggle("open");
      document.body.appendChild(menuBtn);
    }
  }
}

/* =======================
   TOAST NOTIFICATIONS
======================= */

function showToast(message, type = "info", duration = 3000) {
  const container = document.getElementById("toastContainer");
  if (!container) {
    const newContainer = document.createElement("div");
    newContainer.id = "toastContainer";
    document.body.appendChild(newContainer);
    return showToast(message, type, duration);
  }
  
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  
  const icon = type === "success" ? "✓" : type === "error" ? "✕" : type === "warning" ? "⚠" : "ℹ";
  toast.innerHTML = `
    <span style="font-size: 1.2rem;">${icon}</span>
    <span>${message}</span>
  `;
  
  container.appendChild(toast);
  
  // Auto remove after duration
  setTimeout(() => {
    toast.style.animation = "slideInRight 0.3s ease-out reverse";
    setTimeout(() => toast.remove(), 300);
  }, duration);
  
  // Click to dismiss
  toast.addEventListener("click", () => {
    toast.style.animation = "slideInRight 0.3s ease-out reverse";
    setTimeout(() => toast.remove(), 300);
  });
}

/* =======================
   FORM VALIDATION
======================= */

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePassword(password) {
  return password.length >= 6;
}

function validateForm(form) {
  const inputs = form.querySelectorAll("input[required], select[required]");
  let isValid = true;
  
  inputs.forEach(input => {
    if (input.type === "email" && !validateEmail(input.value)) {
      showError(input, "Please enter a valid email address");
      isValid = false;
    } else if (input.type === "password" && !validatePassword(input.value)) {
      showError(input, "Password must be at least 6 characters");
      isValid = false;
    } else if (!input.value.trim()) {
      showError(input, "This field is required");
      isValid = false;
    } else {
      clearError(input);
    }
  });
  
  return isValid;
}

function showError(input, message) {
  clearError(input);
  input.style.borderColor = "var(--error)";
  const errorDiv = document.createElement("div");
  errorDiv.className = "error-message";
  errorDiv.style.color = "var(--error)";
  errorDiv.style.fontSize = "0.875rem";
  errorDiv.style.marginTop = "0.25rem";
  errorDiv.textContent = message;
  input.parentNode.insertBefore(errorDiv, input.nextSibling);
}

function clearError(input) {
  input.style.borderColor = "";
  const errorMsg = input.parentNode.querySelector(".error-message");
  if (errorMsg) {
    errorMsg.remove();
  }
}

/* =======================
   LOGIN HANDLER
======================= */

function handleLogin(event) {
  event.preventDefault();
  const form = event.target;
  
  if (!validateForm(form)) {
    showToast("Please fix the errors in the form", "error");
    return;
  }
  
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const role = document.getElementById("loginRole").value;
  
  // Simulate loading
  const submitBtn = form.querySelector("button[type='submit']");
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = "Signing in...";
  submitBtn.disabled = true;
  form.classList.add("loading");
  
  // Simulate API call
  setTimeout(() => {
    // Save user session
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userRole", role);
    
    showToast("Login successful! Redirecting...", "success");
    
    setTimeout(() => {
      if (role === "admin") {
        window.location.href = "admin.html";
      } else {
        window.location.href = "dashboard.html";
      }
    }, 1000);
  }, 1500);
}

/* =======================
   REGISTER HANDLER
======================= */

function handleRegister(event) {
  event.preventDefault();
  const form = event.target;
  
  if (!validateForm(form)) {
    showToast("Please fix the errors in the form", "error");
    return;
  }
  
  const employeeId = document.getElementById("employeeId").value;
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;
  const role = document.getElementById("regRole").value;
  
  // Simulate loading
  const submitBtn = form.querySelector("button[type='submit']");
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = "Creating account...";
  submitBtn.disabled = true;
  form.classList.add("loading");
  
  // Simulate API call
  setTimeout(() => {
    showToast("Account created successfully!", "success");
    
    setTimeout(() => {
      window.location.href = "login.html";
    }, 1500);
  }, 1500);
}

/* =======================
   LEAVE ACTIONS
======================= */

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("approve")) {
    e.preventDefault();
    if (confirm("Are you sure you want to approve this leave request?")) {
      showToast("Leave request approved", "success");
      e.target.closest("tr")?.remove();
    }
  }
  
  if (e.target.classList.contains("reject")) {
    e.preventDefault();
    if (confirm("Are you sure you want to reject this leave request?")) {
      showToast("Leave request rejected", "warning");
      e.target.closest("tr")?.remove();
    }
  }
});

/* =======================
   ATTENDANCE MARKING
======================= */

function markAttendance() {
  const now = new Date();
  const time = now.toLocaleTimeString();
  showToast(`Attendance marked at ${time}`, "success");
  
  // Update UI if needed
  const attendanceBtn = document.querySelector(".mark-attendance");
  if (attendanceBtn) {
    attendanceBtn.disabled = true;
    attendanceBtn.textContent = "Already Marked";
  }
}

/* =======================
   FORM ENHANCEMENTS
======================= */

// Add focus effects to inputs
document.addEventListener("DOMContentLoaded", () => {
  const inputs = document.querySelectorAll("input, select, textarea");
  inputs.forEach(input => {
    input.addEventListener("focus", function() {
      this.parentElement?.classList.add("focused");
    });
    
    input.addEventListener("blur", function() {
      this.parentElement?.classList.remove("focused");
    });
  });
});

/* =======================
   CARD INTERACTIONS
======================= */

// Add click effects to cards
document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".card");
  cards.forEach(card => {
    card.addEventListener("click", function() {
      if (this.style.cursor !== "default") {
        this.style.transform = "scale(0.98)";
        setTimeout(() => {
          this.style.transform = "";
        }, 150);
      }
    });
  });
});

/* =======================
   TABLE ENHANCEMENTS
======================= */

// Add row hover effects
document.addEventListener("DOMContentLoaded", () => {
  const tableRows = document.querySelectorAll("table tbody tr");
  tableRows.forEach(row => {
    row.addEventListener("mouseenter", function() {
      this.style.transition = "all 0.2s ease";
    });
  });
});

/* =======================
   RESPONSIVE HANDLING
======================= */

window.addEventListener("resize", () => {
  initializeMobileMenu();
});

// Close sidebar when clicking outside on mobile
document.addEventListener("click", (e) => {
  if (window.innerWidth <= 1024) {
    const sidebar = document.querySelector(".sidebar");
    const menuBtn = document.querySelector(".theme-btn[style*='position: fixed']");
    
    if (sidebar && !sidebar.contains(e.target) && !menuBtn?.contains(e.target)) {
      sidebar.classList.remove("open");
    }
  }
});

/* =======================
   SMOOTH SCROLLING
======================= */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  });
});

/* =======================
   LOADING STATES
======================= */

function setLoading(element, isLoading) {
  if (isLoading) {
    element.classList.add("loading");
    element.disabled = true;
  } else {
    element.classList.remove("loading");
    element.disabled = false;
  }
}

/* =======================
   UTILITY FUNCTIONS
======================= */

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(amount);
}

/* =======================
   MODAL MANAGEMENT
======================= */

function showModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }
}

function hideModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }
}

// Close modal on overlay click
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal-overlay")) {
    e.target.classList.remove("active");
    document.body.style.overflow = "";
  }
});

// Close modal on Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const activeModal = document.querySelector(".modal-overlay.active");
    if (activeModal) {
      activeModal.classList.remove("active");
      document.body.style.overflow = "";
    }
  }
});

/* =======================
   DROPDOWN MANAGEMENT
======================= */

document.addEventListener("click", (e) => {
  // Close all dropdowns when clicking outside
  if (!e.target.closest(".dropdown")) {
    document.querySelectorAll(".dropdown.active").forEach(dropdown => {
      dropdown.classList.remove("active");
    });
  }
});

function toggleDropdown(dropdownId) {
  const dropdown = document.getElementById(dropdownId);
  if (dropdown) {
    dropdown.classList.toggle("active");
  }
}

/* =======================
   COPY TO CLIPBOARD
======================= */

function copyToClipboard(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      showToast("Copied to clipboard!", "success");
    }).catch(() => {
      showToast("Failed to copy", "error");
    });
  } else {
    // Fallback for older browsers
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
      showToast("Copied to clipboard!", "success");
    } catch (err) {
      showToast("Failed to copy", "error");
    }
    document.body.removeChild(textarea);
  }
}

/* =======================
   DEBOUNCE FUNCTION
======================= */

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/* =======================
   THROTTLE FUNCTION
======================= */

function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/* =======================
   CONFIRM DIALOG
======================= */

function confirmAction(message, onConfirm, onCancel) {
  if (confirm(message)) {
    if (onConfirm) onConfirm();
  } else {
    if (onCancel) onCancel();
  }
}

/* =======================
   FILE DOWNLOAD
======================= */

function downloadFile(content, filename, contentType = "text/plain") {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* =======================
   DATE UTILITIES
======================= */

function getDaysBetween(date1, date2) {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round(Math.abs((date1 - date2) / oneDay));
}

function isWeekend(date) {
  const day = date.getDay();
  return day === 0 || day === 6;
}

function getBusinessDays(startDate, endDate) {
  let count = 0;
  const current = new Date(startDate);
  const end = new Date(endDate);
  
  while (current <= end) {
    if (!isWeekend(current)) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }
  
  return count;
}

/* =======================
   NUMBER FORMATTING
======================= */

function formatNumber(num, decimals = 2) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(num);
}

function formatPercentage(num, decimals = 1) {
  return formatNumber(num, decimals) + "%";
}

/* =======================
   LOCAL STORAGE HELPERS
======================= */

function saveToLocalStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.error("Error saving to localStorage:", e);
    return false;
  }
}

function getFromLocalStorage(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error("Error reading from localStorage:", e);
    return defaultValue;
  }
}

function removeFromLocalStorage(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (e) {
    console.error("Error removing from localStorage:", e);
    return false;
  }
}

/* =======================
   ANIMATION HELPERS
======================= */

function fadeIn(element, duration = 300) {
  element.style.opacity = "0";
  element.style.display = "block";
  
  let start = null;
  function animate(timestamp) {
    if (!start) start = timestamp;
    const progress = timestamp - start;
    const opacity = Math.min(progress / duration, 1);
    element.style.opacity = opacity;
    
    if (progress < duration) {
      requestAnimationFrame(animate);
    }
  }
  requestAnimationFrame(animate);
}

function fadeOut(element, duration = 300) {
  let start = null;
  const startOpacity = parseFloat(getComputedStyle(element).opacity);
  
  function animate(timestamp) {
    if (!start) start = timestamp;
    const progress = timestamp - start;
    const opacity = startOpacity * (1 - Math.min(progress / duration, 1));
    element.style.opacity = opacity;
    
    if (progress < duration) {
      requestAnimationFrame(animate);
    } else {
      element.style.display = "none";
    }
  }
  requestAnimationFrame(animate);
}

/* =======================
   SCROLL TO TOP
======================= */

function scrollToTop(duration = 500) {
  const start = window.pageYOffset;
  const distance = -start;
  let startTime = null;
  
  function animate(currentTime) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const run = easeInOutQuad(timeElapsed, start, distance, duration);
    window.scrollTo(0, run);
    if (timeElapsed < duration) requestAnimationFrame(animate);
  }
  
  function easeInOutQuad(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  }
  
  requestAnimationFrame(animate);
}

// Add scroll to top button
document.addEventListener("DOMContentLoaded", () => {
  const scrollBtn = document.createElement("button");
  scrollBtn.innerHTML = "↑";
  scrollBtn.className = "theme-btn";
  scrollBtn.style.position = "fixed";
  scrollBtn.style.bottom = "2rem";
  scrollBtn.style.right = "2rem";
  scrollBtn.style.zIndex = "999";
  scrollBtn.style.display = "none";
  scrollBtn.onclick = () => scrollToTop();
  scrollBtn.ariaLabel = "Scroll to top";
  document.body.appendChild(scrollBtn);
  
  window.addEventListener("scroll", () => {
    scrollBtn.style.display = window.pageYOffset > 300 ? "flex" : "none";
  });
});

/* =======================
   FORM DATA SERIALIZATION
======================= */

function serializeForm(form) {
  const formData = new FormData(form);
  const data = {};
  for (const [key, value] of formData.entries()) {
    data[key] = value;
  }
  return data;
}

/* =======================
   INPUT MASKING
======================= */

function maskInput(input, pattern) {
  input.addEventListener("input", (e) => {
    let value = e.target.value.replace(/\D/g, "");
    let formattedValue = "";
    let patternIndex = 0;
    
    for (let i = 0; i < value.length && patternIndex < pattern.length; i++) {
      if (pattern[patternIndex] === "#") {
        formattedValue += value[i];
        patternIndex++;
      } else {
        formattedValue += pattern[patternIndex];
        patternIndex++;
        i--;
      }
    }
    
    e.target.value = formattedValue;
  });
}

/* =======================
   IMAGE PREVIEW
======================= */

function previewImage(input, previewId) {
  const file = input.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const preview = document.getElementById(previewId);
      if (preview) {
        preview.src = e.target.result;
        preview.style.display = "block";
      }
    };
    reader.readAsDataURL(file);
  }
}

/* =======================
   EXPORT FUNCTIONS
======================= */

// Export functions for use in other scripts
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    showToast,
    validateEmail,
    validatePassword,
    formatDate,
    formatCurrency,
    copyToClipboard,
    debounce,
    throttle,
    downloadFile,
    formatNumber,
    formatPercentage,
    getBusinessDays,
    saveToLocalStorage,
    getFromLocalStorage,
    removeFromLocalStorage
  };
}
