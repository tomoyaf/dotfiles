
var bg = chrome.extension.getBackgroundPage();
var stored = localStorage;
var hide_interrupted = (stored.hide_interrupted == "true");
var buttons = {'left':1, 'middle':2, 'right':3, 'esc':27, 'space':32, 'enter':13}


function byId(id) { return document.getElementById(id); }
function byClass(id) { return document.getElementsByClassName(id)[0]; }

function change_state(state, id) {
	chrome.downloads[state](id);
}


var timers = [];

function byte_format(bytes) {
	if (!bytes) return "0 B";
	if (bytes < 1000*1000) return (bytes/1000).toFixed() + " KB";
	if (bytes < 1000*1000*10) return (bytes/1000/1000).toFixed(1) + " MB";
	if (bytes < 1000*1000*1000) return (bytes/1000/1000).toFixed() + " MB";
	if (bytes < 1000*1000*1000*1000) return (bytes/1000/1000/1000).toFixed(1) + " GB";
	return bytes + " B";
}

function time_format(s) {
	if (s < 60) return Math.ceil(s) + " secs";
	if (s < 60*5) return Math.floor(s/60) + " mins " + Math.ceil(s%60) + " secs";
	if (s < 60*60) return Math.ceil(s/60) + " mins";
	if (s < 60*60*5) return Math.floor(s/60/60) + " hours " + (Math.ceil(s/60)%60) + " mins";
	if (s < 60*60*24) return Math.ceil(s/60/60) + " hours";
	return Math.ceil(s/60/60/24) + " days";
}

function refresh_download_view(id) {
	chrome.downloads.search({ id: id }, function (results) {			
		var el = document.createElement('div');
		el.innerHTML = get_download_view(results[0]);
		downloads.replaceChild(el.firstChild, byId("download-"+id));
	});
}

function start_timer(id) {
	clearInterval(timers[id]);

	var progress_last_value     = 0; // [0,1]
	var progress_current_value  = 0; // [0,1]
	var progress_next_value     = 0; // [0,1]
	var progress_remaining_time = 0; // [ms]
	var progress_last_frame     = +new Date;

	function timer() {

		var el = byId("download-" + id);
		var status = el.getElementsByClassName('status')[0];
		var progress = el.getElementsByClassName('progress')[0];

		chrome.downloads.search({ id: id }, function (results) {
			var e = results[0];

			// download not found (probably deleted or canceled on danger)
			if (!e) {
				stopTimer(timers[id]);
				init();
				return;
			}

			// show progress metrics (speed, size, progress bar)
			if (e.state != 'complete') {
				var speed = 0, left_text = "";

				var remaining_seconds = (new Date(e.estimatedEndTime) - new Date()) / 1000;
				var remaining_bytes = e.totalBytes - e.bytesReceived;
				var speed = remaining_bytes / remaining_seconds;

				if (speed) {
					left_text = ", " + time_format(remaining_seconds) //+ " left";
				}

				// UI updated in a requestAnimationFrame loop elsewhere
				if (progress_current_value == 0) {
					if (speed) {
						progress_current_value = e.bytesReceived / e.totalBytes;
						progress_next_value = (e.bytesReceived + speed) / e.totalBytes;
						progress_last_value = progress_current_value;
						progress_remaining_time += 1000;
					}
				} else {
					// we use a local current_value, because the global is UI controlled
					var current_progress = e.bytesReceived / e.totalBytes; 
					var progress_delta = current_progress - progress_last_value;
					progress_next_value = current_progress + progress_delta;
					progress_last_value = current_progress;
					progress_remaining_time += 1000;
				}

				status.innerHTML = 
					byte_format(speed) + "/s &ndash; " +
					byte_format(e.bytesReceived) + " of " + byte_format(e.totalBytes) + left_text;

			  // in_progress, but all the bytes are downloaded
				if (e.bytesReceived && e.bytesReceived == e.totalBytes) {
					status.innerHTML = byte_format(e.totalBytes);
				}
			} else { 
				status.innerHTML = "";
				clearInterval(timers[id]);
				refresh_download_view(e.id)
			}
		});
	}
	timers[id] = setInterval(timer, 1000);
	setTimeout(timer, 1);

	// progress bar animation one frame
	function progressAnimationFrame() {

		var el = byId("download-" + id);
		var progress = el.getElementsByClassName('progress')[0];

		var now = +new Date;
		var elapsed = now - progress_last_frame;
		var remaining_progress = progress_next_value - progress_current_value;
		progress_last_frame = now;

		// check if there's a need to update
		if (progress_remaining_time > 0 && remaining_progress > 0) {
			// update progress value
			progress_current_value += (elapsed / progress_remaining_time) * remaining_progress;
			// update remaining time
			progress_remaining_time -= elapsed;
			// update UI
			progress.style.width = (100 * progress_current_value) + "%";
		}
		// go on as long as the download is refreshing
		if (timers[id]) {
			window.requestAnimationFrame(progressAnimationFrame);
		}
	}
	// start the animation
	window.requestAnimationFrame(progressAnimationFrame);
}

