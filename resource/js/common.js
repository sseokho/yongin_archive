/* include 관련 js(개발하실 때 지워주시면 됩니다.)*/
let isHeaderLoaded = false;
let isFooterLoaded = false;

function getIncludePath(fileName = 'header.html') {

    const isLocal = !window.location.href.includes('yongin_archive');
    const projectRoot = isLocal ? '/' : '/yongin_archive/';
    return projectRoot + 'include/' + fileName;
}

fetch(getIncludePath('header.html'))
    .then(res => {
        if (!res.ok) throw new Error('Header file not found');
        return res.text();
    })
    .then(data => {
        document.querySelector('.header').innerHTML = data;
        isHeaderLoaded = true;

        initHeader();
        sideMenu();

        var ele = $(".sub_header img,.sub_footer img")
        var link = $(".sub_header a,.sub_footer a")
        ele.each((i, v) => {
            $(v).attr("src", $(v).attr("src").replace("././", "../../"));
        })
        link.each((i, v) => {
            $(v).attr("href", $(v).attr("href").replace("././", "../../"));
        })
    })
    .catch(err => console.error(err));



fetch(getIncludePath('footer.html'))
    .then(response => response.text())
    .then(data => {
        document.querySelector(".footer").innerHTML = data;
        isFooterLoaded = true; // footer 로드 완료 표시
        var ele = $(".sub_footer img")
        var link = $(".sub_footer a")
        ele.each((i, v) => {
            $(v).attr("src", $(v).attr("src").replace("././", "../../"));
        })
        link.each((i, v) => {
            $(v).attr("href", $(v).attr("href").replace("././", "../../"));
        })
    });

/* //include 관련 js(개발하실 때 지워주시면 됩니다.)*/



$(document).ready(function () {
    initHeader();
    simpleBar();
    sideMenu();
    swiperBox();
    tabMenu();
    accordion();
    customSelect();
    searchSection();
    layerPopup();
});


function initHeader() {
   const header = document.querySelector('.header');
    const depth1Items = document.querySelectorAll('.depth_1 > li');
    const naviBg = document.querySelector('.navi-bg');
    let isHovering = false;

    // li 안의 실제 '시각적 끝(bottom)' 좌표 계산
    function getDeepestBottom(li) {
        const headerRect = header.getBoundingClientRect();
        let maxBottom = headerRect.bottom;

        const allDepths = li.querySelectorAll('.depth_2, .depth_3');
        allDepths.forEach(depth => {
            const rect = depth.getBoundingClientRect();
            const lastChild = depth.lastElementChild;
            let marginBottom = 0;
            if (lastChild) {
                const lastChildStyle = window.getComputedStyle(lastChild);
                marginBottom = parseFloat(lastChildStyle.marginBottom) || 0;
            }
            const totalBottom = rect.bottom + marginBottom;
            if (totalBottom > maxBottom) maxBottom = totalBottom;
        });

        const liStyle = window.getComputedStyle(li);
        maxBottom += parseFloat(liStyle.paddingBottom) || 0;
        maxBottom += parseFloat(liStyle.borderBottomWidth) || 0;

        return maxBottom;
    }

    // navi-bg 높이 갱신
    function updateNaviBgHeight(li) {
        if (!naviBg) return;
        const headerRect = header.getBoundingClientRect();
        const deepestBottom = getDeepestBottom(li);
        const totalHeight = deepestBottom - headerRect.top;
        naviBg.style.height = totalHeight > 0 ? `${totalHeight}px` : '';
    }

    // depth1 hover
    depth1Items.forEach(li => {
        li.addEventListener('mouseenter', () => {
            depth1Items.forEach(i => i.classList.remove('active'));
            li.classList.add('active');
            header.classList.add('active');
            updateNaviBgHeight(li);
            isHovering = true;
        });
        li.addEventListener('mouseleave', () => {
            isHovering = false;
            setTimeout(() => {
                if (!isHovering) {
                    li.classList.remove('active');
                    header.classList.remove('active');
                    if (naviBg) naviBg.style.height = '';
                }
            }, 100);
        });
    });

    // navi-bg hover 유지
    if (naviBg) {
        naviBg.addEventListener('mouseenter', () => { isHovering = true; });
        naviBg.addEventListener('mouseleave', () => {
            isHovering = false;
            setTimeout(() => {
                if (!isHovering) {
                    header.classList.remove('active');
                    depth1Items.forEach(li => li.classList.remove('active'));
                    naviBg.style.height = '';
                }
            }, 100);
        });
    }

    // 새로고침 시 hover 복원
    window.addEventListener('load', () => {
        const hovered = document.querySelector('.depth_1 > li:hover');
        if (hovered) {
            hovered.classList.add('active');
            header.classList.add('active');
            updateNaviBgHeight(hovered);
        }
    });
}

