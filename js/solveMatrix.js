/**
 * @author haw5855
 */


var $ = function(s){
	return document.getElementById(s);
}

var matrixSolver = new function () {
	var me = this;
	me.o1;
	
	var o2, resizer;
	var prop;
	
	me.points = [];
	me.form = null;
	me.coords = null;
	
	
	
	me.init = function () {
		if (EventHelpers.hasPageLoadHappened(arguments)) {
			return;
		}
			
		//DragDropHelpers.fixVisualCues=true;

		
		
		
		prop = getMatrixProperty();
		
		
		me.o1 = new Block($('o1'));
		
		o2 = new Block($('o2'));
		
		resizer = new Resizer($('o1Resizer'), me.o1);
		me.o1.resizer = resizer;
		
		
		
		var pointEls = CSSHelpers.getElementsByClassName(document, 'point');
		for (var i=0; i<pointEls.length; i++) {
			me.points = new Point(pointEls[i]);
		}
		
		grid.init();
		me.form = $('matrixForm');
		
		if (me.form) {
			EventHelpers.addEvent(me.form, 'submit', me.submitEvent);
			EventHelpers.addEvent(me.form, 'reset', me.resetEvent);
			EventHelpers.addEvent(me.form['do3D'], 'change', me.submitEvent);
			me.submitEvent(null, false)
		}
		
	}
	
	function getMatrixProperty() {
		var style = document.body.style;
		var props = ['transform', 'MozTransform', 'WebkitTransform', 'OTransform'];
		for (i in props) {
			
			if (style[props[i]] != undefined) {
				return props[i];
			}
		}
		return null;
	}
	
	
	
	
	
	
	
	me.setForm = function (coords) {
		var id = grid.draggingObject.id;
		var xEl, yEl;
		var offset =0;
		switch(id) {
			case "o1":
		
				xEl = me.form['from0x'];
				yEl = me.form['from0y'];
				me.form['from1y'].value = grid.draggingObject.offsetHeight + coords.y;
				me.form['from2x'].value = grid.draggingObject.offsetWidth + coords.x;
				break;
			case "o1Resizer":
				xEl = me.form['from2x'];
				yEl = me.form['from1y'];
				me.form['from2x'].value = coords.x
				me.form['from1y'].value = coords.y;
				offset = 10;
				break;
			default:
				var index = parseInt(id.replace('point', '')) - 1;
				
				xEl = me.form['to' + index + 'x'];
				yEl = me.form['to' + index + 'y'];
		}
		//alert(DebugHelpers.getProperties(coords))
		xEl.value = coords.x + offset;
		yEl.value = coords.y + offset;
		EventHelpers.fireEvent(me.form['from0x'], 'change');
		EventHelpers.fireEvent(me.form['from0y'], 'change');
		
	}
	
	
	function formEl(name) {
		return parseFloat(me.form[name].value);
	}
	
	me.resetEvent = function (e) {
		setTimeout(function(e) {
			me.submitEvent(e);
		}, 1)
	}
	
	function get3DMatrix(x0, y0, x1, y1, x2, y2, x3, y3, w, h)
    {
      var v = [],
          cx = 1024/2,
          cy = 768/2,
          cz = 983,
          result,
          i;
 
      console.log('getMatrix3D', x0, y0, x1, y1, x2, y2, x3, y3, w, h);
      v[0] = -(cx*x0*y2-cx*x2*y0-cx*x0*y3-cx*x1*y2+cx*x2*y1+cx*x3*y0+cx*x1*y3-cx*x3*y1-x0*x2*y1+x1*x2*y0+x0*x3*y1-x1*x3*y0+x0*x2*y3-x0*x3*y2-x1*x2*y3+x1*x3*y2)/(x1*y2-x2*y1-x1*y3+x3*y1+x2*y3-x3*y2) / w;
      v[1] = -(cy*x0*y2-cy*x2*y0-cy*x0*y3-cy*x1*y2+cy*x2*y1+cy*x3*y0+cy*x1*y3-cy*x3*y1-x0*y1*y2+x1*y0*y2+x0*y1*y3-x1*y0*y3+x2*y0*y3-x3*y0*y2-x2*y1*y3+x3*y1*y2)/(x1*y2-x2*y1-x1*y3+x3*y1+x2*y3-x3*y2) / w;
      v[2] = (cz*x0*y2-cz*x2*y0-cz*x0*y3-cz*x1*y2+cz*x2*y1+cz*x3*y0+cz*x1*y3-cz*x3*y1)/(x1*y2-x2*y1-x1*y3+x3*y1+x2*y3-x3*y2) / w;
      v[3] = 0;
      v[4] = (cx*x0*y1-cx*x1*y0-cx*x0*y3+cx*x1*y2-cx*x2*y1+cx*x3*y0+cx*x2*y3-cx*x3*y2-x0*x1*y2+x1*x2*y0+x0*x1*y3-x0*x3*y1+x0*x3*y2-x2*x3*y0-x1*x2*y3+x2*x3*y1)/(x1*y2-x2*y1-x1*y3+x3*y1+x2*y3-x3*y2) / h;
      v[5] = (cy*x0*y1-cy*x1*y0-cy*x0*y3+cy*x1*y2-cy*x2*y1+cy*x3*y0+cy*x2*y3-cy*x3*y2-x0*y1*y2+x2*y0*y1+x1*y0*y3-x3*y0*y1+x0*y2*y3-x2*y0*y3-x1*y2*y3+x3*y1*y2)/(x1*y2-x2*y1-x1*y3+x3*y1+x2*y3-x3*y2) / h;
      v[6] = -(cz*x0*y1-cz*x1*y0-cz*x0*y3+cz*x1*y2-cz*x2*y1+cz*x3*y0+cz*x2*y3-cz*x3*y2)/(x1*y2-x2*y1-x1*y3+x3*y1+x2*y3-x3*y2) / h;
      v[7] = 0;
      v[8] = 0;
      v[9] = 0;
      v[10] = 1;
      v[11] = 0;
      v[12] = x0;
      v[13] = y0;
      v[14] = 0;
      v[15] = 1;
 
      /* result = 'matrix3d(';
 
      for (i = 0; i < 16; i++ ) {
        result += v[i];
 
        if ( i != 15 ) {
          result += ', ';
        }
      }
 
      result += ')'; */
      
      result =  $M([
        [v[0], v[1], v[2], v[3]], 
        [v[4], v[5], v[6], v[7]],  
        [v[8], v[9], v[10], v[11]],
        [v[12], v[13], v[14], v[15]] 
      ]);
 
      return result;
    }

	me.submitEvent = function (e, ignorePoints) {
		var transform;
		
		if (e && e.type != 'reset') {
				EventHelpers.preventDefault(e);
		}
		
		if (me.form['do3D'] && me.form['do3D'].checked) {
			/* Uses info from http://www.physicsforums.com/showthread.php?t=360963 */
			var fromPts = [
    			     {
    			         x: formEl("from0x"),
    			         y: formEl("from0y")
    			     },
    			     {
    			         x: formEl("from0x"),
    			         y: formEl("from1y")
    			     },
    			     {
    			         x: formEl("from2x"), 
    			         y: formEl("from0y")
    			     },
    			     {
    			         x: formEl("from2x"), 
    			         y: formEl("from1y")
    			     }
			     ],
			     toPts = [
			         {
			             x: formEl('to0x'),
			             y: formEl('to0y')
			         },
			         {
                         x: formEl('to1x'),
                         y: formEl('to1y')
                     },
                     {
                         x: formEl('to2x'),
                         y: formEl('to2y')
                     },
                     {
                         x: formEl('to3x'),
                         y: formEl('to3y')
                     }
                 
			     ]
			
			
			
			var E = $M([
				[fromPts[0].x, fromPts[0].y, 1, 0, 0, 0, - fromPts[0].x * toPts[0].x, - fromPts[0].y * toPts[0].x],
				[0, 0, 0, fromPts[0].x, fromPts[0].y, 1, - fromPts[0].x * toPts[0].y, - fromPts[0].y * toPts[0].y],
				[fromPts[1].x, fromPts[1].y, 1, 0, 0, 0, - fromPts[1].x * toPts[1].x, - fromPts[1].y * toPts[1].x],
				[0, 0, 0, fromPts[1].x, fromPts[1].y, 1, - fromPts[1].x * toPts[1].y, - fromPts[1].y * toPts[1].y],
				[fromPts[2].x, fromPts[2].y, 1, 0, 0, 0, - fromPts[2].x * toPts[2].x, - fromPts[2].y * toPts[2].x],
				[0, 0, 0, fromPts[2].x, fromPts[2].y, 1, - fromPts[2].x * toPts[2].y, - fromPts[2].y * toPts[2].y],
				[fromPts[3].x, fromPts[3].y, 1, 0, 0, 0, - fromPts[3].x * toPts[3].x, - fromPts[3].y * toPts[3].x],
				[0, 0, 0, fromPts[3].x, fromPts[3].y, 1, - fromPts[3].x * toPts[3].y, - fromPts[3].y * toPts[3].y] 
			
			]);
			
			E_inv = E.inverse();
			
			var vector = $V([toPts[0].x, toPts[0].y, toPts[1].x, toPts[1].y, toPts[2].x, toPts[2].y, toPts[3].x, toPts[3].y]);
			
			var r = E_inv.x(vector); 
			
			var transform = $M([
				[r.e(1), r.e(2), 0, r.e(3)], 
				[r.e(4), r.e(5), 0, r.e(6)], 
				[0, 0, 1, 0],
				[r.e(7), r.e(8), 0, 1]
			]);
			
			/* 
			var w = $('o1').innerWidth,
			    h = $('o1').innerHeight;
			    
			var transform = get3DMatrix(
			    formEl("to0x"), formEl("to0y"),
			    formEl("to1x"), formEl("to1y"),
			    formEl("to2x"), formEl("to2y"),
			    formEl("to3x"), formEl("to3y"),
			    w, h)
			*/
			
			if (!ignorePoints) { 
				doTransform3D(transform);
				drawPoints3D(transform);
			}
		// do nothin;
		} else {
			/* Uses info from http://www.physicsforums.com/showthread.php?t=360963 */
			var M = $M(
			    [[formEl("from0x"), formEl("from0y"), 1], 
			     [formEl("from0x"), formEl("from1y"), 1], 
			     [formEl("from2x"), formEl("from0y"), 1]]);
			
			var M_inv = M.inverse();
			
			var xVector = $V([formEl("to0x"), formEl("to1x"), formEl("to2x")]);
			var yVector = $V([formEl("to0y"), formEl("to1y"), formEl("to2y")]);
			
			var r1 = M_inv.x(xVector);
			var r2 = M_inv.x(yVector);
			
			transform = $M([
				[r1.e(1), r1.e(2), r1.e(3)], 
				[r2.e(1), r2.e(2), r2.e(3)], 
				[0, 0, 1]
			]);
			
			if (!ignorePoints) { 
				doTransform(transform);
				drawPoints(transform);
			}
		}
		
		/* var transform = $M([
			[r1.e(1), r2.e(1), r1.e(3)],
			[r2.e(1), r2.e(2), r1.e(3)],
			[0, 0, 1]
		])
		 */
	
		
		
		
		
			
	}
	
	function doTransform(m) {
		var matrixCSS, webkitMatrixCSS;
			
		matrixCSS = StringHelpers.sprintf(
			"matrix(%.3f, %.3f, %.3f, %.3f, %.3fpx, %.3fpx)", 
			m.e(1,1), m.e(2,1), m.e(1,2), m.e(2,2), m.e(1,3)  , m.e(2,3) 
		)
		
		webkitMatrixCSS = matrixCSS.replace(/px/g, '');
		
		
		origin = StringHelpers.sprintf("%0.1fpx %0.1fpx 0", - formEl('from0x'), - formEl('from0y'));
		//origin = "0 0"

		$('answer').innerHTML = config.getScriptedValue(
			'solveMatrix.css', 
			{
				mozCSS:    matrixCSS,
				webkitCSS: webkitMatrixCSS,
				origin:    origin
			}
		)
		
		
		/* StringHelpers.sprintf(
			"-moz-transform: %s;<br />-webkit-transform: %s;<br />-o-transform: %s;<br />transform: %s; <br />transform-origin: %s;", 
			matrixCSS, webkitMatrixCSS, webkitMatrixCSS, webkitMatrixCSS, origin); */
		
		
		
		me.o1.setDimensions(formEl("from0x"), formEl("from0y"), formEl("from2x") - formEl("from0x"), formEl("from1y") - formEl("from0y"));
		o2.setDimensions(formEl("from0x"), formEl("from0y"), formEl("from2x") - formEl("from0x"), formEl("from1y") - formEl("from0y"));
		
		
		o2.setTransform(origin, webkitMatrixCSS)
		
		
		
	}
	
	function doTransform3D(m) {
		var matrixCSS;
		var sb = new StringBuffer();
		
		sb.append('matrix3d(');
		
		for (var i=1; i<=4; i++) {
			for (var j=1; j<=4; j++) {
				sb.append(m.e(j, i));
				
				if (i!=4 || j !=4) {
					sb.append(', ')
				}
			}
		}

		sb.append(')');
		matrixCSS=sb.toString();
				
		
		origin = StringHelpers.sprintf("%fpx %fpx 0px", - formEl('from0x'), - formEl('from0y'));
		//origin = "0 0"

		$('answer').innerHTML = StringHelpers.sprintf("transform: %s; <br />transform-origin: %0.2f", matrixCSS, origin);
		
		
		
		me.o1.setDimensions(formEl("from0x"), formEl("from0y"), formEl("from2x") - formEl("from0x"), formEl("from1y") - formEl("from0y"));
		o2.setDimensions(formEl("from0x"), formEl("from0y"), formEl("from2x") - formEl("from0x"), formEl("from1y") - formEl("from0y"));
		
		o2.el.style.transform = matrixCSS;  
		
		
		
	}
	
	
	
	
	
	function drawPoints(transformMatrix) {
		// Now vectors for the points
		var fromPts = [ $V([formEl("from0x"), formEl("from0y"), 1]),
						$V([formEl("from0x"), formEl("from1y"), 1]),
						$V([formEl("from2x"), formEl("from0y"), 1])];
			
		
		var toP1 = [];
		for (var i=0; i<3; i++) {
			toP1[i] = transformMatrix.x(fromPts[i])
			$('point' + (i+1)).style.left = toP1[i].e(1) + 'px';
			$('point' + (i+1)).style.top = toP1[i].e(2) + 'px'
		}
	}
	
	function drawPoints3D(transformMatrix) {
		// Now vectors for the points
		/* var fromPts = [ $V([formEl("from0x"), formEl("from0y"), 0, 1]),
						$V([formEl("from0x"), formEl("from1y"), 0, 1]),
						$V([formEl("from2x"), formEl("from0y"), 0, 1]),
						$V([formEl("from2x"), formEl("from1y"), 0, 1])];
			
		
		var toP1 = [];
		for (var i=0; i<4; i++) {
			toP1[i] = transformMatrix.x(fromPts[i])
			$('point' + (i+1)).style.left = toP1[i].e(1) + 'px';
			$('point' + (i+1)).style.top = toP1[i].e(2) + 'px'
		} */
		
		for (var i=0; i<4; i++) {
            var pt = {
                x: formEl("to" + i + "x"),
                y: formEl("to" + i + "y")
            }
            
            $('point' + (i+1)).style.left = pt.x + 'px';
            $('point' + (i+1)).style.top = pt.y + 'px'
        }
	}
}

