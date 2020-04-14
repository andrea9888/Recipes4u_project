var btnsList = document.getElementsByClassName("radio-btn");
var searchBy = document.getElementById("name").id;
const navigateDiv = document.getElementById("navigator");
const apiDiv = document.getElementById("api-response");
var listType = localStorage.getItem("listType");
if (listType === "other"){
    searchBy = "";
}
const searchBtn = document.getElementById("btn");
searchBtn.addEventListener("click", search);
const inpType = document.getElementById("input");
var navigateObj;
var hitsList;

for(let i = 0; i < btnsList.length; i++){
    btnsList[i].addEventListener("click",(event) =>{
        searchBy = event.target.id;
        if (event.target.id === "name"){
            inpType.type = "text";
            inpType.placeholder = "Type name";
        }
        else{
            inpType.type = "number";
            if(event.target.id === "time"){
                inpType.placeholder = "Type time in minutes"
            }
            else{
                inpType.placeholder = "Type calories"                
            }
        }
    })
}

//Max results
function updateTextInput(val) {
    document.getElementById("rangeValue").innerHTML = val; 
}


function search(event){
    var inp = inpType.value;
    event.preventDefault();
    if((typeof inp !== "string" && inp >= 10 && inp <= 10000) || inp.length >= 3){
        var range = document.getElementById("range").value;
        urlParser(inp, range);           
    }
}

function urlParser(inputVal, rangeVal){
    var params;
    listType = localStorage.getItem("listType");
    if(isNaN(inputVal)){
        params = {q: listType + " " + inputVal, 
            app_id:"b72cbd9b",  app_key:"2d0049237f953e0bf3e8bf2db35d0661", from:0, to:rangeVal};
    }
    else{
        if(searchBy === "time"){
            params = {q: listType, 
                app_id:"b72cbd9b",  app_key:"2d0049237f953e0bf3e8bf2db35d0661", from:0, to:rangeVal,
                time: inputVal
            };
        }
        else{
            params = {q: listType, 
                app_id:"b72cbd9b",  app_key:"2d0049237f953e0bf3e8bf2db35d0661", from:0, to:rangeVal,
                calories: inputVal 
            };
        }
    }


    var url = new URL("https://api.edamam.com/search");
    url.search = new URLSearchParams(params).toString();
    apireq(url);
}

function apireq(param){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    
    var requestOptions = {
    method: 'GET',
    mode: 'cors',
    headers: myHeaders,
    redirect: 'follow'
    };

    fetch(param, requestOptions)
        .then(response => response.json())
        .then(result => {
            hitsList = result.hits;
            while (navigateDiv.firstChild) {
                navigateDiv.removeChild(navigateDiv.lastChild);
            }
            if(hitsList.length > 0){  
                navigate();
            }
            else{
                let nRes = document.createElement("div");
                nRes.className = "no-res";
                navigateDiv.appendChild(nRes);
            }
        }
            )
        .catch(error => alert(error));

}


function navigate(){
    
    navigateObj = {};
    navigateObj[1] = true; 
    var navIter = 2;
    for(let i = 4; i < hitsList.length; i+=4){
        navigateObj[navIter] = false;
        navIter++;
    }

    var prevNav = document.createElement("button");
    prevNav.className = "navigate-btn";
    prevNav.innerHTML = "Prev";
    prevNav.addEventListener("click", navHandler);
    navigateDiv.appendChild(prevNav);
    
    for(let prop in navigateObj){
        let navBtn = document.createElement("button");
        navBtn.className = "navigate-btn";
        navBtn.innerHTML = prop;
        navBtn.addEventListener("click", navHandler);
        navigateDiv.appendChild(navBtn);
    }
    var nextNav = document.createElement("button");
    nextNav.className = "navigate-btn";
    nextNav.innerHTML = "Next";
    nextNav.addEventListener("click", navHandler);
    navigateDiv.appendChild(nextNav);
    navigateDiv.children[1].style.opacity = "0.5";
    setTable();
}