function simpleBar() {
    if (typeof SimpleBar !== 'undefined') { // SimpleBar가 정의되어 있을 때만 실행
        // 첫 번째 .x-scroll 요소들에 대해 SimpleBar 초기화
        document.querySelectorAll('.x-scroll').forEach(element => {
            new SimpleBar(element, {
                autoHide: false, // 스크롤바가 항상 보이도록 설정
                direction: 'ltr', // 스크롤 방향 설정 (왼쪽에서 오른쪽)
                scrollbarMinSize: 120, // 손잡이의 최소 크기를 120px로 설정
                scrollbarMaxSize: 120, // 손잡이의 최대 크기를 120px로 설정
            });
        });

        // 두 번째 .custom-select.sub:not(.checked) .options 요소들에 대해 SimpleBar 초기화
        document.querySelectorAll('.custom-select.sub:not(.checked) .options').forEach(element => {
            new SimpleBar(element, {
                autoHide: false, // 스크롤바가 항상 보이도록 설정
                direction: 'ltr', // 스크롤 방향 설정 (왼쪽에서 오른쪽)
                scrollbarMinSize: 120, // 손잡이의 최소 크기를 120px로 설정
                scrollbarMaxSize: 120, // 손잡이의 최대 크기를 120px로 설정
            });
        });
    } else {
        console.warn('SimpleBar is not defined. Please ensure that the SimpleBar library is loaded.');
    }


}

function sideMenu() {

    $('.sitemap').click(function () {
        $(this).addClass('is-click');
        if ($(this).hasClass('is-click')) {
            $('.side-menu').addClass('is-open');
            $('body').addClass("overflow-hidden");

        } else {
            $('.side-menu').removeClass('is-open');
            $('body').removeClass("overflow-hidden");
        }
    });
    $('.side-menu--close,.side-menu__bg').click(function () {
        $('.sitemap').removeClass('is-click');
        $(".side-menu").removeClass('is-open');
        $('body').removeClass("overflow-hidden");
    });
    $('.side-menu__depth02').hide();

    $('.side-menu__depth01:not(.no-dep)').click(function () {
        $(this).toggleClass('is-open');

        if ($(this).hasClass('is-open')) {
            $('.side-menu__depth01').not(this).removeClass("is-open")
            $('.side-menu__depth01').not(this).next().slideUp();

            $(this).next().slideDown();
        } else {
            $(this).next().slideUp();

        }

    });
}

