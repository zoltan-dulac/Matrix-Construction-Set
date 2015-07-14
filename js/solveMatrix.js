/**
 * @author Zoltan Hawryluk
 * 
 */


var $ = function(s){
    return document.getElementById(s);
};

var matrixSolver = new function () {
    var me = this;
    me.isIE10lower = false;
    me.isIE10 = document.documentMode ? document.documentMode === 10 : false;
    me.isIE11 = document.documentMode ? document.documentMode === 11 : false;
    me.blankImage = new Image();
    me.blankImage.src='data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
    
    var resizer, prop, pointsContainer, dialogLinks,
        maxURLLength = 2083, sanitize = new Sanitize(Sanitize.Config.MATRIX), 
        dummyNode = document.createElement('div');
    
    me.points = [];
    me.form = null;
    me.coords = null;
    me.transformProp = Modernizr.prefixed('transform');
    me.transformOriginProp = Modernizr.prefixed('transformOrigin');
    
    // This is not a commnent. Do not remove
    /*@cc_on
    @if (@_jscript_version <= 10)
        me.isIE10lower = true;
    @end
    @*/
   
    me.init = function () {
        if (EventHelpers.hasPageLoadHappened(arguments)) {
            return;
        }
            
        //DragDropHelpers.fixVisualCues=true;
        
        if (me.isIE10lower) {
            alert("Sorry, this tool requires a modern browser.  Please update your browser to the latest build");
        }
        
        
        
        
        prop = getMatrixProperty();
        
        
        me.o1 = new Block($('o1'));
        
        me.o2 = new Block($('o2'));
        
        resizer = new Resizer($('o1Resizer'), me.o1);
        me.o1.resizer = resizer;
        
        
        
        var pointEls = document.getElementsByClassName('point');
        for (var i=0; i<pointEls.length; i++) {
            me.points = new Point(pointEls[i]);
        }
        
        grid.init();
        me.form = $('matrixForm');
        
        // if the browser doesn't support 3D transforms, don't 
        // allow it to be checked
        if (!Modernizr.csstransforms3d) {
            me.form.do3D.checked=false;
            visibleIf.refreshPage();
        }
        
        
        
        dialogLinks = document.getElementsByClassName('dialog-link');
        
        if (me.form) {
            populateForm();
            
            // populate dialog text areas
            if (location.hash === '#') {
                populateLinkDialogs();
            }
            
            EventHelpers.addEvent(me.form, 'submit', me.submitEvent);
            EventHelpers.addEvent(me.form, 'reset', me.resetEvent);
            EventHelpers.addEvent(me.form['do3D'], 'change', me.submitEvent);
            EventHelpers.addEvent(me.form['showVendorPrefixes'], 'change', me.submitEvent);
            EventHelpers.addEvent(window, 'hashchange', hashChangeEvent);
            EventHelpers.addEvent(me.form['hideUI'], 'change', me.hideUIChangeEvent);
            EventHelpers.addEvent(window, 'scroll', me.repaintEvent);
            EventHelpers.addEvent(window, 'resize', me.repaintEvent);
            
            me.hideUIChangeEvent();
            me.submitEvent(null, false, true);
            
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
        var dialog = document.querySelectorAll('dialog');
        if (!dialog[0].showModal) {
            for (var i=0; i<dialog.length; i++) {
                dialogPolyfill.registerDialog(dialog[i]);
            }
        }
    };
    
    me.repaintEvent = function(e) {
        
        // This prevents the "streaking" of transforms
        // inside of Firefox 39 and lower by forcing a 
        // repaint.
        grid.el.style.opacity = 0.99;
        setTimeout(function() {
            grid.el.style.opacity = 1;
        }, 10);
        
    }
    
    me.hideUIChangeEvent = function (e) {
        var hideUI = me.form['hideUI'];
        
        if (hideUI.checked) {
            me.o1.el.style.display ='none';
            $('points').style.display='none';
        } else {
            me.o1.el.style.display ='block';
            $('points').style.display='block';
        }
    }
    
    function hashChangeEvent(e) {
        // uncheck do3D, just in case 
        me.form.do3D.checked = false;
        populateForm();
        
        var dialog = $('info-dialog')
        
        
        switch (location.hash) {
            case '#':
            case '':
                me.form.reset();
                break;
            case '#tv':
                location.hash = '#CYewzAIgvALgTgVwKYDIBmcQFsAMAPKARh3U1wE8iSYR8iB2a2ywgFgCYA6ATgA5Ww9AKylshSkIBshHtzn96rQu2LcUNQgUK966kOKhDCIjNnYFhamuaiTWrPexbsr4ApJV6wE3lznzWRWVVFABnOABjAA0qMMiATVjwiIB1KhJkgAl0lABLYEIoAGUEACMsXJgAAgBhAAsAQwA7AHMkULzgdigAJXakaoAxEDgsFDqYLAAbGpAmmCR5qAAeAAcAPgAVOtzQqt2qqdyANyQqhbxq3KaqhqrSqZAIgGsqpCmkLEXqmEbqxr2pSQi3OcGaoTQIy+wCqCFC1xa5zqZywDXguTwYGAAAoAJRVNAIJoRGC5OacABQFOWpTgVQA9OsaXTGRTtgcDnMpuRblVgJ8QJwqlUICAqk0QNUgbcpg1RkhgFTlvSNigIqFQrN5t8oAAqKoAbwppRAeAAtPCAF4IgBc9xG-LgZpNeAA3BSAL5U+n6gCqxOwX3m+zQVXIIAQVQA7s0fmKQKc4HB8mdfmd+WgGggptVQjByB89rr6RSAMT6Q0U4WlBovFqYInAO2ltBoCLtiKuqrHXa5Uq5I75u07YD8prur1lkDsSvV2vPesRppNqqljsRVsT736qv6ooRODAm6hRqrM4pu6mLC7qoTGCrG30+lRl+cKNIUrwhYRED8mAIGhkwaKZQk4H8sHpH9+UgjUYNCC1T3aThVjqVYql3Ety0IAAaVdp1ne550XRs7QQOApmxAByO8HyfaFcgaMBOBaXIUPIMDsHpeiGnpNAAClCCQGoACEACssAAWRAABRY4EHpFi2OY3I0Eo-EHnnd1hR-R44DtKMdgWLSCTmGALVyS0kDta5kWTGBjKjfJfjtVgcBwVY3SrW8kFyFoJhctyPPdE04EdM0wWAXI4TtIQcAAUgZKpeDi90EyQOA0EeKM7R7eEHiQLcp0IG0gUhQ9cPLdgSqQMqziNKof21eY7QAIha91VhAL8ySaO0Gk-EApgAgqKRoB8kpS41JRoLA7WS91kz8mA7TNdhJo+NBlqqVbJprOsG2XaymlsypgoddLwoaSLoqqNbEtiybJyKqpVgq-C0Pql6usqHq+oGoajK8yF5jNTMKm5VrZjI3J0qqAA5JAoxa3CWqh5N0uRqosDmLrVlrEbhWBsyrSsqpXKCryjiaJAzWRXz-KqQhjLGu0ImAiJsQe7bGd4dy8FxZmkEuM1gN83qGu+dKHKcuo7WIeL3VROAWPFnBGb5wqOPmBprlhz68dHW11YpycfVqIoihMuk0yqet8iqYsyztmFPr2hcDpXMiKJa3JUTaUJ6RgY5OFE1YWha-EqjVtWDMqM4JXCpAzzRYyQsdO0JWp4y6aWuXJECzzhU67q5jtQ9ZVJU5jLSjKsuHfIx3dT0qS8zowGKMoKmqTJNgkgAZW5l3NoogA';
                return;
            case '#building':
                location.hash = '#CYewzAIgvALgTgVwKYDIBmcQFsAMAPKARh3U1wE8iSYR8oAWMMFGnS+kjbQygVgA5+LEIQIAmMADZhPKAHYmpbGIL0BwlVF4BOaTTGUw24WAJyFJygrEoAznADGADSgl7DgJqu7jgOpU3RwAJAJIAS2BCKABlBAAjLDCYAAIAYQALAEMAOwBzJFsUCLEoACUCpBSAMRA4LBR0mCwAG1SQbJgkDqgAHgAHAD5fJGTbLL6RkAQ4ZJ7bPpzkh2bM21sAUjBgACI4hDDm4DC8222BvYOjk4BuHoB6eZyB2cfspZW1zZ2YdKQ4JEyaE6cDOPz+AKBf3ur2ecwWb2Wqw2W22YPIAFoxpkJqDfuRRuMkND4bDXu8kV9tghTgNqcSngAoe6DFAONZtDpdGBQAACYSwfVqKW2bNsdzQ7RgYriSDiqweMHIzQKv0qADpRdtrgyGQAqZIAbwZcRAeExYQAXsdcgAuZImuDAP7ok14bUAXx1asFxxSRru+rlDgA1rlMAhssB0Q4QM1anb-sBrsldXcGZ6dQHkgBVbIxrBYLnJMJoZLkKbJADuORSNGSIAAbn84BERmDkk60JkEM0UrZFcrbCm0wBiESGhnJe2ZENhqaRu0jtBoByrhzJhthWxhOIHJLkO3pCJO7IenVjsQTqdB0PhhfJeA5R7-DpnhlZyf66IOf5dAnYkZW0yZIuCwT9kkaGA+htO47kreC1UrWVt06GMnRgBAaBbTJmlsDVsDuNCkEItYSNsTFCTwvp0j6ZJP1HEQABpkgvK8QMldEu0SZoD2SbYACFZVWAA5JBkC1Sd2I6dEkLCXJGjtE1Dm1KcYzjOA7UrI9Om1To8BgCjMlASs7TAPo8GSMyLJwe0VhDFSlljeMq20pAHMkysIh+O0OBwcyHN+OSFOSXz-J1DMx0IZI+mY1jaKNKdmmOJB0UC+SYDtHA1W0BysEyOBcmOO1iDCqc9IMnC5OyO0ACtqRgEtyG1CVpO3C0kDtfg5DC8r0UfbJbAlOo7QQPoJkcVY3IZdJyGorpbDtbsaDffCOkyZKZgS6KjKuW1khKt100zfVUmiaJ2JmdswwiYcGRHa7gDYrMAHkW0K7IcJAsgIJgKCFtgtAkocNVgzgO4+nBvowGiGqAHFbuvGdb3nYARrgZoAAptn5TJ8mlfZDmtNUar6XJtgASinGybK0pIRmyEB0X+CZMhgBybznCMozajr9pwMR6HM5I5EkfhSvtWonQ05IGeyKapzS4LCEkHA-MOqdBRQsJ2gTJAVgapsHMbP5AZAEyIOPLptSOhk1QuQmTgnFqDJ54qxF4MKMzVMF-kBYEnY412+e6w6vbRQyJgD1rLV5wgDpW6ko5dmO7QFqyHKOeYVl444krll043syT+sG2osDtWwHBwpAMbENUwGYwhyYckuhqwdFajkoq+aFnA30kopgDAGJ4kSFIggAFQAWQAGWSHJHtO6IgA';
                return;
            case '#mint':
                location.hash = '#E4UwziAuBCCumQPYDsBMBeASuKACAYosALYBkAZsIsQAwAe6NFVtAno6UveqgCyeIa7AKwBOZtQCM7ScIAcAyQ1STF7AGy9+laqgZzeqpHvTqAzMIGp2ZlQLMNzlpGfaHVAE0RmAIukjAsCCkAJYekugAyrAARsQhkLgAwgAWAIbIAObgoR4Y2BCJhCSkKZDEADZJKJAgyJDoADwADgB8AKJpiZApILjx9QCEjQD0baQAxmBg1fV1DQACIcTNRIkARFNgI+Q12zEgMWnbYJCsFeC9UAB0W+sA3ABQzyMAVLgAqsgT1MTzuCFyLhWIhYLgAO4ZbqIXCIABuIGAwDCfR6fQ8IHIaVgFUSp3O4FwrxGjwAxIhJLgAN6PACQcJCYBCMRCFQSrAAXLgUmEMcgngBfZ7k1DUulHCYAa0yVFgyA8AFofhUiFyAhkwM00qB6k9laqITzaoLhRSADS4EVirUeDwhLJcmhPWm7eoKpkALxAXNQNBozToT1dkAVWPiFU5uHW0EOxwAciAgg9HsGFeCQCFMmUuTFEBUPCbHtcYiqpbhmmKLghEe6tRN7ZlHdcaHIQMQnja7Q7cE7HsRtZl7Y6nurkGBdiQ1cANRUuiAABoACn9dAAlE8MssuiEUFzWCAKhVcMIwLgQMcQArQZAN8gt5Ad8gFQlEduUErQfUufbyPaX082WQS9ekzbNcEkJ5wSNS9NTSCZvVwZBEHBadmkeIVHjeZJIkiXAJ1wNFcBlMIiRJUliI8MVaQlaVZXlLlYGACpF3WLdsm2fdD2uAArZpMnWVdcDACYqEPHtxKgl9EMQBVQGac8bzpVYmQfXdcFAWcHwRZ14URcgVXBLkeVtOpILCHouUkMwzEkAMnhArNIC5OQ-Ts9DngWSUQFYSg0j+U9OKPGkaAAUjFUdxyIYgpxnOcl0kP0V3XdzHgS0LwunMcJ2igjMrATSF0XBVZFctcTVwCrcFparcjMKJYniRIAAkABUAFkABlcAySikhw3JeHQJIMngipcmEdAJhVCBcnUSbppAIA'
                return;
            case '#speed':
                location.hash = '#E4UwziAuBCCumQPYDsBMBeASuKACAYosALYBkAZsIsQAwAe6qAnBVbQJ6OqlL3oCsANho9ENTs36tqARgkAOACyiZDALQBmVCKRz0Adn4jK1VAy0skZ9II3KrC-aI0NBqec85LuAE0QaAEXRIYFgQUgBLHxl0AGVYACNiCMhcAGEACwBDZABzcEifDGwIVMISUgzIYgAbNJRIEGRIdAAeAAcAPjgImshWhOBO8oGh2PaQEB8AQgAoVoB6LtIAYzAweuamloABCOJ2olSAIjWwBfIG86ziEGAIlZy1R-bILIjkBbBIdhrwDMmkAAdGdjgBuWazABUuAA3rMEog6GowBEAF4fXIALlwiOAPjuakRdAhAF9IUDDh9UvCFjCElkVgBrXJUWDIHzPRA1Ig40A+MG4KELWbkyF03AAVWQK2ot2auAi5Fw7EQsFwAHccqkkLhEAA3O73Am4SAA3AE8hZWB9XDfX7gIUigDEiBkcNmuFxjJZbI5OOd5HIKxDKzJkNdqA9XoZzNZav9puAOTA7SyoGa4YjboANLhI9HcJdmmorckauwcccMtSpmoAIK3e6PZBpLKvd7IcGeosNNQakARXJVHGImoCnuynnAHEhFNpjOQCFexp0SAo7J+DU4mi4XcyGjtOj5oPkZe4P4IQmpxmYndAjQgYjnjVRM04xQ0Q8knsAocj3BP2-CFRWzd12jzAt2kLGoPhANQ-2HSB7yYc80x8Hw7z3CFiHTXIPh3c9V3XLJYNyZAcRWbY7ghYt11RNEQBxeR9CPCFiLUOdkDAS4SBxWB2gmYBHggCEMnYdoAW4nFrSQLMQQaTs7kLdDMLyHEDzY0DZglNJYliXtgFNc1WSiJ1ZmdUyfELCUAHl7nw5BSKLNhcCqSB2jALEFguWCViBJlgCWBZBEQQQADUMgAWXMmMfXjdkfH44AagACmOfYsnyc5kEmTleJRCYplQIEACt2lyY4AEovV3XcNRrRpcGQRA1FACYsiXHtY19BNOQYpjcAPVBFCPXBhGA7qiAJGdmpQEBz0QgCZAmrSvUOVFIAiFA+RAGpOoiQ1zwNO5yB5bc3KiAlkBAsVZkKDQ4kSZJUgACQAFSigAZXAcmsvTYkKRR0DbGVSMKfh0BWHkIEKQQoZhkAgA';
                return;
        }
        
        
        
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
        
        if (location.hash === '#' ) {
            return;
        }
        
        var qs = LZString.decompressFromEncodedURIComponent(location.hash.substring(1));
        
        setFormFromQS(me.form, qs);
        
        
    }
    
    function populateLinkDialogs() {
        me.form.htmlContent.value = me.o1.el.innerHTML;
        me.form.cssContent.value = $('custom-html').innerHTML;
    }
    
    function getSanitizedHTML(s) {
        var r;
        dummyNode.innerHTML = s;
        r = XMLHelpers.getInnerXML(sanitize.clean_node(dummyNode));
        dummyNode.innerHTML = '';
        return r;
    }
    
    function changeObjectHTMLandCSS() {
       // we first take any potential nasty stuff out of the HTML
       var html = getSanitizedHTML(me.form.htmlContent.value);
        
       me.o1.el.innerHTML = html;
       me.o2.el.innerHTML = html;
       
       // then we stick it back into the form
       me.form.htmlContent.value = html;
       
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
    function generateQueryString(form, doEncode) {
      if (!form || !form.elements) return;
    
      var serial = [], i, j, first;
      var add = function (name, value) {
          var uriValue = value.replace(/&/g, '%26').replace(/=/g, '%3d');
          if (doEncode) {
              serial.push(encodeURIComponent(name) + '=' + encodeURIComponent(uriValue));
          } else {
              serial.push(name + '=' + uriValue);
          }
      };
    
      var elems = form.elements;
      for (i = 0; i < elems.length; i += 1, first = false) {
        var elem = elems[i];
        if (elem.nodeName != 'FIELDSET' && elem.name.length > 0) { /* don't include unnamed elements */
          switch (elem.type) {
            case 'select-one': first = true;
            case 'select-multiple':
              for (j = 0; j < elem.options.length; j += 1)
                if (elem.options[j].selected) {
                  add(elem.name, elem.options[j].value);
                  if (first) break; /* stop searching for select-one */
                }
              break;
            case 'checkbox':
            case 'radio': if (!elem.checked) break; /* else continue */
            default: add(elem.name, elem.value); break;
          }
        }
      }
      
      return serial.join('&');
    }
    
    /* Idea from https://lightignite.com/help-your-customers-fill-out-web-forms-with-url-query-strings/ */
    function setFormFromQS(form, query, doDecode) {
        if (!query) {
            return;
        }
        //extract each field/value pair
        query = query.split('&');
        
        //run through each pair
        for (var i = 0; i < query.length; i++) {
        
          //split up the field/value pair into an array
          var qsfield = query[i].split("=");
          
          //target the field and assign its value
          var name = qsfield[0], 
              value=doDecode?decodeURIComponent(decodeURIComponent(qsfield[1])).replace(/\+/g,  " "):qsfield[1],
              field = form[name];
              
          // make sure the uriEncoded values are changed back
          value=value.replace(/%26/g, '&').replace(/%3d/g, '=');
          
          
          if (field) {
              if (field.type === 'radio' || field.type === 'checkbox') {
                if (field.value === value) {
                    field.checked = true;
                }
              } else {
                field.value = value;
              }
          }
        
        }
    }
    
    function setDialogVisibility(e) {
        if ((e.target.nodeName === 'A' || e.target.nodeName == 'INPUT') && e.target.getAttribute('data-allow-default') !== 'true') {
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
                me.form['from2x'].value = coords.x;
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
        
    };
    
    
    function formEl(name) {
        return parseFloat(me.form[name].value);
    }
    
    me.resetEvent = function (e) {
        location.hash="";
        setTimeout(function(e) {
            me.submitEvent(e, false, true);
        }, 1);
    };
    
    
    
    me.to3D = function(e) {
        me.submitEvent(e);
    }

    me.submitEvent = function (e, ignorePoints, noSetHash, o1Hidden) {
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
                doTransform3D(transform, o1Hidden);
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
                doTransform(transform, o1Hidden);
                drawPoints(transform);
            }
        };
        
    
        
         changeObjectHTMLandCSS();
         
         if (!noSetHash) {   
            var qs = generateQueryString(me.form),
                compress_qs = LZString.compressToEncodedURIComponent(qs);
            
            EventHelpers.removeEvent(window, 'hashchange', hashChangeEvent);
            location.hash=compress_qs;
            EventHelpers.addEvent(window, 'hashchange', hashChangeEvent);
        }
        
        
            
    };
    
    function doTransform(m, o1Hidden) {
        var matrixCSS, webkitMatrixCSS,
            scriptedToken = me.form.showVendorPrefixes.checked?'solveMatrix.css.vendor':'solveMatrix.css.noVendor',
            style, width, height;
            
        matrixCSS = StringHelpers.sprintf(
            "matrix(%.3g, %.3g, %.3g, %.3g, %.3gpx, %.3gpx)", 
            m.e(1,1), m.e(2,1), m.e(1,2), m.e(2,2), m.e(1,3)  , m.e(2,3) 
        );
        
        style = CSSHelpers.getComputedStyle(matrixSolver.o2.el);
        width = style.width;
        height = style.height;
        
        webkitMatrixCSS = matrixCSS.replace(/px/g, '');
        
        
        origin = StringHelpers.sprintf("%0.1gpx %0.1gpx", - formEl('from0x'), - formEl('from0y'));
        
        $('answer').innerHTML = config.getScriptedValue(
            scriptedToken, 
            {
                mozCSS:    matrixCSS,
                webkitCSS: webkitMatrixCSS,
                origin:    origin,
                width:     width,
                height:    height
            }
        )
        
        
        if (o1Hidden) {
            me.o1.el.style.top = '-1000px';
        } else {
            me.o1.setDimensions(formEl("from0x"), formEl("from0y"), formEl("from2x") - formEl("from0x"), formEl("from1y") - formEl("from0y"));
        }
        
        me.o2.setDimensions(formEl("from0x"), formEl("from0y"), formEl("from2x") - formEl("from0x"), formEl("from1y") - formEl("from0y"));
        
        
        me.o2.setTransform(origin, webkitMatrixCSS)
        
        
        
    }
    
    function doTransform3D(m, o1Hidden) {
        var matrixCSS;
        var sb = new StringBuffer(),
            counter = 0,
            scriptedToken = me.form.showVendorPrefixes.checked?'solveMatrix3d.css.vendor':'solveMatrix3d.css.noVendor';
        
        sb.append('matrix3d(');
        
        for (var i=1; i<=4; i++) {
            for (var j=1; j<=4; j++) {
                counter++;
                sb.append(StringHelpers.sprintf('%.8g', m.e(j, i)));
                
                if (i!=4 || j !=4) {
                    sb.append(', ');
                }
                
                if ( counter % 4 == 0 && counter != 16) {
                    sb.append('\n                    ');
                }
            }
        }

        sb.append(')');
        matrixCSS=sb.toString();
                
        
        origin = StringHelpers.sprintf("%gpx %gpx 0px", - formEl('from0x'), - formEl('from0y'));
        
        style = CSSHelpers.getComputedStyle(matrixSolver.o2.el);
        width = style.width;
        height = style.height;
        
        $('answer').innerHTML = config.getScriptedValue(
            scriptedToken, 
            {
                mozCSS:    matrixCSS,
                webkitCSS: matrixCSS,
                origin:    origin,
                width:     width,
                height:    height
            }
        );
        //StringHelpers.sprintf("transform: %s; <br />transform-origin: %s", matrixCSS, origin);
        
        
        if (o1Hidden) {
            console.log('haaa');
            me.o1.el.style.top = '-1000px';
        } else {
            me.o1.setDimensions(formEl("from0x"), formEl("from0y"), formEl("from2x") - formEl("from0x"), formEl("from1y") - formEl("from0y"));
        }
        
        me.o2.setDimensions(formEl("from0x"), formEl("from0y"), formEl("from2x") - formEl("from0x"), formEl("from1y") - formEl("from0y"));
        
        me.o2.el.style[matrixSolver.transformProp] = matrixCSS;
        me.o2.el.style[matrixSolver.transformOriginProp] = origin;
        
        
    }
    
    
    
    
    
    function drawPoints(transformMatrix) {
        
        // Now vectors for the points
        var fromPts = [ $V([formEl("from0x"), formEl("from0y"), 1]),
                        $V([formEl("from0x"), formEl("from1y"), 1]),
                        $V([formEl("from2x"), formEl("from0y"), 1])];
            
        
        var toP1 = [];
        for (var i=0; i<3; i++) {
            toP1[i] = transformMatrix.x(fromPts[i]);
            $('point' + (i+1)).style.left = toP1[i].e(1) + 'px';
            $('point' + (i+1)).style.top = toP1[i].e(2) + 'px';
            
        }
        
    }
    
    function drawPoints3D(transformMatrix) {
        
        
        for (var i=0; i<4; i++) {
            var pt = {
                x: formEl("to" + i + "x"),
                y: formEl("to" + i + "y")
            };
            
            $('point' + (i+1)).style.left = pt.x + 'px';
            $('point' + (i+1)).style.top = pt.y + 'px'
        }
    }
};

function Block (el) {
    var me = this;
    var para = el.getElementsByTagName('p')[0]
    me.el = el;
    var zIndex = 1;
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
        e.dataTransfer.setData('Text', 'ffff');
        var coords = {x: e.offsetX, y: e.offsetY}; //DragDropHelpers.getEventCoords(e);
        var dt = e.dataTransfer;
        
        
        if (dt.setDragImage) {
            dt.setDragImage(me.el, coords.x, coords.y);
        }
        
        grid.dragStartCoords = coords;
        
        grid.draggingObject = me.el; //EventHelpers.getEventTarget(e);
        
        
        //me.el.style.zIndex = -1000;
        me.resizer.el.style.visibility = 'hidden';
        //CSSHelpers.addClass(me.el, 'top');
       
        
    }
    
    
   function dragEvent(e) {
        
        // do nothing
        if (grid.draggingObject.id === 'o1' && me.el.id === 'o1') {
            grid.draggingObject.style.top = '-1000px';
        }
   }

    
    function dragEndEvent(e) {
        
        //me.el.style.zIndex = zIndex;
        me.resizer.el.style.visibility = 'visible';
        me.resizer.move();
        
    }
    
    function dragOverEvent(e) {
        
        e.dataTransfer.dropEffect = "move";
        
        switch(grid.draggingObject.id) {
            case 'o1Resizer':
            case 'point1':
            case 'point2':
            case 'point3':
            case 'point4':
                grid.dragOverEvent(e);
                break;
            case 'o1':
                if (me.el.id == 'o2') {
                    me.el.style.visibility = 'hidden';
                    matrixSolver.o1.resizer.el.style.visibility = 'hidden';
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
            
            EventHelpers.addEvent(pointEl, 'mousedown', mousedownEvent);
            
    }
    
    function mousedownEvent(e) {
        //matrixSolver.o2.el.style.visibility = 'hidden'
        
    }
    
    function mouseupEvent(e) {
        matrixSolver.o2.el.style.visibility = 'visible'
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
        if (!Modernizr.csspointerevents ) {
            matrixSolver.o2.el.style.visibility = 'hidden'
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
        grid.draggingObject.zIndex = '';
        grid.dropEvent(e);
        
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
            
        }
        matrixSolver.submitEvent(e, false);
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
        CSSHelpers.addClass(matrixSolver.o1.el, 'no-pointer-events');
        
        // you must set some data in order to drag an arbitrary block element like a <div>
        e.dataTransfer.setData('Text', 'ffff');
        
        //matrixSolver.o1.el.style.left = '-1000px'
        grid.draggingObject = el;
        
        //matrixSolver.o2.el.style.visibility = 'hidden';
        grid.dragStartCoords = DragDropHelpers.getEventCoords(e);
        e.dataTransfer.effectAllowed="move";
        
        EventHelpers.cancelBubble(e);
         
        /* Need pointer-events? */
        if (!Modernizr.csspointerevents ) {
            matrixSolver.o1.el.style.visibility = 'hidden'
            grid.draggingObject.style.zIndex = '-1';
        }
    }
    
    function dragEvent(e) {
        var oldcoords = grid.coords;
        
        
        // do nothing
        //EventHelpers.preventDefault(e);
        
        grid.coords = DragDropHelpers.getEventCoords(e);
        
        if (grid.coords === null || grid.coords.x > grid.el.offsetWidth) {
            grid.coords = oldcoords;
        }
        
    }
    
    function dragEndEvent(e) {
        //matrixSolver.o1.el.style.visibility = 'visible'
        
        grid.draggingObject.style.zIndex = '';
        
        CSSHelpers.removeClass(matrixSolver.o1.el, 'no-pointer-events');
        matrixSolver.o2.el.style.visibility = 'visible';
        
        matrixSolver.submitEvent(e);
    }
    
    me.resize = function(){
        //jslog.debug(StringHelpers.sprintf("%d %d", matrixSolver.coords.x, matrixSolver.coords.y))
        var parent = el.parentNode;
        
        
        matrixSolver.form["from1y"].value = grid.coords.y - grid.dragStartCoords.y + 10;
        matrixSolver.form["from2x"].value = grid.coords.x - grid.dragStartCoords.x + 10;
        
        //matrixSolver.setForm(moveCoords);
        
        
        
        //matrixSolver.submitEvent();
        
    };
    
    init();
}

var grid = new function () {
    var me = this;
    
    me.draggingObject = null;
    me.el = null;
    me.dragStartCoords = null;
    me.coords = null;
    
    me.init = function () {
        
        if (matrixSolver.isIE11) {
            me.el = $('grid-facade');
        } else {
            me.el = $('grid');
        }
        
        /* These are events for the object to be dropped */
        EventHelpers.addEvent(me.el, 'dragover', me.dragOverEvent, true);
        EventHelpers.addEvent(me.el, 'dragenter', me.dragEnterEvent, true);
        EventHelpers.addEvent(me.el, 'drop', me.dropEvent, false);
    };
    
    me.dragEnterEvent = function(e){
        EventHelpers.preventDefault(e);
    };
    
    me.dragOverEvent = function (e) {
        var oldcoords = me.coords;
        e.dataTransfer.dropEffect = "move";
        me.coords = DragDropHelpers.getEventCoords(e);
        
        
        if (me.coords === null || me.coords.x > me.el.offsetWidth) {
            me.coords = oldcoords;
        }
        
        
        
        switch (me.draggingObject.id) {
            case "o1Resizer":
                if (me.draggingObject === e.target) {
                    matrixSolver.o1.resizer.resize();
                }
                break;
            case "o1":
                matrixSolver.o1.el.style.top = '-1000px';
                //matrixSolver.o2.el.style.visibility = 'hidden';
                break;
            default:
                /* Need pointer-events */
                if (!Modernizr.csspointerevents ) {
                    matrixSolver.o2.el.style.visibility = 'hidden';
                    matrixSolver.o2.el.style.zIndex = -1;
                } 
                
        }
        
        matrixSolver.setForm(me.coords);
        
        var o1Hidden = (me.draggingObject.id === 'o1');
        
        matrixSolver.submitEvent(e, false, true, o1Hidden);
        
        
        EventHelpers.cancelBubble(e);
        EventHelpers.preventDefault(e);

    };
    
    me.dropEvent = function (e) {
        EventHelpers.cancelBubble(e);
        EventHelpers.preventDefault(e);
        
        
        switch (me.draggingObject.id) {
            case 'o1Resizer':
            case 'point1':
            case 'point2':
            case 'point3':
            case 'point4':
                me.draggingObject.style.zIndex = '';
                
                return;
            case 'o1':
                moveCoords = {
                    x: me.coords.x - me.dragStartCoords.x,
                    y: me.coords.y - me.dragStartCoords.y
                };
                break;
            default:
                moveCoords = {
                    x: me.coords.x,
                    y: me.coords.y
                };
        }
        
        
        if (me.draggingObject.id != 'o1Resizer') {
            //alert(DebugHelpers.getProperties(moveCoords))
            me.draggingObject.style.left = moveCoords.x + 'px';
            me.draggingObject.style.top = moveCoords.y + 'px';
            me.draggingObject.style.zIndex = "";
        }
        
        
        matrixSolver.setForm(moveCoords);
        
        
        
        matrixSolver.submitEvent(e);
        
        
        matrixSolver.o2.el.style.visibility = 'visible';
        matrixSolver.o2.el.style.zIndex = '';
        
        
    };
    
    me.hideAll = function () {
        matrixSolver.o1.el.style.visibility = 'hidden';
        matrixSolver.o2.el.style.visibility = 'hidden';
    };
    
    me.showAll = function () {
        
        matrixSolver.o1.el.style.visibility = 'visible';
        matrixSolver.o2.el.style.visibility = 'visible';
        
    };
    
    
};

var showhide = new function () {
    var me = this,
        els , links;
        
    me.init = function () {
        els = document.getElementsByClassName('showhide');
        links = document.querySelectorAll('.showhide-link');
        
        var i;
        for (i=0; i<links.length; i++) {
            EventHelpers.addEvent(links[i], 'click', linkClickEvent);
        }
    }
    
    function linkClickEvent(e) {
        var target = e.currentTarget,
            id = DOMHelpers.getAttributeValue(target, 'data-showhide-id'),
            el = $(id);
        
        EventHelpers.preventDefault(e);
        if (el) {
            if (CSSHelpers.isMemberOfClass(el, 'show')) {
                
                CSSHelpers.addClass(el, 'hide');
                CSSHelpers.removeClass(el, 'show');
                
                CSSHelpers.addClass(target, 'hide');
                CSSHelpers.removeClass(target, 'show');
            } else {
                CSSHelpers.addClass(el, 'show');
                CSSHelpers.removeClass(el, 'hide');
                
                CSSHelpers.addClass(target, 'show');
                CSSHelpers.removeClass(target, 'hide');
            }
        }
            
        
        
    }
};

EventHelpers.addPageLoadEvent('matrixSolver.init');
EventHelpers.addPageLoadEvent('showhide.init');

