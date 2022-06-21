/*
JALISWALL 0.1
by Pierre Bonnin - @PierreBonninPRO - 2015
*/
(function($){
  $.fn.jaliswall = function(options){

    this.each(function(){
	//стремный слайдер
		// gallery container
	var $rgGallery= $('#rg-gallery'),
	// carousel container
	$esCarousel= $rgGallery.find('div.es-carousel-wrapper'),
	// the carousel items
	$items= $esCarousel.find('ul > li'),
	// total number of items
	itemsCount= $items.length;
	
	Gallery	= (function() {
		//gallery function
	})();
	var current			= 0, 
	// mode : carousel || fullview
	mode 			= 'carousel',
	// control if one image is being loaded
	anim			= false,
	init			= function() {
		
		// (not necessary) preloading the images here...
		$items.add('<img src="images/ajax-loader.gif"/><img src="images/black.png"/>').imagesLoaded( function() {
			// add options
			_addViewModes();
			
			// add large image wrapper
			_addImageWrapper();
			
			// show first image
			_showImage( $items.eq( current ) );
		});
		
		// initialize the carousel
		_initCarousel();
		
	},
	
	_initCarousel	= function() {
	$esCarousel.show().elastislide({
		imageW 	: 65,
		onClick	: function( $item ) {
			if( anim ) return false;
			anim	= true;
			// on click show image
			_showImage($item);
			// change current
			current	= $item.index();
		}
	});
	// set elastislide's current to current
	$esCarousel.elastislide( 'setCurrent', current );
	},
	_addViewModes	= function() {
	
	// top right buttons: hide / show carousel
	
	var $viewfull	= $('<a href="#" class="rg-view-full"></a>'),
		$viewthumbs	= $('<a href="#" class="rg-view-thumbs rg-view-selected"></a>');
	
	$rgGallery.prepend( $('<div class="rg-view"/>').append( $viewfull ).append( $viewthumbs ) );
	
	$viewfull.bind('click.rgGallery', function( event ) {
		$esCarousel.elastislide( 'destroy' ).hide();
		$viewfull.addClass('rg-view-selected');
		$viewthumbs.removeClass('rg-view-selected');
		mode	= 'fullview';
		return false;
	});
	
	$viewthumbs.bind('click.rgGallery', function( event ) {
		_initCarousel();
		$viewthumbs.addClass('rg-view-selected');
		$viewfull.removeClass('rg-view-selected');
		mode	= 'carousel';
		return false;
	});
	},
	_addImageWrapper= function() {
	
	$('#img-wrapper-tmpl').tmpl( {itemsCount : itemsCount} ).appendTo( $rgGallery );
	
	if( itemsCount > 1 ) {
		// addNavigation
		var $navPrev		= $rgGallery.find('a.rg-image-nav-prev'),
			$navNext		= $rgGallery.find('a.rg-image-nav-next'),
			$imgWrapper		= $rgGallery.find('div.rg-image');
			
		$navPrev.bind('click.rgGallery', function( event ) {
			_navigate( 'left' );
			return false;
		});	
		
		$navNext.bind('click.rgGallery', function( event ) {
			_navigate( 'right' );
			return false;
		});
	
		// add touchwipe events on the large image wrapper
		$imgWrapper.touchwipe({
			wipeLeft			: function() {
				_navigate( 'right' );
			},
			wipeRight			: function() {
				_navigate( 'left' );
			},
			preventDefaultEvents: false
		});
	
		$(document).bind('keyup.rgGallery', function( event ) {
			if (event.keyCode == 39)
				_navigate( 'right' );
			else if (event.keyCode == 37)
				_navigate( 'left' );	
		});	
		}	
	},
	_navigate		= function( dir ) {
		
	if( anim ) return false;
	anim	= true;
	
	if( dir === 'right' ) {
		if( current + 1 >= itemsCount )
			current = 0;
		else
			++current;
	}
	else if( dir === 'left' ) {
		if( current - 1 < 0 )
			current = itemsCount - 1;
		else
			--current;
	}
	
	_showImage( $items.eq( current ) );
	},
	_showImage		= function( $item ) {
	
	// shows the large image that is associated to the $item
	
	var $loader	= $rgGallery.find('div.rg-loading').show();
	
	$items.removeClass('selected');
	$item.addClass('selected');
		 
	var $thumb		= $item.find('img'),
		largesrc	= $thumb.data('large'),
		title		= $thumb.data('description');
	
	$('<img/>').load( function() {
		
		$rgGallery.find('div.rg-image').empty().append('<img src="' + largesrc + '"/>');
		
		if( title )
			$rgGallery.find('div.rg-caption').show().children('p').empty().text( title );
		
		$loader.hide();
		
		if( mode === 'carousel' ) {
			$esCarousel.elastislide( 'reload' );
			$esCarousel.elastislide( 'setCurrent', current );
		}
		
		anim	= false;
		
	}).attr( 'src', largesrc );
	
	};
	return { init : init };
    //чача удалють до селя
	Gallery.init();
      var defaults = {
        item : '.single-blog-item',
        columnClass : '.pf-colum',
        resize:false
      }

      var prm = $.extend(defaults, options);

      var container = $(this);
      var items = container.find(prm.item);
      var elemsDatas = [];
      var columns = [];
      var nbCols = getNbCols();

      init();

      function init(){
        nbCols = getNbCols();
        recordAndRemove();
        print();
        if(prm.resize){
          $(window).resize(function(){
            if(nbCols != getNbCols()){
              nbCols = getNbCols();
              setColPos();
              print();
            }
          });
        }
      }

      function getNbCols(){
        var instanceForCompute = false;
        if(container.find(prm.columnClass).length == 0){
          instanceForCompute = true;
          container.append("<div class='"+parseSelector(prm.columnClass)+"'></div>");
        }
        var colWidth = container.find(prm.columnClass).outerWidth(true);
        var wallWidth = container.innerWidth();
        if(instanceForCompute)container.find(prm.columnClass).remove();
        return Math.round(wallWidth / colWidth);
      }

      // save items content and params and removes originals items
      function recordAndRemove(){
        items.each(function(index){
          var item = $(this);
          elemsDatas.push({
            content : item.html(),
            class : item.attr('class'),
            href : item.attr('href'),
            id : item.attr('id'),
            colid : index%nbCols
          });
          item.remove();
        });
      }

      //determines in which column an item should be
      function setColPos(){
        for (var i in elemsDatas){
          elemsDatas[i].colid = i%nbCols;
        }
      }

      // to get a class name without the selector
      function parseSelector(selector){
        return selector.slice(1, selector.length);
      }

      //write and append html
      function print(){
        var tree = '';
        //creates columns
        for (var i=0; i<nbCols; i++){
          tree += "<div class='"+parseSelector(prm.columnClass)+"'></div>";
        }
        container.html(tree);

        // creates items
        for (var i in elemsDatas){
          var html='';

          var content = (elemsDatas[i].content != undefined)?elemsDatas[i].content:'';
          var href = (elemsDatas[i].href != href)?elemsDatas[i].href:'';
          var classe = (elemsDatas[i].class != undefined)?elemsDatas[i].class:'';
          var id = (elemsDatas[i].id != undefined)?elemsDatas[i].id:'';

          if(elemsDatas[i].href != undefined){
            html += "<a "+getAttr(href,'href')+" "+getAttr(classe,'class')+" "+getAttr(id,'id')+">"+content+"</a>";
          }else{
            html += "<div "+getAttr(classe,'class')+" "+getAttr(id,'id')+">"+content+"</a>";
          }
          container.children(prm.columnClass).eq(i%nbCols).append(html);
        }

      }

      //creates a well-formed attribute
      function getAttr(attr, type){
        return (attr != undefined)?type+"='"+attr+"'":'';
      }

    });

    return this;
  }
})(jQuery);
