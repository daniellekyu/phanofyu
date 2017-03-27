var handlebars = require('handlebars');

handlebars.registerHelper('eq', function (value1, value2, options) {
	if (value1 === value2) {
		return options.fn(this);
	}

	return options.inverse(this);
});

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
			$(html).insertAfter($('#todo'));
			document.getElementById('saveRsvp').addEventListener('click', updateRsvp.bind(this, householdId, data));

			var htmlForNav = handlebars.compile(rsvpNavSource);
			$('#nav').append(htmlForNav);

			$('select').selectpicker({
				style: 'btn-default',
				size: 4
			});

			document.getElementById('updateSelections').addEventListener('click', showForm);
		});
	}

	function getFormValues() {
		var formValues = document.getElementsByTagName('select', '#rsvp');
		formValues = Array.prototype.slice.call(formValues);
		formValues = formValues.map(function(el) {
			return el.value;
		});

		return formValues;
	}

	function updateRsvp(householdId, data) {
		var updates = {};
		var i = 0,
			len = data.guests.length;

		var formValues = getFormValues();
		var drinkSelection = document.getElementById('drink-selection', '#rsvp').value;
		var songSelection = document.getElementById('song-selection', '#rsvp').value;

		for (i; i < len; i++) {
			updates['/householdId/' + householdId + '/' + i + '/status'] = formValues[i];
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

