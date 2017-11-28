(function (window) {

	var unseen = [];

	chrome.downloads.setShelfEnabled(false);

	var timer;

	function refresh_toolbar_icon(items) {
		if (!items.length) {
			clearInterval(timer);
			timer = null;
			draw_toolbar_icon(unseen.length);
			return;
		}

		if (!timer)
			timer = setInterval(refresh, 500)

		var longest_item = { estimatedEndTime: 0 };
		items.forEach(function (e) {
			estimatedEndTime = new Date(e.estimatedEndTime);
			longestEndTime = new Date(longest_item.estimatedEndTime);
			if (estimatedEndTime > longestEndTime) {
				longest_item = e;
			}
		});
		var progress = longest_item.bytesReceived / longest_item.totalBytes;
		draw_toolbar_progress_icon(progress)
	}

	function refresh() {
		chrome.downloads.search(
			{ state: 'in_progress', paused: false },
			refresh_toolbar_icon
		);
	}

	chrome.downloads.onCreated.addListener(refresh);

	chrome.downloads.onChanged.addListener(function (delta) {
		if (delta.state || delta.paused) {
			refresh();
		}
	});

	refresh();

	chrome.downloads.onChanged.addListener(function (e) {
		console.log('changed')
		console.log(e)
		// filename chosen from the file picker (right click)
		if (e.filename && e.filename.previous == '') {
			send_show_gizmo();
		}
		// download turns out to be not safe
		if (e.danger && e.danger.current != 'safe') {
			console.log('download not safe ' + e.id)
		}
		// user accepted the danger
		if (e.danger && e.danger.current == 'safe') {
			console.log('danger changed to safe ' + e.id)
		}
	})

	function send_show_gizmo() {
		console.log('gizmo')
		send_message_to_active_tab('show_gizmo')
	}

	function send_invalidate_gizmo() {
		send_message_to_active_tab('invalidate_gizmo')
	}



	//
	// Toolbar icon
	//

	var canvas = document.createElement('canvas');
	canvas.width = 38;
	canvas.height = 38;
	var ctx = canvas.getContext('2d');

	var scale = (window.devicePixelRatio < 2) ? 0.5 : 1;
	var size = 38 * scale;

	ctx.scale(scale, scale);


	function draw_toolbar_progress_icon(progress) {

		var w = progress * 38

		ctx.clearRect(0, 0, 38, 38);

		ctx.lineWidth = 2;
		ctx.fillStyle = "#c0c0c0"; // c0c0c0 | 555
		ctx.fillRect(0, 28, 38, 12);

		ctx.fillStyle = "#2566ff"; // 0bbf29 | 2566ff | 4dd01a | 1757ed | 76cd54 
		ctx.fillRect(0, 28, w, 12);

		ctx.strokeStyle = "#2566ff"; // 666
		ctx.fillStyle = "#2566ff"; // 666
		ctx.lineWidth = 10;
		ctx.beginPath();
		ctx.moveTo(20, 0);
		ctx.lineTo(20, 14);
		ctx.stroke();

		ctx.moveTo(6, 10);
		ctx.lineTo(34, 10);
		ctx.lineTo(20, 24);
		ctx.fill();

		var icon = { imageData: {} };
		icon.imageData[size] = ctx.getImageData(0, 0, size, size);
		chrome.browserAction.setIcon(icon);
	}


	function draw_toolbar_icon(unseen) {

		var color = unseen ? "#0bbf29" : "#5e5e5e"; // 666

		ctx.clearRect(0, 0, 38, 38);

		ctx.strokeStyle = color;
		ctx.fillStyle = color;
		ctx.lineWidth = 14;
		ctx.beginPath();
		ctx.moveTo(20, 2);
		ctx.lineTo(20, 18);
		ctx.stroke();

		ctx.moveTo(0, 18);
		ctx.lineTo(38, 18);
		ctx.lineTo(20, 38);
		ctx.fill();

		var icon = { imageData: {} };
		icon.imageData[size] = ctx.getImageData(0, 0, size, size);
		chrome.browserAction.setIcon(icon);
	}

	function interpolation(start_value, end_value, time_elapsed) {
		color = time_elapsed * (end_value - start_value) / time_elapsed
	}

	function rgb_interpolation(start_color, end_color, time_elapsed) {
		return {
			R: interpolation(start_color.R, end_color.R, time_elapsed),
			G: interpolation(start_color.G, end_color.G, time_elapsed),
			B: interpolation(start_color.B, end_color.B, time_elapsed)
		};
	}

	function send_message_to_active_tab(msg) {
		var current = { currentWindow: true, active: true, windowType: 'normal' };
		chrome.tabs.query(current, function (tabs) {
			tabs.forEach(function (tab) {
				chrome.tabs.sendMessage(tab.id, msg);
			})
		})
	}



	//
	// Popup open
	//

	var is_popup_open = false;
	chrome.runtime.onMessage.addListener(function (message) {
		console.log(message)
		if ('popup_open' == message) {
			is_popup_open = true;
			unseen = [];
			refresh();
			send_invalidate_gizmo();
			send_focus_mode_enable();
		} else if ('popup_close' == message) {
			is_popup_open = false;
			send_focus_mode_disable();
		}
	});
	// download finished with popup closed -> unseen
	chrome.downloads.onChanged.addListener(function (e) {
		if (e.state && e.state.current == 'complete' && !is_popup_open) {
			unseen.push(e)
		}
	});



	//
	// Focus mode
	//

	function send_focus_mode_enable() {
		send_message_to_active_tab('focus_mode_enable');
	}
	function send_focus_mode_disable() {
		send_message_to_active_tab('focus_mode_disable');
	}

})(window);
