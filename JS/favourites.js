const noSaved = document.getElementById("nth-t-shw");
const favOne = document.getElementById("favourites-1");
const favTwo = document.getElementById("favourites-2");
const maskDiv = document.getElementById("mask-div");

var localStorageObj = {"items": []};
var id = localStorage.getItem("favid");
function checkLocalStorage(){
    if(id && id !== "undefined"){
        fetch(`https://api.jsonbin.io/b/${id}`, {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                    'secret-key': "$2b$10$mYqOBJTUxyvQhz.9nvQay.L0/to7DRDuWCHv5LlOwjr2yUsHK.7w."
                }
            }).then(function(response) {
                return response.json();
            }).then(function(data) {
                localStorageObj = data;
                if(localStorageObj["items"].length !== 0){
                    makeTable();
                }
                else{
                    noSaved.style.display = "block";
                }
            });
    }
    else{
        noSaved.style.display = "block";
    }
}

function deleteModal(event){
    event.target.parentNode.parentNode.removeChild(event.target.parentNode);
    maskDiv.style.display = "none";
}

function makeModal(event){
    let imgSrc = event.target.parentNode.parentNode.children[0].src;
    var curr;
    for(let i = 0; i < localStorageObj["items"].length; i++){
        if(localStorageObj["items"][i][0] === imgSrc){
            curr = localStorageObj["items"][i];
            break;
        }
    }
    
/*
<div class="modal">
            <div class="image-holder">
            <img src="../images/test.jpg" alt="" class="image modal-image">
            </div>
            
        <div class="text-holder">
            <h3 class="modal-label">ALA lfal  la</h3>
            <div class="modal-ing">qwd, dad2, 2 ad ad a, aas</div>
            <div class="modal-time">78m</div>
            <a href="#" class="modal-link">Recipe link</a>
        </div>
        
        <button class="close-modal">X</button>
        </div>
*/
    //Modal
    let modal = document.createElement("div");
    modal.className = "modal";
    //Image holder
    let imgHolder = document.createElement("div");
    imgHolder.className = "image-holder";
    //Image
    let modalImg = document.createElement("img");
    modalImg.classList = "image modal-image";
    modalImg.src = imgSrc;
    imgHolder.appendChild(modalImg);
    modal.appendChild(imgHolder);
    //Text holder
    let txtHolder = document.createElement("div");
    txtHolder.className = "text-holder";
    //Label
    let label = document.createElement("h3");
    label.className = "modal-label";
    label.innerHTML = curr[1];
    txtHolder.appendChild(label);
    //Ingredients
    let ingred = document.createElement("div");
    ingred.className = "modal-ing";
    var recipeIng  = curr[2][0]["text"];
    for(let t = 1; t < curr[2].length; t++){
        recipeIng = recipeIng + ", " + curr[2][t]["text"]; 
    }
    if(recipeIng.length > 80){
        ingred.innerHTML = recipeIng.slice(0, 80) + "...";
    }
    else{
        ingred.innerHTML = recipeIng;
    }
    txtHolder.appendChild(ingred);
    //Time
    let modalTime = document.createElement("div");
    modalTime.className = "modal-time";
    modalTime.innerHTML = curr[3] + "m";
    txtHolder.appendChild(modalTime);
    //Link
    let modalLink = document.createElement("a");
    modalLink.className = "modal-link";
    modalLink.href = curr[4];
    modalLink.target = "_blank";
    modalLink.innerHTML = "Recipe link";
    txtHolder.appendChild(modalLink);
    modal.appendChild(txtHolder);
    //Button
    let closeModal = document.createElement("button");
    closeModal.className = "close-modal";
    closeModal.innerHTML = "X";
    closeModal.addEventListener("click", deleteModal);
    //Event
    modal.appendChild(closeModal);
    modal.style.display = "block";
    maskDiv.style.display = "block";
    if(document.body.clientWidth > 600){
        modal.style.left = `calc(${event.clientX}px - 9vw)`;
    }
    document.body.appendChild(modal);
}

function deleteElem(event){
    let imgSrc = event.target.parentNode.parentNode.children[0].src;

    for(let i = 0; i < localStorageObj["items"].length; i++){
        if(localStorageObj["items"][i][0] === imgSrc){
            if(i < 4){
                localStorageObj["items"].splice(i, 1);
                makeTable();
                break;
            }
            else{
                localStorageObj["items"].splice(i, 1);
                event.target.parentNode.parentNode.parentNode.removeChild(event.target.parentNode.parentNode);
                break;
            }
        }
    }

    if(localStorageObj["items"].length === 0){
        noSaved.style.display = "block";
    }

    fetch('https://api.jsonbin.io/b', {
            method: 'post',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'secret-key': "$2b$10$mYqOBJTUxyvQhz.9nvQay.L0/to7DRDuWCHv5LlOwjr2yUsHK.7w."
            },
            body: JSON.stringify(localStorageObj)
        }).then(function(response) {
            return response.json();
        }).then(function(data) {
            localStorage.setItem("favid", data.id);
        });

}

function makeTable(){
    //remove fav elements
    while (favOne.firstChild) {
        favOne.removeChild(favOne.lastChild);
    }
    while (favTwo.firstChild) {
        favTwo.removeChild(favTwo.lastChild);
    }

    noSaved.style.display = "none";

    for(j = 0; j < localStorageObj["items"].length; j++){
        
        //holder
        let holder = document.createElement("div");
        holder.className = "holder";
        //image
        let holderImage = document.createElement("img");
        holderImage.className = "image";
        holderImage.src = localStorageObj["items"][j][0];
        holder.appendChild(holderImage);
        //Button container
        let onHover = document.createElement("div");
        onHover.className = "on-hover";
        //Button show more
        let showMore = document.createElement("button");
        showMore.classList = "btns show-more";
        showMore.innerHTML = "MORE";
        showMore.addEventListener("click", makeModal);
        onHover.appendChild(showMore);
        //Button delete
        let deleteBtn = document.createElement("button");
        deleteBtn.classList = "btns show-more";
        deleteBtn.innerHTML = "DELETE";
        deleteBtn.addEventListener("click", deleteElem);
        onHover.appendChild(deleteBtn);
        //Append container to holder
        holder.appendChild(onHover);

        if(j < 5){
            favOne.appendChild(holder);            
        }
        else{
            favTwo.appendChild(holder);
        }
    }

}


checkLocalStorage();
