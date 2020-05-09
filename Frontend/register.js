// Base URL
const URL = 'https://stopkran.dev:8000'

$(document).ready(function(){
  // Register process
  $('#regForm').submit(function(){
    let log_URL = URL + '/register/'
    let data = {
      'username': $('#userName').val(),
      'email': $('#userMail').val(),
      'password': $('#password').val()
    };

    // POST request for login
    $.ajax({
      url: log_URL,
      type: 'POST',
      data: data,
      error : function(err) {
        console.log('Error!', err);
      },
      success: function(data) {
        // Notificate
        $(".alert").show();      
      }
    });
    console.log("Send");
    return false;
  });
});