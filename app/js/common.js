'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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

$(document).ready(function () {
	$("[data-item='pagination']").on("click", function (e) {
		$(this).addClass("pagination-link_active");
		$(this).siblings("[data-item='pagination']").removeClass("pagination-link_active");
	});

	var burgerButton = $("[data-burger-btn]");
	var burgerMenu = $("[data-burger-menu]");
	var closeButton = $("[data-close-btn]");
	var expandBtn = $(".expand-btn");

	burgerButton.on("click", function () {
		$(burgerMenu).addClass("page-header__menu-wrapper_visible");
		$("body").css("overflowY", "hidden");
	});

	closeButton.on("click", function () {
		$(burgerMenu).removeClass("page-header__menu-wrapper_visible");
		$("body").css("overflowY", "visible");
	});
	expandBtn.on("mouseenter", function () {
		$("#icon-fullscreen").addClass("fullscreen_hover");
	});
	expandBtn.on("mouseleave", function () {
		$("#icon-fullscreen").removeClass("fullscreen_hover");
	});
	var mainPhotoSource = $(".item-card__good-main-photo img").attr("src");
	var callPopUp = function callPopUp() {
		if ($.magnificPopup) {
			$('.expand-btn').magnificPopup({
				items: {
					src: mainPhotoSource
				},
				type: 'image' });
		}
	};
	callPopUp();

	var Gallery = function Gallery(mainItem, galleryList, galleryImages) {
		this._mainItem = $("." + mainItem);
		this._galleryList = $("." + galleryList);
		this._galleryImages = $("." + galleryImages);
		this._sourcesArray = [];
		this._count = 0;
	};

	Gallery.prototype._createSources = function () {
		var that = this;
		this._galleryImages.each(function () {
			that._sourcesArray.push($(this).attr("src"));
		});
	};
	Gallery.prototype._toggleSmallImage = function () {
		var that = this;
		this._galleryList.on("click", function (e) {
			if (e.target.nodeName === "IMG") {
				var source = $(e.target).attr("src");
				that._mainItem.css("opacity", 0);
				that._mainItem.attr("src", source);
				that._mainSource = that._mainItem.attr("src");
				$(e.target).addClass("item-card__good-small-photos_active");
				$(e.target).siblings("img").each(function (index, elem) {
					$(elem).removeClass("item-card__good-small-photos_active");
				});
				/*$('.expand-btn').magnificPopup({
       items: {
         src: source
       },
       type: 'image' // this is default type
    });*/
				that._popUp(that._mainSource);
				that._mainItem.animate({ "opacity": "1" }, 500);
			}
		});
	};

	Gallery.prototype._popUp = function (source) {
		if ($.magnificPopup) {
			$('.expand-btn').magnificPopup({
				items: {
					src: source
				},
				type: 'image' });
		}
	};

	/*	Gallery.prototype._toggleMainImage = function() {
 		var that = this;
 		this._mainItem.on("click", function(e){
 			that._count++
 			if(that._count === that._sourcesArray.length)
 				that._count = 0;
 			$(this).css("opacity", 0);
 			$(this).attr("src", that._sourcesArray[that._count]);
 			$(this).animate({ "opacity": "1" }, 500);
 			$('.expand-btn').magnificPopup({
 			    items: {
 			      src: that._sourcesArray[that._count]
 			    },
 			    type: 'image' // this is default type
 				});
 
 		});
 	};*/
	Gallery.prototype._offEventsOnMobiles = function () {
		var that = this;
		if (window.innerWidth < 768) {
			this._galleryList.off("click");
			this._mainItem.off("click");
		}
		$(window).on("resize", function () {
			if (window.innerWidth < 768) {
				that._galleryList.off("click");
				that._mainItem.off("click");
			} else {
				that._toggleSmallImage();
				//that._toggleMainImage();
			}
		});
	};
	Gallery.prototype.init = function () {
		this._createSources();
		this._toggleSmallImage();
		//this._toggleMainImage();
		//this._offEventsOnMobiles();
	};
	new Gallery("item-card__good-main-photo img", "item-card__good-small-photos", "item-card__good-small-photos img").init();

	var hoverEvent = function hoverEvent(selector, className, element) {
		$(selector).on("mouseenter", function () {
			$(element).addClass(className);
		});
		$(selector).on("mouseleave", function () {
			$(element).removeClass(className);
		});
	};
	hoverEvent("[data-close-form]", "close_hover", "#icon-close");
	var closePopUp = function closePopUp(closeBtn) {
		$(closeBtn).on("click", function () {
			$(this).parents("[data-pop-up]").each(function (index, elem) {
				$(elem).hide("slow");
			});
		});
	};
	closePopUp("[data-close-form]");
	var confirmInput = $("[data-confirm-input]");
	var changeButtonState = function changeButtonState(input) {
		input.on("keyup", function () {
			var attr = $(this).attr("data-confirm-input");
			var btn = $(this).siblings("[data-confirm-btn]");
			var value = this.value;
			if (value.length > 0 && !isNaN(value)) {
				btn.addClass("post-content__post-user-confirm-btn_active");
			} else {
				btn.removeClass("post-content__post-user-confirm-btn_active");
			}
		});
	};
	changeButtonState(confirmInput);
	var showAllBtn = $("[data-expand-link]");
	var listToExpand = $("[data-expand-list]");
	showAllBtn.on("click", function (e) {
		e.preventDefault();
		listToExpand.each(function (index, elem) {
			$(elem).toggleClass("services__list_visible");
		});
		var text = $(this).text();

		if (text.indexOf("Показать все") !== -1) {
			console.log(text);
			$(this).text("Свернуть");
		} else {
			$(this).text("Показать все");
		}
	});

	var popUpTrigger = $("[data-trigger='pop-up_link']");
	var popUpList = $("[data-trigger='pop-up_list']");
	$('body').on("click", function (e) {

		var parent = $(e.target).parents("[data-trigger='pop-up_link']");
		if ($(e.target).is(popUpTrigger) || parent.length !== 0) {
			e.preventDefault();
			popUpList.css("display") === "none" ? popUpList.show() : popUpList.hide();
		} else popUpList.hide();
	});
});