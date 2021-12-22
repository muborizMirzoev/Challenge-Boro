class FetchCards {
   constructor() {
      this.cards = [];
   }

   async makeRequest(url) {
      try {
         const response = await fetch(url);
         const contentType = response.headers.get('content-type');
         if (!contentType || !contentType.includes('application/json')) {
            throw new TypeError("Ой, мы не получили JSON!");
         }
         this.cards = await response.json();
         return this.cards;
      } catch (error) {
         console.error(error);
      }
   }
}

export default FetchCards;

