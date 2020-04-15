const noSaved = document.getElementById("nth-t-shw");
const favOne = document.getElementById("favourites-1");
const favTwo = document.getElementById("favourites-2");

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
                    console.log(localStorageObj);
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


function makeModal(event){
    //pass
}

function deleteElem(event){

    let imgSrc = event.target.parentNode.parentNode.children[0].src;

    for(var i = 0; i < localStorageObj["items"].length; i++){
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

    console.log(localStorageObj);
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
