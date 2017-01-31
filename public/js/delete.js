$(document).ready(function() {
     $('.delete').click(function(event) {
        $.ajax({
            url:'/delete',
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            datatype: 'json'

            success: function(data) {
                console.log('success');
            },
            error: function(err) {
                console.log(err);
            }
        });
    });
 });