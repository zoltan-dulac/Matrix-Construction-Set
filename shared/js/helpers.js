/**
 * @namespace domHelpers.myNamespace
 */
/*******************************************************************************
 * This notice must be untouched at all times.
 * 
 * This javascript library is a cross browser DHTML library.
 * 
 * domHelpers.js v. 0.8 The latest version is available at
 * http://pandora.seneacac.on.ca/~zoltan/javascript/domHelpers.js
 * 
 * released under the MIT License
 * 
 * changes: 
 *	0.8 - fixed domParseXML() IE bug 
 * 	0.9 - added domIsInObject()
 *  1.0 - added Firefox support for node.contains();
 ******************************************************************************/

var LegacyHelpers = new function () {
	
	var me = this;
	
	/** 
	 * used to implement document.getElementById() for IE4.  Called by 
	 * makeOldBrowsersCompatible().  For internal use only.
	 * @id getElement4Ie4
	 * @param {Object} s The ID of the HTML object
	 */
	function getElement4Ie4 (s) {
		return document.all[s];
	}

	/**
	 * used to implement document.getElementsByTagName() for IE4.  Called by 
	 * makeOldBrowsersCompatible().  For internal use only.
	 * @param {Object} s The tag name of the HTML objects
	 */
	function getElementsByTag4Ie4 (s) {
		return document.tags[s];
	}
	
	/** @id getElement4Ns4
	 * used to implement document.getElementById() for Netscape 4.  
	 * Called by makeOldBrowsersCompatible().  For internal use only.
	 * @param {Object} s The ID of the HTML object
	 */
	function getElement4Ns4 (s) {
		return me.getElement4NsHelper(s, self.document.layers);
	}
	
	
	
	function getElement4NsHelper (s, layerArr) {
		var i;
		
		for (i = 0; i < layerArr.length; i++) {
			// check to see if Netscape assigned block
			if (document.layers[i].id.substring (0, 3) != "_js")
			{
				if (layerArr[i].id == s) {
					layerArr[i].style = layerArr[i];
					return layerArr[i];
				}
				
				// check internal layers within this layer
				if (layerArr[i].document.layers.length > 1) {
					var returnValue = indexNSObjs (layerArr[i].document.layers);
					if (returnValue != null) {
						return returnValue;
					}
					
				}
			}
		}
		return null;
	}
	
	/**
	 * @id getElementsByTag4Ns4
	 * used to implement document.getElementsByTagName() for NS4.  Called by 
	 * makeOldBrowsersCompatible().  For internal use only.
	 * @param {Object} s The tag naem of the HTML objects
	 * 
	 */
	function getElementsByTag4Ns4  (s) {
		return document.tags[s];
	}
	
	/**
	 * @id makeOldBrowsersCompatible
	 * This checks to see if document.getElementById() exists.  If it
	 * doesn't, it attempts to implement that function with the 
	 * existing non-standard DOM.  For internal use only. 
	 */
	function makeOldBrowsersCompatible() {
		if (!document.getElementById && document.all) {
			document.getElementById = getElement4Ie4;
		}
		if (!document.getElementsByTagName && document.tags) {
			document.getElementsByTagName = getElementsByTag4Ie4;
		}
		
		if (!document.getElementById && document.layers) {
			document.getElementById = getElement4Ns4;
		}
	}
	
	makeOldBrowsersCompatible();
}
/**
 * A class to parse color values
 * @author Stoyan Stefanov <sstoo@gmail.com>
 * @link   http://www.phpied.com/rgb-color-parser-in-javascript/
 * @license Use it if you like it
 */
function RGBColor(color_string)
{
	
	var me = this;	
	
	

    me.ok = false;

    // strip any leading #
    if (color_string.charAt(0) == '#') { // remove # if any
        color_string = color_string.substr(1,6);
    }

    color_string = color_string.replace(/ /g,'');
    color_string = color_string.toLowerCase();

    // before getting into regexps, try simple matches
    // and overwrite the input
    var simple_colors = {
        aliceblue: 'f0f8ff',
        antiquewhite: 'faebd7',
        aqua: '00ffff',
        aquamarine: '7fffd4',
        azure: 'f0ffff',
        beige: 'f5f5dc',
        bisque: 'ffe4c4',
        black: '000000',
        blanchedalmond: 'ffebcd',
        blue: '0000ff',
        blueviolet: '8a2be2',
        brown: 'a52a2a',
        burlywood: 'deb887',
        cadetblue: '5f9ea0',
        chartreuse: '7fff00',
        chocolate: 'd2691e',
        coral: 'ff7f50',
        cornflowerblue: '6495ed',
        cornsilk: 'fff8dc',
        crimson: 'dc143c',
        cyan: '00ffff',
        darkblue: '00008b',
        darkcyan: '008b8b',
        darkgoldenrod: 'b8860b',
        darkgray: 'a9a9a9',
        darkgreen: '006400',
        darkkhaki: 'bdb76b',
        darkmagenta: '8b008b',
        darkolivegreen: '556b2f',
        darkorange: 'ff8c00',
        darkorchid: '9932cc',
        darkred: '8b0000',
        darksalmon: 'e9967a',
        darkseagreen: '8fbc8f',
        darkslateblue: '483d8b',
        darkslategray: '2f4f4f',
        darkturquoise: '00ced1',
        darkviolet: '9400d3',
        deeppink: 'ff1493',
        deepskyblue: '00bfff',
        dimgray: '696969',
        dodgerblue: '1e90ff',
        feldspar: 'd19275',
        firebrick: 'b22222',
        floralwhite: 'fffaf0',
        forestgreen: '228b22',
        fuchsia: 'ff00ff',
        gainsboro: 'dcdcdc',
        ghostwhite: 'f8f8ff',
        gold: 'ffd700',
        goldenrod: 'daa520',
        gray: '808080',
        green: '008000',
        greenyellow: 'adff2f',
        honeydew: 'f0fff0',
        hotpink: 'ff69b4',
        indianred : 'cd5c5c',
        indigo : '4b0082',
        ivory: 'fffff0',
        khaki: 'f0e68c',
        lavender: 'e6e6fa',
        lavenderblush: 'fff0f5',
        lawngreen: '7cfc00',
        lemonchiffon: 'fffacd',
        lightblue: 'add8e6',
        lightcoral: 'f08080',
        lightcyan: 'e0ffff',
        lightgoldenrodyellow: 'fafad2',
        lightgrey: 'd3d3d3',
        lightgreen: '90ee90',
        lightpink: 'ffb6c1',
        lightsalmon: 'ffa07a',
        lightseagreen: '20b2aa',
        lightskyblue: '87cefa',
        lightslateblue: '8470ff',
        lightslategray: '778899',
        lightsteelblue: 'b0c4de',
        lightyellow: 'ffffe0',
        lime: '00ff00',
        limegreen: '32cd32',
        linen: 'faf0e6',
        magenta: 'ff00ff',
        maroon: '800000',
        mediumaquamarine: '66cdaa',
        mediumblue: '0000cd',
        mediumorchid: 'ba55d3',
        mediumpurple: '9370d8',
        mediumseagreen: '3cb371',
        mediumslateblue: '7b68ee',
        mediumspringgreen: '00fa9a',
        mediumturquoise: '48d1cc',
        mediumvioletred: 'c71585',
        midnightblue: '191970',
        mintcream: 'f5fffa',
        mistyrose: 'ffe4e1',
        moccasin: 'ffe4b5',
        navajowhite: 'ffdead',
        navy: '000080',
        oldlace: 'fdf5e6',
        olive: '808000',
        olivedrab: '6b8e23',
        orange: 'ffa500',
        orangered: 'ff4500',
        orchid: 'da70d6',
        palegoldenrod: 'eee8aa',
        palegreen: '98fb98',
        paleturquoise: 'afeeee',
        palevioletred: 'd87093',
        papayawhip: 'ffefd5',
        peachpuff: 'ffdab9',
        peru: 'cd853f',
        pink: 'ffc0cb',
        plum: 'dda0dd',
        powderblue: 'b0e0e6',
        purple: '800080',
        red: 'ff0000',
        rosybrown: 'bc8f8f',
        royalblue: '4169e1',
        saddlebrown: '8b4513',
        salmon: 'fa8072',
        sandybrown: 'f4a460',
        seagreen: '2e8b57',
        seashell: 'fff5ee',
        sienna: 'a0522d',
        silver: 'c0c0c0',
        skyblue: '87ceeb',
        slateblue: '6a5acd',
        slategray: '708090',
        snow: 'fffafa',
        springgreen: '00ff7f',
        steelblue: '4682b4',
        tan: 'd2b48c',
        teal: '008080',
        metle: 'd8bfd8',
        tomato: 'ff6347',
        turquoise: '40e0d0',
        violet: 'ee82ee',
        violetred: 'd02090',
        wheat: 'f5deb3',
        white: 'ffffff',
        whitesmoke: 'f5f5f5',
        yellow: 'ffff00',
        yellowgreen: '9acd32'
    };
    for (var key in simple_colors) {
        if (color_string == key) {
            color_string = simple_colors[key];
        }
    }
    // emd of simple type-in colors

    // array of color definition objects
    var color_defs = [
        {
            re: /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,
            example: ['rgb(123, 234, 45)', 'rgb(255,234,245)'],
            process: function (bits){
                return [
                    parseInt(bits[1]),
                    parseInt(bits[2]),
                    parseInt(bits[3])
                ];
            }
        },
        {
            re: /^(\w{2})(\w{2})(\w{2})$/,
            example: ['#00ff00', '336699'],
            process: function (bits){
                return [
                    parseInt(bits[1], 16),
                    parseInt(bits[2], 16),
                    parseInt(bits[3], 16)
                ];
            }
        },
        {
            re: /^(\w{1})(\w{1})(\w{1})$/,
            example: ['#fb0', 'f0f'],
            process: function (bits){
                return [
                    parseInt(bits[1] + bits[1], 16),
                    parseInt(bits[2] + bits[2], 16),
                    parseInt(bits[3] + bits[3], 16)
                ];
            }
        },
		{
            re: /^rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*(0{0,1}\.\d{1,}|0\.{0,}0*|1\.{0,}0*)\)$/,
            example: ['rgba(123, 234, 45, 22)', 'rgba(255, 234,245, 34)'],
            process: function (bits){
                return [
                    parseInt(bits[1]),
                    parseInt(bits[2]),
                    parseInt(bits[3]),
					parseFloat(bits[4])
                ];
            }
        }
    ];

    // search through the definitions to find a match
    for (var i = 0; i < color_defs.length; i++) {
        var re = color_defs[i].re;
        var processor = color_defs[i].process;
        var bits = re.exec(color_string);
        if (bits) {
            channels = processor(bits);
            me.r = channels[0];
            me.g = channels[1];
            me.b = channels[2];
			me.a = channels[3];
            me.ok = true;
        }

    }

    // validate/cleanup values
    me.r = (me.r < 0 || isNaN(me.r)) ? 0 : ((me.r > 255) ? 255 : me.r);
    me.g = (me.g < 0 || isNaN(me.g)) ? 0 : ((me.g > 255) ? 255 : me.g);
    me.b = (me.b < 0 || isNaN(me.b)) ? 0 : ((me.b > 255) ? 255 : me.b);
	
	
	me.a = (isNaN(me.a)) ? 1 : ((me.a > 255) ? 255 : (me.a < 0 )? 0: me.a);

	jslog.debug(me.a)
	
    // some getters
    me.toRGB = function () {
        return 'rgb(' + me.r + ', ' + me.g + ', ' + me.b + ')';
    }
	
	// some getters
    me.toRGBA = function () {
        return 'rgba(' + me.r + ', ' + me.g + ', ' + me.b + ', ' + me.a + ')';
    }
	
	/**
	 * Converts an RGB color value to HSV. Conversion formula
	 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
	 * Assumes r, g, and b are contained in the set [0, 255] and
	 * returns h, s, and v in the set [0, 1].
	 * 
	 * This routine by Michael Jackson (not *that* one),
	 * from http://www.mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
	 *
	 * @param   Number  r       The red color value
	 * @param   Number  g       The green color value
	 * @param   Number  b       The blue color value
	 * @return  Array           The HSV representation
	 */
	me.toHSV = function (){
	    var r = me.r/255, g = me.g/255, b = me.b/255;
	    var max = Math.max(r, g, b), min = Math.min(r, g, b);
	    var h, s, v = max;
	
	    var d = max - min;
	    s = max == 0 ? 0 : d / max;
	
	    if(max == min){
	        h = 0; // achromatic
	    }else{
	        switch(max){
	            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
	            case g: h = (b - r) / d + 2; break;
	            case b: h = (r - g) / d + 4; break;
	        }
	        h /= 6;
	    }
	
	    return {
			h: h,
			s: s,
			v: v
		};
	}

	
   me.toHex = function () {
        var r = me.r.toString(16);
        var g = me.g.toString(16);
        var b = me.b.toString(16);
		
		var a = Math.floor((me.a * 255)).toString(16);
		
        if (r.length == 1) r = '0' + r;
        if (g.length == 1) g = '0' + g;
        if (b.length == 1) b = '0' + b;
		
		
		if (a == 'ff') {
			a = '';
		} else if (a.length == 1) {
			a = '0' + a;
		}
        return '#' + a + r + g + b;
    }


    // help
    me.getHelpXML = function () {

        var examples = new Array();
        // add regexps
        for (var i = 0; i < color_defs.length; i++) {
            var example = color_defs[i].example;
            for (var j = 0; j < example.length; j++) {
                examples[examples.length] = example[j];
            }
        }
        // add type-in colors
        for (var sc in simple_colors) {
            examples[examples.length] = sc;
        }

        var xml = document.createElement('ul');
        xml.setAttribute('id', 'rgbcolor-examples');
        for (var i = 0; i < examples.length; i++) {
            try {
                var list_item = document.createElement('li');
                var list_color = new RGBColor(examples[i]);
                var example_div = document.createElement('div');
                example_div.style.cssText =
                        'margin: 3px; '
                        + 'border: 1px solid black; '
                        + 'background:' + list_color.toHex() + '; '
                        + 'color:' + list_color.toHex()
                ;
                example_div.appendChild(document.createTextNode('test'));
                var list_item_value = document.createTextNode(
                    ' ' + examples[i] + ' -> ' + list_color.toRGB() + ' -> ' + list_color.toHex()
                );
                list_item.appendChild(example_div);
                list_item.appendChild(list_item_value);
                xml.appendChild(list_item);

            } catch(e){}
        }
        return xml;

    }

}


