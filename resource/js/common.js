// 두 개의 fetch 요청 완료 여부를 추적할 플래그 선언
let isHeaderLoaded = false;
let isFooterLoaded = false;




function getIncludePath(fileName = 'header.html') {
    // URL에 'yongin_archive'가 포함되어 있으면 "서버"
    const isLocal = !window.location.href.includes('yongin_archive');

    // 로컬이면 루트 '/', 서버면 '/yongin_archive/'
    const projectRoot = isLocal ? '/' : '/yongin_archive/';

    return projectRoot + 'include/' + fileName;
}

// header 불러오기
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




    })
    .catch(err => console.error(err));








// 헤더 관련
function initHeader() {
    const header = document.querySelector('.header');
    const depth1Items = document.querySelectorAll('.depth_1 > li');
    const naviBg = document.querySelector('.navi-bg');
    let isHovering = false;

    // li 안의 실제 '시각적 끝(bottom)' 좌표 계산
    function getDeepestBottom(li) {
        const headerRect = header.getBoundingClientRect();
        let maxBottom = headerRect.bottom;

        // li 안의 모든 depth_2, depth_3 탐색
        const allDepths = li.querySelectorAll('.depth_2, .depth_3');
        allDepths.forEach(depth => {
            const rect = depth.getBoundingClientRect();
            const style = window.getComputedStyle(depth);

            // 마지막 자식 margin-bottom 포함
            const lastChild = depth.lastElementChild;
            let marginBottom = 0;
            if (lastChild) {
                const lastChildStyle = window.getComputedStyle(lastChild);
                marginBottom = parseFloat(lastChildStyle.marginBottom) || 0;
            }

            const totalBottom = rect.bottom + marginBottom;
            if (totalBottom > maxBottom) maxBottom = totalBottom;
        });

        // li 자체의 padding-bottom도 포함
        const liStyle = window.getComputedStyle(li);
        const paddingBottom = parseFloat(liStyle.paddingBottom) || 0;
        const borderBottom = parseFloat(liStyle.borderBottomWidth) || 0;
        maxBottom += paddingBottom + borderBottom;

        return maxBottom;
    }

    // navi-bg 높이 갱신
    function updateNaviBgHeight(li) {
        const headerRect = header.getBoundingClientRect();
        const deepestBottom = getDeepestBottom(li);
        const totalHeight = deepestBottom - headerRect.top;

        if (totalHeight > 0) {
            naviBg.style.height = `${totalHeight}px`;
        } else {
            naviBg.style.height = '';
        }
    }

    // hover 이벤트
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
                    naviBg.style.height = '';
                }
            }, 100);
        });
    });

    // navi-bg hover 유지
    naviBg.addEventListener('mouseenter', () => {
        isHovering = true;
    });
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

    // 새로고침 시 hover 복원
    window.addEventListener('load', () => {
        const hovered = document.querySelector('.depth_1 > li:hover');
        if (hovered) {
            hovered.classList.add('active');
            header.classList.add('active');
            updateNaviBgHeight(hovered);
        }
    });


    var ele = $(".sub_header img,.sub_footer img")
    var link = $(".sub_header a,.sub_footer a")
    ele.each((i, v) => {
        $(v).attr("src", $(v).attr("src").replace("././", "../../"));
    })
    link.each((i, v) => {
        $(v).attr("href", $(v).attr("href").replace("././", "../../"));
    })




}
// footer fetch
fetch(getIncludePath('footer.html'))
    .then(response => response.text())
    .then(data => {
        document.querySelector(".footer").innerHTML = data;
        isFooterLoaded = true; // footer 로드 완료 표시
        initFooter();
    });
