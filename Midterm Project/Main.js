document.addEventListener('DOMContentLoaded', () => {
    function fetchData(){
        fetch("./BookManga.json")
        .then(response => response.json())
        .then() //function for displaying movies
    }

    /*
        Displaay some content from the json. 
        Title, cover, maybe author
    */
    function loadContent(){ //may need params
        //TODO
    }

    /*
    Displays more of the information on the item when hovering for 1 second.
    Thinking like a "zoom in" of sorts enlarges picture, shows tagline, length of content, 
    However, will make page go to original state when moving mouse
    */
   function hoverContent(){ //may need params
    //TODO
   }

   /*
   Will open this contents catalog over current page (NOT OPENING NEW TAB).
   This page will be stored in CatalogIndPages folder
   Individual Pages will showcase all information form json
   */
   function openCatalogPage(){ //may need params

   }

   /*
   Search functionality added to the search bar in the page.
   */
   function search(){

   }

   /*
    sort/filter the content so that the user can 
    see what they want towards the top/only
   */
   function sort(){

   }

   //Add more functions as needed








});