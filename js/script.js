// ==========================================
// 공동 JS
// ==========================================

const depth1Lists = document.querySelectorAll(".depth1-list");
const depth2NavBg = document.querySelector(".depth2-nav-bg");

// hover 시 depth2-nav-bg 를 활성화할 메뉴 텍스트 목록
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
