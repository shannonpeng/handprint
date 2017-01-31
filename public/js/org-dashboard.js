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
    
    var current_date = Date.now();
    console.log(current_date);
    var c = {};
    var start_date = dateToMS($("#feed .challenge-form .challenge-start-date").val());
    console.log(start_date);
    var end_date = dateToMS($("#feed .challenge-form .challenge-end-date").val());
    console.log(end_date);
    if (start_date < current_date || start_date > end_date ) {
      alert('Please choose valid dates.');
    }
    else {
      c.start_date = start_date;
      c.end_date = end_date;
    }
    
    c.title = $("#feed .challenge-form .challenge-title").val();
    c.description = $("#feed .challenge-form .challenge-description").val();
    c.location = $("#feed .challenge-form .challenge-location").val();
    c.points = $("#feed .challenge-form .challenge-points").val();
    c.category_tags = $("#feed .challenge-form .challenge-tags").val().split(", ");

    if (!(c.title && c.start_date && c.end_date && c.description && c.location && c.points)) {
      alert('Please fill out all required fields.');
      console.log(c);
    }
    else {
      $.ajax({
        url: '/createChallenge',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        datatype: 'json',
        data: JSON.stringify({
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

  $("#feed .challenge .delete-challenge").click(function(event) {

    var a = confirm("Are you sure you want to delete this challenge?");
    var id = $(this).attr('name');
    console.log(id);

    if (a) {

      $.ajax({
        url: '/deleteChallenge',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        datatype: 'json',
        data: JSON.stringify({
          id: id
        }),
        success: function(data) {
          console.log(data);
          window.location.replace('/dashboard');
        },
        error: function(err) {
          console.log(err);
        }
      });

    }
    
  });
});