function swiperBox() {


    var se2__rightSwiper = new Swiper('.se2__rightSwiper.swiper-container', {
        slidesPerView: "auto",
        spaceBetween: 50,
        loop: true,
        observer: true,
        observeParents: true,

        // ✅ 스크롤(드래그) 및 마우스 휠 이동 허용
        mousewheel: {
            forceToAxis: true, // 세로 스크롤 방지하고 가로로만 작동
            sensitivity: 1,
        },
        grabCursor: true, // 마우스 커서 손 모양으로 변경 (드래그 가능)

        // ✅ 스크롤바 추가 (선택)
        scrollbar: {
            el: ".se2__rightSwiper .swiper-scrollbar",
            draggable: true,
            hide: false,
        },

        navigation: {
            nextEl: ".se2__left .nav-button.next",
            prevEl: ".se2__left .nav-button.prev",
        },

        pagination: {
            el: '.se2__rightSwiper .swiper-pagination',
            clickable: true,
        },

        scrollbar: {
            el: '.se2__rightSwiper .swiper-scrollbar',
            draggable: true,
            hide: false,
        },


        breakpoints: {
            320: {
                loop: true,
                centeredSlides: true,
                slidesPerView: 1,
                spaceBetween: 10,
            },
            1024: {
                slidesPerView: "auto",
                spaceBetween: 24,
                centeredSlides: false,
            },
        },
    });


    var se4__rightSwiper = new Swiper('.se4__rightSwiper.swiper-container', {
        slidesPerView: "auto",
        spaceBetween: 50,
        loop: true,
        observer: true,
        observeParents: true,

        // ✅ 스크롤(드래그) 및 마우스 휠 이동 허용
        mousewheel: {
            forceToAxis: true, // 세로 스크롤 방지하고 가로로만 작동
            sensitivity: 1,
        },
        grabCursor: true, // 마우스 커서 손 모양으로 변경 (드래그 가능)

        // ✅ 스크롤바 추가 (선택)
        scrollbar: {
            el: ".se4__rightSwiper .swiper-scrollbar",
            draggable: true,
            hide: false,
        },

        navigation: {
            nextEl: ".se4__left .nav-button.next",
            prevEl: ".se4__left .nav-button.prev",
        },

        pagination: {
            el: '.se4 .btn_wrap .swiper-pagination',
            clickable: true,
            type: 'custom',
            renderCustom: function (swiper, current, total) {
                return '<span class="current">' + current + '</span> / ' + total;
            },
        },

        breakpoints: {
            320: {
                loop: true,
                centeredSlides: true,
                slidesPerView: 1,
                spaceBetween: 10,
            },
            1024: {
                slidesPerView: "auto",
                spaceBetween: 24,
                centeredSlides: false,
            },
        },
    });

    var se5__frontSwiper = new Swiper('.se5__frontSwiper.swiper-container', {
        slidesPerView: "auto",
        loop: false,
        freeMode: true,
        observer: true,
        observeParents: true,
        // ✅ 스크롤(드래그) 및 마우스 휠 이동 허용
        mousewheel: {
            forceToAxis: true, // 세로 스크롤 방지하고 가로로만 작동
            sensitivity: 1,
        },
        grabCursor: true, // 마우스 커서 손 모양으로 변경 (드래그 가능)

        // ✅ 스크롤바 추가 (선택)
        scrollbar: {
            el: ".se5__frontSwiper .swiper-scrollbar",
            draggable: true,
            hide: false,
        },


        breakpoints: {
            320: {
                slidesPerView: 1,
                spaceBetween: 10,
            },
            1024: {
                slidesPerView: "auto",
                spaceBetween: 0,

            },
        },
    });

    // ✅ 첫 번째 슬라이드에 active 추가
    const slides = document.querySelectorAll('.se5__frontSwiper .swiper-slide');
    if (slides.length > 0) {
        slides[0].classList.add('active');
    }

    // ✅ hover 시 active 토글 (하나만 유지)
    slides.forEach(slide => {
        slide.addEventListener('mouseenter', () => {
            slides.forEach(s => s.classList.remove('active'));
            slide.classList.add('active');
        });

        slide.addEventListener('mouseleave', () => {
            slide.classList.remove('active');

            // ✅ 다른 슬라이드가 hover 중이 아니라면 첫 번째 슬라이드에 active 복구
            const isAnyHovered = Array.from(slides).some(s =>
                s.matches(':hover')
            );
            if (!isAnyHovered && slides.length > 0) {
                slides[0].classList.add('active');
            }
        });
    });


}

