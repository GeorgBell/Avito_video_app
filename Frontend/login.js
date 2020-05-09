// Base URLs
const URL = 'https://stopkran.dev:8000/login/'
const base_URL = 'https://stopkran.dev:443'

// jQuery section
$(document).ready(function(){
  
  // Login process
  $('#logForm').submit(function(){

    // Get username from form and send it to backend
    var username = $('#userName').val();
    let data = {
      'username': username,
      'password': $('#password').val()
    };

    // POST request for login
    $.ajax({
      url: URL,
      type: 'POST',
      data: data,
      error : function(err) {
        $(".alert").show();
        console.log('Error!', err);
      },
      success: function(data) {
        
        // Save token to cookie
        let name_1 = "token";
        let value_1 = data.token;
        document.cookie = encodeURIComponent(name_1) + '=' + encodeURIComponent(value_1);

        let name_2 = "username";
        let value_2 = username;
        document.cookie = encodeURIComponent(name_2) + '=' + encodeURIComponent(value_2);

        // Send to user_select page
        window.location.replace(base_URL+"/user_search.html");
      }
    });
    return false;
  });
});