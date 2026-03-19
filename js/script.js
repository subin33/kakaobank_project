// ========================================
// 공통 JS
// ========================================

// '소개', '투자정보' depth1-list hover 시 depth2-nav-bg fadeIn
const depth1Lists = document.querySelectorAll(".depth1-list");
const depth2NavBg = document.querySelector(".depth2-nav-bg");

// hover 시 depth2-nav-bg를 활성화할 메뉴 텍스트 목록
const activeMenuTexts = ["소개", "투자정보"];

depth1Lists.forEach((list) => {
  const linkText = list.querySelector(".depth1-link")?.textContent.trim();

  if (activeMenuTexts.includes(linkText)) {
    list.addEventListener("mouseenter", () => {
      depth2NavBg.classList.add("active");
    });

    list.addEventListener("mouseleave", () => {
      depth2NavBg.classList.remove("active");
    });
  }
});

const swiper = new Swiper(".section-2-content .swiper", {
  slidesPerView: "auto",
});

// ========================================
// section-2 스크롤 15% 도달 시 슬라이드 펼침 애니메이션
// ========================================
const section2 = document.querySelector(".section-2");
const swiperSlides = document.querySelectorAll(".section-2-content .swiper-slide");

function checkSection2Scroll() {
  if (!section2) return;

  const rect = section2.getBoundingClientRect();
  const sectionHeight = rect.height;
  const viewportHeight = window.innerHeight;

  // section-2의 상단이 뷰포트에 들어온 후, section-2 높이의 15% 지점이
  // 뷰포트 하단에 닿았는지 확인
  const scrolledIntoSection = viewportHeight - rect.top;
  const threshold = sectionHeight * 0.15;

  if (scrolledIntoSection >= threshold) {
    // 15% 이상 스크롤 → 슬라이드 펼침
    swiperSlides.forEach((slide) => {
      slide.classList.add("spread");
    });
  } else {
    // 15% 미만으로 돌아오면 → 다시 중앙으로 모임
    swiperSlides.forEach((slide) => {
      slide.classList.remove("spread");
    });
  }
}

// 스크롤 이벤트 (requestAnimationFrame으로 성능 최적화)
let ticking = false;
window.addEventListener("scroll", () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      checkSection2Scroll();
      ticking = false;
    });
    ticking = true;
  }
});

// 초기 로드 시에도 체크 (이미 스크롤된 상태일 수 있으므로)
checkSection2Scroll();
