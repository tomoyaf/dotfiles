

chrome.runtime.onMessage.addListener(function (message) {
	if (message == 'show_gizmo') {
		show_gizmo();
	}
	else if (message == 'invalidate_gizmo') {
		x = 0;
		y = 0;
	}
})

// keep state for last clicked place
// may become the starting position for gizmo
var x = 0;
var y = 0;

document.onmousedown = document.oncontextmenu = function(e) {
	if (is_downloadable(e.target)) {
		x = e.clientX;
		y = e.clientY;
	}
	//show_gizmo();///
}

function show_gizmo() {
	if (!x && !y) return;
	var img = document.createElement('img')
	img.src = chrome.runtime.getURL('icons/file_down.png');
	img.style.cssText = 'position:fixed;opacity:1;z-index:999999;width:56px;height:56px;';
	document.body.appendChild(img);
	img.style.left = (x - 36) + 'px';
	img.style.top  = (y - 56) + 'px';
	setTimeout(function () {
		var duration = calc_duration(distance(x-28, y-56, window.innerWidth-60, -48))
		img.style.webkitTransition = 'all '+ duration + 's';
		img.style.left = (window.innerWidth - 60) + 'px';
		img.style.top  = (-48) + 'px';
		img.style.opacity  = .5;
		img.style.width  = 30 + 'px';
		img.style.height = 30 + 'px';
		setTimeout(function () {
			document.body.removeChild(img);
		}, duration*1000 + 200)
	}, 1)
}

function distance(x1, y1, x2, y2) {
	return Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
}

function calc_duration(distance, speed) {
	speed = speed || 800; // [px/sec]
	return distance / speed;
}

function is_downloadable(el) {
	return el.nodeName == 'IMG' || is_link_or_descendant_of_link(el);
}

function is_link_or_descendant_of_link(el) {
	do {
		if (el.nodeName == 'A' && el.href)
			return true;
	} while (el = el.parentNode);
	return false;
}


//
// Focus mode
//

chrome.runtime.onMessage.addListener(function (message) {
	if (message == 'focus_mode_enable') {
		focus_mode_enable();
	} else 	if (message == 'focus_mode_disable') {
		focus_mode_disable();
	}
})

function focus_mode_enable() {
	return;
	document.body.style.webkitTransition = '-webkit-filter .5s';
	document.body.style.webkitTransform = 'translateZ(0)';
	document.body.style.webkitFilter = 'blur(2.5px)';
}

function focus_mode_disable() {
	return;
	document.body.style.webkitTransition = '-webkit-filter .25s';
	document.body.style.webkitFilter = '';
	setTimeout(function () {
		document.body.style.webkitTransition = '';
		document.body.style.webkitTransform = '';
	}, 300)
}


