const burgerButton = document.querySelector('.header__burger');
const mobileMenuClose = document.querySelector('.mobile-menu__close');
const mobileMenuLinks = document.querySelectorAll('.mobile-menu__link');

burgerButton?.addEventListener('click', () => {
    document.body.classList.add('menu-open');
});

mobileMenuClose?.addEventListener('click', () => {
    document.body.classList.remove('menu-open');
});

mobileMenuLinks.forEach((link) => {
    link.addEventListener('click', () => {
        document.body.classList.remove('menu-open');
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const mobileMedia = window.matchMedia("(max-width: 767px)");

    /* Mobile menu */

    const burgerButton = document.querySelector(".header__burger");
    const closeButton = document.querySelector(".mobile-menu__close");
    const mobileMenuLinks = document.querySelectorAll(".mobile-menu__link");

    if (burgerButton) {
        burgerButton.addEventListener("click", () => {
            document.body.classList.add("menu-open");
        });
    }

    if (closeButton) {
        closeButton.addEventListener("click", () => {
            document.body.classList.remove("menu-open");
        });
    }

    mobileMenuLinks.forEach((link) => {
        link.addEventListener("click", () => {
            document.body.classList.remove("menu-open");
        });
    });

    /* Helpers */

    function formatNumber(number) {
        return String(number).padStart(2, "0");
    }

    function resetItems(items) {
        items.forEach((item) => {
            item.style.display = "";
            item.style.opacity = "";
            item.style.transform = "";
            item.style.transition = "";
            item.style.willChange = "";
        });
    }

    function buildPaginationSegments(section, totalPages) {
        const line = section.querySelector(".portfolio__pagination-line");

        if (!line) {
            return;
        }

        line.innerHTML = "";

        for (let i = 0; i < totalPages; i++) {
            const segment = document.createElement("span");
            segment.classList.add("portfolio__pagination-segment");
            line.appendChild(segment);
        }
    }

    function updatePagination(section, currentPage, totalPages) {
        const number = section.querySelector(".portfolio__pagination-number");
        const segments = section.querySelectorAll(".portfolio__pagination-segment");

        if (number) {
            number.textContent = `${formatNumber(currentPage)}/${formatNumber(totalPages)}`;
        }

        segments.forEach((segment, index) => {
            segment.classList.toggle(
                "portfolio__pagination-segment_active",
                index === currentPage - 1
            );
        });
    }

    /* Slider */

    function initSlider(options) {
        const {
            sectionSelector,
            itemSelector,
            prevSelector,
            nextSelector,
            itemsPerPageDesktop,
            disableOnMobile = true,
        } = options;

        const section = document.querySelector(sectionSelector);

        if (!section) {
            return;
        }

        const items = Array.from(section.querySelectorAll(itemSelector));
        const prevButton = section.querySelector(prevSelector);
        const nextButton = section.querySelector(nextSelector);

        if (!items.length || !prevButton || !nextButton) {
            return;
        }

        let currentPage = 0;
        let isAnimating = false;
        let lastTotalPages = 0;

        function getItemsPerPage() {
            return itemsPerPageDesktop;
        }

        function getTotalPages() {
            return Math.ceil(items.length / getItemsPerPage());
        }

        function getVisibleItems(pageIndex) {
            const itemsPerPage = getItemsPerPage();
            const start = pageIndex * itemsPerPage;
            const end = start + itemsPerPage;

            return items.slice(start, end);
        }

        function preparePagination() {
            const totalPages = getTotalPages();

            if (totalPages !== lastTotalPages) {
                buildPaginationSegments(section, totalPages);
                lastTotalPages = totalPages;
            }
        }

        function renderPage(pageIndex) {
            const totalPages = getTotalPages();

            preparePagination();

            if (disableOnMobile && mobileMedia.matches) {
                resetItems(items);
                updatePagination(section, 1, totalPages);
                return;
            }

            const visibleItems = getVisibleItems(pageIndex);

            items.forEach((item) => {
                item.style.display = "none";
                item.style.opacity = "0";
                item.style.transform = "translateX(0)";
                item.style.transition = "opacity 300ms ease, transform 300ms ease";
                item.style.willChange = "opacity, transform";
            });

            visibleItems.forEach((item) => {
                item.style.display = "";
                item.style.opacity = "1";
                item.style.transform = "translateX(0)";
            });

            updatePagination(section, pageIndex + 1, totalPages);
        }

        function animateToPage(nextPage, direction) {
            if (isAnimating) {
                return;
            }

            if (disableOnMobile && mobileMedia.matches) {
                return;
            }

            const totalPages = getTotalPages();

            if (totalPages <= 1) {
                return;
            }

            if (nextPage < 0) {
                nextPage = totalPages - 1;
            }

            if (nextPage >= totalPages) {
                nextPage = 0;
            }

            if (nextPage === currentPage) {
                return;
            }

            isAnimating = true;

            const currentItems = getVisibleItems(currentPage);
            const nextItems = getVisibleItems(nextPage);

            currentItems.forEach((item) => {
                item.style.transition = "opacity 300ms ease, transform 300ms ease";
                item.style.opacity = "0";
                item.style.transform = `translateX(${-40 * direction}px)`;
            });

            setTimeout(() => {
                items.forEach((item) => {
                    item.style.display = "none";
                    item.style.opacity = "0";
                    item.style.transform = `translateX(${40 * direction}px)`;
                    item.style.transition = "none";
                });

                nextItems.forEach((item) => {
                    item.style.display = "";
                });

                requestAnimationFrame(() => {
                    nextItems.forEach((item) => {
                        item.style.transition = "opacity 300ms ease, transform 300ms ease";
                        item.style.opacity = "1";
                        item.style.transform = "translateX(0)";
                    });
                });

                currentPage = nextPage;
                updatePagination(section, currentPage + 1, totalPages);

                setTimeout(() => {
                    isAnimating = false;
                }, 320);
            }, 300);
        }

        nextButton.addEventListener("click", () => {
            animateToPage(currentPage + 1, 1);
        });

        prevButton.addEventListener("click", () => {
            animateToPage(currentPage - 1, -1);
        });

        mobileMedia.addEventListener("change", () => {
            currentPage = 0;
            preparePagination();

            if (disableOnMobile && mobileMedia.matches) {
                resetItems(items);
                updatePagination(section, 1, getTotalPages());
            } else {
                renderPage(currentPage);
            }
        });

        preparePagination();
        renderPage(currentPage);
    }

    initSlider({
        sectionSelector: ".portfolio",
        itemSelector: ".portfolio__item",
        prevSelector: ".portfolio__arrow_prev",
        nextSelector: ".portfolio__arrow_next",
        itemsPerPageDesktop: 3,
        disableOnMobile: true,
    });

    initSlider({
        sectionSelector: ".partners",
        itemSelector: ".partners-card",
        prevSelector: ".portfolio__arrow_prev",
        nextSelector: ".portfolio__arrow_next",
        itemsPerPageDesktop: 1,
        disableOnMobile: true,
    });

    /* FAQ accordion */

    const faqItems = document.querySelectorAll(".faq__item");

    faqItems.forEach((item) => {
        const answer = item.querySelector(".faq__answer");

        if (!answer) {
            return;
        }

        answer.style.display = "block";
        answer.style.maxHeight = item.classList.contains("faq__item_active")
            ? `${answer.scrollHeight}px`
            : "0";
        answer.style.overflow = "hidden";
        answer.style.transition = "max-height 300ms ease, opacity 300ms ease";
        answer.style.opacity = item.classList.contains("faq__item_active") ? "1" : "0";
    });

    faqItems.forEach((item) => {
        const button = item.querySelector(".faq__button");
        const answer = item.querySelector(".faq__answer");
        const iconPath = item.querySelector(".faq__icon path");

        if (!button || !answer) {
            return;
        }

        button.addEventListener("click", () => {
            const isActive = item.classList.contains("faq__item_active");

            faqItems.forEach((faqItem) => {
                const faqAnswer = faqItem.querySelector(".faq__answer");
                const faqIconPath = faqItem.querySelector(".faq__icon path");

                faqItem.classList.remove("faq__item_active");

                if (faqAnswer) {
                    faqAnswer.style.maxHeight = "0";
                    faqAnswer.style.opacity = "0";
                }

                if (faqIconPath) {
                    faqIconPath.setAttribute("d", "M7 10L12 15L17 10");
                }
            });

            if (!isActive) {
                item.classList.add("faq__item_active");

                answer.style.maxHeight = `${answer.scrollHeight}px`;
                answer.style.opacity = "1";

                if (iconPath) {
                    iconPath.setAttribute("d", "M7 14L12 9L17 14");
                }
            }
        });
    });

    window.addEventListener("resize", () => {
        faqItems.forEach((item) => {
            const answer = item.querySelector(".faq__answer");

            if (!answer) {
                return;
            }

            if (item.classList.contains("faq__item_active")) {
                answer.style.maxHeight = `${answer.scrollHeight}px`;
            }
        });
    });
});