var CSSHelpers =  new function () {
	var me = this;
	var blankRe = new RegExp('\\s');
	
	/*
	 * getComputedStyle: code from http://blog.stchur.com/2006/06/21/css-computed-style/
	 */
	me.getComputedStyle = function(elem, style)
	{
	  var computedStyle;
	  if (typeof elem.currentStyle != 'undefined')
	    { computedStyle = elem.currentStyle; }
	  else
	    { computedStyle = document.defaultView.getComputedStyle(elem, null); }
	
	  return computedStyle[style];
	}
	
	/* Taken from http://blog.stchur.com/2006/09/20/converting-to-pixels-with-javascript/ */
	me.toPixels = function(_str, _context)
	{
	  if (/px$/.test(_str)) { return parseInt(_str); }
	
	  var tmp = document.createElement('div');
	  tmp.style.visbility = 'hidden';
	  tmp.style.position = 'absolute';
	  tmp.style.lineHeight = '0';
	
	  if (/%$/.test(_str))
	  {
	    _context = _context.parentNode || _context;
	    tmp.style.height = _str;
	  }
	  else
	  {
	    tmp.style.borderStyle = 'solid';
	    tmp.style.borderBottomWidth = '0';
	    tmp.style.borderTopWidth = _str;
	  }
	
	  if (!_context) { _context = document.body; }
	
	  _context.appendChild(tmp);
	  var px = tmp.offsetHeight;
	  _context.removeChild(tmp);
	
	  return px ;
	};
	
	
	
	/**
	 * Sets the CSS visibility of an object.
	 * 
	 * @deprecated Only use when NS4 needs to be considered.  Otherwise, set the obj.style.visibility property instead 
	 * @param {Object} obj The DOM object.
	 * @param {String} value Set to either "visible" or "hidden"
	 */
	
	me.setVisibility = function (obj, value)
	{
		// IE, NS4 and W3C
		if (obj.style && obj.style.visibility != null) {
			
			// NS4 needs this
			if (document.layers && value == "visible") {
				value = "inherit";
			} 
			
			obj.style.visibility = value;
		}
	}
	
	/**
	 * Sets the CSS visibility of an object.
	 * 
	 * @deprecated Only use when NS4 needs to be considered.  Otherwise, get the obj.style.visibility property instead 
	 * @param {Object} obj The DOM object.
	 * @return {String}  "visible", "hidden", or error if there is an error.
	 */
	me.getVisibility = function (obj)
	{
		// IE, NS4, W3C
		if (obj.style.visibility != null) {
			
			// I've seen "hide" once a while ago in NS4 a long time ago.
			if (obj.style.visibility == "hidden" || obj.style.visibility == "" ||
					obj.style.visibility == "hide") {
				return "hidden";
			} else {
				return "visible";
			}
			
		} else {
			return null;
		}
	}
	
	/**
	 * Show an table row object.  Used to circumvent Internet Explorer
	 * incompatabilies.
	 * @param {Object} obj an HTML table rom object.
	 */
	
	me.showTableRow = function (obj) {
		try {
			// Everyone but IE
			obj.style.display = 'table-row';
		} catch (e) {
			obj.style.display = 'block';
		}
	}
	
	/**
	 * Get the cascading CSS left property of an object, in pixels.
	 * 
	 * @param {Object} obj - an HTML object.
	 * @return {int} the left coordinate in pixels.
	 */
	me.getLeft = function (obj)
	{
		// most browsers - proprietary IE used by others
		if (obj.offsetLeft != null)
			return obj.offsetLeft; 
		// IE 4
		else if (obj.style.pixelLeft != null) {
			return obj.style.pixelLeft;
		} // W3C
		else if (obj.style.left != null)
			return parseFloat(obj.style.left);
		else
			return null;
	}
	
	/**
	 * Getting the cascading CSS top property of an object, in
	 * pixels. 
	 * 
	 * @param {Object} obj - an HTML object
	 * @return {int} the left coordinate in pixels.
	 * 
	 */
	me.getTop = function(obj)
	{
		// most browsers - proprietary IE used by others
		if (obj.offsetTop != null) 
			return obj.offsetTop;
		// IE 4
		else if (obj.style.pixelTop != null) 
			return obj.style.pixelTop;
		// W3C
		else if (obj.style.top != null)
			return parseFloat (obj.top);
		else 
			return null;
	}
	

	
	/**
	 * Setting the cascading CSS top property of an object, in
	 * pixels. 
	 * 
	 * @param {Object} obj - an HTML object
	 * @param {int} top -  the top coordinate in pixels.
	 * 
	 */
	me.setTop = function (obj, top)
	{
		// IE
		if (obj.style.pixelTop != null) {
			obj.style.pixelTop = top;	
			// NS4, W3C
		} else if (obj.style.top!=null) {
			
			/* This handles a difference between the official implementation 
			 * of the DOM and the way some versions of Opera implement it 
			 * (officially, there should be a px at the end of the value,  but
			 * older versions of Opera don't like it).
			 */
			
			/* If .style.top is JUST a number, then just set it to top */
			if (parseInt(obj.style.top).toString() == obj.style.top.toString()) {
				obj.style.top=top;
			/* Otherwise, set .style.top to be top + "px" */
			} else {
				obj.style.top=top + "px";
			}
		}
	}
	
	/**
	 * Setting the cascading CSS left property of an object, in
	 * pixels. 
	 * 
	 * @param {Object} obj - an HTML object
	 * @param {int} top -  the left coordinate in pixels.
	 * 
	 */
	me.setLeft = function (obj, left)
	{
		// IE
		if  (obj.style.pixelLeft != null) {
			obj.style.pixelLeft = left;
		// NS4, W3C
		} else if (obj.style.left != null) {
			/* See notes for setTop() */
			/* If .style.left is JUST a number, then just set it to top */
			if (parseInt(obj.style.left).toString() == obj.style.left.toString()) {
				obj.style.left=left;
			} else {
				obj.style.left=left+ "px";
			}
		}
	}
	
	me.getAbsoluteCoords = function(obj) {
		
		var curleft = obj.offsetLeft;
		var curtop = obj.offsetTop;
		
		/*
		 * IE and Gecko
		 */
		if (obj.getBoundingClientRect) {
			jslog.debug('getBoundedClientRect')
			var temp = obj.getBoundingClientRect();
			
			curleft = temp.left + BrowserHelpers.getScrollX();
			curtop = temp.top + BrowserHelpers.getScrollY();
		} else {
		
			/* Everything else must do the quirkmode.org way */
		
			if (obj.offsetParent) {
			
				while (obj = obj.offsetParent) {
					curleft += obj.offsetLeft - obj.scrollLeft;
					curtop += obj.offsetTop - obj.scrollTop;
				}
			}
		}
		return {
			x: curleft,
			y: curtop
		};
	}
	
	me.getAbsoluteLeft = function(obj) {
		
		var curleft = obj.offsetLeft;
		
		
		if (obj.offsetParent) {

			while (obj = obj.offsetParent ) {
				curleft += obj.offsetLeft - obj.scrollLeft;
			}
		}
		return curleft;
	}
	
	
	/*
	 *  It seems that this will not work in IE unless you look at the 
	 *  positioning at the node and all other nodes to ensure they
	 *  are set to position: "relative" if they are statically positioned.
	 *  Funny that.
	 */
	me.getAbsoluteTop = function(node) {
		var obj = node;
		
		
		var curtop = obj.offsetTop;
		
		if (obj.offsetParent) {

			while (obj = obj.offsetParent) {
					curtop += obj.offsetTop - obj.scrollTop;				
			}
		}
		
		
		
		return curtop;
	}
	
	me.setAllStaticNodesToRelative = function (node) {
		var positionArray = new Array();
		var obj = node;
		while (obj.nodeName != "HTML") {
			positionArray.push(obj.style.position);
			
			if (obj.style.position == '') {
				obj.style.position = 'relative';
			} 
			obj = obj.parentNode;
		} 
		
		return positionArray;
	}
	
	me.resetPosition = function (node, positionArray)  {
		var obj = node;
		var i = 0;
		while (obj.nodeName != "HTML") {
			//jslog.debug('reseting ' + obj.nodeName)
			obj.style.position = positionArray[i];
			i++;
			obj = obj.parentNode;
		} 
		return positionArray;
	}
	
	/**
	 * Setting the cascading CSS left and top properties  of an object, in
	 * pixels, simultaneously
	 * 
	 * @param {Object} obj - an HTML object
	 * @param {int} newleft - the left coordinate in pixels.
	 * @param {int} newtop -  the left coordinate in pixels.
	 * 
	 */
	me.moveTo = function (obj, newleft, newtop) 
	{
		me.setLeft(obj, newleft);
		me.setTop (obj, newtop);
	}
	
	/**
	 * increment the cascading CSS left and top properties  of an object, in
	 * pixels, simultaneously
	 * 
	 * @param {Object} obj - an HTML object
	 * @param {int} left - the amount to increment the left coordinate by, in pixels.
	 * @param {int} top -  the amount to increment the top coordinate by, in pixels.
	 * 
	 */
	me.moveBy = function(obj, left, top)
	{
		me.setLeft (obj, left + me.getLeft (obj));
		me.setTop (obj, top + me.getTop (obj));
	}
	
	/**
	 * Get an HTML element's width, in pixels, including any padding and borders
	 * the object contains.
	 *  
	 * @param {Object} obj - an HTML object
	 * @return {int} - the width, in pixels.
	 */
	me.getWidth = function (obj)
	{
		// IE 4.x, and most other modern web browsers
		if (obj.offsetWidth != null) {
			return obj.offsetWidth;	
		// NS4
		} else if (obj.style.clip != null && obj.style.clip.width != null) {
			return obj.clip.width;
		// W3C
		} else if (obj.style.width != null ) { 
			return parseInt (obj.style.width);
		}		
	}
	
	/**
	 * Get an HTML element's height, in pixels. including any padding and borders
	 * the object contains.
	 *  
	 * @param {Object} obj - an HTML object
	 * @return {int} - the height, in pixels.
	 */
	me.getHeight = function(obj)
	{
		// IE, and most other modern web browsers.
		if (obj.offsetHeight != null)
			return obj.offsetHeight;	
		// NS4
		else if (obj.style.clip != null  && obj.style.clip.height != null)
			return obj.style.clip.height;
		// W3C
		else if (obj.style != null && obj.style.width != null)
			return parseInt (obj.style.height);
		
	}
	
	/**
	 * Set an HTML element's width, in pixels
	 *  
	 * @param {Object} obj - an HTML object
	 * @param {int} width - the new width of the object, in pixels.
	 */
	me.setWidth = function(obj, width)
	{
		// IE
		if (obj.style.pixelWidth != null) 
			obj.style.pixelWidth = width;
		// W3C
		else if (obj.style.width != null) 
			obj.style.width = width + "px";	
		// NS4
		else if (obj.clip != null && obj.clip.width != null)
			obj.style.clip.width = width;
		
	}
	
	/**
	 * Set an HTML element's height, in pixels
	 *  
	 * @param {Object} obj - an HTML object
	 * @param {int} height - the new height of the object, in pixels.
	 */
	me.setHeight = function (obj, height)
	{
		
		// IE
		if (obj.style.pixelHeight != null)
			obj.style.pixelHeight = height;
		// W3C
		else if (obj.style.height != null) 
			obj.style.height = height + "px";
		else if (obj.style.clip != null && obj.style.clip.height != null) 
			obj.style.clip.height = height;
	}
	
	me.setSize = function (obj, w, h) {
		me.setWidth(obj, w);
		me.setHeight(obj, h);
	}
	
	/**
	 * Set an HTML element's clipping rectangle, in pixels. On order to clip
	 * correctly, your object *must* have the position CSS property set.
	 * 
	 * @param {Object} obj - an HTML element
	 * @param {int} top - the new top clipping coordinate
	 * @param {int} right - the new right clipping coordinate
	 * @param {int} bottom - the new bottom clipping coordinate
	 * @param {int} left - the new left clipping coordinate
	 */
	
	me.setClipRect = function (obj, top, right, bottom, left)
	{
		if (obj.style.clip != null)
		{
			obj.style.clip = StringHelpers.sprintf(
				"rect(%dpx, %dpx, %dpx, %dpx)", top , right , bottom, left );
		}
	}
	
		
	/**
	 * Private method for internal use only. 
	 * 
	 * @param {Object} obj - an HTML object
	 * @param {String} indx - one of "top", "right", "bottom" or "left"
	 * @return {int}  the coordinate of the CSS clip property denoted by indx; 
	 */
	me.getClipEntry = function (obj, indx)
	{
		var strng = obj.style.clip;

		strng = strng.slice (5, strng.length - 1);
		var entries = strng.replace(")","").split (" ");

		if (indx == "top")
			if (entries[0] == "auto" || entries[0] == "")
				return 0;
			else
				return parseFloat(entries[0]);
		else if (indx == "left")
			if (entries[3] == "auto" || entries[3] == "")
				return 0;
			else
				return parseFloat(entries[3]);
		else if (indx == "bottom")
			if (entries[2] == "auto" || entries[2] == "")
				return me.getHeight (obj);
			else
				return parseFloat(entries[2]);
		else if (indx == "right")
			if (entries[1] == "auto" || entries[1] == "")
				return me.getWidth ();
			else
				return parseFloat(entries[1]);
	}
	
	/* from http://blog.stchur.com/2006/06/21/css-computed-style/ */
	me.getCurrentStyle = function(obj)
	{
	  var computedStyle;
	  if (typeof obj.currentStyle != 'undefined')
	    { computedStyle = obj.currentStyle; }
	  else
	    { computedStyle = document.defaultView.getComputedStyle(obj, null); }
	
	  return computedStyle;
	}
	
	
	
	
	
	/**
	 * Get the visible width of a clipped item.
	 * 
	 * @param {Object} obj - an HTML object.
	 */ 
	me.getClipWidth = function (obj)
	{
		return me.getClip(obj, "right") - me.getClip(obj, "left");
	}
	
	/**
	 * Get the visible height of a clipped item.
	 * 
	 * @param {Object} obj - an HTML object
	 */
	me.getClipHeight = function (obj)
	{
		return me.getClip(obj, "bottom") - me.getClip(obj, "top");
	}
	
	/**
	 * Determines if the coordinate (x,y) lies inside an object.
	 * 
	 * @param {Object} obj - an HTML object
	 * @param {int} x - the x-corrdinate
	 * @param {int} y - the y-coordinate
	 */
	me.isInObject = function (obj, x, y, isObjAbsolutePos) {
		return me.isInXRange(obj, x, isObjAbsolutePos) && me.isInYRange(obj, y, isObjAbsolutePos);
	}
	
	me.isInXRange = function (obj, x, isObjAbsolutePos) {
		var objX;
		
		if (isObjAbsolutePos) {
			objX = me.getLeft(obj);
		} else {
			objX = me.getAbsoluteLeft(obj);
		}
		
		var objWidth = me.getWidth(obj);
	
		if (objX <= x && x <= objX+objWidth) {
			return true;
		} else {
			return false;
		}
	}
	
	me.isInYRange = function (obj, y, isObjAbsolutePos) {
		var objY;
		
		if (isObjAbsolutePos) {
			objY = me.getTop(obj);
		} else {
			objY = me.getAbsoluteTop(obj);
		}
	
		var objHeight = me.getHeight(obj);
	
		if (objY <= y && y <= objY+objHeight) {
			return true;
		} else {
			return false;
		}
	}
	
	
	/**
	 * Sets the background colour of an HTML object.
	 * 
	 * @deprecated - Only use to ensure Netscape 4.x compatibility.
	 * @param {String} c - a CSS colour .
	 */
	me.setBackgroundColor = function (obj, c)
	{
		if (obj.style.backgroundColor != null)
			obj.style.backgroundColor = c;
		else 
			return null;
	}
	
	/**
	 * Gets the background colour of an HTML object.
	 * 
	 * @deprecated - Only use to ensure Netscape 4.x compatibility.
	 * @param {String} c - a CSS colour.
	 */
	me.getBackgroundColor = function (obj)
	{
		var c;
		if (obj.style.backgroundColor != null) {
			c = obj.style.backgroundColor;
			return new RGBColor(c);
		} else {
			return null;
		}	
	}
	
	

	/**
	 * Gets the opacity percentage of an HTML object.  To ensure compatibility, the object
	 * must be positioned for this to work in IE.  Also, it is not advised to set the opacity
	 * of an object whose opacity has also been set.
	 *   
	 * @param {Object} obj - an HTML object.
	 * @return {int} opactity value between 0 and 100, 100 being the most opaque.
	 */
	me.getOpacity = function (obj) {
		// W3C 
		if (obj.style.opacity != null) {
			return parseFloat(obj.style.opacity) * 100;
		// Mozilla
		} else if (obj.style.MozOpacity != null) { 
			return parseFloat(obj.style.MozOpacity) * 100;
		// IE
		} else if (obj.style.filter != null) {
			var values = obj.style.filter.split("opacity=");

			if (values.length > 1) {
				return parseFloat(values[1]);
			} else {
				return 100;
			}
		} else {
			return null;
		}
	}
	
	/**
	 * Sets the opacity percentage of an HTML object.  To ensure compatibility, the object
	 * must be positioned for this to work in IE.  Also, it is not advised to set the opacity
	 * of an object whose parent's opacity has also been set.
	 *   
	 * @param {Object} obj - an HTML object
	 * @param {Object} percentage - opactity value between 0 and 100, 100 being the most opaque.
	 */
	me.setOpacity = function (obj, percentage){
		if (obj.style.opacity != null) {
			obj.style.opacity=(percentage/100).toString();
		// Mozilla
		} else if (obj.style.MozOpacity != null) {
			obj.style.MozOpacity=(percentage/100).toString();
		 
		} else if (obj.style.filter != null) {
			// IE must have layout, see 
			// http://jszen.blogspot.com/2005/04/ie6-opacity-filter-caveat.html
			// for details.
			obj.style.zoom="100%";
			
			// if percentage is 100, set this property to nothing.  THis
			// is to prevent selects within this container from disappearing
			// as described in 
			// http://www.esqsoft.com/documents/problem-select-input-disappears-in-IE.htm
			
			if (percentage == 100) {
				obj.style.filter = "";
			} else {
				obj.style.filter = 'alpha(opacity=' + percentage.toString() + ')';
			}
		}
		
	}
	
	
	/**
	 * Generates a regular expression string that can be used to detect a class name
	 * in a tag's class attribute.  It is used by a few methods, so I 
	 * centralized it.
	 * 
	 * @param {String} className - a name of a CSS class.
	 */
	
	function getClassReString(className) {
		return '\\s'+className+'\\s|^' + className + '\\s|\\s' + className + '$|' + '^' + className +'$';
	}
	
	function getClassPrefixReString(className) {
		return '\\s'+className+'-[0-9a-zA-Z_]+\\s|^' + className + '[0-9a-zA-Z_]+\\s|\\s' + className + '[0-9a-zA-Z_]+$|' + '^' + className +'[0-9a-zA-Z_]+$';
	}
	
	
	/**
	 * Make an HTML object be a member of a certain class.
	 * 
	 * @param {Object} obj - an HTML object
	 * @param {String} className - a CSS class name.
	 */
	me.addClass = function (obj, className) {
		if (blankRe.test(className)) {
			return;
		}
		
		// only add class if the object is not a member of it yet.
		if (!me.isMemberOfClass(obj, className)) {
			obj.className += " " + className;
		}
	}
	
	/**
	 * Make an HTML object *not* be a member of a certain class.
	 * 
	 * @param {Object} obj - an HTML object
	 * @param {Object} className - a CSS class name.
	 */
	me.removeClass = function (obj, className) {
	
		if (blankRe.test(className)) {
			return; 
		}
		
		
		var re = new RegExp(getClassReString(className) , "g");
		
		var oldClassName = obj.className;
	
	
		if (obj.className) {
			obj.className = oldClassName.replace(re, ' ');
		}
	
	
	}
	
	/**
	 * Given an HTML element, find all child nodes of a specific class.
	 * 
	 * With ideas from Jonathan Snook 
	 * (http://snook.ca/archives/javascript/your_favourite_1/)
	 * Since this was presented within a post on this site, it is for the 
	 * public domain according to the site's copyright statement.
	 * 
	 * @param {Object} obj - an HTML element.  If you want to search a whole document, set
	 * 		this to the document object.
	 * @param {String} className - the class name of the objects to return
	 * @return {Array} - the list of objects of class cls. 
	 */
	me.getElementsByClassName = function (obj, className)
	{
		if (obj.getElementsByClassName) {
			return DOMHelpers.nodeListToArray(obj.getElementsByClassName(className))
		}
		else {
			var a = [];
			var re = new RegExp(getClassReString(className));
			var els = DOMHelpers.getAllDescendants(obj);
			for (var i = 0, j = els.length; i < j; i++) {
				if (re.test(els[i].className)) {
					a.push(els[i]);
					
				}
			}
			return a;
		}
	}
	
	me.getElementsByClassPrefix = function (obj, classPrefix)
	{
		
		var a = [];
		var re = new RegExp(getClassPrefixReString(classPrefix));
		var els = DOMHelpers.getAllDescendants(obj);
		for (var i = 0, j = els.length; i < j; i++) {
			if (re.test(els[i].className)) {
				a.push(els[i]);
				
			}
		}
		return a;
		
	}
	
	/**
	 * Determines if an HTML object is a member of a specific class.
	 * @param {Object} obj - an HTML object.
	 * @param {Object} className - the CSS class name.
	 */
	me.isMemberOfClass = function (obj, className) {
		
		if (blankRe.test(className))
			return false;
		
		var re = new RegExp(getClassReString(className) , "g");
	
		return (re.test(obj.className));
	
	
	}
	
	/**
	 * Extracts a list of classes that the object belongs to.
	 * @param {Object} obj - an HTML object.
	 * @return {Array} - the list of CSS classes the object belongs to.
	 */
	
	me.getClasses = function (obj) {
		var re = /\s+/g;
		
		return obj.className.replace(re, " ").split(" ");
	}

	
	
	 me.getZoomFactor = function () {
            var factor = 1;
            if (document.body.getBoundingClientRect) {
                    // rect is only in physical pixel size in IE before version 8 
                var rect = document.body.getBoundingClientRect ();
                var physicalW = rect.right - rect.left;
                var logicalW = document.body.offsetWidth;

                    // the zoom level is always an integer percent value
                factor = Math.round ((physicalW / logicalW) * 100) / 100;
            }
            return factor;
        }
	
}