function Block (el) {
	var me = this;
	var para = el.getElementsByTagName('p')[0]
	me.el = el;
	var zIndex;
	me.resizer = null;
	
	
	
	function init(){
		
			EventHelpers.addEvent(el, 'dragstart', dragStartEvent, true);
			EventHelpers.addEvent(el, 'drag', dragEvent);
			EventHelpers.addEvent(el, 'dragend', dragEndEvent);
			EventHelpers.addEvent(el, 'dragover', dragOverEvent, false);
			EventHelpers.addEvent(el, 'dragenter', dragEnterEvent, false);
			EventHelpers.addEvent(el, 'drop', dropEvent, false)
	}
	
	function dragStartEvent(e) {
		e.dataTransfer.effectAllowed="move"; 
		
		// you must set some data in order to drag an arbitrary block element like a <div>
		e.dataTransfer.setData('Text', 'ffff')
		var coords = DragDropHelpers.getEventCoords(e);
		var dt = e.dataTransfer;
		
		
		if (dt.setDragImage) {
			dt.setDragImage(me.el, coords.x, coords.y);
		}
		
		grid.dragStartCoords = coords;
		
		grid.draggingObject = me.el; //EventHelpers.getEventTarget(e);
		
		
		var zIndex = CSSHelpers.getCurrentStyle(me.el).zIndex;
		
		CSSHelpers.addClass(me.el, 'top');
		
		
	}
	
	
   function dragEvent(e) {
   	
     	// do nothing
		EventHelpers.preventDefault(e);
		EventHelpers.cancelBubble(e);
   }

	
	function dragEndEvent(e) {
		
		//grid.draggingO.style.zIndex = '';
		
		me.el.style.zIndex = zIndex;
		me.resizer.move();
		
	}
	
	function dragOverEvent(e) {
		e.dataTransfer.dropEffect = "move";
		
		switch(grid.draggingObject.id) {
			case 'o1Resizer':
				grid.dragOverEvent(e);
				break;
			case 'o1':
				if (me.el.id == 'o2') {
					me.el.style.visibility = 'hidden';
					
				}
				break;
		}
		
		
		
		EventHelpers.cancelBubble(e);
		EventHelpers.preventDefault(e);
	}
	
	function dragEnterEvent(e) {
		//alert(CSSHelpers.isMemberOfClass(grid.draggingObject, 'block'))
		/* if (CSSHelpers.isMemberOfClass(grid.draggingObject, 'block') && me.el != grid.draggingObject ) {
			me.el.style.visibility = 'hidden'
			grid.hiddenObjects.push(me.el)
		} */
		
		EventHelpers.preventDefault(e);
		EventHelpers.cancelBubble(e);
		
	}
	
	function dragLeaveEvent(e) {
		if (CSSHelpers.isMemberOfClass(grid.draggingObject, 'block') && me.el != grid.draggingObject ) {
			me.el.style.visibility = 'visible'
		}
	}
	
	function dropEvent(e) {
		
	}
	
	
	
	me.setDimensions = function(left, top, width, height) {
		me.el.style.left = left + 'px';
		me.el.style.top = top + 'px';
		me.el.style.width = width + 'px';
		me.el.style.height = height + 'px';
		
		if (me.resizer) {
			me.resizer.el.style.left = left + width + - me.resizer.el.offsetWidth + 'px';
			me.resizer.el.style.top = top + height + - me.resizer.el.offsetHeight + 'px';
		}
	}
	
	me.setTransform = function (origin, matrixCSS) {
        //cssSandpaper.setTransformOrigin(me.el, origin)
        me.el.style.transformOrigin = origin;
        
        
        me.el.style.transform = matrixCSS;
    }
	
	
	
	
	init();
	
}

