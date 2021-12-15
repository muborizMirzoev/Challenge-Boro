import {PaginationButton} from './js/pagination.js'

const cardsElement = document.querySelector('.cards');
const baseUlr = 'http://contest.elecard.ru/frontend_data/';

let cards = []

fetchCards('http://contest.elecard.ru/frontend_data/catalog.json');

async function fetchCards(url) {
   try {
      const response = await fetch(url);
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
         throw new TypeError("Ой, мы не получили JSON!");
      }
      cards = await response.json();
      renderCards(cards)
   } catch (error) {
      console.log(error);
   }
}

const paginationButtons = new PaginationButton(33, 10);
paginationButtons.render();
paginationButtons.onChange(e => {
   console.log('paginationButtons', e.target.value);
   cardsElement.innerHTML = ''
   renderCards(cards, e.target.value);
});

function renderCards(cards, page = 1) {
   const showCardsFrom = ((page - 1) * 20) + 1;
   const showCardsTo = page * 20;

   console.log(showCardsFrom, showCardsTo)

   for (let i = showCardsFrom; i < showCardsTo; i++) {
      const card = cards[i];
      const name = parseName(card.image);
      const size = formatBytes(card.filesize);
      const category = capitalize(card.category);
      const date = formatDate(card.timestamp);

      cardsElement.innerHTML += `
      <div class="cards__item card">
        <button type="button" class="card__close"><i class="fas fa-times"></i></button>
        <img class="card__img" src="${baseUlr + card.image}" alt="">
        <ul class="card__info cards-info">
          <li class="card-info__item"><span>Name:</span> <span class="card__info-category">${name}</span></li>
          <li class="card-info__item"><span>Category:</span> <span class="card__info-category">${category}</span></li>
          <li class="card-info__item"><span>Date:</span> <span class="card__info-date">${date}</span></li>
          <li class="card-info__item"><span>Size:</span> <span class="card__info-size">${size}</span></li>
        </ul>
      </div>`
   }
}

function parseName(str) {
   let array = str.split('/');
   let name = array[1].match(/[a-z]+/g);
   name.pop() // delete .jpg
   return name.map(capitalize).join(' ');
}

function formatBytes(bytes, decimals = 2) {
   if (bytes === 0) return '0 Bytes';

   const k = 1024;
   const dm = decimals < 0 ? 0 : decimals;
   const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

   const i = Math.floor(Math.log(bytes) / Math.log(k));

   return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function formatDate(timestamp) {
   const date = new Date(timestamp);

   const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
   const year = date.getFullYear();
   const month = months[date.getMonth()];
   const dateDay = date.getDate();
   return dateDay + ' ' + month + ' ' + year;
}

function capitalize(str) {
   return str[0].toUpperCase() + str.slice(1);
}