function stopTimer(id) {
	clearInterval(timers[id]);
	timers[id] = null;
}

function findClosestItem(el) {
	do {
		if (el.className && el.className.indexOf('download') != -1) {
			return el;
		}
	} while (el = el.parentNode);
}

function showEmptySmile() {
	byId('downloads').innerHTML = '<div id="empty-smile">:-)</div>';
}

function clearAllDownloadsExceptRunning(callback) {
	chrome.downloads.search({}, function (results) {		
		var running = results.map(function (item) {
			// collect downloads in progress
			if (item.state == 'in_progress') 
				return true;
			// erase the rest
			chrome.downloads.erase({ id: item.id });
		});
		callback && callback(running);
	});
}

function clearAllClick() {
	Modal.hide();
	clearAllDownloadsExceptRunning(function (running) {
		if (running.length)
			init();
		else
			showEmptySmile();
	})
}

byId('clear').onclick = function () { 
	if (options.dont_show_clear_dialog)
		clearAllClick();
	else
		Modal.show();
};
byId('modal-close').onclick = function () { Modal.hide() };
byId('clear-all').onclick = clearAllClick;

byId('downloads').ondblclick = function (e) {
	var el = e.target;
	if (el.nodeName == 'A') return;
	el = findClosestItem(el);
	if (el) {
		var id = +el.dataset.id;	
		// we don't have to worry about download states 
		// chrome's API only opens the file if it's available	
		chrome.downloads.open(id);
		e.preventDefault();
		var selected = byId('downloads').getElementsByClassName('selected')[0]
		selected && selected.classList.remove('selected')
		//window.getSelection().removeAllRanges();
	}
}



byId('downloads').onclick = function (e) {
	var c = e.target.className;
	if (e.target.nodeName == 'A') {
		if (!/resume|cancel|pause|retry|erase|name|show/.test(c))
			return;
		if (e.which != buttons.left)
			return;
		var el = findClosestItem(e.target);
		var id = +el.dataset.id;
		if (/resume|cancel|pause/.test(c)) {
			change_state(c, id);
			refresh_download_view(id);
			if (/resume/.test(c))
				start_timer(id);
			else if (/cancel|pause/.test(c))
				stopTimer(id);
		} else if (/retry/.test(c)) {
			chrome.downloads.search({ id: id }, function (results) {
				chrome.downloads.download({ url: results[0].url }, function (new_id) {
					start_timer(new_id); /// May become redundant later
				});
			});
		} else if (/erase/.test(c)) {
			// put it to the end of the list
			chrome.downloads.search(
				{ limit: 6, filenameRegex: '.+', orderBy: ['-startTime'] }, 
				function (results) {
					// remove selected element from the UI first
					var list = el.parentNode;
					list.removeChild(el);
					// bring up a new element to the end of the list
					var e = results[5];
					if (!e || hide_interrupted && e.state == 'interrupted') return; 
					var new_el = element_from_html(get_download_view(e));
					list.appendChild(new_el);
				}
			);
			chrome.downloads.erase({ id: id });
		} else if (/show/.test(c)) {
			chrome.downloads.show(id);
		} else if (/name/.test(c)) {
			chrome.downloads.open(id);
			return false;
		}
	}
}

byId('downloads').ondragstart = function (e) {
	var el = findClosestItem(e.target);
	if (el) {
		var id = +el.dataset.id;		
		chrome.downloads.drag(id);
		el.classList.remove('active');
		e.preventDefault();
	}
}


byId('downloads').addEventListener('click', function (e) {
	if (e.target.nodeName == 'A') return true;
	var selected = byId('downloads').getElementsByClassName('selected')[0]
	selected && selected.classList.remove('selected')
	var el = findClosestItem(e.target);
	el && el.classList.add('selected')
}, false)


