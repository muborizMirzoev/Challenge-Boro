import {PaginationButton} from './js/pagination.js'

const cardsElement = document.querySelector('.cards');
const resetButton = document.querySelector('.reset-button');
const sortVoteElement = document.querySelector('.sort__vote');

const baseUlr = 'http://contest.elecard.ru/frontend_data/';

let cards = [];

async function fetchCards(url) {
   try {
      const response = await fetch(url);
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
         throw new TypeError("Ой, мы не получили JSON!");
      }
      cards = await response.json();
      return cards;
   } catch (error) {
      console.log(error);
   }
}

// sortCards();

async function sortCards(type = 'category') {
   try {
      cards = await fetchCards(`${baseUlr}catalog.json`);
   } catch (error) {
      console.log(error)
   }

   switch (type) {
      case 'category':
         cards.sort();
         break;
      case 'date':
         cards.sort((a, b) => a.timestamp - b.timestamp)
         break;
      case 'size':
         cards.sort((a, b) => a.filesize - b.filesize)
         break;
      case 'name':
         cards.sort((a, b) => parseName(a.image) > parseName(b.image) ? 1 : -1);
         break;
   }
   renderCards(cards)
}


const paginationButtons = new PaginationButton(33, 10);
paginationButtons.render();
paginationButtons.onChange(e => {
   console.log('paginationButtons', e.target.value);
   cardsElement.innerHTML = '';
   renderCards(cards, e.target.value);
});

function renderCards(cards, page = 1) {
   const showCardsFrom = ((page - 1) * 20)
   const showCardsTo = page * 20 - 1;

   console.log(showCardsFrom, showCardsTo)

   cardsElement.innerHTML = '';
   for (let i = showCardsFrom; i <= showCardsTo; i++) {
      const card = cards[i];
      const name = parseName(card.image);
      const size = formatBytes(card.filesize);
      const category = capitalize(card.category);
      const date = formatDate(card.timestamp);

      const deleteCards = getFromLocalStorage('deleteCards');
      if (deleteCards.includes(String(card.timestamp))) continue

      cardsElement.innerHTML += `
      <div class="cards__item card">
        <button type="button" class="card__close" data-id="${card.timestamp}" ><i class="fas fa-times"></i></button>
        <img class="card__img" src="${baseUlr + card.image}" alt="${name}">
        <ul class="card__info cards-info">
          <li class="card-info__item"><span>Name:</span> <span class="card__info-category">${name}</span></li>
          <li class="card-info__item"><span>Category:</span> <span class="card__info-category">${category}</span></li>
          <li class="card-info__item"><span>Date:</span> <time class="card__info-date">${date}</time></li>
          <li class="card-info__item"><span>Size:</span> <span class="card__info-size">${size}</span></li>
        </ul>
      </div>`
   }
}

function reset() {
   localStorage.clear()
}

function removeCards(event) {
   const closeButtonElement = event.target.closest('.card__close');
   const cardsItemElement = event.target.closest('.cards__item');

   const deleteCards = getFromLocalStorage('deleteCards');

   if (closeButtonElement) {
      cardsItemElement.classList.add('removed');
      cardsItemElement.addEventListener('animationend', () => {
         cardsItemElement.classList.add('hide')
      });

      const id = closeButtonElement.dataset.id;
      deleteCards.push(id);
      setToLocalStorage('deleteCards', deleteCards);

      setTimeout(() => {
         cardsItemElement.remove();
      }, 1000)
   }
}

function setToLocalStorage(key, value) {
   localStorage.setItem(key, JSON.stringify(value));
}

function getFromLocalStorage(key) {
   return JSON.parse(localStorage.getItem(key)) || [];
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

function changeSortType(event) {
   const type = event.target.value;
   sortCards(type);
}

cardsElement.addEventListener('click', removeCards);
resetButton.addEventListener('click', reset);
sortVoteElement.addEventListener('change', changeSortType);

document.addEventListener("DOMContentLoaded", changeSortType);

document.querySelectorAll('.trigger').forEach(parent => {
   parent.addEventListener('click', (event) => {
      event.preventDefault()
      for (let sibling of event.currentTarget.parentNode.children) {
         sibling.classList.toggle('open');
         sibling.querySelector('.caret').classList.toggle('caret-down');
      }
   });
})

const popupContainerElement = document.querySelector('.popup__container');
const popupElement = document.querySelector('.popup');
const treeItemPopupElements = document.querySelectorAll('.tree-item__popup');

treeItemPopupElements.forEach(image => {
   image.addEventListener('click', () => {
      popupContainerElement.classList.remove('hidden');
      popupElement.innerHTML = `
      <button type="button" class="popup__close"><i class="fas fa-times"></i></button>
      <img src="http://contest.elecard.ru/frontend_data/animals/bee-5749361__480.jpg" alt="Parent">
   `
   });
})


document.body.addEventListener('click', (event) => {
   if (event.target.closest('.popup__close') || event.target.classList.contains('popup__container')) {
      popupContainerElement.classList.add('hidden');
   }
})

