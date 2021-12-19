import Filter from "./js/filter.js";

const popupContainerElement = document.querySelector('.popup__container');

const filter = new Filter();

document.body.addEventListener('click', (event) => {
   if (event.target.closest('.popup__close') || event.target.classList.contains('popup__container')) {
      popupContainerElement.classList.add('hidden');
   }
})

