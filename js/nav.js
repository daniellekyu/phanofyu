module.exports = (function() {
	// Select the elements we want to show or hide
	var menu = document.querySelector('.menu');
	var overlay = document.querySelector('.overlay');


	// When the user clicks on the hamburger icon the 'open' class is added
	// to both the menu and overlay elements making them visible and triggering the animation
	$('.mobile-btn').on('click', function(){
		menu.className += ' open';
		overlay.className += ' open';
	});


	// When the close button is clicked the 'open' class is removed from
	// both the menu and overlay elements making them invisible
	$('.close').on('click', function(){
		menu.className = 'menu';
		overlay.className = 'overlay';
	});

	// If a user clicks outside the menu on the overlay it will also trigger the event
	// to hide the menu and overlay elements
	window.addEventListener('click', function(event){
		if(event.target === overlay){
			menu.className = 'menu';
			overlay.className = 'overlay';
		}
	});

	$('.menu-item').each(function () {
	    var item = this;
	    item.addEventListener('click', function(e) {
	        e.preventDefault();
	        var href = e.target.href;
	        var hash = e.target.hash;
	        $('.close').trigger('click');
	        $('html, body').animate({
	            scrollTop: $(hash).offset().top + 'px'
	        }, 'slow');
	    });
	});
})();