// Left click on any link invokes the link's action
// Left click on non-link elements (empty space) invokes the 'open file' action
// Middle click anywhere invokes the default action (first control link)
// Right click anywhere invokes the 'more options' action (remove)
function general_click(e) {
	var el = findClosestItem(e.target);

	if (e.which == buttons.left && e.target.nodeName != 'A')  {
		el.classList.remove('active');
		id = +el.dataset.id;
		chrome.downloads.open(id);
		e.preventDefault();
		return;
	}

	if (e.which == buttons.middle) {
		var first_link = el.querySelector('.controls a');
		first_link.classList.remove('active');
		first_link.click();
		e.preventDefault();
		return;
	}

	// opening download with a link is in the general controls handler
	// only updating the UI here
	if (e.which == buttons.left && e.target.classList.contains('name')) {
		el.classList.remove('active');
	}

	if (e.which == buttons.right)  {
		e.preventDefault();
		var remove = el.getElementsByClassName('remove')[0];
		remove.style.display = 'block';
		setTimeout(function () {
			remove.style.webkitTransform = 'translate3d(0,0,0)';
			remove.style.opacity = 1;
			el.onmouseleave = function (e) {
				el.onmouseleave = null;
				remove.style.webkitTransform = 'translate3d(30px,0,0)';
				remove.style.opacity = 0;
				setTimeout(function () { remove.style.display = 'none'; }, 500);
			}
		}, 1)
	}
	return false;
}


function mouse_down(e) {
	var el = findClosestItem(e.target);
	if (e.which == buttons.middle) { // && e.target.nodeName != 'A'
		var first_link = el.querySelector('.controls a');
		first_link.classList.add('active');
	}
	if (e.which == buttons.left && el.draggable && is_target_whole_item(e.target)) {
		el.classList.add('active');
	}
}

function is_target_whole_item(el) {
	return el.nodeName != 'A' || el.classList.contains('name');
}

byId('downloads').addEventListener('mousedown', mouse_down, false)
byId('downloads').addEventListener('click', general_click, false)
byId('downloads').addEventListener('contextmenu', general_click, false)


function get_proper_filename(filename) {
	var back_array =  filename.split('\\');
	var forward_array = filename.split('/');
	var array = back_array.length > forward_array.length ? back_array : forward_array;
	return array.pop().replace(/.crdownload$/, '');
}

function get_download_view(e) {
		var controls = "", status = "", progress_class = "", progress_width = 0;
		if (e.state == 'complete') { // complete
			var folder = /mac/i.test(navigator.platform) ? 'Finder' : 'folder';
			controls = "<a class='show' href='#'>Show in " + folder + "</a>";
			status = byte_format(Math.max(e.totalBytes, e.bytesReceived));
			if (!e.exists) { // interrupted
				status = "Removed";
				controls = "<a class='retry' href='#'>Retry download</a>";
			} 
		} else if (e.state == "interrupted") { // interrupted
			status = "Canceled";
			controls = "<a class='retry' href='#'>Retry download</a>";
		} 
		else { // in_progress
			if (e.paused) { // paused
				status = "Paused";
				controls = "<a class='resume' href='#'>Resume</a><a class='cancel' href='#'>Cancel</a>";
				progress_width = (100 * e.bytesReceived / e.totalBytes) + "%";
				progress_class = "paused";
			} else { //still downloading
				status = ""; //"491 KB/s - 3.0 MB of 3.2 MB, 0 secs left";
				controls = "<a class='cancel' href='#'>Cancel</a>";	
				progress_width = (100 * e.bytesReceived / e.totalBytes) + "%";
				progress_class = "in-progress";		
			}
		}

		var img_src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
		chrome.downloads.getFileIcon(e.id, {}, function (icon) {
			if (icon) {
				img_src = icon;
				byId("img-" + e.id).src = icon;
			}
		});

		var canceled_class = (e.state == "interrupted") ? "canceled" : "";
		var removed_class = (!e.exists) ? "removed" : "";
		var extra_class = removed_class + " " + canceled_class + " " + progress_class;
		var draggable_attr = (e.state == 'complete' && e.exists) ? 'true' : 'false';

		var prop_filename = get_proper_filename(e.filename);


		// dangerous, not yet accepted download needs to be marked
		if (is_dangerous(e)) {
			extra_class += ' danger';
		}


		return "<div class='download " + extra_class + "' id='download-" + e.id + "' data-id='"+ e.id +"' draggable='"+ draggable_attr +"'>" +
					"<a class='remove erase' href='#' title='Remove from list'>x</a>" +
					"<img id='img-"+ e.id +"' src='"+ img_src +"' class='icon' />" +
			        "<div class='name-wrapper'>" +

			        ((e.state != 'complete' || !e.exists)
			        	? "<span class='name'>" + prop_filename + "</span>"
				        : "<a class='name' href='file://" + e.filename + "' title='Open'>" + 
				              prop_filename + // " (" + e.state + ")" + 
				        "</a>") +

			        "</div>" +
			        "<div class='progress-bar'><div class='progress' style='width:" + progress_width + "'></div></div>" + 
			        "<div><a class='src-url' href='" + e.url + "'>" + e.url + "</a></div>" +

			        "<div class='controls'>" + controls  + "<span class='status'>" + status + "</span>" + "</div>" +
		        "</div>";
}

