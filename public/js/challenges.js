$(document).ready(function() {
    $('.challenge-complete-button').click(function(event){
        $.ajax({
            url: '/addPoints',
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify({
                _id: challengeId
            }),
            success: function(data) {
                console.log('success');
            },
            error: function(err) {
                console.log(err);
            } 
        });
    }