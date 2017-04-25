var handlebars = require('handlebars');

handlebars.registerHelper('eq', function (value1, value2, options) {
	if (value1 === value2) {
		return options.fn(this);
	}

	return options.inverse(this);
});

handlebars.registerHelper('exists', function (value, options) {
	if (value !== undefined) {
		return options.fn(this);
	}

	return options.inverse(this);
});

handlebars.registerHelper('nonexistent', function (value, options) {
	if (value === undefined) {
		return options.fn(this);
	}

	return options.inverse(this);
});

var partialsArray = ['festivities', 'registry', 'travel', 'todo'];

var festivitiesSource = require('./../hbs/festivities.hbs');
handlebars.registerPartial('festivities', festivitiesSource);
var registrySource = require('./../hbs/registry.hbs');
handlebars.registerPartial('registry', registrySource);
var travelSource = require('./../hbs/travel.hbs');
handlebars.registerPartial('travel', travelSource);
var todoSource = require('./../hbs/todo.hbs');
handlebars.registerPartial('todo', todoSource);

var rsvpSource = require('./../hbs/rsvp.hbs');
var rsvpNavSource = require('./../hbs/rsvp-nav.hbs');
var firebase = require('firebase/app');
var saveMessage = 'Your response has been saved. Thank you for RSVPing!';

module.exports = function() {
	var database = firebase.database();

	var renderTemplate = handlebars.compile(rsvpSource);

	var queryString = window.location.search;

	if (queryString) {
		var householdId = queryString.slice(1, queryString.length);
		var household,
			data = {};

		firebase.database().ref('householdId/' + householdId).once('value').then(function(response) {
			household = response.val();
			data.guests = household;
			var html = renderTemplate(data);
			$(html).insertAfter($('#gallery'));
			document.getElementById('saveRsvp').addEventListener('click', updateRsvp.bind(this, householdId, data));

			var htmlForNav = handlebars.compile(rsvpNavSource);
			$('#nav').append(htmlForNav);

			$('select').selectpicker({
				style: 'btn-default',
				size: 4
			});

			document.getElementById('updateSelections').addEventListener('click', showForm);
			$('#canvas1').on('click', function () {
			    $('#map_canvas1').removeClass('scrolloff');
			});

			$('#map_canvas1').mouseleave(function () {
			    $('#map_canvas1').addClass('scrolloff');
			});
		});
	}

	function getRsvpStatuses() {
		var formValues = document.getElementsByTagName('select', '#rsvp');
		formValues = Array.prototype.slice.call(formValues);
		formValues = formValues.map(function(el) {
			return el.value;
		});

		return formValues;
	}

	function getNames() {
		var names = document.querySelectorAll('.has-name', '#rsvp');
		names = Array.prototype.slice.call(names);
		names = names.map(function(el) {
			return el.innerHTML;
		});

		var plusOneNames = document.querySelectorAll('.plus-one-name-entry', '#rsvp');
		plusOneNames = Array.prototype.slice.call(plusOneNames);
		plusOneNames = plusOneNames.map(function(el) {
			return el.value;
		});

		names = names.concat(plusOneNames);

		return names;
	}

	function updateRsvp(householdId, data) {
		var updates = {};
		var i = 0,
			len = data.guests.length;

		var names = getNames();
		var rsvpStatuses = getRsvpStatuses();
		var drinkSelection = document.getElementById('drink-selection', '#rsvp').value;
		var songSelection = document.getElementById('song-selection', '#rsvp').value;

		for (i; i < len; i++) {
			updates['/householdId/' + householdId + '/' + i + '/status'] = rsvpStatuses[i].toLowerCase();

			if (names[i] && data.guests[i].name_unknown) {
				updates['/householdId/' + householdId + '/' + i + '/name_unknown'] = false;
				updates['/householdId/' + householdId + '/' + i + '/name_entry'] = names[i];
			}
		}

		updates['/householdId/' + householdId + '/' + 0 + '/drinks'] = drinkSelection;
		updates['/householdId/' + householdId + '/' + 0 + '/songs'] = songSelection;

		firebase.database().ref().update(updates);
		showSaveMessage();
	}

	function showForm() {
		$('#formContent').toggleClass('hid');
		$('#formSaveMessage').toggleClass('hid');
	}

	function showSaveMessage() {
		$('#formContent').toggleClass('hid');
		$('#formSaveMessage').toggleClass('hid');
	}
};

