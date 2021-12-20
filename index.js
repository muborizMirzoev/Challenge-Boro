import Filter from "./js/filter.js";

const popupContainerElement = document.querySelector('.popup__container');
const resetButtonElement = document.querySelector('.reset-button');
const cardsTypeVoteElement = document.querySelector('.cards-type__vote');
const sortVoteElement = document.querySelector('.sort__vote');
const searchFormElement = document.querySelector('.search__form');

const filter = new Filter({cardsTypeVoteElement, sortVoteElement, resetButtonElement, searchFormElement});


document.body.addEventListener('click', (event) => {
   if (event.target.closest('.popup__close') || event.target.classList.contains('popup__container')) {
      popupContainerElement.classList.add('hidden');
   }
})