function Point(pointEl) {
	var me = this;
	
	
	function init(){
			//EventHelpers.addEvent(pointEl, 'mousedown', mousedownEvent);
			//EventHelpers.addEvent(pointEl, 'mouseup', mouseupEvent);
			EventHelpers.addEvent(pointEl, 'dragstart', dragStartEvent);
			EventHelpers.addEvent(pointEl, 'drag', dragEvent);
			EventHelpers.addEvent(pointEl, 'dragend', dragEndEvent);
			
	}
	
	function mousedownEvent(e) {
		$('o2').style.visibility = 'hidden'
	}
	
	function mouseupEvent(e) {
		$('o2').style.visibility = 'visible'
	}
	
	function dragStartEvent(e) {
		// you must set some data in order to drag an arbitrary block element like a <div>
		e.dataTransfer.setData('Text', 'ffff')
		
		
		grid.draggingObject = EventHelpers.getEventTarget(e);
		//CSSHelpers.addClass($('gridBlocks'), 'hidden');
		grid.dragStartCoords = DragDropHelpers.getEventCoords(e);
		console.log('start', grid.dragStartCoords);
		$('o2').style.visibility = 'hidden'
		//grid.draggingObject.style.zIndex = '-1';
		//grid.draggingObject.style.marginTop = '-1px';
		e.dataTransfer.effectAllowed="move"; 
	}
	
	
   function dragEvent(e) {
     	//CSSHelpers.removeClass($('gridBlocks'), 'hidden');
     	console.log('drag', grid.dragStartCoords);
		
   }

	
	function dragEndEvent(e) {
		
		//CSSHelpers.removeClass($('gridBlocks'), 'hidden');
		
		grid.draggingObject.zIndex = '';
		
	}
	
	init();
		
}

