$(document).ready(function() {

  /* Convert date YYYY-MM-DD to milliseconds since 1/1/1970 */
  function dateToMS(date) {
    var d = date.split("-");
    var ds = [];
    for (var i = 0; i < d.length; i++) {
      ds.push(parseInt(d[i]));
    }
    return Date.UTC(ds[0], ds[1] - 1 , ds[2] + 1);
  }

  $("#feed .create-challenge").click(function(event) {
      if($("#feed .challenge-form").hasClass("closed")) {
        $("#feed .challenge-form").removeClass("closed");
      }
      else {
        $("#feed .challenge-form").addClass("closed");
      }
  });

  $("#feed .challenge-form .submit").click(function(event) {
    console.log("in challenge-form submit");
    var current_date = (new Date).getTime();
    var c = {};
    var start_date = dateToMS($("#feed .challenge-form .challenge-start-date").val());
    var end_date = dateToMS($("#feed .challenge-form .challenge-end-date").val());
    if (dates.compare(start_date, current_date) < 0 || dates.compare(start_date, current_date) < 0) {
      console.log('hi');
      alert('Please choose a valid date');
    }
    else {
      c.start_date = dateToMS($("#feed .challenge-form .challenge-start-date").val());
      c.end_date = dateToMS($("#feed .challenge-form .challenge-end-date").val());
    }
    c.title = $("#feed .challenge-form .challenge-title").val();
    c.description = $("#feed .challenge-form .challenge-description").val();
    c.location_name = $("#feed .challenge-form .challenge-location").val();
    c.points = $("#feed .challenge-form .challenge-points").val();
    c.category_tags = $("#feed .challenge-form .challenge-tags").val().split(", ");
    //console.log(c);
    if (!(c.title && c.start_date && c.end_date && c.description && c.location_name && c.points)) {
      alert('Please fill out all required fields.');
    }
    else {
      $.ajax({
        url: '/createChallenge',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        datatype: 'json',
        /*
        data: JSON.stringify({
          title: title,
          start_date: start_date,
          end_date: end_date,
          description: description,
          location_name: location_name,
          points: points,
          category_tags: category_tags
        }),
        */
        data: JSON.stringify({
          // TODO: WHO IS LOGGED IN???
          orgname: 'bch',
          challenge: c
        }),
        success: function(data) {
          window.location.replace('/dashboard');
        },
        error: function(err) {
          console.log(err);
        }
      });
    }
  });
});

