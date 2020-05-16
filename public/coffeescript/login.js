// Generated by CoffeeScript 2.5.1
(function() {
  var loginUser;

  $("form.login").submit(function(event) {
    var password, userData, username;
    event.preventDefault();
    console.log("clicked");
    username = $("input[name='username']");
    password = $("input[name='password']");
    userData = {
      username: username.val().trim(),
      password: password.val().trim()
    };
    if (!userData.username || !userData.password) {
      return;
    }
    loginUser(userData.username, userData.password);
    username.val("");
    return password.val("");
  });

  loginUser = function(username, password) {
    return $.post("/api/login", {
      username: username,
      password: password
    }).then(function(res) {
      return window.location.replace("/index");
    });
  };

}).call(this);