function Resizer(el, block) {
	var me = this;
	
	me.el = el;
	me.block = block;
	
	function init() {
		
		EventHelpers.addEvent(me.el, 'dragstart', dragStartEvent);
		EventHelpers.addEvent(me.el, 'drag', dragEvent);
		EventHelpers.addEvent(me.el, 'dragend', dragEndEvent);
		
		//me.resize();
	}
	
	me.move = function (){
		me.el.style.left = (me.block.el.offsetLeft + me.block.el.offsetWidth - me.el.offsetWidth) + 'px';
		me.el.style.top = (me.block.el.offsetTop + me.block.el.offsetHeight - me.el.offsetHeight) + 'px';
	}
	
	function dragStartEvent(e) {
		// you must set some data in order to drag an arbitrary block element like a <div>
		e.dataTransfer.setData('Text', 'ffff')
		
		//matrixSolver.o1.el.style.left = '-1000px'
		grid.draggingObject = el;
		grid.draggingObject.style.zIndex = '-1';
		$('o2').style.visibility = 'hidden';
		grid.dragStartCoords = DragDropHelpers.getEventCoords(e);
		e.dataTransfer.effectAllowed="move"; 
		EventHelpers.cancelBubble(e);
	}
	
	function dragEvent(e) {
		
		// do nothing
		//EventHelpers.preventDefault(e);
		grid.coords = DragDropHelpers.getEventCoords(e);
	}
	
	function dragEndEvent(e) {
		//matrixSolver.o1.el.style.visibility = 'visible'
		grid.draggingObject.style.zIndex = '';
		grid.dropEvent(e);
	}
	
	me.resize = function(){
		//jslog.debug(StringHelpers.sprintf("%d %d", matrixSolver.coords.x, matrixSolver.coords.y))
		var parent = el.parentNode;
		
		
		matrixSolver.form["from1y"].value = grid.coords.y - grid.dragStartCoords.y + 10;
		matrixSolver.form["from2x"].value = grid.coords.x - grid.dragStartCoords.x + 10;
		
		//matrixSolver.setForm(moveCoords);
		
		
		
		matrixSolver.submitEvent();
		
	}
	
	init();
}

