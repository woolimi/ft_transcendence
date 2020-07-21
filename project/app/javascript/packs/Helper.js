import $ from "jquery"

const Helper = {};
Helper.flash_message = function (type, message) {
	const el = document.createElement('div');
	const id = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
	el.classList.add('alert', "alert-" + type, "alert-dismissible", "fade", "show");
	el.setAttribute("style", "width:100%;position:fixed;top:0;z-index:999");
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

export default Helper;