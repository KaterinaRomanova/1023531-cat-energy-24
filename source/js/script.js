const nav = document.querySelector('.navigation');
const navToggle = document.querySelector('.navigation__toggle');
nav.classList.remove("navigation--nojs");
nav.classList.add("navigation--closed");
navToggle.addEventListener('click', function(){
  if(nav.classList.contains('navigation--closed')){
    nav.classList.remove('navigation--closed');
    nav.classList.add('navigation--opened');
  }else{
    nav.classList.remove('navigation--opened');
    nav.classList.add('navigation--closed');
  }
})