// 푸터 관련
function initFooter() {
    var ele = $(".sub_footer img")
    var link = $(".sub_footer a")
    ele.each((i, v) => {
        $(v).attr("src", $(v).attr("src").replace("././", "../../"));
    })
    link.each((i, v) => {
        $(v).attr("href", $(v).attr("href").replace("././", "../../"));
    })
}
$(document).ready(function () {
    simpleBar();
    sideMenu();
    swiperBox();
    tabMenu();
    accordion();
    customSelect();
    searchSection();
});

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
    const tabItems = document.querySelectorAll('.tab__item');
    const tabContents = document.querySelectorAll('.tab__content');

    tabItems.forEach(item => {
        item.addEventListener('click', () => {
            const target = item.getAttribute('data-tab');

            // 모든 탭 초기화
            tabItems.forEach(i => i.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // 클릭된 탭만 활성화
            item.classList.add('active');
            document.getElementById(target).classList.add('active');
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

        // 페이지 로드 시 옵션 숨기기
        selects.forEach(select => {
            const items = select.querySelector('.select-items');
            if (items) items.classList.add('select-hide');
        });

        selects.forEach(select => {
            const selected = select.querySelector('.select-selected');
            const items = select.querySelector('.select-items');
            if (!selected || !items) return;

            // 클릭 시 toggle (독립적)
            selected.addEventListener('click', e => {
                e.stopPropagation(); // 이벤트 버블링 방지
                items.classList.toggle('select-hide');
                selected.classList.toggle('active');
            });

            // 옵션 선택
            items.querySelectorAll('div').forEach(option => {
                option.addEventListener('click', e => {
                    selected.textContent = option.textContent;
                    selected.dataset.value = option.dataset.value || option.textContent;
                    items.classList.add('select-hide');
                    selected.classList.remove('active');

                    // 선택 후 콜백 (필요시)
                    if (typeof updateSelectedTag === 'function') {
                        updateSelectedTag(selected);
                    }
                });
            });
        });

        // 바깥 클릭 이벤트 제거: 더 이상 클릭 시 모든 select 닫히지 않음
        // document.addEventListener('click', ...) 제거
    }

    // 그룹 초기화
    initCustomSelect('.bread-sel.custom-select');
    initCustomSelect('.custom-select:not(.bread-sel)');


}

function searchSection() {



    const filterButtons = document.querySelectorAll('.filter-btn');
    const selectedContainer = document.querySelector('.selected-filter__items');
    const resetBtn = document.querySelector('.reset-btn');

    // 선택된 값 저장
    let selectedFilters = [];

    // 1️⃣ 필터 버튼 클릭
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const value = btn.dataset.value; // 반드시 data-value 속성 사용

            if (!value) return; // 안전 장치

            if (btn.classList.contains('active')) {
                btn.classList.remove('active');
                removeFilterTag(value);
            } else {
                btn.classList.add('active');
                addFilterTag(value);
            }
        });
    });

    // 2️⃣ 태그 추가
    function addFilterTag(value) {
        if (!selectedFilters.includes(value)) {
            selectedFilters.push(value);
            renderTags();
        }
    }

    // 3️⃣ 태그 제거
    function removeFilterTag(value) {
        selectedFilters = selectedFilters.filter(item => item !== value);

        // 버튼 active 제거
        const btn = document.querySelector(`.filter-btn[data-value="${value}"]`);
        if (btn) btn.classList.remove('active');

        renderTags();
    }

    // 4️⃣ selected-tag 렌더링
    function renderTags() {
        selectedContainer.innerHTML = '';

        selectedFilters.forEach(value => {
            const tag = document.createElement('span');
            tag.className = 'selected-tag';
            // 안전하게 value 넣기
            tag.innerHTML = `${value} <button class="tag-remove" data-value="${value}"></button>`;
            selectedContainer.appendChild(tag);
        });
    }

    // 5️⃣ 태그 X 버튼 클릭
    selectedContainer.addEventListener('click', e => {
        const target = e.target;
        if (target.classList.contains('tag-remove')) {
            const value = target.dataset.value;
            if (!value) return; // 안전 장치
            removeFilterTag(value);
        }
    });

    // 6️⃣ 초기화 버튼
    resetBtn.addEventListener('click', () => {
        selectedFilters = [];
        document.querySelectorAll('.filter-btn.active').forEach(btn => btn.classList.remove('active'));
        renderTags();
    });



    //////////////////////////
    const filterToggleBtn = document.querySelector('.filter-toggle-btn');
    const filterPanel = document.querySelector('.filter-panel');

    filterToggleBtn.addEventListener('click', () => {
        filterPanel.classList.toggle('is-hidden');
    });

}