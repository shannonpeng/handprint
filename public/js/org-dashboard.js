$(document).ready(function() {

  /* Convert date YYYY-MM-DD to milliseconds since 1/1/1970 */
  function dateToMS(date) {
    var d = date.split("-");
    var ds = [];
    for (var i = 0; i < d.length; i++) {
      ds.push(parseInt(d[i]));
    }
    return Date.UTC(ds[0], ds[1], ds[2]);
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
    var c = {};
    c.title = $("#feed .challenge-form .challenge-title").val();
    c.start_date = dateToMS($("#feed .challenge-form .challenge-start-date").val());
    c.end_date = dateToMS($("#feed .challenge-form .challenge-end-date").val());
    c.description = $("#feed .challenge-form .challenge-description").val();
    c.location_name = $("#feed .challenge-form .challenge-location").val();
    c.points = $("#feed .challenge-form .challenge-points").val();
    c.category_tags = $("#feed .challenge-form .challenge-tags").val().split(", ");
    console.log(c);
    $.ajax({
      url: '/createChallenge',
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      datatype: 'json',
      data: JSON.stringify({
        // TODO: WHO IS LOGGED IN???
        orgname: 'bch',
        challenge: c
      })
    });
  });
});

