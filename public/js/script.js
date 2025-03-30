
(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })()

  let curX = 0;
  const scrollFilters = document.querySelector(".scroll-filters");
  const rightBtn = document.querySelector("#right-btn");
  const leftBtn = document.querySelector("#left-btn");
  const cont = document.querySelector('.icon-filters');
  let mw = scrollFilters.scrollWidth-cont.clientWidth;
  
  function rightScroll() {
    curX = Math.max(curX-100,mw*-1);
   
      scrollFilters.style.transform = `translateX(${curX}px)`;
  }
  
  function leftScroll() {
    curX=Math.min(curX+100,0);
    
    scrollFilters.style.transform = `translateX(${curX}px)`;
  }
  
  rightBtn.addEventListener("click", rightScroll);
  leftBtn.addEventListener("click", leftScroll);



let categories = document.querySelectorAll('.filter');
let lastSelected = null; // Store the last selected category

for (let category of categories) {
  category.addEventListener('click', () => {
    let categoryName = category.children[1].innerText;

    fetch(`/listings/?category=${categoryName}`, { cache: "no-store" })
      .then(res => res.text()) // Convert response to text
      .then(html => {
        let parser = new DOMParser();
        let doc = parser.parseFromString(html, "text/html");

        let newContent = doc.querySelector(".listings-found");

        if (newContent) {
          document.querySelector(".listings-found").innerHTML = newContent.innerHTML;

          // Remove "active-category" from the previously selected category
          if (lastSelected) {
            lastSelected.classList.remove("active-category");
          }

          // Add "active-category" to the newly selected category
          category.children[1].classList.add("active-category");

          // Update lastSelected reference
          lastSelected = category.children[1];
        }
      })
      .catch(err => {
        console.error("Error fetching category data:", err);
      });
  });
}


let search = document.querySelector('#search-btn');
let searchBar=document.querySelector('#inner-search')
search.addEventListener('click',()=>{
  let text = searchBar.value;
  text=text.trim();
  fetch(`/listings/search/${text}`)
  .then(req=>req.text())
  .then(html => {
    let parser = new DOMParser();
    let doc = parser.parseFromString(html, "text/html");

    let newContent = doc.querySelector(".listings-found");

    if (newContent) {
      document.querySelector(".listings-found").innerHTML = newContent.innerHTML;
    }
  })
})