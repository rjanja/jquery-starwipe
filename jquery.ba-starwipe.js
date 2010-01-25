/*!
 * jQuery Star Wipe - v1.2 - 1/25/2010
 * http://github.com/rjanja/jquery-starwipe
 * 
 * forked from
 * http://benalman.com/projects/jquery-starwipe-plugin/
 * 
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */

// Script: jQuery Star Wipe: Why eat hamburger when you can have steak?
//
// *Version: 1.2, Last updated: 1/25/2010*
// 
// Project Home - http://benalman.com/projects/jquery-starwipe-plugin/
// GitHub       - http://github.com/cowboy/jquery-starwipe/
// Source       - http://github.com/cowboy/jquery-starwipe/raw/master/jquery.ba-starwipe.js
// (Minified)   - http://github.com/cowboy/jquery-starwipe/raw/master/jquery.ba-starwipe.min.js (9.1kb)
// 
// About: License
// 
// Copyright (c) 2010 "Cowboy" Ben Alman,
// Dual licensed under the MIT and GPL licenses.
// http://benalman.com/about/license/
// 
// About: Examples
// 
// This working example, complete with fully commented code, illustrates a few
// ways in which this plugin can be used.
// 
// Star Wipe - http://benalman.com/code/projects/jquery-starwipe/examples/starwipe/
// 
// About: Support and Testing
// 
// Information about what version or versions of jQuery this plugin has been
// tested with, and what browsers it has been tested in.
// 
// jQuery Versions - 1.3.2
// Browsers Tested - Chrome 3, Safari 4 - HIGH CONFIDENCE STAR WIPE
// IE 8, Firefox 3.6, Opera 9 - GLOW IN THE DARK STAR-WIPE
// 
// About: Release History
// 
// 1.2	 - (1/25/2010) Support added to other browsers by way of PNG mask
// 1.1   - (1/10/2010) Transition can now be canceled by pressing the back
//         button at any point after starting it.
// 1.0   - (10/9/2009) Initial release

