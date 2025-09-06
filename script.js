// Function to apply the theme
const applyTheme = (theme) => {
  const body = document.body;
  const themeBtn = document.querySelector('#theme-btn');
  if (body) {
    body.dataset.theme = theme;
  }
  if (themeBtn) {
    themeBtn.innerHTML = theme === 'light' ? '&#x1F319;' : '&#x2600;';
  }
};

// Check for saved theme in localStorage
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  applyTheme(savedTheme);
} else {
  // Default to light theme if no theme is saved
  applyTheme('light');
}

// Theme toggle
const themeBtn = document.querySelector('#theme-btn');
if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    const body = document.body;
    const newTheme = body.dataset.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  });
}

// Category filter
// ส่วนนี้เป็นโค้ดเดิม
const categories = document.querySelectorAll('.category');
const comics = document.querySelectorAll('.comic');

categories.forEach(cat => {
  cat.addEventListener('click', () => {
    categories.forEach(c => c.classList.remove('active'));
    cat.classList.add('active');

    const selected = cat.dataset.category;
    comics.forEach(comic => {
      // Find the top-level container, which could be the comic itself or a parent link
      const container = comic.closest('.comic-link') || comic;

      if (selected === 'all' || comic.dataset.category === selected) {
        container.classList.remove('hidden');
      } else {
        container.classList.add('hidden');
      }
    });
  });
});

// Search functionality
const searchBar = document.getElementById('search-bar');
if (searchBar) {
  searchBar.addEventListener('keyup', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    
    categories.forEach(c => c.style.display = 'none');
    
    comics.forEach(comic => {
      const title = comic.querySelector('p').textContent.toLowerCase();
      if (title.includes(searchTerm)) {
        comic.style.display = 'block';
      } else {
        comic.style.display = 'none';
      }
    });

    if (searchTerm === '') {
      categories.forEach(c => c.style.display = 'flex');
      comics.forEach(c => c.style.display = 'block');
    }
  });
}

// Banner carousel
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;
const banner = document.querySelector('.banner'); 
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
let autoSlideInterval;

const showSlide = (index) => {
  slides.forEach((slide, i) => {
    slide.classList.remove('active');
    if (i === index) slide.classList.add('active');
  });
};

const nextSlide = () => {
  currentSlide = (currentSlide + 1) % totalSlides;
  showSlide(currentSlide);
};

const resetAutoSlide = () => {
  clearInterval(autoSlideInterval);
  autoSlideInterval = setInterval(nextSlide, 5000); // 5 seconds
};

if (prevBtn) {
  prevBtn.addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    showSlide(currentSlide);
    resetAutoSlide();
  });
}

if (nextBtn) {
  nextBtn.addEventListener('click', () => {
    nextSlide();
    resetAutoSlide();
  });
}

// Add swipe functionality
let startX = 0;
let endX = 0;

if (banner) {
  banner.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  });

  banner.addEventListener('touchend', () => {
    const swipeDistance = endX - startX;
    if (swipeDistance > 50) {
      currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
      showSlide(currentSlide);
      resetAutoSlide();
    } else if (swipeDistance < -50) {
      nextSlide();
      resetAutoSlide();
    }
  });
}

// Start auto-slide on page load
resetAutoSlide();
showSlide(currentSlide);

// Prevent double-tap zoom
document.addEventListener('dblclick', function(e) {
  e.preventDefault();
}, { passive: false });