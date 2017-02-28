var firebase = require('firebase/app');
require('firebase/auth');
require('firebase/database');
window.jQuery = $ = require('jquery');
require('bootstrap');
require('./parallax.min.js');
require('slick-carousel');

var config = {
    apiKey: "AIzaSyBADSmx6tSneYQW1q4TCtCaRHfdTW_HMPI",
    authDomain: "phanofyu.firebaseapp.com",
    databaseURL: "https://phanofyu.firebaseio.com",
    storageBucket: "phanofyu.appspot.com",
    messagingSenderId: "409746737940"
};
firebase.initializeApp(config);
require('./rsvp')();

$('.parallax-window').parallax();

$('.gallery').slick({
	dots: true
});



