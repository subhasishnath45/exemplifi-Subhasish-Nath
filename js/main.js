/**
 * Initializes the navbar toggle animation.
 *
 * Toggles the `.active` class on the first child of the
 * `.navbar-toggler` element when it is clicked.
 *
 */
function initNavbarToggle() {
  const navbarToggler = document.querySelector(".navbar-toggler");

  if (!navbarToggler) return;

  navbarToggler.addEventListener("click", function (e) {
    const firstChild = e.target.children[0];
    if (firstChild) {
      firstChild.classList.toggle("active");
    }
  });
}

/**
 * Initializes hover-based behavior for Bootstrap mega menus.
 *
 * This function enables dropdown menus to open on hover (instead of click)
 * for screen widths ≥ 992px, and restores default Bootstrap click behavior
 * on smaller screens. It also handles ARIA attributes for accessibility.
 *
 * - Adds/removes `.show` classes to simulate Bootstrap's dropdown behavior.
 * - Adjusts `data-bs-toggle` and `aria-expanded` attributes for accessibility.
 * - Rebinds event listeners on window resize to adapt to screen size changes.
 *
 * Requires:
 * - Bootstrap dropdown HTML structure with `.dropdown-mega`, `.dropdown-menu`,
 *   and `[data-bs-toggle="dropdown"]` elements.
 *
 * Usage:
 * Call this function once after DOM is ready.
 */
function initMegaMenuHover() {
  const megaMenus = document.querySelectorAll(".dropdown-mega");

  if (!megaMenus.length) return;

  function handleMouseEnter(menu) {
    menu.classList.add("show");
    const dropdownMenu = menu.querySelector(".dropdown-menu");
    if (dropdownMenu) {
      dropdownMenu.classList.add("show");
    }
    const toggle = menu.querySelector('[data-bs-toggle="dropdown"]');
    if (toggle) {
      toggle.setAttribute("aria-expanded", "true");
    }
  }

  function handleMouseLeave(menu) {
    menu.classList.remove("show");
    const dropdownMenu = menu.querySelector(".dropdown-menu");
    if (dropdownMenu) {
      dropdownMenu.classList.remove("show");
    }
    const toggle = menu.querySelector('[data-bs-toggle="dropdown"]');
    if (toggle) {
      toggle.setAttribute("aria-expanded", "false");
    }
  }

  function bindHoverEvents() {
    megaMenus.forEach((megaMenu) => {
      megaMenu.addEventListener("mouseenter", () => handleMouseEnter(megaMenu));
      megaMenu.addEventListener("mouseleave", () => handleMouseLeave(megaMenu));
    });
  }

  function unbindHoverEvents() {
    megaMenus.forEach((megaMenu) => {
      megaMenu.removeEventListener("mouseenter", () =>
        handleMouseEnter(megaMenu)
      );
      megaMenu.removeEventListener("mouseleave", () =>
        handleMouseLeave(megaMenu)
      );
      handleMouseLeave(megaMenu); // Close any open menu
    });
  }

  function init() {
    if (window.innerWidth >= 992) {
      // Disable Bootstrap's dropdown toggle behavior
      megaMenus.forEach((megaMenu) => {
        const toggle = megaMenu.querySelector('[data-bs-toggle="dropdown"]');
        if (toggle) {
          toggle.removeAttribute("data-bs-toggle");
        }
      });
      bindHoverEvents();
    } else {
      // Restore Bootstrap behavior for mobile
      megaMenus.forEach((megaMenu) => {
        const toggle = megaMenu.querySelector(".nav-link");
        if (toggle && !toggle.hasAttribute("data-bs-toggle")) {
          toggle.setAttribute("data-bs-toggle", "dropdown");
        }
      });
      unbindHoverEvents();
    }
  }

  init();
  window.addEventListener("resize", init);
}

/**
 * Toggles the floating search form on icon click.
 *
 * Switches the visibility of the search form and toggles
 * the search icon between a magnifier and a close icon.
 *
 */
function floatingSearch() {
  var $j = jQuery.noConflict();
  $j(function () {
    $j("#search__icon").click(function () {
      $j("#search__form").toggleClass("search__form-open");
      $j("i", this).toggleClass("fa fa-magnifying-glass fa fa-times");
    });
  });
}

/**
 * Initializes Font Awesome dropdown icons for Bootstrap dropdown menus on mobile viewports.
 *
 * This function:
 * - Dynamically appends a down arrow icon (`fa-chevron-down`) to each `.dropdown-toggle` if not already present.
 * - Toggles the icon between `fa-chevron-down` and `fa-chevron-up` based on the dropdown's visibility state.
 * - Listens for Bootstrap's `hide.bs.dropdown` event to reset the icon when the dropdown is closed.
 * - Only executes on screen widths less than 992px (Bootstrap's `lg` breakpoint), intended for mobile behavior.
 *
 */