(function($,window){
  '$:nomunge'; // Used by YUI compressor.
  
  var loc = window.location,
    hash = '#starwipe-loading',
    
    mask, alphamask,
    prop = '-webkit-mask-size',
    
    supports_starwipe,
    
    str_starwipe = 'starwipe',
    str_click = 'click.' + str_starwipe;
  
  // Method: jQuery.starwipe
  // 
  // Trigger an astounding star wipe page-load transition, navigating to the
  // specified url upon completion (note: only works in the latest WebKit
  // browsers).
  // 
  // Usage:
  // 
  // > if ( !jQuery.starwipe( url ) ) {
  // >   alert( 'error: inferior browser, star wipe not supported' );
  // >   window.location = url;
  // > }
  // 
  // Arguments:
  // 
  //  url - (String) Destination URL to wipe to.
  // 
  // Returns:
  // 
  //  (Boolean) True if the browser supports the star wipe transition, false if
  //    not.
  
  $[ str_starwipe ] = function( url ) {
    
    // Let's find out if the browser supports star wipe!
    if ( supports_starwipe === undefined ) {
      supports_starwipe = $('<div/>').css( prop, '1px' ).css( prop ) === '1px 1px';
    }
    
    if ( !supports_starwipe ) {
      // Browser doesn't support star wipe. :-(
      //return false;
    }
    
    // Remove any existing IFRAME.
    $('.' + str_starwipe).stop().remove();
    
    var win = $(window),
      body = $('body'),
      
      interval_id,
      overflow,
      
      // This determines the maximum mask size to animate the mask to.
      max = Math.max( win.width(), win.height() ) * 3.5,

      frame_css, mask, maskbox, covers,
	  
      // Create the IFRAME!
      iframe = $('<iframe/>');
    
    // Setting the location.hash allows a back button press to cancel the
    // transition. If pressed, the location.hash will no longer be what we set
    // it to, so we know to cancel the transition and remove the iframe.
    loc.hash = hash;

    frame_css = {
        position: 'fixed',
		zIndex: '99999',
        top: '0',
        bottom: '0',
        left: '0',
        right: '0',
        width: '100%',
        height: '100%',
        border: 'none',
        background: '#fff',
    };
		
    if (supports_starwipe) {
		frame_css['-webkit-mask-image'] = 'url(' + mask + ')';
		frame_css['-webkit-mask-repeat'] = 'no-repeat';
		frame_css['-webkit-mask-position'] = '50% 50%';
		frame_css['-webkit-mask-size'] = '0px';
    }
    else {
		frame_css['zIndex'] = '-5';
		frame_css['top'] = '-1px';
		frame_css['left'] = '-1px';
		frame_css['width'] = '1px';
		frame_css['height'] = '1px';
    }
	      
    // If the user has aborted, cancel the transition and clean things up.
    function aborted(){
      if ( loc.hash !== hash ) {
        clearInterval( interval_id );
        iframe.stop().remove();
        overflow && body.css( 'overflow', overflow );
      }
    };
    
    // Actually test if the user pressed the back button.
    interval_id = setInterval( aborted, 100 );
    
    iframe
      
      // When IFRAME content loads, let's transition!
      .load(function(){
        // Save the body "overflow" property in case the user aborts.
        overflow = body.css( 'overflow' );
        body.css( 'overflow', 'hidden' );
		
        iframe.show();
		
		if (supports_starwipe) {
			iframe.animate({
    	        '-webkit-mask-size': max + 'px'
        	  }, 2000, function(){
            	loc.replace( url );
         	 });
		} else {
			// Alpha mask animation. Not quite a Value Meal but at least it comes with a toy.
			// IE, FF, Opera
            var ww = win.width(), wh = win.height();
            var chunky = '<div class=ch id=cleft></div><div class=ch id=cright></div><div class=ch id=ctop></div><div class=ch id=cbot></div><div id=maskbox><img height="100%" width="100%" src="' + alphamask + '" id=mask></div>';
            body.append(chunky);
            mask = $('#mask'); 
			maskbox = $('#maskbox');
			covers = $('div.ch');
            mask.css({
                zIndex: 9999
            });
			// Covers/curtains. Top, bottom, left and right
            var common_css = {
                position: 'absolute',
                backgroundColor: '#000',
				zIndex: 9999
            }
            $('#ctop').css($.extend({}, common_css, {
                top: '-' + (win.height() / 2) + 'px',
                left: '0',
                width: ww,
                height: wh / 2
            }));
            $('#cbot').css($.extend({}, common_css, {
                top: (win.height()) + 'px',
                left: '0',
                width: ww,
                height: wh / 2
            }));
            $('#cleft').css($.extend({}, common_css, {
                left: '-' + (win.width() / 2) + 'px',
                top: '-' + (win.height() / 2) + 'px',
                width: (win.width() / 2) + 'px',
                height: (win.height() * 2) + 'px'
            }));
            $('#cright').css($.extend({}, common_css, {
                left: (win.width()) + 'px',
                top: '-' + (win.height() / 2) + 'px',
                width: (win.width() / 2) + 'px',
                height: (win.height() * 2) + 'px',
            }));
            var orig = {
                position: 'absolute',
                top: '0px',
                left: '0px',
                marginLeft: '-' + (win.width() + 150) + 'px',
                marginTop: '-' + (win.height() + 400) + 'px',
                width: (win.width() + 2500) + 'px',
                height: (win.height() + 2500) + 'px',
                opacity: 0.8,
            };
            maskbox.css(orig);
			// mask animation stepping function - resize the curtains
            function footloose(s, a){
                if (a.prop == 'marginTop') {
                    $('#cleft').css('margin-top', a.now);
                }
                else 
                    if (a.prop == 'marginLeft') {
                        $('#cleft').css('margin-left', a.now);
                    }
                    else 
                        if (a.prop == 'width') {
                            $('#cright').css('left', (ww / 2 + a.now / 2.3) + 'px');
                        }
                        else 
                            if (a.prop == 'height') {
                                $('#ctop').css('top', (0 - a.now / 2.3 + 5) + 'px');
                                $('#cbot').css('top', (wh / 2 + a.now / 2.1 - 5) + 'px');
                            }
            }
            // once curtains are closed, position iframe below, and re-open curtains
            function reverse(){
                iframe.css({
                    zIndex: -1,
                    top: '0',
                    left: '0',
                    width: '100%',
                    height: '100%',
                });
                
                options.complete = function(){
                    maskbox.remove();
                    covers.remove();
                    loc.replace(url);
                };
                delete orig.position; // IE errors on position in animate()
                maskbox.animate(orig, options);
            }
            
            var options = {
                duration: 1800,
                step: footloose,
                complete: reverse
            }
            
            maskbox.animate({
                marginLeft: (win.width() / 2 - 5) + 'px',
                marginTop: (win.height() / 2 - 5) + 'px',
                width: '20px',
                height: '20px',
                opacity: 1.0
            }, options);
		}
		 
      })
      
      // IFRAME initial properties.
      .hide()
      .attr({
        'class': str_starwipe,
        id: str_starwipe + '-' + (+new Date),
        frameborder: 0,
        src: url
      }).css(frame_css);

      iframe.appendTo('body');
    
    return true;
  };
  
  // Method: jQuery.fn.starwipe
  // 
  // Add an astounding star wipe page-load transition to the click event on one
  // or more elements, optionally specifying a URL to navigate to (note: only
  // works in the latest WebKit browsers).
  // 
  // Usage:
  // 
  // > jQuery('selector').starwipe( [ url ] );
  // 
  // Arguments:
  // 
  //  url - (String) Optional URL to navigate to on click. If url is not
  //    specified, the value set in the `href` attribute is used.
  // 
  // Returns:
  // 
  //  (jQuery) The initial jQuery collection of elements.
  
  $.fn[ str_starwipe ] = function( url ) {
    
    return this.unbind( str_click ).bind( str_click, function(){
      
      // Let the good times roll! Prevent the default browser action if necessary.
      return !$[ str_starwipe ]( url || this.href );
      
    });
  };
  
  // The mask image. You guessed it, it's a star.
  mask = 'data:image/png;base64,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';
  alphamask = 'data:image/png;base64,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';

})(jQuery,this);