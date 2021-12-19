import {PaginationButton} from './js/pagination.js'

const cardsElement = document.querySelector('.cards');
const resetButton = document.querySelector('.reset-button');
const cardsTypeVoteElement = document.querySelector('.cards-type__vote');
const sortVoteElement = document.querySelector('.sort__vote');
const treeElement = document.querySelector('.tree');
const popupContainerElement = document.querySelector('.popup__container');
const popupElement = document.querySelector('.popup');


const baseUlr = 'http://contest.elecard.ru/frontend_data/';

let cards = [];
let currentCardsType;
let currentPage;

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
   renderCards(cards, currentPage, currentCardsType)
}

const paginationButtons = new PaginationButton(33, 10);
paginationButtons.render();
paginationButtons.onChange(event => {
   cardsElement.innerHTML = '';
   treeElement.innerHTML = '';
   currentPage = event.target.value;
   renderCards(cards, event.target.value, currentCardsType);
});

function renderCards(cards, page = 1, cardsType = 'card') {
   const showCardsFrom = ((page - 1) * 20);
   const showCardsTo = page * 20 - 1;

   cardsElement.innerHTML = '';
   treeElement.innerHTML = '';
   for (let i = showCardsFrom; i <= showCardsTo; i++) {
      const card = cards[i];
      const name = parseName(card.image);
      const size = formatBytes(card.filesize);
      const category = capitalize(card.category);
      const date = formatDate(card.timestamp);

      const deleteCards = getFromLocalStorage('deleteCards');
      if (deleteCards.includes(String(card.timestamp))) continue

      if (cardsType === 'card') {
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
      } else if (cardsType === 'tree-list') {
         treeElement.innerHTML += `
            <li class="tree-item">
            <p class="trigger"><span class="caret">${name}</span></p>
            <ul class="tree-parent">
              <li class="tree-item">
                <div class="tree-item__flex">
                  <span>PHOTO:</span>
                  <img class="tree-item__popup" src="${baseUlr + card.image}" alt="${name}" width="70px" height="50px">
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

function reset() {
   localStorage.clear();
   renderCards(cards);
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

function cardsChangeTypeHandler(event) {
   const type = event.target.value;
   currentCardsType = type;
   renderCards(cards, currentPage, type);
}

function changeSortType(event) {
   const type = event.target.value;
   sortCards(type);
}

function treeElementClickHandler(event) {
   const triggerElement = event.target.closest('.trigger');
   const treeItemPopupElement = event.target.closest('.tree-item__popup');

   if (triggerElement) {
      triggerElement.nextElementSibling.classList.toggle('open');
      triggerElement.firstElementChild.classList.toggle('caret-down');
   }

   if (treeItemPopupElement) {
      popupContainerElement.classList.remove('hidden');
      popupElement.innerHTML = `
      <button type="button" class="popup__close"><i class="fas fa-times"></i></button>
      <img src="${treeItemPopupElement.src}" alt="${treeItemPopupElement.alt}">`
   }
}


cardsElement.addEventListener('click', removeCards);
resetButton.addEventListener('click', reset);
cardsTypeVoteElement.addEventListener('change', cardsChangeTypeHandler);
sortVoteElement.addEventListener('change', changeSortType);
treeElement.addEventListener('click', treeElementClickHandler);
document.addEventListener("DOMContentLoaded", changeSortType);


document.body.addEventListener('click', (event) => {
   if (event.target.closest('.popup__close') || event.target.classList.contains('popup__container')) {
      popupContainerElement.classList.add('hidden');
   }
})

