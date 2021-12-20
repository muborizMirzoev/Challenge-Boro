import FetchCards from "./fetchCards.js";
import Helper from "./helper.js";
import AppType from "./appType.js";
import {PaginationButton} from "./pagination.js";

class Filter extends Helper {
   constructor(options) {
      super();
      this.cards = [];
      this.currentPage = 1;
      this.currentCardsType = 'card'

      this.cardsTypeVoteElement = options.cardsTypeVoteElement;
      this.sortVoteElement = options.sortVoteElement;
      this.resetButtonElement = options.resetButtonElement;
      this.searchFormElement = options.searchFormElement;

      this.paginationButtons = new PaginationButton(33, 5);
      this.appType = new AppType(document.querySelector('.cards'), document.querySelector('.tree'));

      this.paginationButtons.onChange(event => {
         this.appType.cardsElement.innerHTML = '';
         this.appType.treeElement.innerHTML = '';
         this.currentPage = event.target.value;
         this.appType.render(this.cards, null, event.target.value, this.currentCardsType);
      });

      this.resetButtonElement.addEventListener('click', this.appResetHandler.bind(this));
      this.cardsTypeVoteElement.addEventListener('change', this.cardsChangeTypeHandler.bind(this));
      this.sortVoteElement.addEventListener('change', this.sortTypeChangeHandler.bind(this));
      this.searchFormElement.addEventListener('submit', this.cardsSearchHandler.bind(this));

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
      this.appType.render(this.cards, null, this.currentPage, this.currentCardsType)
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
      this.appType.render(this.cards, null, this.currentPage, type);
   }

   cardsSearchHandler(event) {
      event.preventDefault();
      const inputValue = this.searchFormElement.querySelector('.search__form-input').value;

      const searchResultCards = this.cards.filter(card => {
         const name = this.parseName(card.image);
         const regex = new RegExp(inputValue, 'gi');
         return regex.test(name);
      });

      console.log(searchResultCards)
      this.appType.render(searchResultCards, searchResultCards);

   }
}

export default Filter
