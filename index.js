import Filter from "./assets/js/filter.js";
import Preloader from "./assets/js/loader.js";

const popupContainerElement = document.querySelector('.popup__container');
const resetButtonElement = document.querySelector('.reset-button');
const cardsTypeVoteElement = document.querySelector('.cards-type__vote');
const sortVoteElement = document.querySelector('.sort__vote');
const searchFormElement = document.querySelector('.search__form');

const filter = new Filter({cardsTypeVoteElement, sortVoteElement, resetButtonElement, searchFormElement});

const initPreloaderOptions = {
   timeout: 700,
   closeDuration: 500,
   template: `
        <div class="loader">
            <div class="loader__item" style="animation-delay: 0s"></div>
            <div class="loader__item" style="animation-delay: .5s"></div>
            <div class="loader__item" style="animation-delay: 1s"></div>
        </div>
    `
};

init(new Preloader(initPreloaderOptions));

function init(preloader) {
   preloader.open();
   const {timeout} = preloader.options;
   setTimeout(() => {
      preloader.close()
   }, timeout);
}


document.body.addEventListener('click', (event) => {
   if (event.target.closest('.popup__close') || event.target.classList.contains('popup__container')) {
      popupContainerElement.classList.add('hidden');
   }
})