function setTable(){
    var i = 0;
    for(let prop in navigateObj){
        if(navigateObj[prop] === true){
            break;
        }
        i++;
    }
    //Obrisi Prosle
    while (apiDiv.firstChild) {
        apiDiv.removeChild(apiDiv.lastChild);
      }
    //Making new table
    for(let x = (i*4); x < (i*4)+4 && x < hitsList.length; x++){
        let cell = document.createElement("div");
        cell.className = "one-response";
        //img
        let pic = document.createElement("img");
        pic.className = "api-response-img";
        pic.src = hitsList[x]["recipe"]["image"];
        cell.appendChild(pic);
        //Text
        let cellTxt = document.createElement("div");
        cellTxt.className = "api-response-text";
        //Text - h3 - name
        let hName = document.createElement("h3");
        hName.className = "recipe-name";
        if(hitsList[x]["recipe"]["label"].length > 17){
            hName.innerHTML = hitsList[x]["recipe"]["label"].slice(0, 17) + "...";
        }
        else{
            hName.innerHTML = hitsList[x]["recipe"]["label"]
        }
        cellTxt.appendChild(hName)
        //Text - ingr - div
        let ingred = document.createElement("div");
        ingred.className = "recipe-ing";
        var recipeIng  = hitsList[x]["recipe"]["ingredients"][0]["text"];
        for(let t = 1; t < hitsList[x]["recipe"]["ingredients"].length; t++){
            recipeIng = recipeIng + ", " + hitsList[x]["recipe"]["ingredients"][t]["text"]; 
        }
        if(recipeIng.length > 60){
            ingred.innerHTML = recipeIng.slice(0, 60) + "...";
        }
        else{
            ingred.innerHTML = recipeIng;
        }
        cellTxt.appendChild(ingred)
        //Link
        let recipeLink = document.createElement("a");
        recipeLink.href = hitsList[x]["recipe"]["url"];
        recipeLink.target = "_blank";
        recipeLink.className = "recipe-link";
        recipeLink.innerHTML = "Recipe link";
        cellTxt.appendChild(recipeLink);
        //Preparation time
        let prepTime = document.createElement("div")
        prepTime.className = "recipe-tags";
        prepTime.innerHTML = hitsList[x]["recipe"]["totalTime"] + "m";
        cellTxt.appendChild(prepTime);
        cell.appendChild(cellTxt);
        let favBtn = document.createElement("button");
        favBtn.className = "btn fv-btn";
        //EVent Listener
        favBtn.addEventListener("click", addToFav);
        cell.appendChild(favBtn);
        apiDiv.appendChild(cell);

    }



}

function navHandler(event){
    let currSide = event.target.innerHTML;
    if(currSide === "Next" || currSide === "Prev"){
        for(let prop in navigateObj){
            if(navigateObj[prop] === true){
                if(currSide === "Next"){
                    r = (parseInt(prop) + 1);
                    if(navigateObj[r] === true || navigateObj[r] === false){
                        r = (parseInt(prop) + 1);
                        navigateObj[prop] = false;
                        navigateObj[r] = true;
                        navigateDiv.children[r - 1].style.opacity = "1";
                        navigateDiv.children[r].style.opacity = "0.5";
                    }
                }
                else{
                    r = (parseInt(prop) - 1);
                    if(navigateObj[r] === true || navigateObj[r] === false){
                        navigateObj[prop] = false;
                        navigateObj[r] = true;
                        navigateDiv.children[r + 1].style.opacity = "1";
                        navigateDiv.children[r].style.opacity = "0.5";
                    }
                }
                break;
            }
        }
    }
    else{
        for(let prop in navigateObj){
            if(navigateObj[prop] === true){
                navigateObj[prop] = false;
                navigateObj[currSide] = true;
                navigateDiv.children[prop].style.opacity = "1";
                navigateDiv.children[currSide].style.opacity = "0.5";  
            }
        }

    }

    setTable();
}

function addToFav(event){

    
}
