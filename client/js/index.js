///////////////////////////////////////////////////////
//
// File: index.js
// This is application file for login page to accept login credentials
//
/////////////////////////////////////////////////////


window.onload = function () {
    $(".login_join_div").show();
}

// Verifies login credentials before moving to Conference page

document.getElementById('login_form').addEventListener('submit', event => {
    event.preventDefault();

    joinRoom(document.getElementById('roomName').value, data => {
        if (!jQuery.isEmptyObject(data)) {
            var user_ref = document.getElementById('nameText').value;

            // window.location.href = "confo.html?roomId=" + data.room_id + "&usertype=" + document.getElementById('attendeeRole').value + "&user_ref=" + user_ref;

            var retData = {
                name: document.getElementById('nameText').value,
                role: document.getElementById('attendeeRole').value,
                roomId: data.room_id,
                user_ref,
            };
            
            createToken(retData, token => {
                window.location.href = "confo.html?&user_ref=" + user_ref + "&token=" + token;
            });
        } else {
            alert('No room found');
        }
    });
});

var loadingElem = document.querySelector('.loading');
document.getElementById('create_room').addEventListener('click', event => {
    loadingElem.classList.add('yes');
    createRoom( result => {
        document.getElementById("roomName").value = result;
        document.getElementById("create_room_div").style.display = "none";
        document.getElementById("message").innerHTML = "We have prefilled the form with room-id. Share it with someone you want to talk to";
    });
});

toastr.options = {
    closeButton: false,
    debug: false,
    newestOnTop: false,
    progressBar: false,
    positionClass: "toast-top-right",
    preventDuplicates: false,
    onclick: null,
    showDuration: "300",
    hideDuration: "1000",
    timeOut: "5000",
    extendedTimeOut: "1000",
    showEasing: "swing",
    hideEasing: "linear",
    showMethod: "fadeIn",
    hideMethod: "fadeOut"
}

var createRoom = function (callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(this.responseText);
            if (response.error) {
                toastr["error"](response.error);
            } else {
                callback(response.room.room_id);
                loadingElem.classList.remove('yes');
            }
        }
    };
    xhttp.open("POST", "../api/create-room/", true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send();
};


