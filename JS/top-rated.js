let topRated = document.querySelector(".top-rated")


var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");


var params = {q:"pasta", app_id:"b72cbd9b",  app_key:"2d0049237f953e0bf3e8bf2db35d0661", from:1, to:20};

var requestOptions = {
  method: 'GET',
  mode: 'cors',
  headers: myHeaders,
  redirect: 'follow'
};
var url = new URL("https://api.edamam.com/search");
url.search = new URLSearchParams(params).toString();
console.log(url);
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
  let helpList = [];
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
    for (let i=0; i<result['hits'].length; i++){
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
      if (count === 1){
        ingr.innerText = "Ingredients: " + "\n" + result['hits'][i]['recipe']['ingredientLines'].join('\n').slice(0,100) + "\n ..." ;
      }
      else{
        ingr.innerText = "Ingredients: " + "\n" + result['hits'][i]['recipe']['ingredientLines'].join('\n').slice(0,40) + "\n ..." ;
      }
      let health = document.createElement("p");
      health.innerText = "Health Labels: " + result['hits'][i]['recipe']['healthLabels'].join(', ').slice(0,15) + "...";
    
      text.appendChild(name);
      text.appendChild(ingr);
      text.appendChild(health);

      newItem.appendChild(image);
      newItem.appendChild(text);
      
      helpList.push([newItem, result['hits'][i]['recipe']['calories']]);
      

      if (count === 1){
        row.style.display = "flex";
      }
      image.onclick = function (event){
        let recipe = event.target.parentNode;
        let modalWindow = document.createElement("div");
        modalWindow.className = "modal-window";
        modalWindow.innerHTML = "";
        for(let key in result['hits']){
          if(result['hits'][key]['recipe']['label'] === recipe.children[1].children[0].innerText){
            let nameModal = document.createElement("h2");
            nameModal.innerText = result['hits'][key]['recipe']['label'];
            nameModal.className = "name-modal";
            let imageModal = document.createElement("img");
            imageModal.src = result['hits'][key]['recipe']['image'];
            imageModal.className = "image-modal";
            let ingrModal = document.createElement("p");
            ingrModal.innerText = "INGREDIENTS" + "\n" + result['hits'][key]['recipe']['ingredientLines'].join("\n").slice(0,200);
            ingrModal.className = "modal ingr-modal";
            let healthModal = document.createElement("p");
            healthModal.innerText = "HEALTH LABELS" + "\n" + result['hits'][key]['recipe']['healthLabels'].join("\n");
            healthModal.className = "modal health-modal";
            let dietModal = document.createElement("p");
            dietModal.innerText = "DIET LABELS" + "\n" + result['hits'][key]['recipe']['dietLabels'].join("\n");
            dietModal.className = "modal diet-modal";
            let caloriesModal = document.createElement("p");
            caloriesModal.innerText = "CALORIES: " + parseFloat(result['hits'][key]['recipe']['calories']).toFixed(2);
            caloriesModal.className = "modal calories-modal";

            let x = document.createElement("button");
            x.innerText = "X";
            x.className = "x";

            modalWindow.appendChild(x);
            modalWindow.appendChild(nameModal);
            modalWindow.appendChild(imageModal);
            modalWindow.appendChild(ingrModal);
            modalWindow.appendChild(caloriesModal);
            modalWindow.appendChild(healthModal);
            modalWindow.appendChild(dietModal);
            

            let container = document.querySelector(".container");
            let mask = document.createElement("div");
            mask.className = "mask";
            container.appendChild(mask);
            container.appendChild(modalWindow);

            x.onclick = (event) => {
              container.removeChild(mask);
              container.removeChild(modalWindow);
            };

          }
        }
        
      };
    }
    helpList.sort((a,b) => a[1]-b[1]);
  
    for (let k=rowCount; k<rowCount+count; k++){
        row.appendChild(helpList[k][0]);
     
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

