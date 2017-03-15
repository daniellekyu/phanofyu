var firebase = require('firebase/app');
require('firebase/auth');
require('firebase/database');
window.jQuery = $ = require('jquery');
require('bootstrap');
require('bootstrap-select');
require('./parallax.min.js');
require('slick-carousel');
require('./nav');
var animateOnScroll = require('aos');

var config = {
    apiKey: "AIzaSyBADSmx6tSneYQW1q4TCtCaRHfdTW_HMPI",
    authDomain: "phanofyu.firebaseapp.com",
    databaseURL: "https://phanofyu.firebaseio.com",
    storageBucket: "phanofyu.appspot.com",
    messagingSenderId: "409746737940"
};
firebase.initializeApp(config);

var isTouchDevice = 'ontouchstart' in document.documentElement;
var touchClass = 'touch';

if (isTouchDevice) {
	document.body.classList.add(touchClass);
}

animateOnScroll.init();

require('./rsvp')();

$('.parallax-window').parallax();

$('.gallery').slick({
	dots: true
});