var grid = new function () {
	var me = this;
	
	me.draggingObject = null;
	me.el = null;
	me.dragStartCoords = null;
	me.hiddenObjects = [];
	me.coords = null;
	
	me.init = function (){
		me.el = $('grid');
		
		/* These are events for the object to be dropped */
		EventHelpers.addEvent(me.el, 'dragover', me.dragOverEvent, true);
		EventHelpers.addEvent(me.el, 'dragenter', me.dragEnterEvent, true);
		EventHelpers.addEvent(me.el, 'drop', me.dropEvent, false);
	}
	
	me.dragEnterEvent = function(e){
		EventHelpers.preventDefault(e);
	}
	
	me.dragOverEvent = function (e) {
		
		e.dataTransfer.dropEffect = "move";
		me.coords = DragDropHelpers.getEventCoords(e);
		
		switch (me.draggingObject.id) {
			case "o1Resizer":
			
				matrixSolver.o1.resizer.resize();
				break;
			case "o1":
				$('o2').style.visibility = 'hidden'
				break;
			default:
				$('o2').style.visibility = 'hidden' 
				$('o2').style.zIndex = -1;
				matrixSolver.setForm(me.coords);
		}
		
		
		matrixSolver.submitEvent(e, true);
		
   	 	
		EventHelpers.cancelBubble(e);
		EventHelpers.preventDefault(e);

	}
	
	me.dropEvent = function (e) {
		
		switch (me.draggingObject.id) {
			case "o1Resizer":
			case "o1":
				moveCoords = {
					x: me.coords.x - me.dragStartCoords.x,
					y: me.coords.y - me.dragStartCoords.y
				}
				break;
			default:
				moveCoords = {
					x: me.coords.x,
					y: me.coords.y
				}
		}
		
		if (me.draggingObject.id != 'o1Resizer') {
			//alert(DebugHelpers.getProperties(moveCoords))
			me.draggingObject.style.left = moveCoords.x + 'px';
			me.draggingObject.style.top = moveCoords.y + 'px';
			me.draggingObject.style.zIndex = "";
		}
		
		for (var i=0; i<me.hiddenObjects.length; i++) {
			var obj=me.hiddenObjects[i];
			obj.style.visibility = 'visible';
			//obj.style.zIndex = "";
		}
		me.hiddenObjects = [];
		
		matrixSolver.setForm(moveCoords);
		
		
		
		matrixSolver.submitEvent(e);
		
		
		$('o2').style.visibility = 'visible';
		$('o2').style.zIndex = '';
		
		EventHelpers.cancelBubble(e);
		EventHelpers.preventDefault(e);
	}
	
	me.hideAll = function () {
		$('o1').style.visibility = 'hidden';
		$('o2').style.visibility = 'hidden';
	}
	
	me.showAll = function () {
		
		$('o1').style.visibility = 'visible';
		$('o2').style.visibility = 'visible';
		
	}
	
	
}

EventHelpers.addPageLoadEvent('matrixSolver.init');


