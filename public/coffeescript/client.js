// Generated by CoffeeScript 2.5.1
(function () {
  // Initializing global variables
  var city, geoConfirm, geoID, geolocate, getCoordinates, getKeys, displayCard, getReviews, id, lat, long, maps, nearbyRestaurants, offset, pos, randomSelection, restDiv, restaurantArray, restaurantPhotos, searchRestaurants, selection, sendInfo, setCity, yelp, review1, review2, review3, person1, person2, person3

  id = this

  restDiv = $('.restaurants')

  pos = this

  yelp = this

  maps = this

  lat = this

  long = this

  city = this

  offset = 0

  restaurantArray = []

  geoConfirm = this

  geoID = this

  selection = ''

  // Searches restaurants based on the users entry
  searchRestaurants = function () {
    return $.ajax({
      url: `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?location=${city}&categories=restaurants&limit=50&offset=${offset}`,
      method: 'GET',
      cache: true,
      headers: {
        Authorization: yelp
      }
    }).then(function (res) {
      var count
      count = 0
      while (count < 49) {
        restaurantArray.push(res.businesses[count])
        count++
      }
      randomSelection()
      displayCard()
    })
  }

  // Nearby restaurants search function
  nearbyRestaurants = function () {
    return $.ajax({
      url: `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?latitude=${lat}&longitude=${long}&categories=restaurants&limit=50&offset=${offset}`,
      method: 'GET',
      cache: true,
      headers: {
        Authorization: yelp
      }
    }).then(function (res) {
      var count
      count = 0
      while (count < 49) {
        restaurantArray.push(res.businesses[count])
        count++
      }
      randomSelection()
      displayCard()
    })
  }

  // Formats page after search event
  var formatPage = function () {
    $('#returned').remove()
    $('#city-search').remove()
    $('#proximity').remove()
    $('#pic1').attr('style', 'background-image: url(' + +");'")
    $('#pic2').attr('style', 'background-image: url(' + +");'")
    $('#pic3').attr('style', 'background-image: url(' + +");'")
    $('#person1').text('')
    $('#person2').text('')
    $('#person3').text('')
    $('#review1').text('')
    $('#review2').text('')
    $('#review3').text('')
    $('<a>Return to Search</a>').appendTo('#return').attr('href', '/index').attr('id', 'returned')
  }

  // Returns a city by using the id stored in mysql. Will want to pull the id from within this function likely
  var searchRestaurantsByID = function () {
    return $.ajax({
      url: `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/${id}`,
      method: 'GET',
      cache: true,
      headers: {
        Authorization: yelp
      }
    }).then(function (res) {
    })
  }

  // Displays the card handlebar w/out api call
  displayCard = function () {
    formatPage()
    // get the template
    var source = $('#card-hbs').html()
    // compile template:
    var template = Handlebars.compile(source)
    // apply template:
    var info = {
      imageURL: selection[0].image_url,
      name: selection[0].name,
      yelp: selection[0].yelp_url,
      rating: selection[0].rating
    }
    var context = template(info)
    // add result to the page:
    var likeBtn = $("<button><i class='huge utensils icon'></i>").attr('id', 'like')
    var dislikeBtn = $("<button><i class='huge shipping fast icon'></i>").attr('id', 'dislike')
    likeBtn.off('click').click(function (event) {
      if (selection !== '') {
        // var id, name, picURL, yelp, rating;
        event.preventDefault()
        var id = selection[0].id
        var name = selection[0].name
        var picURL = selection[0].image_url
        var yelp = selection[0].url
        var rating = selection[0].rating
        sendInfo(id, name, picURL, yelp, rating)
      } else {
        // var id, name, picURL, yelp, rating;
        event.preventDefault()
        id = restaurantArray[0].id
        name = restaurantArray[0].name
        picURL = restaurantArray[0].image_url
        yelp = restaurantArray[0].url
        rating = restaurantArray[0].rating
        restaurantArray.splice(0, 1)
        sendInfo(id, name, picURL, yelp, rating)
      }
    })
    dislikeBtn.off('click').click(function (event) {
      event.preventDefault()
      randomSelection()
      displayCard()
    })
    dislikeBtn.appendTo(restDiv)
    likeBtn.appendTo(restDiv)
    $('#loader').removeClass('active').addClass('disabled')
    $('.hbs-container').empty().append(context, dislikeBtn, likeBtn)
    $('.index-card').off('click').click(function (event) {
      event.preventDefault()
      $('.card').transition({
        animation: 'scale',
        duration: '0.50s',
        onComplete: function () {
          displayContent()
        }
      })
    })
  }

  var displayContent = function () {
    $('#restaurant-content').attr('style', 'display: initial;').transition({
      animation: 'scale',
      duration: '1.5s'
    })
  }

  // Gets photos of the restaurant
  restaurantPhotos = function (alias) {
    return $.ajax({
      url: `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/${alias}`,
      method: 'GET',
      cache: true,
      headers: {
        Authorization: yelp
      }
    }).then(function (res) {
      var pic1, pic2, pic3
      pic1 = res.photos[0]
      pic2 = res.photos[1]
      pic3 = res.photos[2]
      $('#pic1').attr('style', 'background-image: url(' + pic1 + ");'")
      $('#pic2').attr('style', 'background-image: url(' + pic2 + ");'")
      $('#pic3').attr('style', 'background-image: url(' + pic3 + ");'")
    })
  }

  // Gets reviews for the restaurant
  getReviews = function (alias) {
    return $.ajax({
      url: `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/${alias}/reviews`,
      method: 'GET',
      cache: true,
      headers: {
        Authorization: yelp
      }
    }).then(function (res) {
      review1 = res.reviews[0].text
      review2 = res.reviews[1].text
      review3 = res.reviews[2].text
      person1 = res.reviews[0].user.name
      person2 = res.reviews[1].user.name
      person3 = res.reviews[2].user.name
      $('#person1').text(person1)
      $('#person2').text(person2)
      $('#person3').text(person3)
      $('#review1').text(review1)
      $('#review2').text(review2)
      $('#review3').text(review3)
    })
  }

  // Gets the users current location to make a call to yelp for nearby restaurants
  getCoordinates = function () {
    var error, options, success
    options = {
      enableHighAccuracy: false,
      timeout: 5000
    }
    error = function (err) {
      return console.log('ERROR(' + err.code + '): ' + err.message)
    }
    success = function (position) {
      pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }
      lat = pos.lat
      long = pos.lng
      nearbyRestaurants()
      return navigator.geolocation.clearWatch(geoID)
    }
    // id must be established after it's parameters are listed
    geoID = navigator.geolocation.watchPosition(success, error, options)
  }

  // Sets up the ability to use geolocation from google maps
  geolocate = function () {
    return $.ajax({
      url: `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/js?key=${maps}`,
      cache: true,
      method: 'GET'
    }).then(function (res) {
      // Gets coordinates and then runs yelp api with the results
      return getCoordinates()
    })
  }

  // Sends the info to be saved to the database for future searches
  sendInfo = function (id, name, picURL, yelp, rating) {
    return $.post('/api/restaurants', {
      id: id,
      name: name,
      picURL: picURL,
      yelp: yelp,
      rating: rating
    }).then(function (res) {
      randomSelection()
      var id = selection[0].id
      displayCard(id)
    })
  }

  // Gets the keys from server side
  getKeys = function () {
    return $.get('/api/keys', function (res) {
      yelp = `${res[0]}`
      maps = `${res[1]}`
    })
  }

  // Sets the user's input to local storage in order to repeat search the same city
  // Might be redundant now with the new array method, in this case just move searchRestaurants() directly to the click event
  setCity = function () {
    var cities
    if ($('#city').val().trim() !== '') {
      window.localStorage.clear()
      city = $('#city').val().trim()
      cities = []
      cities.push($('#city').val().trim())
      localStorage.setItem('City', JSON.stringify(cities))
      return searchRestaurants()
    } else {
      return alert('You must enter a city! Or select nearby restaurants.')
    }
  }

  // Splices disliked restaurants from the database, and checks their logged date to see if they should re-enter the pool
  var dislikedRestaurants = function () {
    return $.ajax({
      url: '/api/disliked',
      cache: true,
      method: 'GET'
    }).then(function (res) {
      var count, countTwo, dislikedArray, removedArray, results
      dislikedArray = res
      count = 0
      countTwo = 0
      results = []
      while (count < dislikedArray.length) {
        while (countTwo < restaurantArray.length) {
          if (restaurantArray[countTwo].id === dislikedArray[count].id) {
            removedArray = removedArray + dislikedArray[count].splice()
          }
          countTwo++
        }
        results.push(count++)
      }
      return results
    })
  }

  // Randomly selects a restaurant from the generated array of restaurants
  randomSelection = function () {
    var random
    random = Math.floor(Math.random() * restaurantArray.length)
    selection = restaurantArray.splice(random, 1)
    if (selection !== '') {
      templateComments(selection[0].id)
      getReviews(selection[0].alias)
      restaurantPhotos(selection[0].alias)
    } else {
      templateComments(restaurantArray[0].id)
      getReviews(restaurantArray[0].alias)
      restaurantPhotos(restaurantArray[0].alias)
    }
  }

  // Displays the comments handlebar
  var templateComments = function (id) {
    $.get('/comments/restaurants' + id).then(function (result) {
      var timeArray = []
      if (result) {
        // Formatting date of the user review
        for (var i = 0; i < result.length; i++) {
          var date = new Date(result[i].createdAt).toDateString()
          date.slice(0, -36)
          timeArray.push(date)
        };
        // get the template
        var source = $('#comments-hbs').html()
        // compile template:
        var template = Handlebars.compile(source)
        // apply template:
        var comments = result
        var context = template(comments)
        // add result to the page:
        $('.hbs-container-comments').empty().append(context)
        // Displaying times for the user reviews based on idexes
        for (var j = 0; j < timeArray.length; j++) {
          $('.date:eq(' + j + ')').append(timeArray[j])
        }
      }
    })
  }

  $(document).ready(function () {
    // Runs immediately to have info available before they start searching, prevents sync timing errors
    getKeys()

    $('#proximity').click(function (event) {
      $('#loader').removeClass('disabled').addClass('active')
      if (JSON.parse(window.localStorage.getItem('Location Services')) !== true) {
        geoConfirm = confirm('This website is requesting your location to provide you with location based services.')
        if (geoConfirm === true) {
          localStorage.setItem('Location Services', JSON.stringify(geoConfirm))
          restaurantArray = []
          return geolocate()
        } else if (geoConfirm === false) {
          return alert('Location services were denied, please enter a city.')
        }
      } else if (JSON.parse(window.localStorage.getItem('Location Services')) === true) {
        restaurantArray = []
        return geolocate()
      }
    })
    $('#search').click(function (event) {
      restaurantArray = []
      event.preventDefault()
      $('#loader').removeClass('disabled').addClass('active')
      setCity()
      return $('#city').val('')
    })
  })
}).call(this)
