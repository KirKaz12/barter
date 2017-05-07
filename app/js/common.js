'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*localStorage.removeItem( 'inlineSVGdata' );
localStorage.removeItem( 'inlineSVGrev',);*/
;(function (window, document) {
	'use strict';

	var file = 'img/svg_sprite.html',
	    revision = 1;

	if (!document.createElementNS || !document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect) return true;

	var isLocalStorage = 'localStorage' in window && window['localStorage'] !== null,
	    request,
	    data,
	    insertIT = function insertIT() {
		document.body.insertAdjacentHTML('afterbegin', data);
	},
	    insert = function insert() {
		if (document.body) insertIT();else document.addEventListener('DOMContentLoaded', insertIT);
	};

	if (isLocalStorage && localStorage.getItem('inlineSVGrev') == revision) {
		data = localStorage.getItem('inlineSVGdata');
		if (data) {
			insert();
			return true;
		}
	}

	try {
		request = new XMLHttpRequest();
		request.open('GET', file);
		request.onload = function () {
			if (request.status >= 200 && request.status < 400) {
				data = request.responseText;
				insert();
				if (isLocalStorage) {
					localStorage.setItem('inlineSVGdata', data);
					localStorage.setItem('inlineSVGrev', revision);
				}
			}
		};
		request.send();
	} catch (e) {}
})(window, document);

var SelectFX = window.SelectFX;
window.addEventListener('load', function () {
	var selectElements = document.querySelectorAll('select.cs-select');
	for (var x in selectElements) {
		if (_typeof(selectElements[x]) === 'object') {
			new SelectFX(selectElements[x]);
		}
	};
}, false);

$("[data-item='pagination']").on("click", function (e) {
	$(this).addClass("pagination-link_active");
	$(this).siblings("[data-item='pagination']").removeClass("pagination-link_active");
});