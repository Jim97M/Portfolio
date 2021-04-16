/*--------Navigation Menu-----------*/
//Immediately Invoked Arrow Function
(() => {
    const hamburgurBtn = document.querySelector(".hamburgur-btn"),
    navMenu = document.querySelector(".nav-menu"),
    closeBtn = navMenu.querySelector(".close-nav-menu");

    hamburgurBtn.addEventListener("click", function() {
      navMenu.classList.toggle("open");
    });

})();


/*-------About Section Tabs ---------*/
(() =>{
   const aboutSection = document.querySelector(".about-section"),
   tabsContainer = document.querySelector(".about-tabs");

   tabsContainer.addEventListener("click", (event) => {
       /*  If event.target contains 'tab-item' class
            and not contains 'active' class 
       */
       if(event.target.classList.contains("tab-item") &&
           !event.target.classList.contains("active")){
             const target = event.target.getAttribute("data-target");
              //Deactivate existing active 'tab-item'
              tabsContainer.querySelector(".active").classList.remove("outer-shadow", "active");
              //Activate new 'tab-item'
              event.target.classList.add("active", "outer-shadow");
              //Deactivate existing active 'tab-content'
              aboutSection.querySelector(".tab-content.active").classList.remove("active");
              //Activate new 'tab-content'
              aboutSection.querySelector(target).classList.add("active");
           }
   })
})();

/*--------------- portfolio filter and popup -------------*/

(() => {

   //Select All Elements That Are to be Handled For Filter 
      const filterContainer  = document.querySelector(".portfolio-filter"),
      portfolioItemsContainer = document.querySelector(".portfolio-items"),
      portfolioItems = document.querySelectorAll(".portfolio-item");

      console.log(portfolioItems)
     

      // popup = document.querySelector(".portfolio-popup"),
      // prevBtn = popup.querySelector(".pp-prev"),
      // nextBtn = POPUP.querySelector(".pp-next"),
      // closeBtn = popup.querySelector(".pp-close"),
      // projecDetailsContainer = popup.querySelector(".pp-details"),
      // projectDetailsBtn = popup.querySelector(".pp-project-details-btn");
      // let itemIndex, slideShow, screenShots;

      // //Filter Portfolio Items

      // filterContainer.addEventListener("click", (event) => {

      //       console.log(event.target);
         // if(event.target.classList.contains("filter-item") &&
         //   !event.target.classList.contains("active")){
         //      console.log("True");
         //   }else{
         //      console.log("False");
         //   }
      // });
      
})();



// (() =>{

//      //Select all elements that are to be handled by the filter 
//       const filterContainer  = document.querySelector(".portfolio-filter"),
//       portfolioItemsContainer = document.querySelector(".portfolio-items"),
//       portfolioItems = document.querySelectorAll(".portfolio-item"),
//       popup = document.querySelector(".portfolio-popup"),
//       prevBtn = popup.querySelector(".pp-prev"),
//       nextBtn = popup.querySelector(".pp-next"),
//       closeBtn = popup.querySelector(".pp-close"),
//       projecDetailsContainer = popup.querySelector(".pp-details"),
//       projectDetailsBtn = popup.querySelector(".pp-project-details-btn");
//       let itemIndex, slideShow, screenShots;


//       filterContainer.addEventListener("click", (event) => {
//                   if(event.target.classList.contains("filter-item") &&
//                     !event.target.classList.contains("active")){
                     
//                      //Deactivate Existing Active 'Filter-Item'
//                     filterContainer.querySelector(".active").classList.remove("outer-shadow", "active");

//                     //Activate New 'Filter Item'
//                     event.target.classList.add("active", "outer-shadow");
//                     const target =  event.target.getAttribute("data-target");
//                     portfolioItems.forEach((item) => {
//                        if(target === item.getAttribute("data-category")){
//                           item.classList.remove("hide");
//                           item.classList.add("show");
//                        }
//                        else{
//                           item.classList.remove("show");
//                           item.classList.add("hide");
//                        }
//                     })
//                   }
//                })

         
//   })();

  /*--------------Testimonial Slider ------------*/

  //Immediately Invoked function expression using arrow function
   // (() => {  const sliderContainer = document.querySelector(".testi-slider-container"),
   //   slides = sliderContainer.querySelectorAll(".testi-item");
   //   slideWidth = sliderContainer.offsetWidth,
   //   prevBtn = document.getElementById("prev"),
   //   nextBtn = document.getElementById("next");
   //   let slideIndex = 0;

   //    //Set Width Of All Slides
   //     slides.forEach((slide) => {
   //     slide.style.width = slideWidth + "px";
   //   })

   // //   //Set width of sliderContainer
   //    sliderContainer.style.width = slideWidth * slides.length + "px";


   // //    //Slider Function For The Next Button
   //    nextBtn.addEventListener("click", () => {
   //       if(slideIndex === slides.length-1){
   //          slideIndex = 0;
   //       }
   //       else{
   //          slideIndex++;
   //       }
   //       // sliderContainer.style.marginLeft = - (slideWidth * slideIndex) + "px";
   //       console.log(slideIndex++);
   //    })
     
   // })();

/*--------Hide All Section Except The Active------------*/
//Immediately Invoked Function Expression Using Arrow Function
(() => {
   //Query All Elements With ClassName Section
    const sections = document.querySelectorAll(".section");
    //ForEach Loop For Each Section 
    sections.forEach((section) => {
       //Identify Active Class And Toggle Through With If Statement
        if(!section.classList.contains("active")){
           //Hide Other Classes
           section.classList.add("hide");
        }
     })
})();

window.addEventListener("load", ()=>{
   //Get The Preloader Class
   document.querySelector(".preloader").classList.add("fade-out");
   setTimeout(() => {
      document.querySelector(".preloader").style.display = "none";
   },3000)
})