function tabMenu() {
    document.querySelectorAll('.tab__item').forEach(item => {
        item.addEventListener('click', () => {
            const tabList = item.closest('.tab__list');
            if (!tabList) return;

            const groupId = tabList.dataset.tabGroup; // 탭 그룹 ID
            const targetId = item.dataset.tab;
            if (!targetId) return;

            // 같은 그룹의 탭 콘텐츠 찾기
            const tabContents = document.querySelector(`.tab__contents[data-tab-group="${groupId}"]`);
            if (!tabContents) return;

            const groupTabItems = tabList.querySelectorAll('.tab__item');
            const groupTabContents = tabContents.querySelectorAll('.tab__content');

            // 초기화
            groupTabItems.forEach(i => i.classList.remove('active'));
            groupTabContents.forEach(c => c.classList.remove('active'));

            // 활성화
            item.classList.add('active');
            const targetContent = tabContents.querySelector(`#${targetId}`);
            if (targetContent) targetContent.classList.add('active');
        });
    });


    function smoothScrollTo(targetElement, duration = 500) {
        const container = document.scrollingElement || document.documentElement;
        const start = container.scrollTop;
        const end = targetElement.getBoundingClientRect().top + start;
        const change = end - start;
        let currentTime = 0;
        const increment = 20;

        function animateScroll() {
            currentTime += increment;
            const val = easeInOutQuad(currentTime, start, change, duration);
            container.scrollTop = val;
            if (currentTime < duration) {
                requestAnimationFrame(animateScroll);
            }
        }

        animateScroll();
    }

    // 부드러운 스크롤 easing 함수
    function easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    // 탭 클릭 이벤트
    const allTabs = document.querySelectorAll('.tab__item[data-target]');

    allTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.dataset.target;
            if (!targetId) return;

            const targetGroup = document.getElementById(targetId);
            if (!targetGroup) return;

            const activeTab = targetGroup.querySelector('.tab__item.active');
            if (!activeTab) return;

            // JS로 직접 부드럽게 스크롤
            smoothScrollTo(activeTab, 500);
        });
    });





}

function accordion() {
    const accordionHeaders = document.querySelectorAll('.accordion__header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;

            // 이미 열려 있는 상태면 아무것도 하지 않음
            if (header.classList.contains('active')) return;

            // 모든 아코디언 닫기
            accordionHeaders.forEach(h => h.classList.remove('active'));
            document.querySelectorAll('.accordion__content').forEach(c => c.classList.remove('open'));

            // 클릭한 항목만 열기
            header.classList.add('active');
            content.classList.add('open');
        });
    });


}

function customSelect() {
function initCustomSelect(selector) {
    const selects = document.querySelectorAll(selector);

    // 1️⃣ 페이지 로드 시 옵션 숨기기
    selects.forEach(select => {
        const items = select.querySelector('.select-items');
        if (items) items.classList.add('select-hide');
    });

    selects.forEach(select => {
        const selected = select.querySelector('.select-selected');
        const items = select.querySelector('.select-items');
        if (!selected || !items) return;

        // 2️⃣ 클릭 시 toggle (독립적)
        selected.addEventListener('click', e => {
            e.stopPropagation();
            items.classList.toggle('select-hide');
            selected.classList.toggle('active');
        });

        // 3️⃣ 옵션 선택
        items.querySelectorAll('div').forEach(option => {
            option.addEventListener('click', e => {
                // innerHTML 그대로 가져오기 (span.count 포함, 중첩 가능)
                selected.innerHTML = option.innerHTML;
                selected.dataset.value = option.dataset.value || option.textContent;

                items.classList.add('select-hide');
                selected.classList.remove('active');

                // 선택 후 콜백
                if (typeof updateSelectedTag === 'function') {
                    updateSelectedTag(selected);
                }
            });
        });
    });

    // 4️⃣ 바깥 클릭 이벤트 제거: 더 이상 클릭 시 모든 select 닫히지 않음
}



    // 그룹 초기화
    initCustomSelect('.bread-sel.custom-select');
    initCustomSelect('.custom-select:not(.bread-sel)');


}

