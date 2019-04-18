///////////////////////////////////////////////////////
//
// File: room.js
// This function fetches Room-Information to which the user is logging in
//
// Last Updated: 29-11-2018
// Reformat, Indentation, Inline Comments
//
/////////////////////////////////////////////////////


var joinRoom = function (roomName, callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var response =  JSON.parse(this.responseText);
            if(response.error){
                $.toast({
                    heading: 'Error',
                    text: response.error,
                    showHideTransition: 'fade',
                    icon: 'error',
                    position: 'top-right',
                    showHideTransition: 'slide'
                });
            }
            else {
                callback(response.room);
            }


        }
    };
    xhttp.open("GET", "../api/get-room/?roomId=" + roomName, true);
    xhttp.send();
};

