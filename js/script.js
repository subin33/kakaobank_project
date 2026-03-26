// ========================================
// 네비게이션 - depth1-list hover 시 depth2-nav-bg fadeIn/fadeOut
// ========================================
function initNavigation() {
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
}

// ========================================
// Swiper 초기화 - 여러 Swiper가 있어도 충돌하지 않도록 개별 인스턴스 관리
// ========================================
function initSwipers() {
  const swiperInstances = {};

  // section-2 Swiper
  const section2SwiperEl = document.querySelector(".section-2-content .swiper");

  if (section2SwiperEl) {
    swiperInstances.section2 = new Swiper(section2SwiperEl, {
      slidesPerView: "auto",
    });
  }

  // section-5 Swiper
  const section5SwiperEl = document.querySelector(".section-5__swiper-container");

  if (section5SwiperEl) {
    const section5PaginationEl = section5SwiperEl.querySelector(".progress-bar .swiper-pagination");

    swiperInstances.section5 = new Swiper(section5SwiperEl, {
      slidesPerView: 1,
      effect: "fade",
      fadeEffect: {
        crossFade: true,
      },
      observer: true,
      observeParents: true,
      resizeObserver: true,
      speed: 400,
      loop: true,
      allowTouchMove: false,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      pagination: {
        el: section5PaginationEl,
        clickable: true,
        type: "bullets",
        renderBullet: function (index, className) {
          return '<span class="' + className + '">' + "<i></i>" + "<b></b>" + "</span>";
        },
      },
      navigation: {
        nextEl: ".section-5-content .swiper-btn-next",
        prevEl: ".section-5-content .swiper-btn-prev",
      },
      on: {
        init: function () {
          // 슬라이드가 1개라면 pagination 숨김 처리
          const realSlideCount = section5SwiperEl.querySelectorAll(".swiper-slide:not(.swiper-slide-duplicate)").length;

          if (realSlideCount <= 1 && section5PaginationEl) {
            section5PaginationEl.style.display = "none";
          }
        },
        slideChange: function () {
          // 이전 슬라이드 bullet에 is-passed 클래스 추가
          const bullets = section5SwiperEl.querySelectorAll(".swiper-pagination-bullet");
          const realIndex = this.realIndex;

          bullets.forEach((bullet, index) => {
            if (index < realIndex) {
              bullet.classList.add("is-passed");
            } else {
              bullet.classList.remove("is-passed");
            }
          });

          // storyData를 활용하여 좌측 영역 콘텐츠 업데이트
          updateSection5Content(realIndex);
        },
      },
    });
  }

  // 필요 시 다른 Swiper 추가
  // if (document.querySelector(".another-swiper")) {
  //   swiperInstances.another = new Swiper(".another-swiper", { ... });
  // }

  return swiperInstances;
}

// ========================================
// section-2 스크롤 15% 도달 시 슬라이드 펼침 애니메이션
// ========================================
function initSection2ScrollAnimation() {
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
}

// ========================================
// section-5 좌측 영역 콘텐츠 업데이트 (storyData 활용)
// ========================================
function updateSection5Content(index) {
  if (typeof storyData === "undefined" || !storyData[index]) return;

  const data = storyData[index];
  const leftSlide = document.querySelector(".section-5-content .left-slide");

  if (!leftSlide) return;

  // 아이콘 이미지 업데이트
  const iconBox = leftSlide.querySelector(".icon-box i");
  if (iconBox) {
    iconBox.style.backgroundImage = `url('${data.icon}')`;
    iconBox.style.backgroundSize = "contain";
    iconBox.style.backgroundRepeat = "no-repeat";
    iconBox.style.display = "inline-block";
    iconBox.style.width = "30px";
    iconBox.style.height = "30px";
  }

  // 아이콘 타이틀 업데이트
  const iconTitle = leftSlide.querySelector(".icon-title");
  if (iconTitle) {
    iconTitle.textContent = data.iconTitle;
  }

  // 스토리 타이틀 업데이트
  const storyTitle = leftSlide.querySelector(".story-title");
  if (storyTitle) {
    storyTitle.textContent = data.secTitle;
  }

  // 스토리 설명 업데이트
  const storyDesc = leftSlide.querySelector(".story-desc");
  if (storyDesc) {
    storyDesc.textContent = data.secDesc;
  }

  // 링크 업데이트
  const linkBtn = leftSlide.querySelector(".link-btn");
  if (linkBtn) {
    linkBtn.href = data.link;
    linkBtn.setAttribute("aria-label", data.ariaLabel);
  }
}

// ========================================
// section-3 날짜 동적 반영
// ========================================
function initTodayDate() {
  const todayDateEl = document.getElementById("todayDate");
  const todayDayEl = document.getElementById("todayDay");

  function updateTodayDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayName = days[now.getDay()];

    if (todayDateEl) todayDateEl.textContent = `${year}.${month}.${day}`;
    if (todayDayEl) todayDayEl.textContent = dayName;
  }

  // 자정(00:00)에 날짜 자동 업데이트
  function scheduleNextDayUpdate() {
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const msUntilMidnight = tomorrow - now;

    setTimeout(() => {
      updateTodayDate();
      // 다음 자정에도 업데이트 예약
      scheduleNextDayUpdate();
    }, msUntilMidnight);
  }

  // 초기 실행
  updateTodayDate();
  scheduleNextDayUpdate();
}

// ========================================
// footer - Top 버튼 (페이지 상단으로 이동)
// ========================================
function initTopButton() {
  const btnTop = document.querySelector(".btn-top");

  if (btnTop) {
    btnTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }
}

// ========================================
// 초기화 실행
// ========================================
initNavigation();
updateSection5Content(0); // 초기 로드 시 첫 번째 데이터로 렌더링
initSwipers();
initSection2ScrollAnimation();
initTodayDate();
initTopButton();
