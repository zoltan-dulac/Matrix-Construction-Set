/**
 * @author Zoltan Hawryluk
 * 
 * BUGS: IE10 needs to do a mutation event hack like the IE11 mutation events fix.
 */


var $ = function(s){
    return document.getElementById(s);
}

var matrixSolver = new function () {
    var me = this;
    me.isIE10 = document.documentMode ? document.documentMode === 10 : false;
    me.isIE11 = document.documentMode ? document.documentMode === 11 : false;
    me.blankImage = new Image();
    me.blankImage.src='data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
    
    var o2, resizer, prop, pointsContainer, dialogLinks,
        maxURLLength = 2083;
    
    me.points = [];
    me.form = null;
    me.coords = null;
    me.transformProp = Modernizr.prefixed('transform');
    me.transformOriginProp = Modernizr.prefixed('transformOrigin');
    
    
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
        
        
        
        var pointEls = document.getElementsByClassName('point');
        for (var i=0; i<pointEls.length; i++) {
            me.points = new Point(pointEls[i]);
        }
        
        grid.init();
        me.form = $('matrixForm');
        dialogLinks = document.getElementsByClassName('dialog-link');
        
        if (me.form) {
            populateForm();
            console.log(me.form.htmlContent.value);
            
            // populate dialog text areas
            if (location.hash === '#' || location.hash === '') {
                populateLinkDialogs();
            }
            
            console.log(me.form.htmlContent.value);
            EventHelpers.addEvent(me.form, 'submit', me.submitEvent);
            EventHelpers.addEvent(me.form, 'reset', me.resetEvent);
            EventHelpers.addEvent(me.form['do3D'], 'change', me.to3D);
            EventHelpers.addEvent(window, 'hashchange', hashChangeEvent);
            me.submitEvent(null, false, true);
            console.log(me.form.htmlContent.value);
        }
        
        
        
        
        
        for (var i=0; i<dialogLinks.length; i++) {
            EventHelpers.addEvent(dialogLinks[i], 'click', setDialogVisibility);
        }
        
        // for some reason, IE10+ removes the grid points after dragging.
        // this puts them back in.
        
        pointsContainer = document.querySelector('#points');
        
        // IE11 and newer browsers
        if (window.MutationObserver) {
            var observer = new MutationObserver(pointsMutationObserver);
            
            observer.observe(pointsContainer, {
                childList: true
            });
        // IE9-10 and older browsers.
        } else if (window.MutationEvent) {
            EventHelpers.addEvent(pointsContainer, 'DOMNodeRemoved', pointsChildRemovedEvent);
        }
        
        
        // initialize dialogs in unsupported browsers
        var dialog = document.querySelector('dialog');
        if (!dialog.showModal) {
            dialogPolyfill.registerDialog(dialog);
        }
    }
    
    function hashChangeEvent(e) {
        console.log('hashchange');
        populateForm();
        me.submitEvent(null, false, true);
    }
    
    function pointsMutationObserver(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type == 'childList' && mutation.removedNodes.length > 0) {
                for (var i=0; i<mutation.removedNodes.length; i++) {
                    pointsChildRemovedHelper(mutation.removedNodes[i]);
                };
            }
        });
    }
    
    function pointsChildRemovedEvent(e) {
        setTimeout(function () {
            pointsChildRemovedHelper(e.target);
        }, 1);
    }
    
    function pointsChildRemovedHelper (node) {
        if (node.nodeType === 1) {
            pointsContainer.appendChild(node);
        }
    }
    
    function populateForm() {
        
        if (location.hash === '#' || location.hash === '') {
            return;
        }
        
        var qs = LZString.decompressFromEncodedURIComponent(location.hash.substring(1));
        
        setFormFromQS(me.form, qs);
        
        
    }
    
    function populateLinkDialogs() {
        me.form.htmlContent.value = $('o1').innerHTML;
        me.form.cssContent.value = $('custom-html').innerHTML;
    }
    
    function changeObjectHTMLandCSS() {
        
        $('o1').innerHTML = me.form.htmlContent.value;
        $('o2').innerHTML = me.form.htmlContent.value;
        $('custom-html').innerHTML = me.form.cssContent.value;
    }
    
    function getStylesheetContent(node) {
        var list, sheet = node.sheet;
        if (typeof node.sheet.cssRules != "undefined")
            list = sheet.cssRules;
        else if (typeof node.sheet.rules != "undefined")
            list = rules;
            
        return list;
    }
    
    /* From http://stackoverflow.com/questions/316781/how-to-build-query-string-with-javascript */
    function generateQueryString(form) {
      if (!form || !form.elements) return;
    
      var serial = [], i, j, first;
      var add = function (name, value) {
        serial.push(encodeURIComponent(name) + '=' + encodeURIComponent(value));
      }
    
      var elems = form.elements;
      for (i = 0; i < elems.length; i += 1, first = false) {
        if (elems[i].name.length > 0) { /* don't include unnamed elements */
          switch (elems[i].type) {
            case 'select-one': first = true;
            case 'select-multiple':
              for (j = 0; j < elems[i].options.length; j += 1)
                if (elems[i].options[j].selected) {
                  add(elems[i].name, elems[i].options[j].value);
                  if (first) break; /* stop searching for select-one */
                }
              break;
            case 'checkbox':
            case 'radio': if (!elems[i].checked) break; /* else continue */
            default: add(elems[i].name, elems[i].value); break;
          }
        }
      }
    
      return serial.join('&');
    }
    
    /* From https://lightignite.com/help-your-customers-fill-out-web-forms-with-url-query-strings/ */
    function setFormFromQS(form, query) {
        query = decodeURI(query);
        //extract each field/value pair
        query = query.split('&');
        
        //run through each pair
        for (var i = 0; i < query.length; i++) {
        
          //split up the field/value pair into an array
          var field = query[i].split("=");
          
          //target the field and assign its value
          var name = field[0], value=decodeURIComponent(decodeURIComponent(field[1])).replace(/\+/g,  " ");
          //console.log(name, value);
          form[field[0]].value = value;
        
        }
    }
    
    function setDialogVisibility(e) {
        
        if (e.target.nodeName === 'A') {
            EventHelpers.preventDefault(e);
        }
        
        var dialogID = e.target.getAttribute('data-dialog-id');
        
        
        if (CSSHelpers.isMemberOfClass(e.target,'close')) {
            document.getElementById(dialogID).close();
        } else {
            document.getElementById(dialogID).showModal();
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
    
    
    
    me.to3D = function(e) {
       
        
        me.submitEvent(e);
    }

    me.submitEvent = function (e, ignorePoints, isLoadEvent) {
        var transform;
        
        if (e && e.type != 'reset') {
                EventHelpers.preventDefault(e);
        }
        
        if (me.form['do3D'] && me.form['do3D'].checked) {
            /* Uses info from http://franklinta.com/2014/09/08/computing-css-matrix3d-transforms/ */
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
                 
                 ];
            
            
            
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
        
    
        
         changeObjectHTMLandCSS();
         
         if (!isLoadEvent) {   
            var qs = generateQueryString(me.form),
                compress_qs = LZString.compressToEncodedURIComponent(qs);
            console.log('setting hash');
            EventHelpers.removeEvent(window, 'hashchange', hashChangeEvent);
            location.hash=compress_qs;
            EventHelpers.addEvent(window, 'hashchange', hashChangeEvent);
        }
        
        
            
    }
    
    function doTransform(m) {
        var matrixCSS, webkitMatrixCSS;
            
        matrixCSS = StringHelpers.sprintf(
            "matrix(%.3f, %.3f, %.3f, %.3f, %.3fpx, %.3fpx)", 
            m.e(1,1), m.e(2,1), m.e(1,2), m.e(2,2), m.e(1,3)  , m.e(2,3) 
        )
        
        webkitMatrixCSS = matrixCSS.replace(/px/g, '');
        
        
        origin = StringHelpers.sprintf("%0.1fpx %0.1fpx", - formEl('from0x'), - formEl('from0y'));
        //origin = "0 0"

        $('answer').innerHTML = config.getScriptedValue(
            'solveMatrix.css', 
            {
                mozCSS:    matrixCSS,
                webkitCSS: webkitMatrixCSS,
                origin:    origin
            }
        )
        
        
        
        me.o1.setDimensions(formEl("from0x"), formEl("from0y"), formEl("from2x") - formEl("from0x"), formEl("from1y") - formEl("from0y"));
        o2.setDimensions(formEl("from0x"), formEl("from0y"), formEl("from2x") - formEl("from0x"), formEl("from1y") - formEl("from0y"));
        
        
        o2.setTransform(origin, webkitMatrixCSS)
        
        
        
    }
    
    function doTransform3D(m) {
        var matrixCSS;
        var sb = new StringBuffer(),
            counter = 0;
        
        sb.append('matrix3d(');
        
        for (var i=1; i<=4; i++) {
            for (var j=1; j<=4; j++) {
                counter++;
                sb.append(StringHelpers.sprintf('%.8f', m.e(j, i)));
                
                if (i!=4 || j !=4) {
                    sb.append(', ')
                }
                
                if ( counter % 4 == 0 && counter != 16) {
                    sb.append('\n                    ');
                }
            }
        }

        sb.append(')');
        matrixCSS=sb.toString();
                
        
        origin = StringHelpers.sprintf("%fpx %fpx 0px", - formEl('from0x'), - formEl('from0y'));
        
        $('answer').innerHTML = StringHelpers.sprintf("transform: %s; <br />transform-origin: %s", matrixCSS, origin);
        
        
        
        me.o1.setDimensions(formEl("from0x"), formEl("from0y"), formEl("from2x") - formEl("from0x"), formEl("from1y") - formEl("from0y"));
        o2.setDimensions(formEl("from0x"), formEl("from0y"), formEl("from2x") - formEl("from0x"), formEl("from1y") - formEl("from0y"));
        
        o2.el.style[matrixSolver.transformProp] = matrixCSS;
        o2.el.style[matrixSolver.transformOriginProp] = origin;
        
        
        
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
            $('point' + (i+1)).style.top = toP1[i].e(2) + 'px';
            
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
        
        console.log('dragStartTarget', e.target);
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
        console.log('block drag over');
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
        EventHelpers.preventDefault(e);
        EventHelpers.cancelBubble(e);
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
        
        if (Modernizr.csstransforms3d) {
            me.el.style[matrixSolver.transformOriginProp] = origin;
        } else {
            var splitOrigin = origin.split(' ');
            me.el.style[matrixSolver.transformOriginProp] = splitOrigin[0] + ' ' + splitOrigin[1];
        }
        
        me.el.style[matrixSolver.transformProp] = matrixCSS;
    }
    
    
    
    
    init();
    
}

function Point(pointEl) {
    var me = this;
    
    me.el = pointEl;
    
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
        var coords = DragDropHelpers.getEventCoords(e);
        // you must set some data in order to drag an arbitrary block element like a <div>
        e.dataTransfer.setData('Text', 'ffff');
        
        // get rid of drag effect
        var dt = e.dataTransfer;
        if (dt.setDragImage) {
            dt.setDragImage(matrixSolver.blankImage, 0, 0);
        }
        
        grid.draggingObject = EventHelpers.getEventTarget(e);
        //CSSHelpers.addClass($('gridBlocks'), 'hidden');
        grid.dragStartCoords = coords;
        // Need pointer-events? 
        if (!Modernizr.csspointerevents || matrixSolver.isIE11) {
            $('o2').style.visibility = 'hidden'
            grid.draggingObject.style.zIndex = '-1';
        }
        //grid.draggingObject.style.marginTop = '-1px';
        e.dataTransfer.effectAllowed="move"; 
    }
    
    
   function dragEvent(e) {
        //CSSHelpers.removeClass($('gridBlocks'), 'hidden');
        
        
   }

    
    function dragEndEvent(e) {
        //CSSHelpers.removeClass($('gridBlocks'), 'hidden');
        console.log('dragEndEvent', e);
        grid.draggingObject.zIndex = '';
        
        /*
         * IE10 has a bug which can't grab the coordinates from the grid's
         * drag event, so we have to move the point here. We do it only
         * for IE10 because most browsers will report bad numbers for 
         * e.layerX/Y.
         * 
         * More information about this bug is here:
         * 
         * https://connect.microsoft.com/IE/feedback/details/797359/datatransfer-in-dragover-dragenter-events-is-not-accessible-in-ie10
         * http://msdn.developer-works.com/article/12301904/IE+10+dragover+event%3A+clientX,+clientY,+pageX,+pageY,+dataTransfer.getData+are+not+refreshed
         * 
         * Note that this bug is *only* in IE10 (not 9, not 11 ... *only* 10).
         */
        if (matrixSolver.isIE10) {
            me.el.style.left = e.layerX + 'px';
            me.el.style.top = e.layerY + 'px';
            matrixSolver.setForm({
                x: e.layerX,
                y: e.layerY
            });
            matrixSolver.submitEvent(e, false);
        }
        EventHelpers.preventDefault(e);
        EventHelpers.cancelBubble(e);
        
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
        console.log('resizer dragStart')
        CSSHelpers.addClass($('o1'), 'no-pointer-events');
        
        // you must set some data in order to drag an arbitrary block element like a <div>
        e.dataTransfer.setData('Text', 'ffff')
        
        //matrixSolver.o1.el.style.left = '-1000px'
        grid.draggingObject = el;
        
        $('o2').style.visibility = 'hidden';
        grid.dragStartCoords = DragDropHelpers.getEventCoords(e);
        e.dataTransfer.effectAllowed="move";
        
        EventHelpers.cancelBubble(e);
         console.log('dragStartEvent end')
    }
    
    function dragEvent(e) {
        console.log('resizer drag');
        // do nothing
        //EventHelpers.preventDefault(e);
        grid.coords = DragDropHelpers.getEventCoords(e);
    }
    
    function dragEndEvent(e) {
        console.log('resizer dragend' ,e);
        //matrixSolver.o1.el.style.visibility = 'visible'
        grid.draggingObject.style.zIndex = '';
        
        grid.dropEvent(e);
        CSSHelpers.removeClass($('o1'), 'no-pointer-events');
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
        //console.log('grid drag enter event');
        EventHelpers.preventDefault(e);
    }
    
    me.dragOverEvent = function (e) {
        
        e.dataTransfer.dropEffect = "move";
        me.coords = DragDropHelpers.getEventCoords(e); 
        
        //console.log('grid drag over event ' + me.draggingObject.id + ' ' + me.coords.x + ', ' + me.coords.y);
        switch (me.draggingObject.id) {
            case "o1Resizer":
            
                matrixSolver.o1.resizer.resize();
                break;
            case "o1":
                $('o2').style.visibility = 'hidden';
                break;
            default:
                /* Need pointer-events */
                if (!Modernizr.csspointerevents || matrixSolver.isIE11) {
                    $('o2').style.visibility = 'hidden';
                    $('o2').style.zIndex = -1;
                } 
                matrixSolver.setForm(me.coords);
        }
        
        
        matrixSolver.submitEvent(e, false);
        
        
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
            console.log(me.coords);
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


