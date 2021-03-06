import $ from "jquery"

const Helper = {};
Helper.flash_message = function (type, message) {
	const el = document.createElement('div');
	const id = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
	el.classList.add('alert', "alert-" + type, "alert-dismissible", "fade", "show");
	el.setAttribute("style", "width:100%;position:fixed;top:0;z-index:1100");
	el.setAttribute("role", "alert");
	el.setAttribute("id", id);
	el.innerHTML = `${message}<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>`;
	document.body.appendChild(el);
	window.setTimeout(function () {
		$(`#${id}`).fadeTo(500, 0).slideUp(500, function () {
			$(this).alert('close')
		});
	}, 1000);
}

Helper.make_room = function (s1, s2) {
	if (s1 < s2)
		return s1 + "_" + s2;
	return s2 + "_" + s1;
}

Helper.fetch = function (collection) {
	return new Promise((resolve, reject) => {
		collection.fetch({
			success: function (collection) {
				resolve(collection);
			},
			error: function (collection, response) {
				reject(response);
			}
		});
	})
}

Helper.save = function (model) {
	return new Promise((resolve, reject) => {
		model.save({}, {
			success: function(model) {
				resolve(model);
			},
			error: function(model, response) {
				reject(response);
			}
		});
	})
}

Helper.ajax = function(url, data, method) {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: url,
			type: method,
			data: data
		})
		.done(resolve)
		.fail(reject);
	})
}

Helper.contain = function(collection, callback) {
	if (collection.find(callback))
		return true;
	return false
}

Helper.getTimeString = function(distance){
	if (distance < 0)
		return null;
	const seconds = distance % 60;
	distance = (distance / 60) >> 0
	const minutes = distance % 60;
	distance = (distance / 60) >> 0;
	const hours = distance % 24;
	distance = (distance / 24) >> 0;
	const days = distance;
	let answer = `${days}d ${hours}h ${minutes}m ${seconds}s`
	answer = 'in ' + answer
	return answer
}

export default Helper;