function is_dangerous(e) {
	return !/safe|accepted/.test(e.danger) && e.state == 'in_progress';
}

function element_from_html(html) {
	var el = document.createElement('div');
	el.innerHTML = html;
	return el.firstChild;
}



chrome.downloads.onCreated.addListener(function (e) {
	var downloads = byId('downloads');
	var new_el = element_from_html(get_download_view(e));
	downloads.insertBefore(new_el, downloads.firstChild);
	downloads.removeChild(downloads.lastChild);
});

chrome.downloads.onChanged.addListener(function (delta) {
	if (delta.filename)
		refresh_download_view(delta.id);
	if (delta.danger && delta.danger.current == 'accepted')
		byId("download-" + delta.id).classList.remove('danger');
});


//
// Modal
//

var Modal = (function () {

	var visible = false;
	var duration = 0.1; // sec

	function show() {
		visible = true;
		byId('downloads').style.opacity =  0.5;
		byClass('modal-overlay').style.display = 'block';
		byClass('modal').style.display = 'block';
		setTimeout(function () {
			byClass('modal').classList.add('visible');
		}, 1)
	}

	function hide() {
		visible = false;
		byId('downloads').style.opacity =  1;
		byClass('modal-overlay').style.display = 'none';
		byClass('modal').classList.remove('visible');
		setTimeout(function () {
			byClass('modal').style.display = 'none';
		}, duration * 1000 + 10);
	}

	function isVisible() {
		return visible;
	}

	document.addEventListener("keydown", function (e) {
		if (isVisible()) {
			if (e.keyCode == buttons.enter) {
				clearAllClick()
				e.preventDefault();
			}
			if (e.keyCode == buttons.space) {
				clearAllClick()
				e.preventDefault();
			}
			if (e.keyCode == buttons.esc) {
				hide();
				e.preventDefault();
			}
		}
	});

	return {
		show: show,
		hide: hide,
		isVisible: isVisible
	};
})();


//
// Options
//

// default options
var options = {'dont_show_clear_dialog': false};

// init options
chrome.storage.sync.get(options, function (options_new) {
	options = options_new;
  byId('dont_show_clear_dialog').checked = options.dont_show_clear_dialog;
});

byId('dont_show_clear_dialog').onchange = function (e) {
	chrome.storage.sync.set({'dont_show_clear_dialog': e.target.checked});
}


//
// Init
//

function init () {
	// we need this 'empty' search to force refresh the downloads list
	// e.g.: find files that were removed 
	chrome.downloads.search({ limit:0 }, function () {
		chrome.downloads.search(
			{ limit: 5, filenameRegex: '.+', orderBy: ['-startTime'] }, 
			show_downloads_list
		);
		byId("show-all").focus();
	});
}

function show_downloads_list(results) {
	var target = byId('downloads');
	var html = "";

	results.forEach(function (e) {
		//if (!e.filename) return;
		if (hide_interrupted && e.state == 'interrupted') return; 

		// if the new download is dangerous prompt the user
		if (is_dangerous(e)) {
			// need a slight delay to get meaningful dialog box
			setTimeout(function () {
				chrome.downloads.acceptDanger(e.id);
			}, 100);
		}

		if (e.state == "in_progress" && !e.paused) {
			start_timer(e.id);
		}

		html += get_download_view(e);
	});

	if (html)
		target.innerHTML = html;
	else
		showEmptySmile();
}


byId("show-all").onclick = function (e) { 
	chrome.tabs.create({url:e.target.href,selected:true})
};


window.addEventListener("DOMContentLoaded", function () {
	chrome.runtime.sendMessage("popup_open");
});
window.addEventListener("unload", function () {
	// need this little trick to send message to the bg page
	var bg = chrome.extension.getBackgroundPage();
	bg.chrome.extension.sendMessage("popup_close");
});

init();
