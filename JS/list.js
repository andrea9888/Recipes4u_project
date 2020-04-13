var btnsList = document.getElementsByClassName("radio-btn");
var searchBy = document.getElementById("name");
const listType = localStorage.getItem("listType")
const obj = localStorage.getItem("response");
console.log(obj)
for(let i = 0; i < btnsList.length; i++){
    btnsList[i].addEventListener("click",(event) =>{
        searchBy = event.target.id;
    })
}




function updateTextInput(val) {
    document.getElementById("rangeValue").innerHTML = val; 
}

/*
<div class="one-response">
            <img src="../images/test.jpg" alt="blalba" class="api-response-img">
            <div class="api-response-text">
                <h3 class="recipe-name">Alabla-bla All</h3>
                <div class="recipe-ing">blabla, blabal, blaa, blabla, bla</div><a href="#" class="recipe-link">Recipe link</a>
                <div class="recipe-tags">Tags: aa, aa, aa, a</div>
            </div>
            <button class="btn fv-btn"></button>
        </div>
*/

/*

var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
var params = {q:"pasta", app_id:"b72cbd9b",  app_key:"2d0049237f953e0bf3e8bf2db35d0661", from:1, to:3};
var requestOptions = {
  method: 'GET',
  mode: 'cors',
  headers: myHeaders,
  redirect: 'follow'
};
var url = new URL("https://api.edamam.com/search");
url.search = new URLSearchParams(params).toString();
console.log(url['href'])
fetch(url['href'], requestOptions)
    .then(response => response)
    .then(result => localStorage.setItem("result",result))
    .catch(error => console.log('error', error));
*/