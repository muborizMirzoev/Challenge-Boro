class Preloader {
   constructor(options) {
      this.element = null;
      this.options = options;
   }


   make() {
      const element = document.createElement('div');
      element.classList.add('preloader-panel');
      element.innerHTML = this.options.template;
      return element;
   }

   open = function () {
      this.element = this.make.bind(this).call();
      document.body.style = "overflow: hidden";
      document.body.append(this.element);
      return this;
   }

   close = function () {
      const {closeDuration} = this.options;
      return this.element.animate([
         {opacity: 1},
         {opacity: 0},
      ], {duration: closeDuration, fill: 'forwards'})
         .finished.then(_ => {
            document.body.style = "overflow: auto";
            this.element.remove();
         });
   }
}

export default Preloader;
