var localStorageObj = {"items": []};

var id = localStorage.getItem("favid");
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
            makeTable();
        });
}

function makeTable(){
    //pass
}


