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
                console.log(localStorageObj);
                //makeTable();
            });
    }
    else{
        //pass
    }
}

/*

<div class="holder">

    <img src="../images/test.jpg" alt="" class="image">

    <div class="on-hover">
    
        <button class="btns show-more">MORE</button>
        <button class="btns del-btn">DELETE</button>
    
    </div>

</div>
*/
function makeTable(){
    //pass
}


