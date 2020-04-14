let topRated = document.querySelector(".top-rated")
var obj;

var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");


var params = {q:"pasta", app_id:"b72cbd9b",  app_key:"2d0049237f953e0bf3e8bf2db35d0661", from:1, to:40};

var requestOptions = {
  method: 'GET',
  mode: 'cors',
  headers: myHeaders,
  redirect: 'follow'
};
var url = new URL("https://api.edamam.com/search");
url.search = new URLSearchParams(params).toString();
console.log(url['href'])
fetch(url, requestOptions)
  .then(response => response.json())
  .then(result => {
    obj= result;
    makeSlider(result);
    fillTopRatedContainer(result);
    makeSideBar(result);
    
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
    for (let i=10; i<result['hits'].length; i++){
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
      image.onclick = openModalWindow; 
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
function openModalWindow(event){
    console.log("ulazi")
    let recipe = event.target.parentNode;
    let modalWindow = document.createElement("div");
    modalWindow.className = "modal-window";
    modalWindow.innerHTML = "";
    for(let key in obj['hits']){
      let check = recipe.children[1].innerText;
      if(recipe.children[1].children[0] !== undefined){
        check = recipe.children[1].children[0].innerText;
      }
      let checkObj = obj['hits'][key]['recipe']['label'];
      if (this.className === "best-image"){
        check = event.target.src;
        checkObj = obj['hits'][key]['recipe']['image'];
      }
      
      if( checkObj === check){
        console.log("yes")
        let nameModal = document.createElement("h2");
        nameModal.innerText = obj['hits'][key]['recipe']['label'];
        nameModal.className = "name-modal";
        let imageModal = document.createElement("img");
        imageModal.src = obj['hits'][key]['recipe']['image'];
        imageModal.className = "image-modal";
        let ingrModal = document.createElement("p");
        ingrModal.innerText = "INGREDIENTS" + "\n" + obj['hits'][key]['recipe']['ingredientLines'].slice(0,5).join("\n");
        ingrModal.className = "modal ingr-modal";
        let healthModal = document.createElement("p");
        healthModal.innerText = "HEALTH LABELS" + "\n" + obj['hits'][key]['recipe']['healthLabels'].join("\n");
        healthModal.className = "modal health-modal";
        let dietModal = document.createElement("p");
        dietModal.innerText = "DIET LABELS" + "\n" + obj['hits'][key]['recipe']['dietLabels'].join("\n");
        dietModal.className = "modal diet-modal";
        let caloriesModal = document.createElement("p");
        caloriesModal.innerText = "CALORIES: " + parseFloat(obj['hits'][key]['recipe']['calories']).toFixed(2);
        caloriesModal.className = "modal calories-modal";

        let x = document.createElement("button");
        x.innerText = "X";
        x.className = "x";

        let icon = document.createElement("img");
        icon.className = "icon";
        icon.src = "../images/boil.svg";

        modalWindow.appendChild(x);
        modalWindow.appendChild(nameModal);
        modalWindow.appendChild(imageModal);
        modalWindow.appendChild(ingrModal);
        modalWindow.appendChild(caloriesModal);
        modalWindow.appendChild(healthModal);
        modalWindow.appendChild(dietModal);
        modalWindow.appendChild(icon);
        

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
}


function makeSlider(result){
  let slider = document.querySelector(".slider-content");
  showImages();
  let count = 0;
  let foodCurr;
  let foodPrev;
  let prev = 1;
  let curr = 1;
  let numImg = 3;
  let classImg;
  let classImgPrev;
  let key;
  let isOnDiv;

  function moveImg(val){
      count++;
      if(val === 1){
          if (curr !== numImg){
              prev = curr;
              curr = curr + 1;
              
          }
          else {
              prev = numImg;
              curr = 1;
          }

      }
      
      else if (val === -1){
          if(curr !== 1){
              prev = curr;
              curr = curr - 1;
              
      }
          else{
              prev = 1;
              curr = numImg;
          }

      }

      showImages(curr, prev);
      
  }
      
  function showImages(curr=0, prev=0){

    slider.innerHTML = "";
    let helpList2 = [];
    for (let i=1;i<10;i++){

      let newFood = document.createElement("div");
      newFood.className = "new-food";
      let newFoodImg = document.createElement("img");
     
      newFoodImg.src = result['hits'][i]['recipe']['image'];
      newFoodImg.className = "new-food-image";
      let newFoodName = document.createElement("p");
      newFoodName.innerText = result['hits'][i]['recipe']['label'];
      newFoodName.className = "new-food-name";
      let readMore = document.createElement("button");
      readMore.innerText = "Read more";
      readMore.className = "read-more";

      newFood.appendChild(newFoodImg);
      newFood.appendChild(newFoodName);
      newFood.appendChild(readMore);

      readMore.onclick = openModalWindow;
      
      if (i%3 !== 0){
        helpList2.push(newFood);
      }
      else{
        helpList2.push(newFood);

        let newFoodGroup = document.createElement("div");
        newFoodGroup.className = "new-food-group";
        helpList2.forEach((elem)=>newFoodGroup.appendChild(elem));
        helpList2 = [];

        slider.appendChild(newFoodGroup);
      
               
      }  
      
    }
    if(curr !==0 && prev!==0){
      foodPrev = document.querySelector(".slider-content").children[prev-1];
      foodPrev.style.display = "none";
      foodCurr = document.querySelector(".slider-content").children[curr-1];
      foodCurr.style.display = "flex";

    }
    
}

if(count === 0){
  slider.firstChild.style.display = "flex";

}

  document.querySelector(".prev").addEventListener("click", function(){moveImg(-1)});
  document.querySelector(".next").addEventListener("click", function(){moveImg(1)});

  document.querySelector(".slider-content").addEventListener("mouseover", function(){
      document.addEventListener('keydown', checkKey)});
  document.querySelector(".slider-content").addEventListener("mouseout", function(){
          document.removeEventListener('keydown', checkKey); });

  setInterval(() => moveImg(-1), 3000);


          
  function checkKey (event) {
      let key = event.key; 
      if (key === "ArrowRight"){
          moveImg(1);
      }
      else if (key === "ArrowLeft"){
          moveImg(-1);
      }
  } 

}
function makeSideBar(result){
    makeBest(result);
}

function makeBest(result){
  let helpList3 = [];
  let best = document.querySelector(".best");

  for(let i=1;i<39;i++){

    let bestItem = document.createElement("img");
    bestItem.className = "best-image";
    bestItem.src =  result['hits'][i]['recipe']['image'];
    helpList3.push([bestItem, result['hits'][i]['recipe']['totalTime']]);
    
  }
  
  let helpList4 = helpList3.filter( elem => elem[1] !== 0);
  helpList4.sort((a,b) => a[1]-b[1]);
  
  for(let i=0;i<3;i++){
    best.appendChild(helpList4[i][0]);
    helpList4[i][0].onclick = openModalWindow;
  }

}