function initDropdownIcons() {
  if (window.innerWidth < 992) {
    const dropdownToggles = document.querySelectorAll(".dropdown-toggle");

    dropdownToggles.forEach(function (toggle) {
      // Skip if icon already added
      if (!toggle.querySelector(".dropdown-icon")) {
        const icon = document.createElement("i");
        icon.classList.add("fa-solid", "fa-chevron-down", "dropdown-icon");
        icon.style.marginLeft = "0.5rem";
        toggle.appendChild(icon);
      }

      const icon = toggle.querySelector(".dropdown-icon");

      toggle.addEventListener("click", function () {
        // Delay to allow Bootstrap to toggle .show class
        setTimeout(function () {
          if (toggle.classList.contains("show")) {
            icon.classList.remove("fa-chevron-down");
            icon.classList.add("fa-chevron-up");
          } else {
            icon.classList.remove("fa-chevron-up");
            icon.classList.add("fa-chevron-down");
          }
        }, 10);
      });
    });

    // Sync icon state when dropdown hides (e.g., clicking outside)
    // Edge case handling
    document.addEventListener("hide.bs.dropdown", function (e) {
      const toggle = e.relatedTarget;
      const icon = toggle?.querySelector(".dropdown-icon");

      if (icon) {
        icon.classList.remove("fa-chevron-up");
        icon.classList.add("fa-chevron-down");
      }
    });
  }
}
/**
 * Wraps each `.dropdown-menu` element in a `.dropdown-menu__wrapper` div
 * and synchronizes the wrapper's visibility with the dropdown's state.
 *
 * Also assigns a unique class (`.dropdown-menu__wrapper-1`, `-2`, etc.) to each wrapper
 * and uses a MutationObserver to update the wrapper's `.show` class in real-time.
 */
function initDropdownWrapper() {
  const dropdownMenus = document.querySelectorAll(".dropdown-menu");
  dropdownMenus.forEach((menu) => {
    const wrapper = document.createElement("div");
    wrapper.className = "dropdown-menu__wrapper";
    menu.parentNode.insertBefore(wrapper, menu);
    wrapper.appendChild(menu);

    if (menu.classList.contains("show")) {
      wrapper.classList.add("show");
    }

    // Watch for changes to class attribute
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          if (menu.classList.contains("show")) {
            wrapper.classList.add("show");
          } else {
            wrapper.classList.remove("show");
          }
        }
      });
    });
    observer.observe(menu, { attributes: true });
  });

  const wrappers = document.querySelectorAll(".dropdown-menu__wrapper");
  wrappers.forEach((wrapper, index) => {
    wrapper.classList.add(`dropdown-menu__wrapper-${index + 1}`);
  });
}
/**
 * Adds or removes the 'sticky-top' class on the navbar based on screen width.
 * Applies 'sticky-top' when the viewport is less than 992px wide (mobile/tablet),
 * and removes it on larger screens (desktop).
 */
function initStickyNavbar() {
  const navbar = document.getElementById("mainNavbar");
  if (window.innerWidth < 992) {
    navbar.classList.add("sticky-top");
  } else {
    navbar.classList.remove("sticky-top");
  }
}

/**
 * Handles active state for navigation items based on user interaction.
 *
 * - On click: sets the clicked `.nav-item` as active, removing active from others.
 * - On hover: temporarily sets hovered `.nav-item` as active (removed on mouseleave).
 * - Observes `.dropdown-menu__wrapper` elements and removes `.active` from all `.nav-item`s
 *   when the dropdown wrapper loses the `show` class (i.e., dropdown closes).
 */
function toggleActiveNav() {
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.addEventListener("click", function () {
      document
        .querySelectorAll(".nav-item")
        .forEach((el) => el.classList.remove("active"));
      this.classList.add("active");
    });
  });

  document.querySelectorAll(".nav-item").forEach((item) => {
    item.addEventListener("mouseenter", function () {
      document
        .querySelectorAll(".nav-item")
        .forEach((el) => el.classList.remove("active"));
      this.classList.add("active");
    });

    item.addEventListener("mouseleave", function () {
      this.classList.remove("active");
    });
  });

  document.querySelectorAll(".dropdown-menu__wrapper").forEach((wrapper) => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          const isShown = wrapper.classList.contains("show");
          if (!isShown) {
            document.querySelectorAll(".nav-item.active").forEach((item) => {
              item.classList.remove("active");
            });
          }
        }
      });
    });

    observer.observe(wrapper, { attributes: true });
  });
}

// Call the functions once DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  initNavbarToggle();
  initMegaMenuHover();
  floatingSearch();
  initDropdownIcons();
  initDropdownWrapper();
  initStickyNavbar();
  toggleActiveNav();
});

window.addEventListener("resize", function () {
  initStickyNavbar();
});