function searchSection() {


    document.querySelectorAll('.sch-section').forEach(section => {
        const filterButtons = section.querySelectorAll('.filter-btn');
        const selectedContainers = section.querySelectorAll('.selected-filter__items');
        const resetBtns = section.querySelectorAll('.reset-btn');
        const filterToggleBtn = section.querySelector('.filter-toggle-btn');
        const filterPanel = section.querySelector('.filter-panel');
        const filterOpenBtns = section.querySelectorAll('.filter-open');
        const filterPopup = section.querySelector('.filter-popup');

        let selectedFilters = [];

        // 1️⃣ 필터 버튼 클릭 → 태그 추가/제거
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const value = btn.dataset.value;
                if (!value) return;
                btn.classList.toggle('active');
                btn.classList.contains('active') ? addFilterTag(value) : removeFilterTag(value);
            });
        });

        function addFilterTag(value) {
            if (!selectedFilters.includes(value)) {
                selectedFilters.push(value);
                renderTags();
            }
        }

        function removeFilterTag(value) {
            selectedFilters = selectedFilters.filter(v => v !== value);
            filterButtons.forEach(btn => { if (btn.dataset.value === value) btn.classList.remove('active'); });
            renderTags();
        }

        function renderTags() {
            selectedContainers.forEach(container => {
                container.innerHTML = '';
                selectedFilters.forEach(value => {
                    const tag = document.createElement('span');
                    tag.className = 'selected-tag';
                    tag.innerHTML = `${value} <button class="tag-remove" data-value="${value}"></button>`;
                    container.appendChild(tag);
                });
            });
        }

        selectedContainers.forEach(container => {
            container.addEventListener('click', e => {
                if (e.target.classList.contains('tag-remove')) removeFilterTag(e.target.dataset.value);
            });
        });

        // 6️⃣ reset 버튼 클릭 → 초기화
        resetBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                selectedFilters = [];
                filterButtons.forEach(f => f.classList.remove('active'));
                renderTags();
            });
        });

        // 7️⃣ 패널 토글
        if (filterToggleBtn && filterPanel) {
            filterToggleBtn.addEventListener('click', () => {
                filterToggleBtn.classList.toggle('is-hidden');
                filterPanel.classList.toggle('is-hidden');
            });
        }

        // 🚀 8️⃣ filter-open 클릭 시 → 해당 탭 정확히 열기
        filterOpenBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (!filterPopup) return;
                filterPopup.classList.add('is-active');

                const targetTab = btn.dataset.openTab;  // ⭐ 클릭한 버튼의 data-open-tab 값
                const tabGroup = filterPopup.dataset.tabGroup;
                if (!tabGroup) return;

                const tabList = filterPopup.querySelector(`.tab__list[data-tab-group="${tabGroup}"]`);
                const tabContents = filterPopup.querySelector(`.tab__contents[data-tab-group="${tabGroup}"]`);
                if (!tabList || !tabContents) return;

                const tabItems = tabList.querySelectorAll('.tab__item');
                const contentItems = tabContents.querySelectorAll('.tab__content');

                // 기존 active 제거
                tabItems.forEach(t => t.classList.remove('active'));
                contentItems.forEach(c => c.classList.remove('active'));

                // ⭐ 버튼과 이름이 같은 탭 자동 활성화
                const activeTab = tabList.querySelector(`.tab__item[data-tab="${targetTab}"]`);
                const activeContent = tabContents.querySelector(`#${targetTab}`);

                if (activeTab) activeTab.classList.add('active');
                if (activeContent) activeContent.classList.add('active');

                // 🚀 탭 내부 클릭 기능도 유지
                tabItems.forEach(item => {
                    item.addEventListener('click', () => {
                        const targetId = item.dataset.tab;
                        tabItems.forEach(t => t.classList.remove('active'));
                        contentItems.forEach(c => c.classList.remove('active'));
                        item.classList.add('active');
                        const targetContent = tabContents.querySelector(`#${targetId}`);
                        if (targetContent) targetContent.classList.add('active');
                    });
                });
            });
        });

        // 9️⃣ 팝업 닫기
        const filterPopupBg = section.querySelector('.filter-popup-bg');
        const filterPopupClose = section.querySelector('.filter-popup-close');
        const closeFilterPopup = () => filterPopup?.classList.remove('is-active');

        if (filterPopupBg) filterPopupBg.addEventListener('click', closeFilterPopup);
        if (filterPopupClose) filterPopupClose.addEventListener('click', closeFilterPopup);
    });
}

function layerPopup(){
	// 모든 popup-open 버튼
    document.querySelectorAll('.popup-open').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.dataset.tab;
            if (!targetTab) return;

            const popup = document.querySelector(`.popup-overlay[data-tab="${targetTab}"]`);
            if (popup) popup.style.display = 'flex';
        });
    });

    // 모든 popup-close 버튼
    document.querySelectorAll('.popup-close, .popup-cancel').forEach(btn => {
        btn.addEventListener('click', () => {
            const parentPopup = btn.closest('.popup-overlay');
            if (parentPopup) parentPopup.style.display = 'none';
        });
    });

    // 오버레이 클릭 시 (팝업 바깥 영역)
    document.querySelectorAll('.popup-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.style.display = 'none';
        });
    });

}