var BrowserHelpers = new function () {

	var me = this;
	/**
	 * gets the current window's width.  
	 * 
	 * @author Peter-Paul Koch - http://www.quirksmode.org
	 * @license see http://www.quirksmode.org/about/copyright.html
	 * @return {int} - the window's width, in pixels.
	 */
	me.getWindowWidth = function (theWindow)
	{
		if (!theWindow) {
			theWindow = window;
		}
		
		var theDocument = theWindow.document;
		
		// all except IE
		if (theWindow.innerWidth != null)  {
			return theWindow.innerWidth;
		// IE6 Strict mode
		} else if (theDocument.documentElement && 
				theDocument.documentElement.clientWidth ) {
			return theDocument.documentElement.clientWidth;	
		// IE strictly less than 6
		} else if (theDocument.body != null) {
			return theDocument.body.clientWidth;
		} else {	
			return null;
		}
	}
	
	/**
	 * gets the current window's height.  
	 * 
	 * @author Peter-Paul Koch - http://www.quirksmode.org
	 * @license see http://www.quirksmode.org/about/copyright.html
	 * @return {int} - the window's height in pixels.
	 */
	me.getWindowHeight = function  (theWindow)
	{
		if (!theWindow) {
			theWindow = window;
		}
			
		var theDocument = theWindow.document;
		
		// all except IE
		if (theWindow.innerHeight != null) {
			return theWindow.innerHeight;
		// IE6 Strict mode
		} else if (theDocument.documentElement && 
				theDocument.documentElement.clientHeight ) {
			return theDocument.documentElement.clientHeight;
		// IE strictly less than 6
		} else if (theDocument.body != null) {
			return theDocument.body.clientHeight;
		} else {
			return null;
		}
	}
	
	/**
	 * Sets the current window's height.
	 * 
	 * @param {int} n - the height, in pixels.
	 */ 
	me.setWindowWidth = function(theWindow, n) {
		if (!theWindow) {
			theWindow = window;
		}
			
		if (theWindow.innerWidth != null) {
			theWindow.innerWidth = n;
		} else {
			theWindow.resizeTo(n , me.getWindowHeight(theWindow));
		}
	}
	
	/**
	 * Sets the current window's width.
	 * 
	 * @param {Object} n - the width, in pixels.
	 */
	me.setWindowHeight = function (theWindow, n) {
		if (!theWindow) {
			theWindow = window;
		}
		
		if (theWindow.innerHeight != null) {
			theWindow.innerHeight = n;
		} else { 
			theWindow.resizeTo(me.getWindowWidth(theWindow), n) ;
		}
	}
	
	
	
	me.getChromeWidth = function (theWindow) {
		if (theWindow.outerWidth && theWindow.innerWidth) {
			return theWindow.outerWidth - theWindow.innerWidth;
		} else {
			var body = document.getElementsByTagName('body')[0];
			var bodyWidth = CSSHelpers.getWidth(body);
			
			var windowWidth = me.getWindowWidth(theWindow);
			
			return windowWidth - bodyWidth;
		}
	}
	
	
	
	/**
	 * Get the the amount of pixels the window has been scrolled from the top.  If there is no
	 * vertical scrollbar, this function return 0.
	 *
	 * @return {int} - the amount of pixels the window has been scrolled to the right, in pixels.
	 */
	me.getScrollX = function (myWindow)
	{
		var myDocument;
		
		if (myWindow) {
			myDocument = myWindow.document;
		} else {
			myWindow = window;
			myDocument = document;
		}
		
		// All except that I know of except IE
		if (myWindow.pageXOffset != null) {
			return myWindow.pageXOffset;
		// IE 6.x strict
		} else if (myDocument.documentElement != null 
				&& myDocument.documentElement.scrollLeft !="0px" 
					&& myDocument.documentElement.scrollLeft !=0)  {
			return myDocument.documentElement.scrollLeft;
		// all other IE
		} else if (myDocument.body != null && 
			myDocument.body.scrollLeft != null) {
			return myDocument.body.scrollLeft;
		// if for some reason none of the above work, this should.
		} else if (myWindow.scrollX != null) {
			return myWindow.scrollX;
		} else {
			return null;
		}
	}
	
	/**
	 * Get the the amount of pixels the window has been scrolled to the right.  If there is no
	 * horizontal scrollbar, this function return 0.
	 * 
	 * @return {int} - the amount of pixels the window has been scrolled to the right, in pixels.
	 */
	me.getScrollY = function(myWindow)
	{
		var myDocument;
		
		if (myWindow) {
			myDocument = myWindow.document;
		} else {
			myWindow = window;
			myDocument = document;
		}
		
		// All except that I know of except IE
		if (myWindow.pageYOffset != null) {
			return myWindow.pageYOffset;
		// IE 6.x strict
		} else if (myDocument.documentElement != null
				&& myDocument.documentElement.scrollTop !="0px" 
					&& myDocument.documentElement.scrollTop !=0) {
			return myDocument.documentElement.scrollTop;
		// all other IE
		} else if (myDocument.body && myDocument.body.scrollTop != null) { 
			return myDocument.body.scrollTop;
		// if for some reason none of the above work, this should.
		} else if (myWindow.scrollY != null) { 
			return myWindow.scrollY;
		} else {
			return null;
		}
	}

	/**
	 * If the user has hilighted text in the page, get that text.
	 * Some ideas from http://www.quirksmode.org/js/selected.html
	 *
	 * @return {String} - the selected text.
	 */
	me.getSelectedText = function (myWindow)
	{
		var myDocument;
		
		if (myWindow) {
			myDocument = myWindow.document;
		} else {
			myWindow = window;
			myDocument = document;
		}
		
		// Safari 1.3 and Mozilla
		if (theWindow.getSelection) {
			return theWindow.getSelection();
		// IE Mac, Opera, Netscape 4
		} else if (theDocument.getSelection != null) {
			return theDocument.getSelection(); 
		// IE 5+ Win
		} else if (theDocument.selection != null && 
			theDocument.selection.createRange != null) {
			return theDocument.selection.createRange().text;
		} else {
			return null;
		}
	}


	/**
	 * Get a document's width (not the window, the whole document).
	 * 
	 * @author Peter-Paul Koch - http://www.quirksmode.org/viewport/compatibility.html
	 * @author Zoltan Hawryluk - added test3, which happens sometimes in
	 * 		Firefox, though I haven't isolated the reason why.
	 * @return {int} - the document's width in pixels.
	 */
	me.getDocumentWidth = function (theDocument) {
		if (!theDocument) {
			theDocument = document;
		}
		
		// all but Explorer Mac
		var test1 = theDocument.body.scrollWidth;
		
		// Explorer Mac;
		//would also work in Explorer 6 Strict, Mozilla and Safari
		var test2 = theDocument.body.offsetWidth;
		
		// Fix for Firefox in certain cases.
		var test3 = theDocument.documentElement.scrollWidth;
		
		
		var r = Math.max(test1, test2);
		return Math.max(r, test3);
	}
	
	/**
	 * Get a document's height (not the window, the whole document).
	 * 
	 * @author Peter-Paul Koch - http://www.quirksmode.org/viewport/compatibility.html
	 * @author Zoltan Hawryluk - added test3, which happens sometimes in
	 * 		Firefox, though I haven't isolated the reason why.
	 * @return {int} - the document's height in pixels.
	 */
	me.getDocumentHeight = function (theDocument) {
		if (!theDocument) {
			theDocument = document;
		}
		
		// all but Explorer Mac
		var test1 = theDocument.body.scrollHeight;
		
		// Explorer Mac;
		//would also work in Explorer 6 Strict, Mozilla and Safari
		var test2 = theDocument.body.offsetHeight;
		
		// Fix for Firefox in certain cases.
		var test3 = theDocument.documentElement.scrollHeight;
		
		
		var r = Math.max(test1, test2);
		return Math.max(r, test3);
		
		
	}

}

function MutationEventTextNode (obj, fn) {
	this.obj = obj;
	this.fn = fn;
}

MutationEventTextNode.prototype.equals = function (obj) {
	return (obj instanceof MutationEventTextNode) && 
		(obj.obj == this.obj) &&
		(obj.fn == this.fn)
}

