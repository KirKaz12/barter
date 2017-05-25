localStorage.removeItem( 'inlineSVGdata' );
localStorage.removeItem( 'inlineSVGrev');
;( function( window, document )
{
	'use strict';
	var file     = 'img/svg_sprite.html',
			revision = 1;

	if( !document.createElementNS || !document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' ).createSVGRect )
		return true;

	var isLocalStorage = 'localStorage' in window && window[ 'localStorage' ] !== null,
		request,
		data,
		insertIT = function()
		{
			document.body.insertAdjacentHTML( 'afterbegin', data );
		},
		insert = function()
		{
			if( document.body ) insertIT();
			else document.addEventListener( 'DOMContentLoaded', insertIT );
		};

	if( isLocalStorage && localStorage.getItem( 'inlineSVGrev' ) == revision )
	{
		data = localStorage.getItem( 'inlineSVGdata' );
		if( data )
		{
			insert();
			return true;
		}
	}

	try
	{
		request = new XMLHttpRequest();
		request.open( 'GET', file );
		request.onload = function()
		{
			if( request.status >= 200 && request.status < 400 )
			{
				data = request.responseText;
				insert();
				if( isLocalStorage )
				{
					localStorage.setItem( 'inlineSVGdata',  data );
					localStorage.setItem( 'inlineSVGrev',   revision );
				}
			}
		}
		request.send();
	}
	catch( e ){}

}( window, document ) );


let SelectFX = window.SelectFX;
window.addEventListener('load', function() {
  var selectElements = document.querySelectorAll('select.cs-select');
  for (var x in selectElements) {
    if (typeof selectElements[x] === 'object') {
      new SelectFX(selectElements[x]);
    }
  };
}, false);

$(document).ready(function() {
	$("[data-item='pagination']").on("click", function(e) {
		$(this).addClass("pagination-link_active");
		$(this).siblings("[data-item='pagination']")
						.removeClass("pagination-link_active");
	});

	const burgerButton = $("[data-burger-btn]");
	const burgerMenu = $("[data-burger-menu]");
	const closeButton = $("[data-close-btn]");
	const expandBtn = $(".expand-btn");

	burgerButton.on("click", ()=>{
		$(burgerMenu).addClass("page-header__menu-wrapper_visible");
		$("body").css("overflowY", "hidden");
	});

	closeButton.on("click", ()=>{
		$(burgerMenu).removeClass("page-header__menu-wrapper_visible");
		$("body").css("overflowY", "visible");
	});
	expandBtn.on("mouseenter", ()=>{
		$("#icon-fullscreen").addClass("fullscreen_hover")
	});
	expandBtn.on("mouseleave", ()=>{
		$("#icon-fullscreen").removeClass("fullscreen_hover")
	});
	let mainPhotoSource = $(".item-card__good-main-photo img").attr("src");
	const callPopUp = () => {
		if($.magnificPopup) {
			$('.expand-btn').magnificPopup({
		    items: {
		      src: mainPhotoSource
		    },
		    type: 'image', // this is default type
			});
		}
	};
	callPopUp();
	


	var Gallery = function(
		mainItem, 
		galleryList, 
		galleryImages
	) {
		this._mainItem = $("."+mainItem);
		this._galleryList = $("."+galleryList);
		this._galleryImages = $("."+galleryImages);
		this._sourcesArray = [];
		this._count = 0;
	}

	Gallery.prototype._createSources = function() {
		var that = this;
		this._galleryImages.each(function(){
			that._sourcesArray.push($(this).attr("src"));
		});
	};
	Gallery.prototype._toggleSmallImage = function() {
		var that = this;
		this._galleryList.on("click", function(e){
			if(e.target.nodeName === "IMG") {
				var source = $(e.target).attr("src");
				that._mainItem.css("opacity", 0);
				that._mainItem.attr("src", source);
				that._mainSource = that._mainItem.attr("src");
				$(e.target).addClass("item-card__good-small-photos_active");
				$(e.target).siblings("img").each(function(index, elem){
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

	Gallery.prototype._popUp = function(source) {
		if($.magnificPopup) {
			$('.expand-btn').magnificPopup({
		    items: {
		      src: source
		    },
		    type: 'image', // this is default type
			});
		}
	}


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
	Gallery.prototype._offEventsOnMobiles = function() {
		var that = this;
		if(window.innerWidth < 768) {
			this._galleryList.off("click");
			this._mainItem.off("click");
		}
		$(window).on("resize", function(){
			if(window.innerWidth < 768) {
				that._galleryList.off("click");
				that._mainItem.off("click");
			} else {
				that._toggleSmallImage();
				//that._toggleMainImage();
			}
		});
	};
	Gallery.prototype.init = function() {
		this._createSources();
		this._toggleSmallImage();
		//this._toggleMainImage();
		//this._offEventsOnMobiles();
	};
	new Gallery(
		"item-card__good-main-photo img",
		"item-card__good-small-photos",
		"item-card__good-small-photos img"
		).init();

	const hoverEvent = (selector, className, element)=> {
		$(selector).on("mouseenter", function(){
			$(element).addClass(className);
		});
		$(selector).on("mouseleave", function(){
			$(element).removeClass(className);
		});
	}
	hoverEvent("[data-close-form]", "close_hover", "#icon-close");
	const closePopUp = (closeBtn)=>{
		$(closeBtn).on("click", function(){
			$(this).parents("[data-pop-up]").each(function(index,elem){
				$(elem).hide("slow");
			})
		});
	};
	closePopUp("[data-close-form]");
	const confirmInput = $("[data-confirm-input]");
	const changeButtonState = (input) => {
		input.on("keyup", function(){
			let attr = $(this).attr("data-confirm-input");
			let btn = $(this).siblings("[data-confirm-btn]");
			let value = this.value;
			if( value.length > 0 && !isNaN(value)) {
				btn.addClass("post-content__post-user-confirm-btn_active");
			} else {
				btn.removeClass("post-content__post-user-confirm-btn_active");
			}
		});
	};
	changeButtonState(confirmInput);
});



        