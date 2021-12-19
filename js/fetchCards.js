export default class FetchData {
   constructor(url) {
      this.url = url;
      this.data = [];

   }

   async makeRequest(url) {
      try {
         const response = await fetch(url);
         const contentType = response.headers.get('content-type');
         if (!contentType || !contentType.includes('application/json')) {
            throw new TypeError("Ой, мы не получили JSON!");
         }
         return await response.json()
      } catch (error) {
         console.log(error);
      }
   }


   getCards() {
      return this.makeRequest(this.url).then(cards => this.data = cards)
   }


}
