// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.

// Uncomment to copy all static images under ../images to the output folder and reference
// them with the image_pack_tag helper in views (e.g <%= image_pack_tag 'rails.png' %>)
// or the `imagePath` JavaScript helper below.
//
// const images = require.context('../images', true)
// const imagePath = (name) => images(name, true)

require("@rails/ujs").start()
require("@rails/activestorage").start()
require("channels")

const $ = require("jquery");
global.$ = global.jQuery = $;
window.$ = window.jQuery = $;
require("bootstrap");
require("backbone");


import Helper from "./Helper.js"
global.Helper = Helper;
window.Helper = Helper;

import SPA from "./SPA.js"
if ($("html").data().isLogin) {
	SPA.start();
}
