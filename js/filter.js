import FetchCards from "./fetchCards.js";
import Helper from "./helper.js";
import AppType from "./appType.js";
import {PaginationButton} from "./pagination.js";

class Filter extends Helper {
   constructor() {
      super();
      this.cards = [];
      this.currentPage = 1;
      this.currentCardsType = 'card'

      this.paginationButtons = new PaginationButton(33, 10);
      this.appType = new AppType(document.querySelector('.cards'), document.querySelector('.tree'));
      this.resetButton = document.querySelector('.reset-button');
      this.cardsTypeVoteElement = document.querySelector('.cards-type__vote');
      this.sortVoteElement = document.querySelector('.sort__vote');


      this.paginationButtons.onChange(event => {
         this.appType.cardsElement.innerHTML = '';
         this.appType.treeElement.innerHTML = '';
         this.currentPage = event.target.value;
         this.appType.render(this.cards, event.target.value, this.currentCardsType);
      });

      this.resetButton.addEventListener('click', this.appResetHandler.bind(this));
      this.cardsTypeVoteElement.addEventListener('change', this.cardsChangeTypeHandler.bind(this));
      this.sortVoteElement.addEventListener('change', this.sortTypeChangeHandler.bind(this));

      this.paginationButtons.render();
      document.addEventListener("DOMContentLoaded", this.sortTypeChangeHandler.bind(this));
   }

   async sortCards(type = 'category') {
      try {
         this.cards = await new FetchCards().makeRequest(`${this.baseUlr}catalog.json`);
      } catch (error) {
         console.error(error)
      }

      switch (type) {
         case 'category':
            this.cards.sort();
            break;
         case 'date':
            this.cards.sort((a, b) => a.timestamp - b.timestamp)
            break;
         case 'size':
            this.cards.sort((a, b) => a.filesize - b.filesize)
            break;
         case 'name':
            this.cards.sort((a, b) => this.parseName(a.image) > this.parseName(b.image) ? 1 : -1);
            break;
      }
      this.appType.render(this.cards, this.currentPage, this.currentCardsType)
   }

   appResetHandler() {
      localStorage.clear();
      this.appType.render(this.cards);
   }

   sortTypeChangeHandler(event) {
      const type = event.target.value;
      this.sortCards(type);
   }

   cardsChangeTypeHandler(event) {
      const type = event.target.value;
      this.currentCardsType = type;
      this.appType.render(this.cards, this.currentPage, type);
   }


}

export default Filter
