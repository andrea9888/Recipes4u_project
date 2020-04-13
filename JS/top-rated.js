let topRated = document.querySelector(".top-rated")


var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");


var params = {q:"pasta", app_id:"b72cbd9b",  app_key:"2d0049237f953e0bf3e8bf2db35d0661", from:1};

var requestOptions = {
  method: 'GET',
  mode: 'cors',
  headers: myHeaders,
  redirect: 'follow'
};
var url = new URL("https://api.edamam.com/search");
url.search = new URLSearchParams(params).toString();
fetch(url, requestOptions)
  .then(response => response.json())
  .then(result => {
    fillTopRatedContainer(result);
   
  })
  .catch(error => console.log('error', error));


function fillTopRatedContainer(result){
  let obj = result;
  if (window.screen.width < 1200){
    showBasedOnScreen(obj, 1);
  }
  else if (window.screen.width > 1200){
    showBasedOnScreen(obj, 3);
  }
}

function showBasedOnScreen(obj, count){
    rowCount = 0;
    showRecipeRow(obj, count)
    showRecipeRow(obj, count)
    var load = document.querySelector(".load-more");
    load.onclick = () => showRecipeRow(obj, count);
}

let rowCount;

function showRecipeRow(result, count){
  try{
    if (topRated.hasChildNodes()){
      for(let i=0;i<topRated.childElementCount;i++){
        if (topRated.children[i].innerText === 'Load more'){
          topRated.removeChild(topRated.childNodes[i]);
        }
      }

    }
    row = document.createElement("div");
    row.className = "top-row";
    for (let i=rowCount; i<rowCount+count; i++){
      let newItem = document.createElement("div");
      newItem.className = "top-product";
      let image = document.createElement("img");
      image.src = result['hits'][i]['recipe']['image'];
      image.className = "top-images";

      let text = document.createElement("div");
      text.className = "top-text";
      let name = document.createElement("h3");
      name.innerText = result['hits'][i]['recipe']['label']
      let ingr = document.createElement("p");
      ingr.innerText = "Ingredients: " + "\n" + result['hits'][i]['recipe']['ingredientLines'].join('\n').slice(0,100) + "\n ..." ;
      let health = document.createElement("p");
      health.innerText = "Health Labels: " + result['hits'][i]['recipe']['healthLabels'].join(', ');
    
      text.appendChild(name);
      text.appendChild(ingr);
      text.appendChild(health);

      newItem.appendChild(image);
      newItem.appendChild(text);
      
      row.appendChild(newItem);
      if (count === 1){
        row.style.display = "flex";
      }
    }

    let loadMore = document.createElement("button");
    loadMore.innerText = "Load more";
    loadMore.className = "load-more";

    topRated.appendChild(row);
    topRated.appendChild(loadMore);
    load = document.querySelector(".load-more");
    load.onclick = () => showRecipeRow(result, count);
    rowCount+=count;
  }
  catch(error){
    console.log("No more recipes");
  }
}