var handlebars = require('handlebars');

handlebars.registerHelper('eq', function (value1, value2, options) {
	if (value1 === value2) {
		return options.fn(this);
	}

	return options.inverse(this);
});

var source = require('./../hbs/rsvp.hbs');
var firebase = require('firebase/app');

module.exports = function() {
	var database = firebase.database();

	var renderTemplate = handlebars.compile(source);

	var queryString = window.location.search;

	if (queryString) {
		var householdId = queryString.slice(1, queryString.length);
		var household,
			data = {};
		firebase.database().ref('householdId/' + householdId).once('value').then(function(response) {
			household = response.val();
			data.guests = household;
			var html = renderTemplate(data);
			$('#section-rsvp').append(html);
		});
		document.getElementById('saveRsvp').addEventListener('click', updateRsvp.bind(this, householdId, data));
	}

	// on update of any form element, update userData

	function getFormValues() {
		// should return constructed object
	};

	function updateRsvp(householdId, data) {
		var updates = {};
		updates['/householdId/' + householdId + '/status'] = ['attending'];

		firebase.database().ref().update(updates);
	}
};

