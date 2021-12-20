let navToggle = document.querySelector(".nav__toggle");
let navWrapper = document.querySelector(".nav__wrapper");

navToggle.addEventListener("click", function () {
   if (navWrapper.classList.contains("active")) {
      this.setAttribute("aria-expanded", "false");
      this.setAttribute("aria-label", "menu");
      navWrapper.classList.remove("active");
   } else {
      navWrapper.classList.add("active");
      this.setAttribute("aria-label", "close menu");
      this.setAttribute("aria-expanded", "true");
      searchForm.classList.remove("active");
      searchToggle.classList.remove("active");
   }
});

let searchToggle = document.querySelector(".search__toggle");
let searchForm = document.querySelector(".search__form");

searchToggle.addEventListener("click", showSearch);

function showSearch() {
   searchForm.classList.toggle("active");
   searchToggle.classList.toggle("active");

   navToggle.setAttribute("aria-expanded", "false");
   navToggle.setAttribute("aria-label", "menu");
   navWrapper.classList.remove("active");

   if (searchToggle.classList.contains("active")) {
      searchToggle.setAttribute("aria-label", "Close search");
   } else {
      searchToggle.setAttribute("aria-label", "Open search");
   }
}
