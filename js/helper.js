class Helper {
   constructor() {
      this.baseUlr = 'http://contest.elecard.ru/frontend_data/';
   }

   setToLocalStorage(key, value) {
      localStorage.setItem(key, JSON.stringify(value));
   }

   getFromLocalStorage(key) {
      return JSON.parse(localStorage.getItem(key)) || [];
   }

   parseName(str) {
      let array = str.split('/');
      let name = array[1].match(/[a-z]+/g);
      name.pop() // delete .jpg
      return name.map(this.capitalize).join(' ');
   }

   formatBytes(bytes, decimals = 2) {
      if (bytes === 0) return '0 Bytes';

      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

      const i = Math.floor(Math.log(bytes) / Math.log(k));

      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
   }

   formatDate(timestamp) {
      const date = new Date(timestamp);

      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const year = date.getFullYear();
      const month = months[date.getMonth()];
      const dateDay = date.getDate();
      return dateDay + ' ' + month + ' ' + year;
   }

   capitalize(str) {
      return str[0].toUpperCase() + str.slice(1);
   }
}

export default Helper
