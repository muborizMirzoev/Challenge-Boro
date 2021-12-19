import Helper from "./helper.js";

class AppType extends Helper {
   constructor(cardsElement, treeElement) {
      super()
      this.cardsElement = cardsElement;
      this.treeElement = treeElement;
      this.popupContainerElement = document.querySelector('.popup__container');
      this.popupElement = document.querySelector('.popup');

      this.cardsElement.addEventListener('click', this.cardRemoveHandler.bind(this));
      this.treeElement.addEventListener('click', this.treeElementClickHandler.bind(this));
   }

   render(cards, page = 1, cardsType = 'card') {
      const showCardsFrom = ((page - 1) * 20);
      const showCardsTo = page * 20 - 1;

      this.cardsElement.innerHTML = '';
      this.treeElement.innerHTML = '';
      for (let i = showCardsFrom; i <= showCardsTo; i++) {
         const card = cards[i];
         const name = this.parseName(card.image);
         const size = this.formatBytes(card.filesize);
         const category = this.capitalize(card.category);
         const date = this.formatDate(card.timestamp);

         const deleteCards = this.getFromLocalStorage('deleteCards');
         if (deleteCards.includes(String(card.timestamp))) continue

         if (cardsType === 'card') {
            this.cardsElement.innerHTML += `
         <div class="cards__item card">
           <button type="button" class="card__close" data-id="${card.timestamp}" ><i class="fas fa-times"></i></button>
           <img class="card__img" src="${this.baseUlr + card.image}" alt="${name}">
           <ul class="card__info cards-info">
             <li class="card-info__item"><span>Name:</span> <span class="card__info-category">${name}</span></li>
             <li class="card-info__item"><span>Category:</span> <span class="card__info-category">${category}</span></li>
             <li class="card-info__item"><span>Date:</span> <time class="card__info-date">${date}</time></li>
             <li class="card-info__item"><span>Size:</span> <span class="card__info-size">${size}</span></li>
           </ul>
         </div>`
         } else if (cardsType === 'tree-list') {
            this.treeElement.innerHTML += `
            <li class="tree-item">
            <p class="trigger"><span class="caret">${name}</span></p>
            <ul class="tree-parent">
              <li class="tree-item">
                <div class="tree-item__flex">
                  <span>PHOTO:</span>
                  <img class="tree-item__popup show-popup" src="${this.baseUlr + card.image}" alt="${name}" width="70px" height="50px">
                </div>
              </li>
              <li class="tree-item">
                <div class="tree-item__flex">
                  <span>CATEGORY:</span>
                  <span>${category}</span>
                </div>
              </li>
              <li class="tree-item">
                <div class="tree-item__flex">
                  <span>DATE:</span>
                  <time>${date}</time>
                </div>
              </li>
              <li class="tree-item">
                <div class="tree-item__flex">
                  <span>SIZE:</span>
                  <time>${size}</time>
                </div>
              </li>
            </ul>
          </li>
         `
         }
      }
   }

   cardRemoveHandler(event) {
      const closeButtonElement = event.target.closest('.card__close');
      const cardsItemElement = event.target.closest('.cards__item');

      const deleteCards = this.getFromLocalStorage('deleteCards');

      if (closeButtonElement) {
         cardsItemElement.classList.add('removed');
         cardsItemElement.addEventListener('animationend', () => {
            cardsItemElement.classList.add('hide')
         });

         const id = closeButtonElement.dataset.id;
         deleteCards.push(id);
         this.setToLocalStorage('deleteCards', deleteCards);

         setTimeout(() => {
            cardsItemElement.remove();
         }, 1000)
      }
   }

   treeElementClickHandler(event) {
      const triggerElement = event.target.closest('.trigger');
      const treeItemPopupElement = event.target.closest('.tree-item__popup');

      if (triggerElement) {
         triggerElement.nextElementSibling.classList.toggle('open');
         triggerElement.firstElementChild.classList.toggle('caret-down');
      }

      if (treeItemPopupElement) {
         this.popupContainerElement.classList.remove('hidden');
         this.popupElement.innerHTML = `
            <button type="button" class="popup__close"><i class="fas fa-times"></i></button>
            <img src="${treeItemPopupElement.src}" alt="${treeItemPopupElement.alt}">`
      }
   }
}

export default AppType
