// normalize the user's zoom setting 
// in order not to mess up the layout
// we make sure everything is readable
if (window.devicePixelRatio < 2) 
	document.documentElement.style.zoom = 1 / window.devicePixelRatio
else // retina
	document.documentElement.style.zoom = 2 / window.devicePixelRatio;