var EventHelpers = new function () {
	var me = this;
	
	var globalEvent;

	var safariTimer;
	var isSafari = /WebKit/i.test(navigator.userAgent);
	me.scriptNode;
	
	var availableCache = new Array();
	var src="helpers.js"
	var srcRe = new RegExp(src.replace('.', '\\\.'));
	me.docIsLoaded = false;
	var availableTimeout;
	
	var nodeCache;
	
	me.mutationClass = "EventHelpers-mutationNode";
	
	me.init = function () {
		if (me.hasPageLoadHappened(arguments)) {
			return;	
		}
		
		if (document.createEventObject){
	        // dispatch for IE
	        globalEvent = document.createEventObject();
	    } else 	if (document.createEvent) {
			globalEvent = document.createEvent("HTMLEvents");
		} 
		
		setTimeout('EventHelpers.docIsLoaded = true', 1);
		
		try {
			 nodeCache = new Hashtable();
		} catch (ex) {
			// do nothing.
		}
	}
	
	me.getScriptNodeBySrc = function (src){
		
		var scriptNodes = document.getElementsByTagName('script');
		for (var i=0; i<scriptNodes.length; i++) {
			var node = scriptNodes[i];
			if (node.src.match(srcRe)) {
				return node;
			}
		}
		return null;
	}
	
	function setRoot() {
	
		if (me.scriptNode) {
			me.root = me.scriptNode.src.replace(srcRe, '');
		}
		
		if (me.root.indexOf('http') != 0 && me.root.indexOf('/') != 0) {
			var docRoot = location.href.split('/');
			docRoot[docRoot.length-1] = '';
			docRoot = docRoot.join('/');
			me.root = docRoot + me.root;
		}
		
	}
	
	/**
	 * Adds an event to the document.  Examples of usage: 
	 * me.addEvent(window, "load", myFunction);
	 * me.addEvent(docunent, "keydown", keyPressedFunc);
	 * me.addEvent(document, "keyup", keyPressFunc);
	 * 
	 * @author Scott Andrew - http://www.scottandrew.com/weblog/articles/cbs-events
	 * @author John Resig - http://ejohn.org/projects/flexible-javascript-events/
	 * @param {Object} obj - a javascript object.
	 * @param {String} evType - an event to attach to the object.
	 * @param {Function} fn - the function that is attached to the event.
	 */
	me.addEvent = function (obj, evType, fn, useCapture){
	  if (!useCapture) {
	  	useCapture = false;
	  }
	  if (obj.addEventListener){
		obj.addEventListener(evType, fn, useCapture);
	  } else if (obj.attachEvent){
		obj['x-e'+evType+fn] = fn;
		obj['x-' + evType+fn] = function() { obj["x-e"+evType+fn]( self.event ); }
		obj.attachEvent( "on"+evType, obj['x-' + evType+fn] );
	  } 
	}
	
	
	
	// type is one of "DOMNodeInserted", "DOMNodeRemoved", "DOMSubtreeModified", "DOMAttrModified"
	me.addMutationEvent = function (obj, type, fn) {
		if (obj.addEventListener) {
			EventHelpers.addEvent(obj, type, fn);
		} else {
			//EventHelpers.addEvent(obj, 'propertychange', fn);
			
			// allow IE to allow bubbling of this event
			var eventHandlerArray = obj["IE" + type]
			if (type != "DOMCharacterDataModified") {
				if (!eventHandlerArray) {
					obj["IE" + type] = [];
				}
				obj["IE" + type].push(fn);
			}
			
			
			
			switch(type) {
				case "DOMNodeInserted":
					obj["x-originalParent"] = obj.parentNode;
					break;
				case "DOMAttrModified":
					if (!obj.IEAttrModifiedEvents) {
						obj.IEAttrModifiedEvents = [];
					}
					obj.IEAttrModifiedEvents.push(fn);
					indexPreviousAttributeValues(obj);
					
					EventHelpers.addEvent(obj, 'propertychange', fireAttrModifiedEvent);
					
					break;
				case "DOMCharacterDataModified":
					// must do polling ... sigh.
					
					addDOMCharacterDataModifiedPolling(new MutationEventTextNode(obj, fn));
					return;
					
					
			}
			
			obj["x-originalChildren"] = [];
			for (var i=0; i< obj.childNodes.length; i++) {
				obj["x-originalChildren"][i] = (obj.childNodes[i])
			};
			CSSHelpers.addClass(obj, me.mutationClass)
			
			
		}
	}
	
	
	
	function addDOMCharacterDataModifiedPolling(mutantTextNode) {
		//jslog.debug('dd:' + obj)
		
		if (!nodeCache){
			jslog.info("Cannot add DOMCharacterDataModified events in IE without jsHashtable. Bailing.");
			return;
		}
		
		var obj = mutantTextNode.obj;
		var fn = mutantTextNode.fn;
		
		var oldData = nodeCache.get(mutantTextNode);
		
		if (oldData == null) {
			nodeCache.put(mutantTextNode, {
				data: obj.data,
				fn: fn,
				interval: setInterval(function () {
					addDOMCharacterDataModifiedPolling(mutantTextNode)
				}, 100)
			});
		} else {
			try {
				if (oldData.data != obj.data) {
					fn({
						target: obj,
						attrName: "",
						attrChange: 0,
						relatedNode: obj.parentNode,
						newValue: obj.data,
						prevValue: oldData.data
					});
					oldData.data = obj.data;
				};
			} catch (ex) {
				// ah .. node was destroyed! Let's clean up, shall we?
				clearInterval(oldData.interval);
				nodeCache.remove(mutantTextNode);
				
			}
			
			
		}
		
	}
	
	function removeFromArray(array, item) {
		
		for (var i = 0; i < array.length; i++) {
			if (array[i] == item) {
				array.splice(i, 1);
			}
		}
	}
	
	// type is one of "DOMNodeInserted", "DOMNodeRemoved", "DOMSubtreeModified", "DOMAttrModified"
	me.removeMutationEvent = function(obj, type, fn){
		if (obj.addEventListener) {
			EventHelpers.removeEvent(obj, type, fn);
		}
		else {
			
			// allow IE to allow bubbling of this event
			var eventHandlerArray = obj["IE" + type]
			if (!eventHandlerArray) {
				// this never had the mutation event attached.  Bailing.
				return;
			}
			removeFromArray(obj["IE" + type], fn)
			
			
			switch (type) {
				case "DOMNodeInserted":
					obj["x-originalParent"] = null;
					break;
				case "DOMAttrModified":
					removeFromArray(obj.IEAttrModifiedEvents, fn)
					
				
					EventHelpers.removeEvent(obj, 'propertychange', fireAttrModifiedEvent);
					
					break;
			}
			
			CSSHelpers.removeClass(obj, me.mutationClass)
			
			
		}
	}
	
	function indexPreviousAttributeValues(obj) {
		
		var prevAttr = [];
		
		var attrs = obj.attributes;
		
		for (var i=0; i<attrs.length; i++) {
			
			var attr = attrs[i];
			//if (attr.specified) {
				prevAttr[attr.name] = attr.value;
				
			//}
		}
		
		obj["x-prevAttributes"] = prevAttr;
		
		
	}
	
	function fireAttrModifiedEvent(e) {
		
		if (e.propertyName.indexOf("x-") == 0 || e.propertyName == 'innerHTML') {
			return;
		}
		
		var obj = EventHelpers.getEventTarget(e);
		var fns = obj.IEAttrModifiedEvents;
		var prevValue, newValue;
		
		var propName;
		switch(e.propertyName) {
			case "className":
				propName="class";
				prevValue = eval('obj["x-prevAttributes"]["class"]');
				newValue = eval('obj.className');
				break;
			case "htmlFor":
				propName="for";
				prevValue = eval('obj["x-prevAttributes"]["for"]');
				newValue = eval('obj.htmlFor');
				break;
			default:
				propName = e.propertyName;
				if (propName.indexOf('.') > 0) {
					prevValue = eval('obj["x-prevAttributes"].' + propName);
					newValue = eval("obj." + e.propertyName);
				} else {
					prevValue = obj["x-prevAttributes"][propName];
					newValue = obj[e.propertyName];
				}
		}
		
		var attrChange;
		
		if (prevValue == undefined) {
			attrChange=2;
		} else if (newValue=='') {
			attrChange=3;
		} else {
			attrChange=1;
		}
		
		var mutationEvent = {
			target: obj,
			attrName: propName,
			attrChange: attrChange,
 			relatedNode: obj.attributes[e.propertyName], 
			newValue: newValue,
			prevValue: prevValue
		}
		for (var i=0; i<fns.length; i++) {
			fns[i](mutationEvent)
		}
		indexPreviousAttributeValues(obj);
	}
	
	// used by the mutation.htc file.
	me.nodeInsertedEvent = function (e) {
		me.bubbleMutationEvent(e, null, 'DOMNodeInserted');
	}
	
	function isTopMost(el) {
		var theParent = el["x-originalParent"].parentNode;
		switch(theParent.nodeName) {
			case null:
			case "#document-fragment":
				return false;
			default:
				
				return true;
		}
	}
	
	me.bubbleMutationEvent = function(e, el, type,originalParent /*optional*/){
		
		
		if (!el) {
			el = EventHelpers.getEventTarget(e);
		}		
		
		var firstNode;
		
		if (originalParent) {
			firstNode = originalParent;
		} else {
			
			firstNode = (type=="DOMNodeRemoved" && el.parentNode)?el["x-originalParent"]:el;
		}
		
		
		var relatedNode = null; // DOMSubtreeModified
		//alert(type + ": " + firstNode);
		switch(type) {
			case "DOMNodeInserted":
				relatedNode = el.parentNode;
				break;
			case "DOMNodeRemoved":
				if (originalParent) {
					
					relatedNode = originalParent;
				}
				else {
					relatedNode = el["x-originalParent"];
				}
				break;
		}
		
		var mutationEvent = {
			target: el,
			attrName: "",
			attrChange: 0,
			relatedNode: relatedNode, 
			newValue: "",
			prevValue: ""
		};
		//alert('found one ' + firstNode.nodeName)
		for (var i = firstNode; i && i.nodeName && i.nodeName != 'BODY'; i = type=="DOMNodeRemoved"?i["x-originalParent"]:i.parentNode) {
			
			var fn = i["IE" + type];
			
			if (fn) {
				
				for (var j = 0; j < fn.length; j++) {
					if (type == "DOMSubtreeModified") {
						mutationEvent.target  = i;
					}
					
					if (type == 'DOMNodeRemoved') {
						if (isTopMost(el)) {
							fn[j](mutationEvent);
						} 
					} else {
						fn[j](mutationEvent);
					}
					
					
				}
			}
			
			
		}
		
	}
	
	me.innerHTMLChangeEvent = function (e) {
		
		
		EventHelpers.preventDefault(e);
		
		
		if (e.propertyName == 'innerHTML') {
			var target = EventHelpers.getEventTarget(e);
			var children = target.childNodes;
			
			var originalChildren = target["x-originalChildren"];
			if (originalChildren) {
				//alert('original  children:  ' + originalChildren.length + ' original parent ' + target.originalParent)
				for (var i = 0; i < originalChildren.length; i++) {
				
				
					me.bubbleMutationEvent(e, originalChildren[i], 'DOMNodeRemoved', target);
				}
			}
			
			
			for (var i=0; i<children.length; i++) {
				
				//if (children[i].nodeType == 3) {
					me.bubbleMutationEvent(e, children[i], 'DOMNodeInserted');
					me.bubbleMutationEvent(e, children[i], 'DOMSubtreeModified');
				//}
				
			}
		}
	}
	
	
	/**
	 * Removes an event that is attached to a javascript object.
	 * 
	 * @author Scott Andrew - http://www.scottandrew.com/weblog/articles/cbs-events
	 * @author John Resig - http://ejohn.org/projects/flexible-javascript-events/	 * @param {Object} obj - a javascript object.
	 * @param {String} evType - an event attached to the object.
	 * @param {Function} fn - the function that is called when the event fires.
	 */
	me.removeEvent = function (obj, evType, fn){
	
	  if (obj.removeEventListener){
	    obj.removeEventListener(evType, fn, false);
	  } else if (obj.detachEvent){
	  	try {
			obj.detachEvent("on"+evType, obj['x-' + evType+fn]);
			obj['x-' + evType+fn] = null;
			obj["x-e" + evType + fn] = null;
		} catch (ex) {
			// do nothing;
		}
	  }
	}
	
	/* 
	 * Fires an event manually.
	 * @author Scott Andrew - http://www.scottandrew.com/weblog/articles/cbs-events
	 * @author John Resig - http://ejohn.org/projects/flexible-javascript-events/	 * @param {Object} obj - a javascript object.
	 * @param {String} evType - an event attached to the object.
	 * @param {Function} fn - the function that is called when the event fires.
	 * 
	 */
	me.fireEvent = function (element,event, options){
		
		if(!element) {
			return;
		}
		
	    if (document.createEventObject){
	       
			return element.fireEvent('on' + event, globalEvent)
			
	    }
	    else{
	        // dispatch for firefox + others
	        globalEvent.initEvent(event, true, true); // event type,bubbling,cancelable
	        return !element.dispatchEvent(globalEvent);
	    }
}
	
	function removeEventAttribute(obj, beginName) {
		var attributes = obj.attributes;
		for (var i=0; i<attributes.length; i++) {
			var attribute = attributes[i]
			var name = attribute.name
			if (name.indexOf(beginName) == 0) {
				//obj.removeAttributeNode(attribute);
				attribute.specified = false;
			}
		}
	} 

	me.addScrollWheelEvent = function (obj, fn) {
		if (obj.addEventListener) {
        	/** DOMMouseScroll is for mozilla. */
        	obj.addEventListener('DOMMouseScroll', fn, true);
		} 
		
		/** IE/Opera. */
		if (obj.attachEvent) {
			obj.attachEvent("onmousewheel", fn);
		}
		
	}
	
	me.removeScrollWheelEvent = function (obj, fn) {
		if (obj.removeEventListener) {
        	/** DOMMouseScroll is for mozilla. */
        	obj.removeEventListener('DOMMouseScroll', fn, true);
		} 
		
		/** IE/Opera. */
		if (obj.detachEvent) {
			obj.detatchEvent("onmousewheel", fn);
		}
		
	}
	
	me.getMouseCoords = function (e) {
		if (!e) {
			return;
		}
		// IE
		if (e.clientX != null) {
			return {
				x: e.clientX,
				y: e.clientY
			}
		
		}
		// NS4
		else if (e.pageX != null) {
			return {
				x: e.pageX,
				y: e.pageY
			}
		// W3C
		}  else if (window.event != null && window.event.clientX != null 
				&& document.body != null && 
				document.body.scrollLeft != null) {
			return {
				x: window.event.clientX + document.body.scrollLeft,
				y: window.event.clientY + document.body.scrollTop
			}
					
		} else { 
			return null;
		}
	}
	
	
	
	/**
	 * Given a mouse event, get the mouse pointer's x-coordinate.
	 * 
	 * @param {Object} e - a DOM Event object.
	 * @return {int} - the mouse pointer's x-coordinate.
	 */
	me.getMouseX = function (e)
	{	
		if (!e) {
			return;
		}
		// NS4
		if (e.pageX != null) {
			return e.pageX;
		// W3C
		} else if (e.clientX != null) {
			return e.clientX;
		// IE
		} else if (window.event != null && window.event.clientX != null 
				&& document.body != null && 
				document.body.scrollLeft != null) {
			return window.event.clientX + document.body.scrollLeft;
		
		} else { 
			return null;
		}
	}
	
	/**
	 * Given a mouse event, get the mouse pointer's y-coordinate.
	 * @param {Object} e - a DOM Event Object.
	 * @return {int} - the mouse pointer's y-coordinate.
	 */
	me.getMouseY = function (e)
	{
		// NS4
		if (e.pageY != null )
			return e.pageY;
		// IE
		else if (window.event != null  && window.event.clientY != null  && 
				document.body != null  &&
				document.body.scrollTop != null )
			return window.event.clientY + document.body.scrollTop; 
		// W3C
		else if (e.clientY != null) {
			return e.clientY;
		}
	}
	/**
	 * Given a mouse scroll wheel event, get the "delta" of how fast it moved.
	 * @param {Object} e - a DOM Event Object.
	 * @return {int} - the mouse wheel's delta.  It is greater than 0, the 
	 * scroll wheel was spun upwards; if less than 0, downwards.
	 */	
	me.getScrollWheelDelta = function(e){
        var delta = 0;
        if (!e) /* For IE. */
                e = window.event;
        if (e.wheelDelta) { /* IE/Opera. */
				delta = e.wheelDelta/120;
				/** In Opera 9, delta differs in sign as compared to IE.
				 */
				if (window.opera) {
					delta = -delta ;
				}
        } else if (e.detail) { /** Mozilla case. */
                /** In Mozilla, sign of delta is different than in IE.
                 * Also, delta is multiple of 3.
                 */
                delta = -e.detail/3;
        }
		return delta
	}
	
	/**
	 * Sets a mouse move event of a document.  
	 * 
	 * @deprecated - use only if compatibility with IE4 and NS4 is necessary.  Otherwise, just 
	 * 		use EventHelpers.addEvent(window, 'mousemove', func) instead. Cannot be used to add
	 * 		multiple mouse move event handlers.
	 * 
	 * @param {Function} func - the function that you want a mouse event to fire.
	 */
	me.addMouseEvent = function (func) {
		
		if (document.captureEvents){
			document.captureEvents(Event.MOUSEMOVE);
		}
		
		document.onmousemove = func;
		window.onmousemove = func;
		window.onmouseover=func;
		
	}
	
	
	
	/** 
	 * Find the HTML object that fired an Event.
	 * 
	 * @param {Object} e - an HTML object
	 * @return {Object} - the HTML object that fired the event.
	 */
	me.getEventTarget = function (e) {	
		
		// W3C
		if (e.currentTarget) {
			return e.currentTarget;
		// Safari and Opera)
		} else if (e.toElement) {
			return e.toElement;
		// MS way
		} else if (e.srcElement) {
			return e.srcElement;
		} else {
			return null;
		}
	}
	
	


	/**
	 * Given an event fired by the keyboard, find the key associated with that event.
	 * 
	 * @param {Object} e - an event object.
	 * @return {String} - the ASCII character code representing the key associated with the event.
	 */
	
	me.getKey = function (e)
	{
		if (e.keyCode) {
			return e.keyCode;
		} else if (e.event && e.event.keyCode) { 
			return window.event.keyCode;
		} else if (e.which) {
			return e.which;
		}
	}
	
	
	/** 
	*  Will execute a function when the page's DOM has fully loaded (and before all attached images, iframes,
	*  etc., are).  
	*  
	*  Usage:
	*  
	*  EventHelpers.addPageLoadEvent('init');
	*
	*  where the function init() has this code at the beginning:
	*
	*  function init() {
	*
	*  if (EventHelpers.hasPageLoadHappened(arguments)) return;
	*
	*	// rest of code
	*   ....
	*  }
	*
	* @author This code is based off of code from http://dean.edwards.name/weblog/2005/09/busted/ by Dean 
	* Edwards, with a modification by me.
	* 
	* @param {String} funcName - a string containing the function to be called.  
	*/
	me.addPageLoadEvent = function (funcName) {
		
		var func = eval(funcName);
		
		// for Internet Explorer (using conditional comments)
		/*@cc_on @*/
		/*@if (@_win32)
		pageLoadEventArray.push(func);
		return;
		/*@end @*/
		if (isSafari) { // sniff
			pageLoadEventArray.push(func);
			
			if (!safariTimer) {
				
				safariTimer = setInterval(function(){
					if (/loaded|complete/.test(document.readyState)) {
						clearInterval(safariTimer);
						
						/*
						 * call the onload handler
						 * func();
						 */
						me.runPageLoadEvents();
						return;
					}
					set = true;
				}, 10);
			}
		/* for Mozilla */
		} else if (document.addEventListener) {
			var x =document.addEventListener("DOMContentLoaded", 
				func, null);
		
		/* Others */
		} else {
			me.addEvent(window, 'load', func);
		} 
	}
		
	var pageLoadEventArray = new Array();
	
	me.runPageLoadEvents = function (e) {
		if (isSafari || e.srcElement.readyState == "complete" ) {
			
			for (var i=0; i<pageLoadEventArray.length; i++) {	
				
					pageLoadEventArray[i]();
				
			}
		}
	} 
	/**
	 * Determines if either addPageLoadEvent('funcName') or addEvent(window, 'load', funcName)
	 * has been executed.
	 * 
	 * @see addPageLoadEvent
	 * @param {Function} funcArgs - the arguments of the containing. function
	 */
	me.hasPageLoadHappened = function (funcArgs) {
		// If the function already been called, return true;
		if (funcArgs.callee.done) return true;
	
		// flag this function so we don't do the same thing twice
		funcArgs.callee.done = true;
	}
	
	me.whenAvailable = function (id, fn, ms) {
		
		availableCache.push ({id: id, fn: fn})
		
		
		if (!ms) {
			ms = 100;
		}
		
		if (!availableTimeout) {
			availableTimeout = setInterval('EventHelpers.checkAvailability()', ms);
		}

	}
	
	me.checkAvailability = function () {
		
		var docReady = me.docIsLoaded; // check doc ready first; thus ensure that check is made at least once _after_ doc is ready
		
		for (var i = availableCache.length - 1; 0 <= i; --i) {
			
			var el = document.getElementById(availableCache[i].id);
			if (el) {
				
				var fn = availableCache[i].fn; // first remove from availableCache, then call function
				availableCache[i] = availableCache[availableCache.length - 1];
				availableCache.pop();
				
				fn(el);
				
			}
			
		}
		
		if (docReady) {
			
			clearTimeout(availableTimeout);
			availableTimeout = null;
		}
		

	}
	



	/**
	 * Used in an event method/function to indicate that the default behaviour of the event
	 * should *not* happen.
	 * 
	 * @param {Object} e - an event object.
	 * @return {Boolean} - always false
	 */
	me.preventDefault = function (e) {
		
	    if(e.preventDefault)
	    {
	        e.preventDefault();
	    }
		
	    try {
	        e.returnValue = false;
	    } catch (ex) {
			// do nothing
		}
	
	}
	
	me.cancelBubble = function (e) {
		if(e.stopPropagation)
	    {
	        e.stopPropagation();
	    }
		
	    try {
	        e.cancelBubble = true;
	    } catch (ex) {
			// do nothing
		}
	}

	/* EventHelpers.init () */
	function init() {
		/* get the script node */
		me.scriptNode = me.getScriptNodeBySrc(src);
		setRoot();
		
		
		// Do not remove
		// The detection if the page is secure or not is important. If 
		// this logic is removed, Internet Explorer will give security
		// alerts.
		/*@cc_on @*/
		/*@if (@_win32)
		document.write('<script id="__ie_onload" defer src="' + 
			((location.protocol == 'https:') ? '//0' : 'javascript:void(0)') + '"><\/script>');
		var script = document.getElementById("__ie_onload");
		me.addEvent(script, 'readystatechange', me.runPageLoadEvents);
		/*@end @*/
	}
	
	init();


	
}

