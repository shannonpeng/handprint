$(document).ready(function() {

  $( "#plus-icon" ).click(function() {
    $( ".challenge-form" ).toggle();
  });

  $( "#submit").click(function() {
    var values = $("#addchallenge").serialize().split('&');
    var responses = [];
    for(i = 0; i < values.length; i++) {
      responses.push(decodeURIComponent(values[i].split('=')[1]));
    };
    console.log(responses);
    months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    start = responses[1].split('/');
    start_date = months[Number(start[0])]+" "+start[1]+", "+start[2];
    end = responses[2].split('/');
    end_date = months[Number(end[0])]+" "+end[1]+", "+end[2];
    // start_date = (Number(responses[1].substr(0,2))-1)*1000*60*60*24*30.5 + (Number(responses[1].substr(3,5))-1)*1000*60*60*24 + (Number(responses[1].substr(6,9))-1970)*1000*60*60*24*365;
    // end_date = (Number(responses[2].substr(0,2))-1)*1000*60*60*24*30.5 + (Number(responses[2].substr(3,5))-1)*1000*60*60*24 + (Number(responses[2].substr(6,9))-1970)*1000*60*60*24*365;
    $.ajax({
      url: '/addChallenge',
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      datatype: 'json',
      data: JSON.stringify({
        title: responses[0],
        start_date: Date.parse(start_date),
        end_date: Date.parse(end_date),
        description: responses[3],
        location_name: responses[4],
        location_zipcode: responses[5],
        points: responses[6],
        // category_tags: $(this).find('input[name="category"]').val()
      }),
      success: function(data) {
        console.log('sucessfully created challenge');
      },
      error: function(error) {
        console.log(error);
      }
    });
  });
});