var DebugHelpers = new function () {

	var me = this;
	
	me.arguments = "";
	me.string = "";
	
	me.logger = null;	
	/**
	 * Get all properties and methods in any javascript object and place them inside a 
	 * string.  Useful for debugging.
	 * 
	 * @param {Object} obj - a javascript object.
	 * @param {Object} objName - used to display an object name before properties and methods
	 * 		in the string.  Optional.
	 * @return {String} - a string containing the properties of the object
	 */
	me.getProperties = function (obj, objName)
	{
		var result = ""
		
		if (!obj) {
			return result;
		}
		
		for (var i in obj)
		{
			try {
				result += objName + "." + i.toString() + " = " + obj[i] + ", ";
			} catch (ex) {
				// nothing
			}
		}
		return result
	}
	
	/**
	 * If jslog.js is present, add a string to the log.
	 * 
	 * @param {Object} s - the string to log.
	 * @param {Object} error - (optional) if true, an error is logged (default false)
	 */ 
	me.log = function (string) {
		try {
			var dummy = jslog;
			
			
			
			me.arguments = arguments;
			me.string = string;
			
			
			var execCmd = new StringBuffer();
			var execCmdString;
			
			execCmd.append(StringHelpers.sprintf("jslog.debug(StringHelpers.sprintf('%s'", string));
			
			var numArguments = arguments.length;
			
			if (numArguments > 1) {
				execCmd.append(", ")
				for (var i = 1; i < numArguments; i++) {
					execCmd.append(StringHelpers.sprintf("arguments[%d]%s ", i, i == numArguments - 1 ? "" : ", "));
				}
			}
			
			execCmd.append("))");
			
			execCmdString = execCmd.toString();
			
			
			
			
			eval(execCmdString);
		} 
		catch (ex) {
			// do nothing.
		}
	}
	
	/** 
	 * Given a thrown javascript error, return a string with a nicely formatted error message.
	 * 
	 * @param {Object} error - a thrown javascript error.
	 * @return {String} - a formatted error message.
	 */
	me.getErrorString = function(error) {
		var errorString = "";
	
		errorString += error.message + ". ";
	
		if (error.fileName) {
			errorString += error.fileName 
			if (error.lineNumber) {
				errorString += ", " + error.lineNumber;
			}
		}
	
		if (error.stack) {
			errorString += "\n\nStack info: " + error.stack;
		}
	
		return errorString;
	}
	
	me.getStackTrace = function () {
	  var callstack = [];
	  var isCallstackPopulated = false;
	  try {
	    i.dont.exist+=0; //doesn't exist- that's the point
	  } catch(e) {
	    if (e.stack) { //Firefox
	      var lines = e.stack.split('\n');
	      for (var i=0, len=lines.length; i<len; i++) {
	        if (lines[i].match(/^\s*[A-Za-z0-9\-_\$]+\(/)) {
	          callstack.push(lines[i]);
	        }
	      }
	      //Remove call to printStackTrace()
	      callstack.shift();
	      isCallstackPopulated = true;
	    }
	    else if (window.opera && e.message) { //Opera
	      var lines = e.message.split('\n');
	      for (var i=0, len=lines.length; i<len; i++) {
	        if (lines[i].match(/^\s*[A-Za-z0-9\-_\$]+\(/)) {
	          var entry = lines[i];
	          //Append next line also since it has the file info
	          if (lines[i+1]) {
	            entry += "&quot; at &quot;" + lines[i+1];
	            i++;
	          }
	          callstack.push(entry);
	        }
	      }
	      //Remove call to printStackTrace()
	      callstack.shift();
	      isCallstackPopulated = true;
	    }
	  }
	  if (!isCallstackPopulated) { //IE and Safari
	    var currentFunction = arguments.callee.caller;
	    while (currentFunction) {
	      var fn = currentFunction.toString();
	      var fname = fn.substring(fn.indexOf("&quot;function&quot;") + 8, fn.indexOf('')) || 'anonymous';
	      callstack.push(fname);
	      currentFunction = currentFunction.caller;
	    }
	  }
	  return (callstack);
	}

function output(arr) {
  //Optput however you want
  alert(arr.join('\n\n'));
}

	
	
	function init() {
		
	}
	
	me.getStackTrace = function(){
	
		var mode;
		try {
			(0)()
		} 
		catch (e) {
			mode = e.stack ? 'Firefox' : window.opera ? 'Opera' : 'Other';
		}
		
		switch (mode) {
			case 'Firefox':
				
					try {
						(0)()
					} 
					catch (e) {
						return e.stack.replace(/^.*?\n/, '').replace(/(?:\n@:0)?\s+$/m, '').replace(/^\(/gm, '{anonymous}(').split("\n");
					}
				
				
			case 'Opera':
				
					try {
						(0)()
					} 
					catch (e) {
						var lines = e.message.split("\n"), ANON = '{anonymous}', lineRE = /Line\s+(\d+).*?in\s+(http\S+)(?:.*?in\s+function\s+(\S+))?/i, i, j, len;
						
						for (i = 4, j = 0, len = lines.length; i < len; i += 2) {
							if (lineRE.test(lines[i])) {
								lines[j++] = (RegExp.$3 ? RegExp.$3 + '()@' + RegExp.$2 + RegExp.$1 : ANON + RegExp.$2 + ':' + RegExp.$1) +
								' -- ' +
								lines[i + 1].replace(/^\s+/, '');
							}
						}
						
						lines.splice(j, lines.length - j);
						return lines;
					
				};
				
			default:
				
					var curr = arguments.callee.caller, FUNC = 'function', ANON = "{anonymous}", fnRE = /function\s*([\w\-$]+)?\s*\(/i, stack = [], j = 0, fn, args, i;
					
					while (curr) {
						
						fn = fnRE.test(curr.toString()) ? RegExp.$1 || ANON : ANON;
						args = convertToArray(stack.slice.call(curr.arguments));
						i = args.length;
						
						while (i--) {
							switch (typeof args[i]) {
								case 'string':
									args[i] = '"' + args[i].replace(/"/g, '\\"') + '"';
									break;
								case 'function':
									args[i] = FUNC;
									break;
							}
						}
						 
						stack[j++] = fn + '(' + args.join() + ')\n';
						
							curr = curr.caller;
						
					}
					
					return stack;
				
		};
	};
	
	function convertToArray(fakeArray) {
		var r = new Array();
		for (var i=0; i<fakeArray.length; i++) {
			var el = fakeArray[i];
			var type = typeof(el)
			if (type == 'string') {
				r[i] = fakeArray[i];
			} else {
				r[i] = type;
			}
		}
		
		return r;
	}
	
	
	init();
}

var DOMHelpers = new function () {
	
	var me = this;
	
	var tempID = 'helpersTemp';
	var tempIDCounter = 0;
	
		
	/**
	 * Returns all children of an element. Needed if it is necessary to do
	 * the equivalent of getElementsByTagName('*') for IE5 for Windows.
	 * 
	 * @param {Object} e - an HTML object.
	 */
	me.getAllDescendants = function(obj) {
		return obj.all ? obj.all : obj.getElementsByTagName('*');
	}
	
	/**
	 * Returns all children of an element that is an element (i.e. a tag).
	 * Needed if it is necessary to do the equivalent of obj.children[] 
	 * for Gecko browsers (.children[] is not W3C, and is broken in Opera).
	 * 
	 * @param {Object} obj - an HTML object.
	 */
	me.getAllChildElements = function (obj) {
		var allNodes = obj.childNodes;
		var childElements = new Array();
		for (var i=0; i<allNodes.length; i++) {
			var node = allNodes[i];
			if (node.nodeType == DOMNode.ELEMENT_NODE) {
				childElements.push(node);
			}
		}
		return childElements;
	}
	
	me.getAllTextNodes = function (obj) {
		var textNodes = new Array();
		
		for (var i=0; i<textNodes.length; i++) {
			switch (textNodes[i].nodeType) {
				case DOMNode.TEXT_NODE:
			}
		}
	}
 
	/**
	 * Given an tag, find the first ancestor tag of a given tag name.
	 * 
	 * @param {Object} obj - a HTML or XML tag.
	 * @param {String} tagName - the name of the ancestor tag to find.
	 * @return {Object} - the ancestor tag, or null if not found.
	 */ 
	me.getAncestorByTagName = function(obj, tagName) {
		
		for (var node = obj.parentNode; 
			  node.nodeName.toLowerCase() != 'body';
			  node = node.parentNode) {
		
			if (tagName.toLowerCase() == node.nodeName.toLowerCase()) {
				return node;
			}
			  
		}
		return null;
	}
	
	me.getPreviousTag = function (obj) {
		var node = obj;
		
		do {
			node = node.previousSibling;
		} while (node && node.nodeType != DOMNode.ELEMENT_NODE );
		
		return node;
	}
	
	me.getNextTag = function (obj) {
		var node = obj;
		
		do {
			node = node.nextSibling;
		} while (node && node.nodeType != DOMNode.ELEMENT_NODE);
		
		return node;
	}
	
	/**
	 * Given an tag, find the first ancestor which has a specific class 
	 * 
	 * @param {Object} obj - a HTML or XML tag.
	 * @param {String} tagName - the name of the ancestor tag to find.
	 * @return {Object} - the ancestor tag, or null if not found.
	 */
	me.getAncestorByClassName = function(obj, className) {
		
		for (var node = obj.parentNode; 
			  node.tagName.toLowerCase() != 'body';
			  node = node.parentNode) {
		
			if (CSSHelpers.isMemberOfClass(node, className)) {
				return node;
			}
			  
		}
		return null;
	}
	
	/**
	 * Get a frame's HTML source, given its node.
	 * The frame must be from the same domain.
	 * 
	 * @param {String} id - the ID of the object.
	 * @return {String} - HTML source of the FRAME or IFRAME.
	 */
	me.getFrameDocument = function (obj) {
		if (obj.document) {
			return obj.document;
		} else if (obj.contentDocument && obj.contentDocument.document) {
			return obj.contentDocument.document;
		} else if (obj.contentWindow && obj.contentWindow.document) {
			return obj.contentWindow.document;
		}
	}

	/**
	 * Get the text inside a tag.
	 * 
	 * @param {Object} tag - a DOM node (HTML or XML)
	 * @return {String} - the inside text.
	 */
	me.getTextContent = function (tag) {
		if (!tag || !tag.firstChild)
			return "";
			
		var children = tag.childNodes;
		var s = "";
		
		for (var i=0; i<children.length; i++) {
			var child = children[i];
			var nodeType = child.nodeType;
			if (nodeType == DOMNode.TEXT_NODE || 
				nodeType == DOMNode.CDATA_SECTION_NODE ) {
				s += child.nodeValue;
			}
		}
		
		return s;
	}
	
	/**
	 * Get the text inside a tag without carriage return characters.
	 * 
	 * @param {Object} tag - a DOM node (HTML or XML)
	 * @return {String} - the inside text.
	 */
	me.getNormalizedTextContent = function (tag) {
		return me.getTextContent(tag).trim();
	}
	
	/**
	 * Given an HTML or XML object, find the an attribute by name.
	 * 
	 * @param {Object} obj - a DOM object.
	 * @param {String} attrName - the name of an attribute inside the DOM object.
	 * @return {Object} - the attribute object or null if there isn't one.
	 */
	me.getAttributeByName = function (obj, attrName) {

		var attributes = obj.attributes;
		
		try {
			return attributes.getNamedItem(attrName);
			
		} 
		catch (ex) {
			var i;
			
			for (i = 0; i < attributes.length; i++) {
				var attr = attributes[i]
				if (attr.nodeName == attrName && attr.specified) {
					return attr;
				}
			}
			return null;
		}
		
	}
	
	/**
	 * Given an HTML or XML object, find the value of an attribute.
	 * 
	 * @param {Object} obj - a DOM object.
	 * @param {String} attrName - the name of an attribute inside the DOM object.
	 * @return {String} - the value of the attribute.
	 */
	me.getAttributeValue = function (obj, attrName) {
		var attr = me.getAttributeByName(obj, attrName);
		
		if (attr != null) {
			return attr.nodeValue;
		} else {
			return obj[attrName];
		}
	}
	
	
	
	/**
	 * Given an HTML or XML object, set the value of an attribute.
	 * 
	 * @param {Object} obj - a DOM object.
	 * @param {String} attrName - the name of an attribute inside the DOM object.
	 * @param {String} attrValue - the value of the attribute.
	 */
	me.setAttributeValue = function (obj, attrName, attrValue) {
		var attr = me.getAttributeByName(obj, attrName);
		
		if (attr != null) {
			attr.nodeValue = attrValue;
		} else {
			attr = document.createAttribute(attrName);
			attr.value = attrValue;
			obj.setAttributeNode(attr)
			//obj[attrName] = attrValue;
		}
	}
	
	me.getDefinedAttributes = function (obj) {
		
		var attrs = obj.attributes;
		var r = new Array();
		
		for (var i=0; i<attrs.length; i++) {
			attr = attrs[i];
			if (attr.specified) {
				r[attr.name] = attr.value;
				
			}
		}
	
		return r;
	}
	

	me.getAllAttributePairs = function(obj) {
		var s = new StringBuffer("")

		var attrs = obj.attributes;
		
		for (var i=0; i<attrs.length; i++) {
			attr = attrs[i];
			if (attr.specified) {
				s.append( StringHelpers.sprintf('%s="%s" ', 
					attr.name, attr.value));
			}
		}
	
		return s.toString().trim();
	}
	
	
	
	me.getTagString = function (obj) {
		var s = "<";
		
		s+= obj.tagName + " " + me.getAllAttributePairs(obj)
			+ ">";
			
		return s;
	}
	
	me.getCleanAttrArray = function (obj) {
		var arr = new Array();
		
		var attrs = obj.attributes;
		
		for (var i=0; i<attrs.length; i++) {
			attr = attrs[i];
			if (attr.specified) {
				arr.push(attr);
			}
		}
		
		return arr;
	}

	function createTemporaryDOMObject () {
		tempIDCounter++;
		var tempObj = document.getElementById(tempID + tempIDCounter);
		if (!tempObj) {
			var body = document.getElementsByTagName('body')[0];
			tempObj = document.createElement('span');
			tempObj.id = tempID + tempIDCounter;
			tempObj.style.display = 'none';
			body.appendChild(tempObj);
		}
		
		return tempObj;
	}
	
	function removeTemporaryDOMObject(obj){
		document.body.removeChild(obj);
		obj = null;
	}

	/* This is designed to work around an IE "feature" taht
	 * doesn't allow writing HTML to table elements (like
	 * <tbody>).  
	 */
	me.setTableNodeInnerHTML = function (obj, s) {
		var table = me.getAncestorByTagName(obj, 'table');
		var subTagName = obj.tagName.toLowerCase();
		
		if (subTagName != 'tbody' && subTagName != 'thead' 
			&& subTagName != 'tfoot' &&
			subTagName != 'tr' ) {
				return null;
		}
		
		try {
			obj.innerHTML = s;
		} catch (ex) {
			var tempObj = createTemporaryDOMObject();

			tempObj.innerHTML = StringHelpers.sprintf(
			 	'<table><%s>%s</%s></table>', subTagName, s, subTagName);
			
			// obj.parentNode.replaceChild(tempObj.getElementsByTagName(subTagName)[0], obj);
			table.replaceChild(tempObj.getElementsByTagName(subTagName)[0], obj);
			removeTemporaryDOMObject(tempObj)
			}
		}
		
	/* This is designed to work around an IE "feature" taht
	 * doesn't allow writing HTML to table elements (like
	 * <tbody>).  It is similar to what is described on 
	 * http://mytechrantings.blogspot.com/2006/07/table-innerhtml-work-around.html
	 */
	me.appendChildToTbody = function (obj, node, clearTemp) {
		try {
			obj.appendChild(node);
		} catch (ex) {
			var tempObj = createTemporaryDOMObject()
			if (clearTemp)
				tempObj.innerHTML = '';
		 	
			 tempObj.appendChild(node, true);
			
			 obj.parentNode.replaceChild(tempObj.firstChild.firstChild,
			 	obj);
			 removeTemporaryDOMObject(tempObj)
		}
	}

	me.swapInnerHTML = function(a, b) {
		var tmp = a.innerHTML;
		a.innerHTML = b.innerHTML;
		b.innerHTML = tmp;
	}
	
	/*
	 * This code taken from an idea from http://sundberg.it/tags/Firefox
	 */
	me.swapNodes = function (item1, item2) {
		
		// We need a clone of the node we want to swap
		var itemtmp = item1.cloneNode(1);
		
		// We also need the parentNode of the items we are going to swap.
		var parent = item1.parentNode;
		
		// First replace the second node with the copy of the first node
		// which returns a the new node
		item2 = parent.replaceChild(itemtmp, item2);
		
		//Then we need to replace the first node with the new second node
		parent.replaceChild(item2, item1);
		
		// And finally replace the first item with it's copy so that we
		// still use the old nodes but in the new order. This is the reason
		// we don't need to update our Behaviours since we still have
		// the same nodes.
		parent.replaceChild(item1, itemtmp);
		
		// Free up some memory, we don't want unused nodes in our document.
		itemtmp = null;
	}
	
	me.removeNode = function (node) {
		var parentNode = node.parentNode;
		if (parentNode) {
			parentNode.removeChild(node);
		} 
	}
	

	/**
	 * Set the src paramater of an iframe or Netscape 4.x layer.
	 * 
	 * @deprecated - should just use me.setAttribute() of an iframe src attribute instead, unless 
	 * it is necessary to ensure Netscape 4.x compatibility.
	 * 
	 * @param {Object} obj - an IFRAME or ILAYER object
	 * @param {String} sourcefile - the new URL of the iframe source.
	 * @param {int} width - the width of the new ILAYER (not used if browser is not Netscape 4.x)
	 */
	me.setIframeSrc = function (obj, sourcefile, width)
	{
		// IE, W3C
		if (obj.src != null)
		{
			obj.src = sourcefile;
		}
		else if (obj.load != null && obj.style.clip != null 
				&& obj.style.clip.bottom != null) 
		{
			var clipbottom;
			me.setVisibility (obj, 'hidden');
			clipbottom = me.getClip (obj, "bottom");
			obj.load (sourcefile, width);
			obj.style.clip.bottom = clipbottom;
			this.objShow ();
		}
	}

	
    me.getInnerText = function(obj) {
		var html = obj.innerHTML;
		
		return StringHelpers.removeHTMLTags(html);
	}
	
	/******
	* Corrects selectNode innerHTML bug as described in
	*      http://support.microsoft.com/default.aspx?scid=kb;en-us;276228
	* Version: 2.1 - 04/09/2007
	* @author: Micox - N�iron Jos� C. Guimar�es - micoxjcg@yahoo.com.br
	* http://elmicoxcodes.blogspot.com/2007/02/innerhtml-and-select-option-in-ie.html
	* with modifications by Zoltan Hawryluk.
	* 
	* @param {Object} obj - a SELECT node
	* @param {String} innerHTML: what to change the obj's innerHTML to
	* 
	*******/
	me.setSelectInnerHTML = function (objeto, innerHTML){

		objeto.innerHTML = "";
		var selTemp = createTemporaryDOMObject();
		var opt;
		
		
		if (innerHTML.toLowerCase().indexOf("<option") < 0) {//se n�o � option eu converto
			innerHTML = "<option>" + innerHTML + "</option>";
		}
		innerHTML = innerHTML.replace(/<option/gi, "<span").replace(/<\/option/gi, "</span");
		selTemp.innerHTML = innerHTML;
		
		var psuedoOptionNodes= selTemp.childNodes;
		
		for (var i = 0; i < selTemp.childNodes.length; i++) {
			var spantemp = selTemp.childNodes[i];
			if (spantemp.tagName) {
				opt = document.createElement("OPTION");
				if (document.all) { //IE
					objeto.add(opt);
				} else {
					objeto.appendChild(opt);
				}       
		    
		   //getting attributes
				for (var j = 0; j < spantemp.attributes.length; j++) {
					var attrName = spantemp.attributes[j].nodeName;
					var attrVal = spantemp.attributes[j].nodeValue;
					if (attrVal) {
						try {
							opt.setAttribute(attrName, attrVal);
							opt.setAttributeNode(spantemp.attributes[j].cloneNode(true));
						}
						catch (e) {
						}
					}
				}
		   
		   //value and text
				opt.value = spantemp.getAttribute("value");
				opt.text = spantemp.innerHTML;
		   //IE
				opt.selected = spantemp.getAttribute("selected");
				opt.className = spantemp.className;
			}
		}
		removeTemporaryDOMObject(selTemp)
	}

	/******
	* Converts a DOM live node list to a static/dead array.  Good when you don't
	* want the thing you are iterating in a for loop changing as the DOM changes.
	* 
	* @param {Object} nodeList - a node list (like one returned by document.getElementsByTagName)
	* @return {Array} - an array of nodes.
	* 
	*******/
	me.nodeListToArray = function (nodeList) 
	{ 
	    var ary = []; 
	    for(var i=0, len = nodeList.length; i < len; i++) 
	    { 
	        ary.push(nodeList[i]); 
	    } 
	    return ary; 
	} 
	
	me.insertAfter = function (refNode, nodeToInsert) {
		var parent = refNode.parentNode;
		
		var nextSibling = refNode.nextSibling;
		if (nextSibling) {
			parent.insertBefore(nodeToInsert, nextSibling);
		} else {
			parent.appendChild(nodeToInsert);
		}
	}
	
	/*
	 * HTML5 dataset
	 */	
	me.getDataset = function (obj) {
		var r = new Array();
		
		var attributes = DOMHelpers.getDefinedAttributes(obj);
		//jslog.debug('entered')
		for (var i=0; i<attributes.length; i++) {
			var attr = attributes[i];
			
			if (attr.indexOf('data-') == 0) {
				//jslog.debug('adding ' + name)
				var name = attr.substring(5);
				//jslog.debug('adding ' + name)
				r[name] = attr.value;
			}
		}
		
		//jslog.debug('dataset = ' + DebugHelpers.getProperties(r))
		return r;
	}
	
	me.getDatasetItem = function (obj, name) {
		var dataName = 'data-' + name.toLowerCase();
		var r = DOMHelpers.getAttributeValue(obj, dataName);
		
		
		if (!r) {
			r = obj[dataName];
		}
		return r;
	}
	
	me.setDatasetItem = function (obj, name, value) {
		var attrName = 'data-' + name.toLowerCase();
		
		var val = DOMHelpers.setAttributeValue(obj, attrName, value);
		
		if (DOMHelpers.getAttributeValue(obj, attrName) == null) {
			obj[attrName] = value;
			
		}
	}
	
}


var StringHelpers = new function () {
	
	var me = this;
	
	// Needed by entify()
	var amp = /&/g;
	var lt = /</g;
	var gt = />/g;
	var tab = /\t/g;
	var space = / /g;
	var cr = /\n/g;			// UNIX carriage return
	var mscr = /\r\n/g;		// Microsoft carriage return
	
	var entityRe = /&\w+;/;
	
	var tempDiv = null;		// used by entity2Hex() and entity2CharCode()
	var tagRe = /<\/?[^>]+>/gi; 
							// used by removeHTMLTags()
							
	// used by the String.prototype.trim()			
	me.initWhitespaceRe = /^\s\s*/;
	me.endWhitespaceRe = /\s\s*$/;
	me.whitespaceRe = /\s/;
	
	/**
	 * Convert a hyphenated string to camelized text.  For example, the string "font-type" will be converted
	 * to "fontType".
	 * 
	 * @param {Object} s - the string that needs to be camelized.
	 * @return {String} - the camelized text.
	 */
	me.camelize = function (s) {
		var r="";
		
		for (var i=0; i<s.length; i++) {
			if (s.substring(i, i+1) == '-') {
				i++;
				r+= s.substring(i, i+1).toUpperCase();
			} else {
				r+= s.substring(i, i+1);
			}
		}
		
		return r;
	}
	
    me.fromCamelCase = function(s, doPreserveUpperCase){
        return s.replace(/(.)([A-Z])/g, function(t, a, b){
			if (doPreserveUpperCase) {
				return a + ' ' + b;
			}
			else {
				return a + ' ' + b.toLowerCase();
			}
        });
    }
    
    me.toCamelCase = function(s){
        s.replace(/( )([a-z])/g, function(t, a, b){
            return b.toUpperCase();
        });
    }
	
    function camelcase(s){
        s = trim(s);
        return (/\S[A-Z]/.test(s)) ? s.replace(/(.)([A-Z])/g, function(t, a, b){
            return a + ' ' + b.toLowerCase();
        }) : s.replace(/( )([a-z])/g, function(t, a, b){
            return b.toUpperCase();
        });
    }
    
    String.prototype.camelCase = function(){
        var s = trim(this);
        return (/\S[A-Z]/.test(s)) ? s.replace(/(.)([A-Z])/g, function(t, a, b){
            return a + ' ' + b.toLowerCase();
        }) : s.replace(/( )([a-z])/g, function(t, a, b){
            return b.toUpperCase();
        });
    };
	/**
	 * Convers an ASCII character value to Unicode format.
	 * 
	 * @param {int} num - the ASCII value of the character.
	 * @return {String} - the UNICODE equivalent.
	 */
	me.toUnicode = function (num) {
		return eval(me.sprintf("\"\\u%04x\"", num));
	}

	/**
	 * Take out the first comment inside a block of HTML
	 * 
	 * @param {String} s - an HTML block
	 * @return {String} s - the HTML block uncommented.
	 */
	me.uncommentHTML = function(s) {
		if (s.indexOf('-->')!= -1 && s.indexOf('<!--') != -1) {
			return s.replace("<!--", "").replace("-->", "");
		} else {
			return s;
		}
	}
	
	/**
	 * Convert a string to an HTML comment.
	 * 
	 * @param {String} s - the string to comment.
	 * @return {String} - the string commented.
	 */
	me.commentHTML = function(s) {
		if (s.indexOf('-->')!= -1 || s.indexOf('<!--') != -1) {
			return s;
		} else {
			return "<!-- " + s + "-->";
		}
	}
	
	me.unentify = function (s) {
		
		return s.replace(/&amp;/g, '&').
			replace(/&lt;/g, '<').
			replace(/&gt;/g, '>');
	}
	
	me.entify = function (s, options) {


		if (!options) {
			options = {}
		}
		
		var result =  s.replace(amp, "&amp;")
		  .replace(lt,"&lt;")
		  .replace(gt,"&gt;")
		  .replace(tab, '   ');
		  
		if (!options.ignoreSpace) {
		 	result = result.replace(space, '&nbsp;')
		}
		
		if (!options.ignoreReturns) {
			result = result.replace(mscr, '<br />')
			  .replace(cr, '<br />');
		}
		  
		 
		 
		 return result;
	}
	
	/*******************************************************************************
	 * Function sprintf(format_string,arguments...) Javascript emulation of the C
	 * printf function (modifiers and argument types "p" and "n" are not supported
	 * due to language restrictions)
	 * 
	 * Copyright 2003 K&L Productions. All rights reserved
	 * http://www.klproductions.com
	 * 
	 * Terms of use: This function can be used free of charge IF this header is not
	 * modified and remains with the function code.
	 * 
	 * Legal: Use this code at your own risk. K&L Productions assumes NO
	 * resposibility for anything.
	 ******************************************************************************/
	me.sprintf = function (fstring)
	  { var pad = function(str,ch,len)
	      { var ps='';
	        for(var i=0; i<Math.abs(len); i++) ps+=ch;
	        return len>0?str+ps:ps+str;
	      }
	    var processFlags = function(flags,width,rs,arg)
	      { var pn = function(flags,arg,rs)
	          { if(arg>=0)
	              { if(flags.indexOf(' ')>=0) rs = ' ' + rs;
	                else if(flags.indexOf('+')>=0) rs = '+' + rs;
	              }
	            else
	                rs = '-' + rs;
	            return rs;
	          }
	        var iWidth = parseInt(width,10);
	        if(width.charAt(0) == '0')
	          { var ec=0;
	            if(flags.indexOf(' ')>=0 || flags.indexOf('+')>=0) ec++;
	            if(rs.length<(iWidth-ec)) rs = pad(rs,'0',rs.length-(iWidth-ec));
	            return pn(flags,arg,rs);
	          }
	        rs = pn(flags,arg,rs);
	        if(rs.length<iWidth)
	          { if(flags.indexOf('-')<0) rs = pad(rs,' ',rs.length-iWidth);
	            else rs = pad(rs,' ',iWidth - rs.length);
	          }    
	        return rs;
	      }
	    var converters = new Array();
	    converters['c'] = function(flags,width,precision,arg)
	      { if(typeof(arg) == 'number') return String.fromCharCode(arg);
	        if(typeof(arg) == 'string') return arg.charAt(0);
	        return '';
	      }
	    converters['d'] = function(flags,width,precision,arg)
	      { return converters['i'](flags,width,precision,arg); 
	      }
	    converters['u'] = function(flags,width,precision,arg)
	      { return converters['i'](flags,width,precision,Math.abs(arg)); 
	      }
	    converters['i'] =  function(flags,width,precision,arg)
	      { var iPrecision=parseInt(precision);
	        var rs = ((Math.abs(arg)).toString().split('.'))[0];
	        if(rs.length<iPrecision) rs=pad(rs,' ',iPrecision - rs.length);
	        return processFlags(flags,width,rs,arg); 
	      }
	    converters['E'] = function(flags,width,precision,arg) 
	      { return (converters['e'](flags,width,precision,arg)).toUpperCase();
	      }
	    converters['e'] =  function(flags,width,precision,arg)
	      { iPrecision = parseInt(precision);
	        if(isNaN(iPrecision)) iPrecision = 6;
	        rs = (Math.abs(arg)).toExponential(iPrecision);
	        if(rs.indexOf('.')<0 && flags.indexOf('#')>=0) rs = rs.replace(/^(.*)(e.*)$/,'$1.$2');
	        return processFlags(flags,width,rs,arg);        
	      }
	    converters['f'] = function(flags,width,precision,arg)
	      { iPrecision = parseInt(precision);
	        if(isNaN(iPrecision)) iPrecision = 6;
	        rs = (Math.abs(arg)).toFixed(iPrecision);
	        if(rs.indexOf('.')<0 && flags.indexOf('#')>=0) rs = rs + '.';
	        return processFlags(flags,width,rs,arg);
	      }
	    converters['G'] = function(flags,width,precision,arg)
	      { return (converters['g'](flags,width,precision,arg)).toUpperCase();
	      }
	    converters['g'] = function(flags,width,precision,arg)
	      { iPrecision = parseInt(precision);
	        absArg = Math.abs(arg);
	        rse = absArg.toExponential();
	        rsf = absArg.toFixed(6);
	        if(!isNaN(iPrecision))
	          { rsep = absArg.toExponential(iPrecision);
	            rse = rsep.length < rse.length ? rsep : rse;
	            rsfp = absArg.toFixed(iPrecision);
	            rsf = rsfp.length < rsf.length ? rsfp : rsf;
	          }
	        if(rse.indexOf('.')<0 && flags.indexOf('#')>=0) rse = rse.replace(/^(.*)(e.*)$/,'$1.$2');
	        if(rsf.indexOf('.')<0 && flags.indexOf('#')>=0) rsf = rsf + '.';
	        rs = rse.length<rsf.length ? rse : rsf;
	        return processFlags(flags,width,rs,arg);        
	      }  
	    converters['o'] = function(flags,width,precision,arg)
	      { var iPrecision=parseInt(precision);
	        var rs = Math.round(Math.abs(arg)).toString(8);
	        if(rs.length<iPrecision) rs=pad(rs,' ',iPrecision - rs.length);
	        if(flags.indexOf('#')>=0) rs='0'+rs;
	        return processFlags(flags,width,rs,arg); 
	      }
	    converters['X'] = function(flags,width,precision,arg)
	      { return (converters['x'](flags,width,precision,arg)).toUpperCase();
	      }
	    converters['x'] = function(flags,width,precision,arg)
	      { var iPrecision=parseInt(precision);
	        arg = Math.abs(arg);
	        var rs = Math.round(arg).toString(16);
	        if(rs.length<iPrecision) rs=pad(rs,' ',iPrecision - rs.length);
	        if(flags.indexOf('#')>=0) rs='0x'+rs;
	        return processFlags(flags,width,rs,arg); 
	      }
	    converters['s'] = function(flags,width,precision,arg)
	      { var iPrecision=parseInt(precision);
	        var rs = arg;
	        if(rs.length > iPrecision) rs = rs.substring(0,iPrecision);
	        return processFlags(flags,width,rs,0);
	      }
	    farr = fstring.split('%');
	    retstr = farr[0];
	    fpRE = /^([-+ #]*)(\d*)\.?(\d*)([cdieEfFgGosuxX])(.*)$/;
	    for(var i=1; i<farr.length; i++)
	      { fps=fpRE.exec(farr[i]);
	        if(!fps) continue;
	        if(arguments[i]!=null) retstr+=converters[fps[4]](fps[1],fps[2],fps[3],arguments[i]);
	        retstr += fps[5];
	      }
	    return retstr;
	}
	
	/**
	 * Convert an HTML entity to a Unicode character code.
	 * 
	 * @param {String} ent - an HTML entity.
	 * @return {String} - ent converted to Unicode character code.
	 * @author "Fox" from http://www.thescripts.com/forum/thread148087.html
	 */
	me.entityToCharCode = function (ent)
	{
		var retval = null;
		
		if(!tempDiv) {
			tempDiv = document.createElement('DIV');
		}
		
		tempDiv.innerHTML = ent;
		
		return tempDiv.innerHTML.charCodeAt(0);
	}  
	
	/**
	 * Convert a string to a hexadecimal Unicode HTML entity.
	 * 
	 * @param {String} ent - an HTML entity.
	 * @return {String} - ent converted to an hexadecimal Unicode HTML entity.
	 * @author "Fox" from http://www.thescripts.com/forum/thread148087.html
	 */
	me.entityToHex = function (ent)
	{
	
		if(!tempDiv) {
			tempDiv = document.createElement('DIV');
		}
		tempDiv.innerHTML = ent;
		
		return tempDiv.innerHTML.charCodeAt(0).toString(16).toUpperCase();
	}
	
	me.entitiesToHex = function (htmlString)
	{
		var result = htmlString;
		do {
			alert(entityRe)
			var matchResult = result.match(entityRe);
			
			var doesMatch = (matchResult != null)
			if (doesMatch) {
				var hexValue = me.entityToHex(matchResult);
				var entityRe = new RegExp(
					StringHelpers.sprintf('&%s;', hexValue), 'g');
				
				result = result.replace(entityRe, hexValue)
			}
		} while (doesMatch);
		
		return result;
	}
	
	/*
	 * removeHTMLTags() - based on ideas from 
	 * http://radio.javaranch.com/pascarello/2005/01/14/1105721395000.html
	 */
	me.removeHTMLTags = function (s) {
		var r = s.replace(tagRe,"");
        return r;
	}
	
	
	me.urlencode = function (str) {
		return escape(str).replace('+', '%2B').replace('%20', '+').replace('*', '%2A').replace('/', '%2F').replace('@', '%40');
	}
	
	/*
	 * From http://www.phpbuilder.com/board/showthread.php?t=10318476
	 */
	me.urldecode = function (str) {
		return unescape(str.replace('+', ' '));
	}
	
	me.tabString = me.toUnicode(9);
}

/*
*  stringBuffer.js - ideas from 
*  http://www.multitask.com.au/people/dion/archives/000354.html
*/

function StringBuffer() {
	var me = this;

	var buffer = []; 
	

	me.append = function(string)
	{
		buffer.push(string);
		return me;
	}
	
	me.appendBuffer = function(bufferToAppend) {
		buffer = buffer.concat(bufferToAppend);
	}
	
	me.toString = function()
	{
		return buffer.join("");
	}
	
	me.getLength = function() 
	{
		return buffer.length;
	}
	
	me.flush = function () 
	{
		buffer.length=0;
	}

}

/* 
 * Adding trim method to String Object.  Ideas from 
 * http://www.faqts.com/knowledge_base/view.phtml/aid/1678/fid/1 and
 * http://blog.stevenlevithan.com/archives/faster-trim-javascript
 */
String.prototype.trim = function() { 
	var str = this;
	
	// The first method is faster on long strings than the second and 
	// vice-versa.
	if (this.length > 6000) {
		str = this.replace(StringHelpers.initWhitespaceRe, '');
		var i = str.length;
		while (StringHelpers.whitespaceRe.test(str.charAt(--i)));
		return str.slice(0, i + 1);
	} else {
		return this.replace(StringHelpers.initWhitespaceRe, '')
			.replace(StringHelpers.endWhitespaceRe, '');
	}  
};


// from http://jamesroberts.name/blog/2010/02/22/string-functions-for-javascript-trim-to-camel-case-to-dashed-and-to-underscore/
String.prototype.toDash = function(){
	return this.replace(/([A-Z])/g, function($1){return "-"+$1.toLowerCase();});
};

String.prototype.toUnderscore = function(){
	return this.replace(/([A-Z])/g, function($1){return "_"+$1.toLowerCase();});
};

//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/string/capitalize [v1.0]

String.prototype.capitalize = function(){ //v1.0
    
        return this.charAt(0).toUpperCase() + this.substr(1);
    
};

// From http://www.somacon.com/p143.php
var FormHelpers = new function () {
	var me = this;
	
	// return the value of the radio button that is checked
	// return an empty string if none are checked, or
	// there are no radio buttons. Usage :
	// FormHelpers.getCheckedValue(document.forms[formName].elements[radioName]); 
	me.getCheckedValue = function(radioObj) {
		if(!radioObj)
			return "";
		var radioLength = radioObj.length;
		if(radioLength == undefined)
			if(radioObj.checked)
				return radioObj.value;
			else
				return "";
		for(var i = 0; i < radioLength; i++) {
			if(radioObj[i].checked) {
				return radioObj[i].value;
			}
		}
		return "";
	}
	
	// set the radio button with the given value as being checked
	// do nothing if there are no radio buttons
	// if the given value does not exist, all the radio buttons
	// are reset to unchecked.  Usage :
	// FormHelpers.setCheckedValue(document.forms[formName].elements[radioName], 
	//	value);
	me.setCheckedValue = function(radioObj, newValue) {
		if(!radioObj)
			return;
		var radioLength = radioObj.length;
		if(radioLength == undefined) {
			radioObj.checked = (radioObj.value == newValue.toString());
			return;
		}
		for(var i = 0; i < radioLength; i++) {
			radioObj[i].checked = false;
			if(radioObj[i].value == newValue.toString()) {
				radioObj[i].checked = true;
			}
		}
	}
}

var XMLHelpers = new function () {
	
	var me = this;
	
	/* 
	 * Opera doesn't have the dashes inside the innerHTML of a DOM node for
	 * JSP comment tags ... just <% %>
	 */
	var JSPcommentRe = new RegExp("<%(--)?([\\w\\W]*?)(--)?%>", 'g');
	var beginningHTMLCommentRe = new RegExp("<!--");
	var endHTMLCommentRe = new RegExp("-->");
	
	var selfClosingTagRe = /<([^\/>]+) *\/>/g;
	var quoteRe = /\"/g;
	/**
	 * Wrapper for XMLHttpRequest Object.  Grabbing data (XML and/or text) from a URL.
	 * Grabbing data from a URL. Input is one parameter, url. It returns a request
	 * object. Based on code from
	 * http://www.xml.com/pub/a/2005/02/09/xml-http-request.html.  IE caching problem
	 * fix from Wikipedia article http://en.wikipedia.org/wiki/XMLHttpRequest
	 * 
	 * @param {String} url - the URL to retrieve
	 * @param {Function} processReqChange - the function/method to call at key events of the URL retrieval.
	 * @param {String} method - (optional) "GET" or "POST" (default "GET")
	 * @param {String} data - (optional) the CGI data to pass.  Default null.
	 * @param {boolean} isAsync - (optional) is this call asyncronous.  Default true.
	 * 
	 * @return {Object} a XML request object.
	 */
	me.getXMLHttpRequest = function (url, processReqChange) //, method, data, isAsync)
	{
		var argv = me.getXMLHttpRequest.arguments;
		var argc = me.getXMLHttpRequest.arguments.length;
		var httpMethod = (argc > 2) ? argv[2] : 'GET';
		var data = (argc > 3) ? argv[3] : "";
		var isAsync = (argc > 4) ? argv[4] : true;
		
		var req;
		// branch for native XMLHttpRequest object
		if (window.XMLHttpRequest) {
			req = new XMLHttpRequest();	
		// branch for IE/Windows ActiveX version
		} else if (window.ActiveXObject) {
			try {
				req = new ActiveXObject('Msxml2.XMLHTTP');
			} catch (ex) {
				req = new ActiveXObject("Microsoft.XMLHTTP");
			} 
			// the browser doesn't support XML HttpRequest. Return null;
		} else {
			return null;
		}
		
		if (isAsync) {
			req.onreadystatechange = processReqChange;
		}
		
		if (httpMethod == "GET" && data != "") {
			url += "?" + data;
		}
		
		req.open(httpMethod, url, isAsync);
		
		//Fixes IE Caching problem
		req.setRequestHeader( "If-Modified-Since", "Sat, 1 Jan 2000 00:00:00 GMT" );
		req.send(data);
		
		return req;
	}
	

	

	/**
	 * Convert a string to a DOM object.
	 * Based on code from
	 * http://www-128.ibm.com/developerworks/web/library/wa-ie2mozgd/
	 * 
	 * @param {Object} xmlString - an XML string.
	 * @return {Object} - the DOM tree of the string.
	 */
	me.parseXML = function (xmlString) {
		var myDocument;
		
		if (document.implementation && document.implementation.createDocument){
			// All except IE, create a new DOMParser
			var parser = new DOMParser();
			myDocument = parser.parseFromString(xmlString, "text/xml");
		} else if (window.ActiveXObject){
			// Internet Explorer, create a new XML document using ActiveX
			// and use loadXML as a DOM parser.
			myDocument = new ActiveXObject("Microsoft.XMLDOM");
			myDocument.async="false";
			myDocument.loadXML(xmlString);
		}
		
		return myDocument;
	}
	
	/* 
	 * This function assumes you don't use the element "parsererror" 
	 */
	me.hasParserError = function (node) {
		/* 
		 * IE throws an access denied which cannot be caught with
		 * a try ... catch.  Using conditional comments.  We cannot 
		 * detect, so say there is no error (for now).
		 */
		
		/*@cc_on @*/
		/*@if (@_win32)
		return false;
		/*@end @*/
		
		if (node.getElementsByTagName('parsererror').length > 0) {
			return true;
		}
		else {
			return false;
		}
		
	}
	
	me.getParserError = function (node) {
		/*@cc_on @*/
		/*@if (@_win32)
		return "Unknown XML Error."
		/*@end @*/
		if (node.getElementsByTagName('parsererror').length > 0) {
			return me.getInnerXML(node.getElementsByTagName('parsererror')[0])
		}
		
			
		
	}
	
	/**
	 * Given an HTML object with only an HTML comment with XML inside of it, parse the
	 * XML and return it's DOM tree.
	 * 
	 * @param {Object} obj - the HTML object with the HTML comment inside.
	 * @return {Object} - the equivalent DOM object.
	 */
	me.parseXMLDataIsland = function(obj) {
			
		
	         return me.parseXML(obj.innerHTML
			 	.replace(JSPcommentRe, '')
				.replace(beginningHTMLCommentRe, '')
				.replace(endHTMLCommentRe, '')
			 )
	}
	
	
	
	/**
	 * If a parse error happened using parseXMLDataIsland() or getXMLHttpRequest(),
	 * return the error string.
	 * 
	 * @param {Object} xmlObj - an unsuccessful DOM object returned by an XML parsing routine.
	 * @return {String} - the error message returned.
	 */
	
	me.XMLParseError = function (xmlObj) {
	        var parseError = xmlObj.getElementsByTagName('parsererror')[0];
	        var sourceText = xmlObj.getElementsByTagName('sourcetext')[0];
	        if (parseError) {
	                return DOMHelpers.getTextContent(parseError);
	        } else if (DOMHelpers.getAllDescendants(xmlObj).length == 0) {
	                return "Error parsing XML";
	        } else {
	                return null;
	        }
	}
	

	/**
	 * Given an XML node, return the XML inside as a string.  Similar to innerHTML except
	 * it is for XML, not HTML.
	 * 
	 * @author - Phillip Perkins, http://www.zdnetasia.com/techguide/webdev/printfriendly.htm?AT=39304134-39001232c
	 * @param {Object} node - a DOM object.
	 * @return {String} - the XML String inside the object.
	 */
	me.getInnerXML = function (node, options) {
		var s = "";
		
		for (var i = 0; i < node.childNodes.length; i++) {
			s+= me.getOuterXML(node.childNodes[i], options);
		}
		
		return s;
	}


	
	/**
	 * Given an XML node, return the XML inside as a string and the XML string of the node itself.
	 * Similar to Internet Explorer's outerHTML property, except it is for XML, not HTML.
	 * Created with information from http://www.codingforums.com/showthread.php?t=31489
	 * and http://www.mercurytide.co.uk/whitepapers/issues-working-with-ajax/		
	 * 
	 * @param {Object} node - a DOM object.
	 * @param {Object} options - a JS object containing options.  To date,
	 * 		the only one supported is "insertClosingTags", when set to
	 * 		true, converts self closing tags, like <td />, to <td></td>.
	 * @return {String} - the XML String inside the object.
	 */
	me.getOuterXML = function (node, options) {
		var r;
			// Internet Explorer
			if (node.xml) {
				r = node.xml;
				
			// Everyone else 
			} else if (node.outerHTML) { 
				r = node.outerHTML;
			} else if (window.XMLSerializer) {
			
				var serializer = new XMLSerializer();
    			var text = serializer.serializeToString(node);
				r = text;
			} else {
				return null;
			}
			
			/*
			 * If the XML is actually HTML and you are inserting it into an HTML
			 * document, you must use the "insertClosingTags" option, otherwise
			 * Opera will not like you, especially if you have empty <td> tags.
			 */
			if (options) {
				if (options.insertClosingTags) {
					r = r.replace(selfClosingTagRe, "<$1></$1>");
				}
			}
			return r;
	}
	
	// this is not used ... but it may be needed depending if XMLSerializer works correctly.
	me.nodeToXML = function (node) {
        switch (node.nodeType) {
            case DOMNode.TEXT_NODE:
                strXMLSb.append(StringHelpers.entify(node.data, {
                    ignoreSpace: true,
                    ignoreReturns: true
                }));
                break;
            case DOMNode.CDATA_SECTION_NODE:
                strXMLSb.append('<![CDATA[ ').append(node.data).append(']]>');
				break;
			case DOMNode.ELEMENT_NODE:
				strXMLSb.append(StringHelpers.sprintf(
					"<%s %s>%s</%s>", 
					node.nodeName, 
					DOMHelpers.getAllAttributePairs(node),
					me.getInnerXML(node),
					node.nodeName
				));
				break;
            default:
				var objXMLSerializer = new XMLSerializer();
                strXMLSb.append(objXMLSerializer.serializeToString(node));
                break;
                
        }
	}
	
	me.nodeToObject = function (node) {
		var descendants = node.childNodes; //DOMHelpers.getAllDescendants(node);
		var result = new Object();
		
		for (var i=0; i<descendants.length; i++) {
			
			
			
			var descendant = descendants[i]
			
			if (descendant.nodeType == DOMNode.ELEMENT_NODE ) {
				//document.getElementById('debug').innerHTML = descendant.nodeName;
				result[descendant.nodeName] = 
					DOMHelpers.getTextContent(descendant);
			}
		}
		
		return result;
	}
	
	/*
	 * objectToXML(): converts a javascript object to XML
	 * based on code from http://xajaxproject.org/
	 */
	me.objectToXML = function(obj, name, options)
	{
		var xmlSb = new StringBuffer();
		if (!options) {
			options = {}
		}
		
		xmlSb.append(StringHelpers.sprintf("<%s>", name));
		
		for (i in obj)
		{
			
			if (i == 'constructor')
				continue;
			if (obj[i] && typeof(obj[i]) == 'function')
				continue;
			
			
			if (options.allowXML) {
				var key = i;
				var value = obj[i];
			} else {
				var key = StringHelpers.entify(i, {ignoreSpace: true});
				var value = StringHelpers.entify(obj[i], {ignoreSpace: true});
			}
			
			if (options.trimValues) {
				key = key.trim();
				value = value.trim();
			}
			
			if (value && typeof(value)=="object" && this.depth <= 50) {
				this.depth++;
				xmlSb.append(me.objectToXML(value, key));
				this.depth--;
			} else {
				//xmlSb += "<e><k>"+key+"</k><v>"+value+"</v></e>"; 
				if (options.cdataElements && 
				    options.cdataElements[key]) {
					xmlSb.append(
						StringHelpers.sprintf(
						"<%s><![CDATA[ %s ]]></%s>",
						key, value, key));
				} else {
					xmlSb.append(
						StringHelpers.sprintf(
						  "<%s>%s</%s>", 
						  key, value, key));
				}
			}
			
		}
		xmlSb.append(StringHelpers.sprintf("</%s>", name));
	
		return xmlSb.toString();
	}
	
	
	/* 
	 * This is different than DOMHelpers.getAttributeValues(), in that it
	 * allows one to grab an attribute that the browser doesn't understand.
	 */
	me.getAttributeValue = function (node, type) {
		var typeRe = new RegExp(type + '=\"([a-zA-Z\-]*)\"');
		var typeVal = XMLHelpers.getOuterXML(node).match(typeRe);
		if (typeVal && typeVal.length >= 1) {
			return typeVal[1].replace(quoteRe, '');
		} else {
			return null;
		}
	}


}

var ObjectHelpers = new function () {
	var me = this;
	
	me.isArray = function (obj){
    	return obj instanceof Array;
	}
	
	/*
	 * From http://www.codingforums.com/showthread.php?t=191882
	 */
	
	me.addGetter = function (obj, name, fn){
		if(!(obj&&name&&fn)){
			throw new TypeError("addGetter(): Argument Expected");
		} else if (Object.defineProperty){
			return Object.defineProperty(obj, name, {get:fn}) && obj;
		} else if (obj.__defineGetter__){
			obj.__defineGetter__(name, fn);
		} else {
			function getter(){return fn();};
			obj[name]={valueOf: getter, toString: getter};
		}
	   return obj;
	}
	
	me.addSetter = function (obj, name, fn){
		if(!(obj&&name&&fn)){
			throw new TypeError("addSetter(): Argument Expected");
		} else if (Object.defineProperty){
			return Object.defineProperty(obj, name, {set:fn}) && obj;
		} else if(obj.__defineSetter__){
			obj.__defineSetter__(name, fn);
		} else {
			return false;
		}
	   return obj;
	}
	
}

function RequestHelper(src, func) {
  
	var me = this;
	
	me.src = src;
	me.func = func;
	me.methodArguments = getMethodArguments(arguments);
	
	
	
	
	var req;
	
	function init () {
		req = XMLHelpers.getXMLHttpRequest(me.src, method);
	}
	
	function getMethodArguments(argv) {
		var r = new Array();
		for (var i=2; i<argv.length; i++) {
			
			r.push(argv[i]);
		}
		
		return r;
	}
	
	function method () {
		
		if (!req) {
                return;
        }
        
        // only if req shows "complete"
        if (req.readyState == ReadyState.COMPLETED) {
                // only if "OK"
				//DebugHelpers.log(req.getAllResponseHeaders());
				
                if (req.status == HttpCode.OK || req.status == HttpCode.LOCAL_OK) {
					me.func(req, me.methodArguments);
				}
		}
	}
	
	init()
} 



/**
 * This singleton object is a list of node types and is enumerated according to the W3C standard.
 */
var DOMNode = new function () {
	var me = this;
	
	this.ELEMENT_NODE = 1;
	this.ATTRIBUTE_NODE = 2;
	this.TEXT_NODE = 3;
	this.CDATA_SECTION_NODE = 4;
	this.ENTITY_REFERENCE_NODE = 5;
	this.ENTITY_NODE = 6;
	this.PROCESSING_INSTRUCTION_NODE = 7;
	this.COMMENT_NODE = 8;
	this.DOCUMENT_NODE = 9;
	this.DOCUMENT_TYPE_NODE = 10;
	this.DOCUMENT_FRAGMENT_NODE = 11;
	this.NOTATION_NODE = 12;
}

var ReadyState = new function () {
	
	var me=this;
	
	// open() has not been called yet.
	me.UNINITIALIZED = 0;
	
	// send() has not been called yet.
	me.LOADING = 1;
	
	// send() has been called, headers and status are available.
	me.LOADED = 2;
	
	// Downloading, responseText holds the partial data.
	me.INTERACTIVE = 3;
	
	// Finished with all operations.
	me.COMPLETED = 4;
}

/* 
 * This lookup table coded with information from 
 * http://www.quirksmode.org/js/keys.html
 */
var CharCode = new function () {
	
	var me = this;

	var isOpera = window.opera != null;

	me.ALT 			= 18;
	me.BACKSPACE	= 8;
	me.CAPSLOCK		= 20;
	me.CTRL			= 17;
	me.DELETE		= 46;
	me.END			= 35;
	me.ENTER		= 13;
	me.ESCAPE		= 27;
	me.HOME 		= 36;
	me.INSERT		= 45;
	me.NUMLOCK		= 144;
	me.PAGEUP		= 33;
	me.PAGEDOWN		= 34;
	me.SHIFT		= 16;
	me.TAB			= 9;
	me.WINSTART		= 91;
	
	
	
	
	/* Function Keys */
	me.F = new Array();
	
	for (var i=1; i<=12; i++) {
		if (isOldSafari) {
			me.F[i] = 63235 + i;
		} else {
			me.F[i] = 111 + i;
		}
	}	
	
	/* Arrow keys are silly in Safari.  We only test for old safari if BrowserDetect loaded. */
	if (window.BrowserDetect) {
		var isOldSafari = BrowserDetect.browser == 'Safari' &&
	    	BrowserDetect.version < 3.1;
		if (isOldSafari) {
			me.LEFT 		= 63234;
			me.UP 			= 63232;
			me.RIGHT		= 63235;
			me.DOWN			= 63233;
			me.MACHELPDOWN  = 45;
			me.MACHELPPRESS = 45;
		} 
	} 
	
	if (!me.LEFT) {	// if is not an old version of safari or BrowserDetect not loaded 
		me.LEFT 		= 37;
		me.UP 			= 38;
		me.RIGHT		= 39;
		me.DOWN			= 40;
		
		if (isOpera) {
			me.MACHELPDOWN = 5;
			me.MACHELPPRESS = 63;
		} else {
			me.MACHELPDOWN = 6;
			me.MACHELPPRESS = 6;
		}
	}
	
	 
}

/*
 * These codes are from http://en.wikipedia.org/wiki/List_of_HTTP_status_codes
 */
var HttpCode = new function () {
	var me = this;
	
	me.LOCAL_OK = 0;
	
	// Informational
	me.CONTINUE = 100;
	me.SWITCHING_PROTOCOLS = 101;
	me.PROCESSING = 102;
	
	// Sucessful
	me.OK = 200;
	me.CREATED  = 201;
	me.ACCEPTED = 202;
	me.NONAUTHORITATIVE_INFO = 203;
	me.NO_CONTENT = 204;
	me.RESET_CONTENT = 205;
	me.PARTIAL_CONTENT = 206;
	me.MULTI_STATUS= 207;
	
	// Redirection
	me.MULTIPLE_CHOICES = 300;
	me.MOVED_PERMANENTLY = 301;
	me.FOUND = 302;
	me.SEE_OTHER = 303;
	me.NOT_MODIFIED = 304;
	me.USE_PROXY = 305;
	me.SWITCH_PROXY;	// No longer used ... included for completeness.
	me.TEMPORARY_REDIRECT = 307;
	
	// Client Errors
	me.BAD_REQUEST = 400;
	me.UNAUTHORIZED = 401;
	me.PAYMENT_REQUIRED = 402;
	me.FORBIDDEN = 403;
	me.NOT_FOUND = 404;
	me.METHOD_NOT_ALLOWED = 405;
	me.NOT_ACCEPTABLE = 406;
	me.PROXY_AUTHENTICATION = 407;
	me.REQUEST_TIMEOUT = 408;
	me.CONFLICT = 409;
	me.GONE = 410;
	me.LENGTH_REQUIRED = 411;
	me.PRECONDITION_FAILED = 412;
	me.REQUEST_ENTITY_TOO_LARGE = 413;
	me.REQUEST_URI_TOO_LONG = 414;
	me.UNSUPPORTED_MEDIA_TYPE = 415;
	me.REQUESTED_RANGE_NOT_SATISFIABLE = 416;
	me.EXPECTATION_FAILED = 417;
	me.UNPROCESSABLE_ENTITY = 422;
	me.LOCKED = 423;
	me.FAILED_DEPENDENCY = 424;
	me.UNORDERED_COLLECTION = 425;
	me.UPGRADE_REQUIRED = 426;
	me.RETRY_WITH = 449 	// MS extension
	
	// Server errors
	me.INTERNAL_SERVER_ERROR = 500;
	me.NOT_IMPLEMENTED = 501;
	me.BAD_GATEWAY = 502;
	me.SERVICE_UNAVAILABLE = 503;
	me.GATEWAY_TIMEOUT = 504;
	me.HTTP_VERSION_NOT_SUPPORTED = 505;
	me.INSUFFICIENT_STORAGE = 507;
	me.BANDWIDTH_LIMIT_EXCEEDED = 509;
	
	me.isInformational = function (n) {
		return (100 <= n && n <= 199);
	} 
	
	me.isSuccessful = function (n) {
		return (200 <= n && n <= 299)
	}
	
	me.isRedirection = function (n) {
		return (300 <= n && n <= 399);
	}
	
	me.isClientError = function (n) {
		return (400 <= n && n <= 499);
	}
	
	me.isServerError = function (n) {
		return (500 <= n && n<=599);
	}
}

if (!window.MutationEvent) {
	window.MutationEvent = {
		MODIFICATION: 1,
		ADDITION: 2,
		REMOVAL: 3
	}
}


var dummyLogger = new function () {
	var me = this;
	
	function doNothing() {
		// really do nothing;
	}
	
	me.debug = doNothing;
	me.info = doNothing;
	
}


// implements .contains().  Idea from http://www.quirksmode.org/blog/archives/2006/01/contains_for_mo.html
if (window.Node && Node.prototype && !Node.prototype.contains)
{
	Node.prototype.contains = function (arg) {
		return !!(this.compareDocumentPosition(arg) & 16)
	}
}

// Add behaviour for mutation events 
document.write('<style type="text/css"> .' + EventHelpers.mutationClass + ' *, .' + EventHelpers.mutationClass + '{ behavior: url(/shared/htc/mutation.htc); } </style>');


if (!window.jslog) {
	window.jslog = dummyLogger;
}

EventHelpers.addPageLoadEvent('EventHelpers.init');
