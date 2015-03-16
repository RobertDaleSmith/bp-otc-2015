
 /****************************************************************************/
 /*                                                                          */
 /****************************************************************************/

 /*jslint browser:true */
 /*global window,$,console,document,alert */

 (function(window, document, undefined) {
 
  
 
 
    //****************************************************************************
    //
    //****************************************************************************
 
    var requestAnimFrame = (function(window) {
     'use strict';
 
     return window.requestAnimationFrame || 
            window.webkitRequestAnimationFrame || 
            window.mozRequestAnimationFrame    || 
            window.oRequestAnimationFrame      || 
            window.msRequestAnimationFrame     || 
            function(/* function */ callback, /* DOMElement */ element){ 
             window.setTimeout(callback, 1000 / 60);
            }; 
    }(window));
 
 
  //****************************************************************************
  //
  //****************************************************************************
 
  var utilities = {
   OBJECT_NAME: 'utilities',
 
 
    //***************************************************************************
    //
    //***************************************************************************
 
    checkArguments: function(
                             location,
                             argumentsObject,
                             lookupDatatypes,
                             minimumNumberOfArguments // optional
                            ) {
     'use strict';
 
     var a, b, entries, subEntries, datatype, value, txt, lookup, errorMsg; 
 
     entries = argumentsObject.length;
     errorMsg = '';
 
     if (!this.isString(location)) {
      errorMsg += this.OBJECT_NAME + ' function checkArguments argument \'location\' is not an string (' + location +')...\n';
     }
 
     if (!this.isArray(argumentsObject)) {
      errorMsg += this.OBJECT_NAME + ' ' + location + ' function checkArguments argument \'argumentsObject\' is not an object (' + argumentsObject + ')...\n'; 
     }
 
     if ( !this.isArray( lookupDatatypes ) ) {
      errorMsg += this.OBJECT_NAME + ' ' + location + ' function checkArguments argument \'lookupDatatypes\' is not an array (' + lookupDatatypes + ')...\n';
     }
 
     if ( arguments.length === 3 ) {
      if ( entries > lookupDatatypes.length ) {
       errorMsg += this.OBJECT_NAME + ' ' + location + ' number of arguments not equal to number of datatypes (' + entries + '/' + lookupDatatypes.length + ')...\n';
      }
     } else {
      if ( isNaN( minimumNumberOfArguments ) || entries < minimumNumberOfArguments ) {
       errorMsg += this.OBJECT_NAME + ' ' + location + ' number of arguments less than expected (' + entries + '/' + minimumNumberOfArguments + ')...\n';
      }
     } 
 
 
     if( errorMsg !== '' ){
      throw new Error( errorMsg );
     }
 
     txt = '';
 
     for (a = 0; a < entries; a += 1 ) {
 
      value = argumentsObject[ a ];    
      lookup =  lookupDatatypes[a].split(',');
      subEntries = lookup.length;
 
      for (b = 0; b < subEntries; b += 1 ) {
 
       datatype = lookup[b].toLowerCase(); 
 
       switch ( datatype ) {
 
        case 'int':
         if (!this.isInt(value)) {
          txt += ' argument \'' + a + '\' is not an integer (' + value +')...\n';
         }
         break;
        case 'number':
         if (!this.isNumber(value)) { txt += ' argument \'' + a + '\' is not an number (' + value +')...\n'; }
         break;
        case 'boolean':
         if (!this.isBoolean(value)) { txt += ' argument \'' + a + '\' is not an boolean (' + value +')...\n'; }
         break;
        case 'node':
         if (!(this.isNode(value) || value === window)) { txt += ' argument \'' + a + '\' is not an node (' + value +')...\n'; }
         break;
        case 'function':
         if (!this.isFunction(value)){ txt += ' argument \'' + a + '\' is not an function (' + value +')...\n'; }
         break;
        case 'string':
         if (!this.isString(value)){ txt += ' argument \'' + a + '\' is not an string (' + value +')...\n'; }
         break;
        case 'array':
         if (!this.isArray(value)){ txt += ' argument \'' + a + '\' is not an array (' + value +')...\n'; }
         break;
        case 'object':
         if (!this.isObject(value)){ txt += ' argument \'' + a + '\' is not an object (' + value +')...\n'; }
         break;
        default:
         if (datatype !== '*' && b !== (subEntries-1) ) {
          throw new Error(location+'\nunknown datatype (' + datatype + ')...'); 
         }
         break;
       }
      }
     }
 
     if ( txt !== '' ) {
      throw new Error( '\n\n' + location + '\n' + txt + '\n' );   
     }
    },
 
 
    //***************************************************************************
    //
    //***************************************************************************
 
    isBoolean: function( value ) {
     'use strict';
     return ( typeof value === 'boolean' ) ;
    },    
 
    //***************************************************************************
    //
    //***************************************************************************
 
    isInt: function ( value ) {
     'use strict';
     return (typeof value === 'number' && !isNaN( parseFloat( value ) ) && Math.abs( value - Math.floor( value ) ) === 0.0 );
    },
 
    //***************************************************************************
    //
    //***************************************************************************
 
    isNumber: function ( value ) {
     'use strict';
     return ( typeof value === 'number' && !isNaN( parseFloat( value ) ) );
    },
 
    //***************************************************************************
    //
    //***************************************************************************
 
    isString: function ( value ) {
     'use strict';
     return ( typeof value === 'string' );
    },
 
    //***************************************************************************
    //
    //***************************************************************************
 
    isObject: function ( value ) {
     'use strict';
     return ( typeof value === 'object' && !value.hasOwnProperty( 'length' ) );
    },
 
    //***************************************************************************
    //
    //***************************************************************************
 
    isFunction: function ( value ) {
     'use strict';
     return ( value && typeof value === 'function' ) ;
    }, 
 
    //***************************************************************************
    //
    //***************************************************************************
 
    isNode: function ( value ) {
     'use strict';
     return ( value && value.nodeType );
    }, 
 
    //***************************************************************************
    //
    //***************************************************************************
 
    isArray: function ( value ) {
     'use strict';
     return ( typeof value === 'object' && value.hasOwnProperty( 'length' ) );
    },
 
 
   //****************************************************************************
   //
   //****************************************************************************
 
   removeChildrenContainer: function( container ) { 
    'use strict';
 
    var a, entries;
 
    entries = container.childNodes.length;
 
    for ( a = 0; a < entries; a += 1 ) {
     while ( container.lastChild.hasChildNodes() ) {
      this.removeChildrenContainer( container.lastChild );
     }
     container.removeChild( container.lastChild );
    }
   }
  };
 
  
 
 
    //***************************************************************************
    //
    //***************************************************************************
 
    function Model() { 
     this.OBJECT_NAME = 'model';
     this.dictionary = {};
     this.subscribers = undefined;
     this.id = 0;
    }
 
 
    //****************************************************************************
    //                                                                          
    //****************************************************************************
 
    Model.prototype = {
 
     //**************************************************************************
     //
     //**************************************************************************
 
     setProperty: function(
                           propName,
                           propValue,
                           forceUpdate
                          ) {
      'use strict';
 
 
      if (
          this.dictionary[ propName ] === undefined ||
          this.dictionary[ propName ] !== propValue ||
          ( arguments.length === 3 && forceUpdate === true )
         ) {
       this.dictionary[ propName ] = propValue;
       this.generateEvent( propName, propValue );
      }
     },
 
     //**************************************************************************
     //
     //**************************************************************************
 
     getProperty: function( propName ) {
     'use strict';
 
 
      if ( this.dictionary.hasOwnProperty( propName ) ) {
       return this.dictionary[ propName ];
      }
     },
 
     //**************************************************************************
     //
     //**************************************************************************
 
     generateEvent: function(
                             propName,
                             propValue
                            ) {
      'use strict';
 
      var a, entries, lookup, prop, obj;
 
 
      if ( this.subscribers ) {
       if ( this.subscribers.hasOwnProperty( propName ) ) {
 
        // duplicate object's
        // while executing callbacks, listerener may be
        // removed from lookup subscriber, which in turn
        // may change length which result in problems
 
        obj = this.subscribers[ propName ];
        entries = obj.length;
        lookup = [];
 
        for (a = 0; a < entries; a +=1 ) {   
         lookup[ a ] = {};
 
         for ( prop in obj[ a ] ) {
          if ( obj[ a ].hasOwnProperty( prop ) ) {
           lookup[ a ][ prop ] = obj[ a ][ prop ];
         }}
        }
 
        entries = lookup.length;
        for ( a = 0; a < entries; a += 1 ) {   
         lookup[a]['function']( propName, propValue );
        }
       }
 
 
       if ( this.subscribers.hasOwnProperty('all') ) {
 
        // duplicate object's
        // while executing callbacks, listerener may be
        // removed from lookup subscriber, which in turn
        // may change length which result in problems
 
        obj = this.subscribers.all;
        entries = obj.length;
        lookup = [];
 
        for ( a = 0; a < entries; a += 1 ) {   
         lookup[ a ] = {};
 
         for ( prop in obj[ a ] ) {
          if ( obj[ a ].hasOwnProperty( prop ) ) {
           lookup[ a ][ prop ] = obj[ a ][ prop ];
         }}
        }
 
        entries = lookup.length;
        for ( a = 0; a < entries; a += 1 ) {   
         lookup[ a ]['function']( propName, propValue );
        }
       }
      }
     },
 
 
     //**************************************************************************
     //
     //**************************************************************************
 
     subscribe: function(
                         fn,
                         eventType
                        ) {
      'use strict';      
 
 
      var id;
 
      eventType = eventType || 'all';
 
      if ( !this.subscribers ) {
       this.subscribers = {};
      }
 
      if( !this.subscribers[eventType] ) {
       this.subscribers[ eventType ] = [];
      }
 
      id = this.getId();   
      this.subscribers[ eventType ].push( { 'function' : fn, 'id' : id} );
 
      return id;   
     },
 
 
     //**************************************************************************
     //
     //**************************************************************************
 
     getId: function() {
      'use strict';
 
      return 'id' + ( this.id += 1 );
     },
 
 
     //**************************************************************************
     //
     //**************************************************************************
 
     unsubscribe: function( id ) {
      'use strict';      
 
 
      var a, prop, entries, lookup;  
 
      if ( this.subscribers ) {
       for( prop in this.subscribers ) {
        if( this.subscribers.hasOwnProperty( prop ) ) {
 
         lookup = this.subscribers[ prop ];
         entries = lookup.length;
 
         for( a = 0; a < entries; a += 1 ) {   
 
          if ( lookup[a].hasOwnProperty( 'id' ) ) {
           if ( id === lookup[ a ].id ) {
            lookup.splice( a, 1 );
            return false;
           }
          }
         }
        }
       }
      }
     }
    };
 
  
 
 
    //***************************************************************************
    // SVG object
    //***************************************************************************
 
    var SVG = {
 
     NAME_SPACE: 'http://www.w3.org/2000/svg',
     OBJECT_NAME: 'SVG',
     ADJUSTABLE_PROPERTIES: { 
                             'pointer-events': { 'keyword': 'auto|none|visiblePainted|visibleFill|visibleStroke|visible|painted|fill|stroke|all|inherit' },
                             'fill'          : { 'datatype' : { 'int': 'rgb' }, 'keyword': 'none|black|green|silver|lime|gray|olive|white|yellow|maroon|navy|red|blue|purple|teal|fuchsia|aqua' },
                             'stroke'        : { 'datatype' : { 'int': 'rgb' }, 'keyword': 'none|black|green|silver|lime|gray|olive|white|yellow|maroon|navy|red|blue|purple|teal|fuchsia|aqua' },
                             'stroke-width'  : { 'datatype' : { 'number': '' } },
                             'desc'          : { 'datatype' : { 'string': '' } },
                             'cursor'        : { 'keyword'  : 'default|pointer|crosshair|move|text|wait|help' }
                            },
 
 
     //**************************************************************************
     //
     //**************************************************************************
 
     isAvailable: function() { 
      'use strict';
 
      return !!document.createElementNS && !!document.createElementNS( this.NAME_SPACE, 'svg' ).createSVGRect;
     },
 
     //**************************************************************************
     //
     //**************************************************************************
 
     createSvg: function(
                         width,
                         height,
                         viewBoxWidth,
                         viewBoxHeight
                        ) {
      'use strict';
 
 
      var svg;
 
      svg = document.createElementNS( this.NAME_SPACE, 'svg' );
 
      svg.setAttribute( 'version', '1.2' );
      svg.setAttribute( 'baseProfile', 'tiny' );
 
      if ( String(width).indexOf('%') !== -1 ) {
       svg.setAttribute( 'width', '100%' );
       svg.setAttribute( 'height', '100%' );
      } else {
       svg.setAttribute( 'width', width + 'px' );
       svg.setAttribute( 'height', height + 'px' );
      }
 
      svg.setAttribute( 'preserveAspectRatio', 'none' );
      svg.setAttribute( 'viewBox', '0 0 ' + viewBoxWidth + ' ' + viewBoxHeight ); 
 
      return svg;
     },
 
 
     //**************************************************************************
     //
     //**************************************************************************
 
     title: function(
                     svg,
                     txt
                    ) {
      'use strict';
 
 
      var title, titleText;
 
      title = document.createElementNS( this.NAME_SPACE, 'title' );
      titleText = document.createTextNode( txt );
      title.appendChild( titleText );
      svg.appendChild(title);
 
      return title;
     },
 
 
 
     //**************************************************************************
     //
     //**************************************************************************
 
     description: function(
                           svg,
                           txt
                          ) {
      'use strict';
 
 
      var desc, descText;
 
      desc = document.createElementNS( this.NAME_SPACE, 'desc' );
      descText = document.createTextNode( txt );
      desc.appendChild( descText );
      svg.appendChild(desc);
 
      return desc;
     },
 
 
     //**************************************************************************
     //
     //**************************************************************************
 
     removeChildren: function( svg ) {
      'use strict';
 
 
      while ( svg.lastChild ) {
       svg.removeChild(svg.lastChild);
      }
     },
 
 
     //**************************************************************************
     //
     //**************************************************************************
 
     setProperties: function(
                             element,
                             properties
                            ) {
      'use strict';
 
 
      var prop, flag, txt, value, dataType;
 
      for ( prop in properties ) { 
 
       flag = false;
 
       if ( properties.hasOwnProperty( prop ) &&
            this.ADJUSTABLE_PROPERTIES.hasOwnProperty( prop ) ) {
 
        value = properties[ prop ];
 
 
 
        //**************************************************************************
        // check datatype, if present
        //**************************************************************************
 
        if ( this.ADJUSTABLE_PROPERTIES[ prop ].hasOwnProperty( 'datatype' ) ) {
 
         dataType = this.ADJUSTABLE_PROPERTIES[ prop ][ 'datatype' ];
         value    = !isNaN( parseFloat( value ) ) ? parseFloat( value ) : '';
 
         //*************************************************************************
         // 
         //*************************************************************************
 
         if ( value === 0 || value != '' ) { 
 
          if ( dataType.hasOwnProperty( 'int' ) && parseInt( value, 10) === Math.floor( value ) ) { 
           if( dataType.int === 'rgb' ){
            element.setAttribute( prop,  SVG.getRGB ( parseInt( value , 10 ) ) );
           } else {
            element.setAttribute( prop,  parseInt(value, 10 ) );
           } 
 
           flag = true;
          }
 
          else if ( dataType.hasOwnProperty( 'number' ) ) {
           element.setAttribute( prop, parseFloat( value ) );
           flag = true;
          }
         }
 
 
         else if ( dataType.hasOwnProperty( 'string' ) ) {
 
          value = properties[ prop ];
 
  alert(prop + ' ' + value );
 
          element.setAttribute( prop, value );
          flag = true;
         }
 
 
        }
 
        //**************************************************************************
        // check for keyword
        //**************************************************************************
 
        if ( !flag &&
             this.ADJUSTABLE_PROPERTIES[ prop ].hasOwnProperty( 'keyword' ) &&
             this.ADJUSTABLE_PROPERTIES[ prop ][ 'keyword' ].indexOf( value ) !== -1 ) {
         element.setAttribute( prop, value );
         flag = true;
        }
       }
 
       if ( !flag ) {
        throw new Error( this.OBJECT_NAME + ' function setProperties unknown property (' + prop + ' / ' + properties[ prop ] +')...\n' );
       }
      }
     },
 
 
 
     //**************************************************************************
     //
     //**************************************************************************
 
     drawRectangle: function(
                             svg,
                             xPosition,
                             yPosition,
                             width,
                             height,
                             properties
                            ) {
      'use strict';
 
 
      var element;
 
      element = this.getRectangle(
                                  xPosition,
                                  yPosition,
                                  width,
                                  height,
                                  properties
                                 );
 
      svg.appendChild( element );
 
      return element;
     },
 
 
     //**************************************************************************
     //
     //**************************************************************************
 
     getRectangle: function(
                            xPosition,
                            yPosition,
                            width,
                            height,
                            properties
                           ) {
      'use strict';
 
 
      var rect;
 
      rect = document.createElementNS( this.NAME_SPACE, 'rect' );
 
      rect.setAttribute( 'pointer-events', 'none'   ); 
      rect.setAttribute( 'fill'          ,  this.getRGB( 0 ) ); 
      rect.setAttribute( 'stroke'        , 'none');
 
      //*************************************************************************
      //
      //*************************************************************************
 
      if ( properties ) {
       this.setProperties( rect, properties ); 
      }
 
      rect.setAttribute( 'x'     , parseInt( xPosition * 100.0 , 10) / 100.0 );
      rect.setAttribute( 'y'     , parseInt( yPosition * 100.0 , 10) / 100.0 );
      rect.setAttribute( 'width' , parseInt( width     * 100.0 , 10) / 100.0 );
      rect.setAttribute( 'height', parseInt( height    * 100.0 , 10) / 100.0 );
 
      return rect;
     },
 
 
 
     //**************************************************************************
     //
     //**************************************************************************
 
     drawLine: function(
                        svg,
                        lookupPositions,
                        properties
                       ) {
      'use strict';
 
 
      var element;
 
      element = this.getLine(
                             lookupPositions,
                             properties
                            );
 
      svg.appendChild( element );
 
      return element;
     },
 
 
     //**************************************************************************
     //
     //**************************************************************************
 
     getLine: function(
                       lookupPositions,
                       properties
                      ) {
      'use strict';
 
 
      var a, entries, path, txt, xPosition, yPosition, xPrevious, yPrevious;
 
      path = document.createElementNS( this.NAME_SPACE, 'path' );
 
      //*************************************************************************
      // default
      //*************************************************************************
 
      path.setAttribute( 'pointer-events', 'none'   ); 
      path.setAttribute( 'fill'          , 'none'   ); 
      path.setAttribute( 'stroke'        , this.getRGB( 0 ) ); 
      path.setAttribute( 'stroke-width'  , 1.0 );
 
      //*************************************************************************
      //
      //*************************************************************************
 
      if ( properties ) {
       this.setProperties( path, properties); 
      }
 
      entries = lookupPositions.length;
      xPrevious = yPrevious = -1000000;
 
      txt = '';
 
      for ( a = 0; a < entries; a += 2 ) {
 
       xPosition = parseInt( lookupPositions[ a     ] * 100.0 , 10) / 100.0 ;
       yPosition = parseInt( lookupPositions[ a + 1 ] * 100.0 , 10) / 100.0 ;
 
       //************************************************************************
       // do not draw if same position
       //************************************************************************
 
       if ( !( xPosition === xPrevious && yPosition === yPrevious ) ) {
 
        //***********************************************************************
        // horizontal same
        //***********************************************************************
 
        if ( xPosition === xPrevious ) {
         txt += 'V' + yPosition;
        } else if (  yPosition === yPrevious ) {
         txt += 'H' + xPosition;
        } else {
         txt += (txt.length===0 ? 'M' : 'L') + xPosition + ( yPosition < 0.0 ? '' : ' ') + yPosition;   
        }
       }
 
       xPrevious = xPosition;
       yPrevious = yPosition;
      }
 
 
      //*************************************************************************
      // if property 'fill' is defined, path is closed
      //*************************************************************************
 
      if ( properties && properties.hasOwnProperty('fill') ) {
       txt += 'z';
      }
 
      path.setAttribute('d',  txt  );
 
      return path;
     },
 
 
     //**************************************************************************
     //
     //**************************************************************************
 
     getRGB: function( colorValue ) {
      'use strict'; 
 
      var red, green, blue;
 
 
      if ( colorValue < 0 ) {
       throw new Error( 'SVG getRGB colorvalue < 0 (' + colorValue + ')...' ); 
      }
 
      red   = ( parseInt( colorValue, 10 ) >> 16 ) & 255;
      green = ( parseInt( colorValue, 10 ) >>  8 ) & 255;
      blue  = ( parseInt( colorValue, 10 )       ) & 255;
 
      return 'rgb(' + red + ',' + green + ',' + blue + ')';
     },
 
 
 
     //**************************************************************************
     //
     //**************************************************************************
 
     drawCircle: function( 
                          svg,
                          radius,
                          xPosition,
                          yPosition, 
                          properties
                         ) {
 
 
      var element;
 
      element = this.getCircle(
                               radius,
                               xPosition,
                               yPosition, 
                               properties
                              );
 
      svg.appendChild( element );
 
      return element;
     },
 
 
     //**************************************************************************
     //
     //**************************************************************************
 
     getCircle: function(
                         radius,
                         xPosition,
                         yPosition, 
                         properties
                        ) {
      'use strict'; 
 
      var circle, txt;
 
 
      circle = document.createElementNS( this.NAME_SPACE, 'circle' );
 
      //*************************************************************************
      // default
      //*************************************************************************
 
      circle.setAttribute( 'pointer-events', 'none' ); 
      circle.setAttribute( 'fill'          , SVG.getRGB( 0 ) );
      circle.setAttribute( 'stroke'        , 'none');
 
      //*************************************************************************
      //
      //*************************************************************************
 
      if ( properties  ) {
       this.setProperties(
                          circle,
                          properties
                         ); 
      }
 
      circle.setAttribute( 'cx', parseInt( xPosition * 100.0 , 10) / 100.0 );
      circle.setAttribute( 'cy', parseInt( yPosition * 100.0 , 10) / 100.0 );
      circle.setAttribute( 'r' , parseInt( radius    * 100.0 , 10) / 100.0 );
 
      return circle;
     }
    };
 
  
 
 
   //****************************************************************************
   // 
   // each 'slider-area' has one child with class 'slider'
   //
   // <div id="slider-container" class="slider-area" ... 
   //  <div class="slider" ...
   // </div>
   //
   // callback
   //  Slider.EVENT_MOUSE_UP
   //  Slider.EVENT_LAMBDA
   //
   //****************************************************************************
 
   function Slider(args) {
    'use strict';
 
    var errorMsg, self, userAgent, event;
 
    self = this;
    errorMsg = '';
    this.OBJECT_NAME = 'Slider';
 
    this.elmSlider = args && args.hasOwnProperty('elm') ? args.elm : undefined;
    this.callback = args && args.hasOwnProperty('callback')  ? args.callback : undefined;
    this.interval = args && args.hasOwnProperty('interval')  ? Number(args.interval) : 0;
    this.lambdaSlider = args && args.hasOwnProperty('value') ? Number(args.value) : 0.0;
    this.flagHorizontal = args && args.hasOwnProperty('flagHorizontal') ? Boolean(args.flagHorizontal) : true;
    this.updateType = args && args.hasOwnProperty('updateType') ?  (args.updateType === Slider.UPDATE_ON_CHANGE ? Slider.UPDATE_ON_CHANGE : Slider.UPDATE_MOUSE_UP) : Slider.UPDATE_MOUSE_UP;
 
    this.flagTouchEvent = ('ontouchstart' in document.documentElement) ? true : false;
 
 
    if ( !(this instanceof Slider) ) {
     errorMsg += 'use \'new\' for Slider...\n';
    }
 
    if( this.elmSlider && this.elmSlider.nodeType ) { 
 
     this.elmSliderRaw = this.elmSlider;
     this.elmSlider = $( this.elmSlider );
     this.sliderRaw = null;
     this.slider = null;
 
     this.elmSlider.children().each( function( index, element ) {
      if ( element.nodeType === 1 && element.tagName.toLowerCase() === 'div' ) {
       self.sliderRaw = element;
       self.slider = $( element );
      }
     });
 
     if( this.slider === null ) {
      errorMsg = 'slider not valid or present...\n';
     }
    } else {
     errorMsg = 'container not valid...\n';
    }
 
    if(!( this.callback && (typeof this.callback === 'function'))) { 
     errorMsg = 'container not valid...\n';
    }
 
    if( isNaN(this.lambdaSlider) || this.lambdaSlider<0.0 || this.lambdaSlider > 1.0 ) { 
     errorMsg = 'initial value out of range 0.0 ... 1.0 (' + this.lambdaSlider + ')...\n';
    }
 
    if( isNaN(this.interval) || this.interval<0 ) { 
     errorMsg = 'interval out of range 1 ...  (' + this.interval + ')...\n';
    }
 
    //***************************************************************************
    //
    //***************************************************************************
 
    if ( errorMsg !== '' ) {
     throw new Error('- ' + this.OBJECT_NAME + ' ----\n' + errorMsg); 
    }
 
    //***************************************************************************
    //
    //***************************************************************************
 
    else {
 
     //**************************************************************************
     // wanneer slider position gezet wordt, wordt er geen slider lambda
     // event gegenereert
     //**************************************************************************
 
     this.flagEnableLambdaEvent = true;
 
 
     this.lambdaSliderPrev = this.lambdaSlider;
     this.sliderSize = null;
     this.sliderOffset = null;
     this.sliderPosition = null;
     this.dragElement = null;
 
 
     this.elmSlider.bind( this.flagTouchEvent ? 'touchstart' : 'mousedown', function(e) { self.mouseDown(e); } );
 
     //**************************************************************************
     // reposition slider on resize
     //**************************************************************************
 
     $(window).resize(function() {
      self.setSlider( self.lambdaSlider );
     });
 
     this.setSlider( this.lambdaSlider );
    }
   }
 
 
 
   //****************************************************************************
   // 
   //
   //****************************************************************************
 
   Slider.FLAG_DEBUG   = false;
   Slider.UPDATE_MOUSE_UP  = 'update mouse up';
   Slider.UPDATE_ON_CHANGE  = 'update on change';
 
 
   //****************************************************************************
   //
   //
   //****************************************************************************
 
   Slider.prototype = {
 
 
    //***************************************************************************
    //
    //***************************************************************************
 
    setSlider: function(lambda) {
     'use strict';
 
     this.flagEnableLambdaEvent = false;
     this.updateSlider( lambda , true );
     this.flagEnableLambdaEvent = true;
    },
 
    //***************************************************************************
    //
    //***************************************************************************
 
    getSlider: function() {
     'use strict';
 
     return this.lambdaSlider;
    },
 
 
    //***************************************************************************
    //
    //***************************************************************************
 
    mouseUp: function(e) {
     'use strict';
 
     var self;
 
     self = this;
 
     if(this.flagTouchEvent) {
      $( document).unbind('touchend');
      $( document).unbind('touchmove');
      this.elmSlider.bind('touchstart', function( e ) { self.mouseDown( e ); });
     }
 
     else {
      $( document ).unbind( 'mouseup' );
      $( document ).unbind( 'mousemove' );
      this.elmSlider.bind('mousedown', function( e ) { self.mouseDown(e); });
     }
 
     document.onselectstart = null;
     this.dragElement = null;
     this.processMouseUp();
    },
 
 
    //***************************************************************************
    //
    //***************************************************************************
 
    processMouseUp: function() { 
 
     //**************************************************************************
     // update to interval position, if present
     //**************************************************************************
 
     if(this.sliderPosition !== null) {
      if ( this.flagHorizontal ){  this.slider.css( { 'left': this.sliderPosition + 'px' } ); }
      else                      {  this.slider.css( { 'top': this.sliderPosition + 'px' } ); }
     }
 
     //**************************************************************************
     // callback; return interpolation lambda
     //**************************************************************************
 
     if ( this.updateType === Slider.UPDATE_MOUSE_UP ) {
      this.generateLambdaEvent();
     }
    },
 
 
    //***************************************************************************
    //
    //***************************************************************************
 
    generateLambdaEvent: function() {
     'use strict';
 
     this.callback( Slider.EVENT_LAMBDA, this.lambdaSlider );
    },
 
 
    //***************************************************************************
    //
    //***************************************************************************
 
    mouseDown: function( e ) {
     'use strict';
 
     var a, entries, obj, self;
 
     self = this;
 
     e.preventDefault();
 
     if ( this.flagTouchEvent ) {
 
      obj = e.originalEvent.changedTouches;
      entries = obj.length;
 
      for ( a = 0; a < entries; a += 1 ) {
       if( obj[ a ].target === this.elmSliderRaw || obj[ a ].target === this.sliderRaw ){
        this.processMouseDown(
                              $(obj[a].target),
                              obj[a].pageX
                             );
 
        this.elmSlider.unbind('touchstart');
        $(document).bind('touchmove', function(e) { self.mouseMove(e); });
        $(document).bind('touchend' , function(e) { self.mouseUp(e); });
 
        break;
       }
      }
     }
 
     else if ( e.which === 1 ) { // left mouse button
 
      this.processMouseDown(
                            $(e.target),
                            e.pageX
                           );
 
 
      this.elmSlider.unbind( 'mousedown' );
      $(document).bind('mouseup'  , function(e) { self.mouseUp(e); });
      $(document).bind('mousemove', function(e) { self.mouseMove(e); });
     }
 
 
     document.body.focus(); // cancel out any text selections
     document.onselectstart = function () { return false; };  // prevent text selection in IE
    },
 
 
    //***************************************************************************
    //
    //***************************************************************************
 
    processMouseDown: function(
                               dragElement,
                               position
                              ) {
     'use strict';
 
     var self;
 
     this.dragElement = dragElement;
     self = this;
 
     if ( this.flagHorizontal ) {
 
      if ( this.dragElement === this.slider ) {
       this.sliderOffset = position - this.slider.position().left;
      } else {
       this.sliderOffset = this.slider.width() / 2.0; 
      }
 
      this.updateSlider( ( position - this.elmSlider.offset().left ) - this.sliderOffset );
 
 
 
     }
    },
 
 
 
 
    //****************************************************************************
    //                                                                          
    //****************************************************************************
 
    mouseMove: function (e) {
     'use strict';
 
     var a, entries, obj;
 
     e.preventDefault();
 
     if(this.flagTouchEvent){
 
      obj = e.originalEvent.changedTouches;
      entries = obj.length;
 
      for(a=0; a<entries; a+=1){
       if( obj[a].target === this.elmSliderRaw || obj[a].target === this.sliderRaw ){
        this.processMouseMove(
                              obj[a].pageX 
                             );
        break;
       }
      }
     }
 
     else if ( e.which === 1 ) { 
      this.processMouseMove(e.pageX);
     }
    },
 
 
    //***************************************************************************
    //
    //***************************************************************************
 
    processMouseMove: function(position) {
     'use strict';
 
     if ( this.dragElement ) {
      if(this.flagHorizontal){
       this.updateSlider( ( position - this.elmSlider.offset().left ) - this.sliderOffset );
      }
     }
    },
 
 
 
 
    //****************************************************************************
    //                                                                          
    //****************************************************************************
 
    updateSlider: function ( position, flagIsLambda  ) {
     'use strict';
 
     var minimum, maximum, integerValue;
 
     minimum = 0;
     maximum = this.elmSlider.width() - this.slider.width();
 
     if(arguments.length === 2 && Boolean(flagIsLambda) ) { 
      position *= maximum;
     } 
 
     if ( position < minimum ) {
      this.lambdaSlider = 0.0;
      position = minimum; 
     }  else if (position > maximum ) {
      this.lambdaSlider = 1.0;
      position = maximum; 
     } else { 
 
      this.lambdaSlider = position * ( 1.0 / maximum );
      this.sliderPosition = null;
 
      if ( this.interval !== 0 ) {
       integerValue = Math.round( parseInt( this.lambdaSlider * (this.interval + 1), 10) );
       this.lambdaSlider = integerValue * ( 1.0 / this.interval );
       this.sliderPosition = this.lambdaSlider * maximum;
      }
     }
 
     if ( this.flagHorizontal ){  $(this.slider).css( { 'left': position + 'px' } ); }
     else                      {  $(this.slider).css( { 'top': position + 'px' } ); } 
 
     if (
         this.flagEnableLambdaEvent && 
         this.updateType === Slider.UPDATE_ON_CHANGE && 
         this.lambdaSlider !== this.lambdaSliderPrev
        ) {
 
 
      this.generateLambdaEvent();
      this.lambdaSliderPrev = this.lambdaSlider;
 
     }
 
 
 
 
 
    }
   };
 
 
 
  //****************************************************************************
  //
  //
  //****************************************************************************
 
  function BezierLinear(
                        xAnchorStart,
                        yAnchorStart,
                        xAnchorEnd,
                        yAnchorEnd
                       ) { 
   'use strict';
      
   var errorMsg;
 
   //***************************************************************************
   // check dependancies                                                                           
   //***************************************************************************
 
   if ( !(this instanceof BezierLinear) ||
        !utilities ) {
 
    errorMsg = '';
 
    if ( !(this instanceof BezierLinear) ) { errorMsg += 'use \'new\' for BezierLinear...\n'; }
    if ( !utilities ) { errorMsg += '\'utilities\' not present...\n'; }
 
    if ( errorMsg !== '' ) {
     throw new Error('- ' + BezierLinear.OBJECT_NAME + ' ----\n' + errorMsg); 
    }
   }
 
 
   this.xAnchorStart    = xAnchorStart;
   this.yAnchorStart    = yAnchorStart;
   this.xAnchorEnd      = xAnchorEnd;
   this.yAnchorEnd      = yAnchorEnd;
   this.lambdaStartPrev = -1.0;
   this.lambdaEndPrev   = -1.0;
   this.lengthBezier    = 0.0;
   this.path            = '';
 
   this.init();
  }
 
 
  //****************************************************************************
  //
  //
  //****************************************************************************
 
  BezierLinear.OBJECT_NAME = 'BezierLinear';
 
    
  //****************************************************************************
  //
  //
  //****************************************************************************
 
  BezierLinear.prototype = {
 
   //***************************************************************************
   //
   //***************************************************************************
 
   init: function() {
    'use strict';
 
    this.lengthBezier = this.calculateLength();
   },
 
 
   //***************************************************************************
   //                                                                          
   //***************************************************************************
 
   getLength: function() {
    'use strict';
 
    return this.lengthBezier;
   },
 
 
   //***************************************************************************
   //                                                                          
   //***************************************************************************
 
   getPath: function(
                     lambdaStart,
                     lambdaEnd
                    ) {
    'use strict';
 
    
    var obj, xPosition, yPosition, mathFloor;
 
    //**************************************************************************
    // if different previous, recalculate path otherwise use previous path                                                                         
    //**************************************************************************
 
    if ( lambdaStart !== this.lambdaStartPrev ||
         lambdaEnd   !== this.lambdaEndPrev ) {
 
     this.lambdaStartPrev = lambdaStart;
     this.lambdaEndPrev   = lambdaEnd;
 
     obj = this.interpolateLinearBezierCurve(
                                             lambdaStart,
                                             lambdaEnd,
                                             this.xAnchorStart,
                                             this.yAnchorStart,
                                             this.xAnchorEnd,
                                             this.yAnchorEnd
                                            );
 
     if ( !( obj.xAnchorStart === obj.xAnchorEnd && 
             obj.yAnchorStart === obj.yAnchorEnd ) ) {
 
      mathFloor = Math.floor;
 
      xPosition = parseInt( obj.xAnchorStart * 100.0 , 10) / 100.0 ;
      yPosition = parseInt( obj.yAnchorStart * 100.0 , 10) / 100.0 ;
 
      this.path = 'M' + xPosition + ( yPosition < 0.0 ? '' : ' ' ) + yPosition ;
 
      xPosition = parseInt( obj.xAnchorEnd * 100.0 , 10) / 100.0 ;
      yPosition = parseInt( obj.yAnchorEnd * 100.0 , 10) / 100.0 ;
 
      if ( obj.xAnchorStart === obj.xAnchorEnd ) {
       this.path += 'V' + yPosition;
      } else if ( obj.yAnchorStart === obj.yAnchorEnd ) {
       this.path += 'H' + xPosition;
      } else {
       this.path += ( xPosition < 0.0  ? '' : ' ') + xPosition + ( yPosition < 0.0 ? '' : ' ' ) + yPosition + ' ';
      }
     }
    }
     
    return this.path;
   },
 
 
   //***************************************************************************
   //                                                                          
   //***************************************************************************
 
   calculateLength: function() {
    'use strict';  
  
    var length, mathPow;
 
    mathPow = Math.pow;
    length = Math.sqrt (
                        mathPow( this.xAnchorStart - this.xAnchorEnd, 2.0 ) +
                        mathPow( this.yAnchorStart - this.yAnchorEnd, 2.0 )
                       );
 
    return length;
   },
 
 
   //***************************************************************************
   //                                                                          
   //***************************************************************************  
   
   interpolateLinearBezierCurve: function(
                                          lambdaStart,
                                          lambdaEnd,
                                          xAnchorStart,
                                          yAnchorStart,
                                          xAnchorEnd,
                                          yAnchorEnd 
                                         )  {
    'use strict';
 
  
    if ( lambdaStart >= 0.0 ) {
     xAnchorStart += lambdaStart * ( xAnchorEnd - xAnchorStart );
     yAnchorStart += lambdaStart * ( yAnchorEnd - yAnchorStart );    
    }
 
    if ( lambdaEnd <= 1.0 ) {
     lambdaEnd = 1.0 - lambdaEnd;
     xAnchorEnd += lambdaEnd * ( xAnchorStart - xAnchorEnd );
     yAnchorEnd += lambdaEnd * ( yAnchorStart - yAnchorEnd ); 
    }
   
    return {
            'xAnchorStart': xAnchorStart,
            'yAnchorStart': yAnchorStart,
            'xAnchorEnd'  : xAnchorEnd,
            'yAnchorEnd'  : yAnchorEnd
           };
   }  
  };
  
 
 
 
  //****************************************************************************
  //
  //
  //****************************************************************************
 
  function BezierQuadratic(
                           xAnchorStart,
                           yAnchorStart,
                           xHandle,
                           yHandle,
                           xAnchorEnd,
                           yAnchorEnd
                          ) { 
   'use strict';
      
   var errorMsg;
 
   //***************************************************************************
   // check dependancies                                                                           
   //***************************************************************************
 
   if ( !(this instanceof BezierQuadratic) ||
        !utilities ) { 
 
    errorMsg = '';
 
    if ( !(this instanceof BezierQuadratic) ) { errorMsg += 'use \'new\' for BezierQuadratic...\n'; }
    if ( !utilities ) { errorMsg += '\'utilities\' not present...\n'; }
 
    if ( errorMsg !== '' ) {
     throw new Error('- ' + BezierQuadratic.OBJECT_NAME + ' ----\n' + errorMsg); 
    }
   }
  
 
   this.lambdaStartPrev = -1.0;
   this.lambdaEndPrev   = -1.0;
   this.lengthBezier    = 0.0;
   this.xAnchorStart    = xAnchorStart;
   this.yAnchorStart    = yAnchorStart;
   this.xHandle         = xHandle;
   this.yHandle         = yHandle;
   this.xAnchorEnd      = xAnchorEnd;
   this.yAnchorEnd      = yAnchorEnd;
   this.path            = '';
 
   this.init();
  }
 
 
  //****************************************************************************
  //
  //
  //****************************************************************************
 
  BezierQuadratic.OBJECT_NAME = 'BezierQuadratic';
 
    
  //****************************************************************************
  //
  //
  //****************************************************************************
 
  BezierQuadratic.prototype = {
 
   //***************************************************************************
   //
   //***************************************************************************
 
   init: function() {
    'use strict';
 
    this.lengthBezier = this.calculateLength();
   },
 
 
   //***************************************************************************
   //                                                                          
   //***************************************************************************
 
   getLength: function() {
    'use strict';
 
    return this.lengthBezier;
   },
 
 
   //***************************************************************************
   //                                                                          
   //***************************************************************************
 
   getPath: function(
                     lambdaStart,
                     lambdaEnd
                    ) {
    'use strict';
 
 
    //**************************************************************************
    // if different previous, recalculate path                                                                         
    //**************************************************************************
 
    if ( lambdaStart !== this.lambdaStartPrev ||
         lambdaEnd   !== this.lambdaEndPrev ) {
 
     this.lambdaStartPrev = lambdaStart;
     this.lambdaEndPrev   = lambdaEnd;
 
 
     // interpolatie nog opnemen!
 
 
     this.path = 'M' + this.xAnchorStart.toFixed( 2 ) + ',' + this.yAnchorStart.toFixed( 2 ) + ' ' +
                       this.xAnchorEnd  .toFixed( 2 ) + ',' + this.yAnchorEnd  .toFixed( 2 );
  
    }   
    
    return this.path;
   },
 
 
   //***************************************************************************
   //                                                                          
   //***************************************************************************
 
   calculateLength: function() {
    'use strict';  
 
    var a, lambda, lambda0, lambda1, lambda2, length, entries, xPosition, yPosition, xPrevious, yPrevious, mathPow;
 
    length = 0.0;
    entries = Outline.LENGTH_NUMBER_OF_SAMPLE_POSITION;
    mathPow = Math.pow;
 
    for (a = 1; a < entries; a += 1) {
     
     lambda  = a * ( 1.0 / ( entries - 1 ) );
     lambda0 = mathPow( 1.0 - lambda, 2.0 );
     lambda1 = 1.0 - lambda;
     lambda2 = mathPow( lambda, 2.0 );
 
     xPosition = lambda0 * this.xAnchorStart + 2 * lambda1 * lambda * this.xHandle + lambda2 * this.xAnchorEnd;
     yPosition = lambda0 * this.yAnchorStart + 2 * lambda1 * lambda * this.yHandle + lambda2 * this.yAnchorEnd;
 
     length += Math.sqrt (
                          mathPow( xPrevious - xPosition, 2.0 ) +
                          mathPow( yPrevious - yPosition, 2.0 )
                         );
 
     xPrevious = xPosition;
     yPrevious = yPosition;
    }
 
    return length;
   },
 
 
   //***************************************************************************
   //                                                                          
   //***************************************************************************  
   
   interpolateCubicBezier: function(
                                    lambdaStart,
                                    lambdaEnd,
                                    xAnchorStart,
                                    yAnchorStart,
                                    xHandle,
                                    yHandle,
                                    xAnchorEnd,
                                    yAnchorEnd 
                            ) {
    'use strict';
 
  
    var x0, y0, x1, y1;
 
    if ( lambdaStart > 0.0 ) {
     x0 =  xAnchorStart + lambdaStart * ( xHandle    - xAnchorStart );
     y0 =  yAnchorStart + lambdaStart * ( yHandle    - yAnchorStart );
     x1 =  xHandle      + lambdaStart * ( xAnchorEnd - xHandle      );
     y1 =  yHandle      + lambdaStart * ( yAnchorEnd - yHandle      );
 
     xAnchorStart = x0 + lambdaStart * ( x1 - x0 );
     yAnchorStart = y0 + lambdaStart * ( y1 - y0 );
     xHandle      = x1;
     yHandle      = y1; 
    }
 
   
    if ( lambdaEnd < 1.0 ) {
     x0 =  xAnchorStart + lambdaStart * ( xHandle    - xAnchorStart );
     y0 =  yAnchorStart + lambdaStart * ( yHandle    - yAnchorStart );
     x1 =  xHandle      + lambdaStart * ( xAnchorEnd - xHandle      );
     y1 =  yHandle      + lambdaStart * ( yAnchorEnd - yHandle      );
 
     xAnchorStart = x0 + lambdaStart * ( x1 - x0 );
     yAnchorStart = y0 + lambdaStart * ( y1 - y0 );
     xHandle      = x1;
     yHandle      = y1; 
    }
   
    return {
            'xAnchorStart' : xAnchorStart,
            'yAnchorStart' : yAnchorStart,
            'xHandle'      : xHandle,
            'yHandle'      : yHandle,
            'xAnchorEnd'   : xAnchorEnd,
            'yAnchorEnd'   : yAnchorEnd
           };
   }
  };
  
 
 
 
  //****************************************************************************
  //
  //
  //****************************************************************************
 
  function BezierCubic(
                       xAnchorStart,
                       yAnchorStart,
                       xHandleStart,
                       yHandleStart,
                       xHandleEnd,
                       yHandleEnd,
                       xAnchorEnd,
                       yAnchorEnd
                      ) { 
   'use strict';
      
   var errorMsg;
 
   //***************************************************************************
   // check dependancies                                                                           
   //***************************************************************************
 
   if ( !(this instanceof BezierCubic) ||
         !utilities ) { 
 
    errorMsg = '';
 
    if ( !(this instanceof BezierCubic) ) { errorMsg += 'use \'new\' for BezierCubic...\n'; }
    if ( !utilities ) { errorMsg += '\'utilities\' not present...\n'; }
 
    if ( errorMsg !== '' ) {
     throw new Error('- ' + BezierCubic.OBJECT_NAME + ' ----\n' + errorMsg); 
    }
   }
 
 
   this.lambdaStartPrev = -1.0;
   this.lambdaEndPrev   = -1.0;
   this.lengthBezier    = 0.0;
   this.xAnchorStart    = xAnchorStart;
   this.yAnchorStart    = yAnchorStart;
   this.xHandleStart    = xHandleStart;
   this.yHandleStart    = yHandleStart;
   this.xHandleEnd      = xHandleEnd;
   this.yHandleEnd      = yHandleEnd;
   this.xAnchorEnd      = xAnchorEnd;
   this.yAnchorEnd      = yAnchorEnd;
   this.path            = '';
 
   this.init();
  }
 
 
  //****************************************************************************
  //
  //
  //****************************************************************************
 
  BezierCubic.OBJECT_NAME = 'BezierCubic';
 
    
  //****************************************************************************
  //
  //
  //****************************************************************************
 
  BezierCubic.prototype = {
 
   //***************************************************************************
   //
   //***************************************************************************
 
   init: function() {
    'use strict';
 
    this.lengthBezier = this.calculateLength();
   },
 
 
   //***************************************************************************
   //                                                                          
   //***************************************************************************
 
   getLength: function() {
    'use strict';
 
    return this.lengthBezier;
   },
 
 
   //***************************************************************************
   //                                                                          
   //***************************************************************************
 
   getPath: function(
                     lambdaStart,
                     lambdaEnd
                    ) {
    'use strict';
 
 
    var obj, xPosition, yPosition, mathFloor;
 
    //**************************************************************************
    // if different previous, recalculate path                                                                         
    //**************************************************************************
 
    if ( lambdaStart !== this.lambdaStartPrev ||
         lambdaEnd   !== this.lambdaEndPrev ) {
 
     this.lambdaStartPrev = lambdaStart;
     this.lambdaEndPrev   = lambdaEnd;
 
     obj = this.interpolateCubicBezierCurve(
                                            lambdaStart,
                                            lambdaEnd,
                                            this.xAnchorStart,
                                            this.yAnchorStart,
                                            this.xHandleStart,
                                            this.yHandleStart,
                                            this.xHandleEnd,
                                            this.yHandleEnd,
                                            this.xAnchorEnd,
                                            this.yAnchorEnd
                                           );
 
 
     mathFloor = Math.floor;
 
     xPosition = parseInt( obj.xAnchorStart * 100.0 , 10) / 100.0 ;
     yPosition = parseInt( obj.yAnchorStart * 100.0 , 10) / 100.0 ;
 
     this.path = 'M' + xPosition + ( yPosition < 0.0 ? '' : ' ') + yPosition;
 
     xPosition = parseInt( obj.xHandleStart * 100.0 , 10) / 100.0 ;
     yPosition = parseInt( obj.yHandleStart * 100.0 , 10) / 100.0 ;
 
     this.path += 'C' + xPosition + ( yPosition<0.0 ? '' : ' ') + yPosition;
 
     xPosition = parseInt( obj.xHandleEnd * 100.0 , 10) / 100.0 ;
     yPosition = parseInt( obj.yHandleEnd * 100.0 , 10) / 100.0 ;
 
     this.path += ( xPosition<0.0 ? '' : ' ' ) + xPosition + ( yPosition < 0.0 ? '' : ' ' ) + yPosition;
 
     xPosition = parseInt( obj.xAnchorEnd * 100.0 , 10) / 100.0 ;
     yPosition = parseInt( obj.yAnchorEnd * 100.0 , 10) / 100.0 ;
 
     this.path += ( xPosition < 0.0 ? '' : ' ') + xPosition + ( yPosition < 0.0 ? '' : ' ' ) + yPosition + ' ';
    } 
 
 
    return this.path;
   },
 
 
   //***************************************************************************
   //                                                                          
   //***************************************************************************
 
   calculateLength: function() {
    'use strict';  
       
    var a, lambda, entries, xPosition, yPosition, xPrevious, yPrevious, length,
        lambda0, lambda1, lambda2, lambda3, factor, mathPow;
 
    length    = 0.0;
    entries   = Outline.LENGTH_NUMBER_OF_SAMPLE_POSITION;
    xPrevious = this.xAnchorStart;
    yPrevious = this.yAnchorStart;
    factor    = 1.0 / ( entries - 1 );
    lambda    = 0.0;
    mathPow   = Math.pow;
 
    for ( a = 1; a < entries; a += 1, lambda += factor ) {
 
     lambda0 = mathPow( 1.0 - lambda, 3.0 );
     lambda1 = mathPow( 1.0 - lambda, 2.0 );
     lambda2 = mathPow( lambda, 2.0 );
     lambda3 = mathPow( lambda, 3.0 );
 
     xPosition = this.xAnchorStart * lambda0 + 
                 this.xHandleStart * 3.0 * lambda * lambda1 + 
                 this.xHandleEnd * 3.0 * lambda2 *
                 ( 1.0 - lambda ) + this.xAnchorEnd * lambda3;
 
     yPosition = this.yAnchorStart * lambda0 + 
                 this.yHandleStart * 3.0 * lambda * lambda1 + 
                 this.yHandleEnd * 3.0 * lambda2 * 
                 ( 1.0 - lambda ) + this.yAnchorEnd * lambda3;
 
     length += Math.sqrt (
                          mathPow( xPrevious - xPosition, 2.0 ) +
                          mathPow( yPrevious - yPosition, 2.0 )
                         );
 
     xPrevious = xPosition;
     yPrevious = yPosition;
    }
 
    return length;
   },
 
 
   //***************************************************************************
   //                                                                          
   //***************************************************************************  
   
   interpolateCubicBezierCurve: function(
                                         lambdaStart,
                                         lambdaEnd,
                                         xAnchorStart,
                                         yAnchorStart,
                                         xHandleStart,
                                         yHandleStart,
                                         xHandleEnd,
                                         yHandleEnd,
                                         xAnchorEnd,
                                         yAnchorEnd 
                                        )  {
    'use strict';
 
  
    var x0, y0, x1, y1, x2, y2, x3, y3, x4, y4;
 
    if (lambdaStart > 0.0) {
 
     x0 = xAnchorStart + lambdaStart * ( xHandleStart - xAnchorStart );
     y0 = yAnchorStart + lambdaStart * ( yHandleStart - yAnchorStart );
     x1 = xHandleStart + lambdaStart * ( xHandleEnd   - xHandleStart );
     y1 = yHandleStart + lambdaStart * ( yHandleEnd   - yHandleStart );
     x2 = xHandleEnd   + lambdaStart * ( xAnchorEnd   - xHandleEnd   );
     y2 = yHandleEnd   + lambdaStart * ( yAnchorEnd   - yHandleEnd   );
 
     x3 = x0 + lambdaStart * ( x1 - x0 );
     y3 = y0 + lambdaStart * ( y1 - y0 );
     x4 = x1 + lambdaStart * ( x2 - x1 );
     y4 = y1 + lambdaStart * ( y2 - y1 );
 
     xAnchorStart = x3 + lambdaStart * ( x4 - x3 );
     yAnchorStart = y3 + lambdaStart * ( y4 - y3 );
     xHandleStart = x4;
     yHandleStart = y4;
     xHandleEnd   = x2;
     yHandleEnd   = y2;
    }
 
    if ( lambdaEnd < 1.0 ) {
 
     x0 = xAnchorStart + lambdaEnd * ( xHandleStart - xAnchorStart );
     y0 = yAnchorStart + lambdaEnd * ( yHandleStart - yAnchorStart );
     x1 = xHandleStart + lambdaEnd * ( xHandleEnd   - xHandleStart );
     y1 = yHandleStart + lambdaEnd * ( yHandleEnd   - yHandleStart );
     x2 = xHandleEnd   + lambdaEnd * ( xAnchorEnd   - xHandleEnd   );
     y2 = yHandleEnd   + lambdaEnd * ( yAnchorEnd   - yHandleEnd   );
 
     x3 = x0 + lambdaEnd * ( x1 - x0 );
     y3 = y0 + lambdaEnd * ( y1 - y0 );
     x4 = x1 + lambdaEnd * ( x2 - x1 );
     y4 = y1 + lambdaEnd * ( y2 - y1 );
 
     xHandleStart = x0;
     yHandleStart = y0;
     xHandleEnd   = x3;
     yHandleEnd   = y3;
     xAnchorEnd   = x3 + lambdaEnd * ( x4 - x3 );
     yAnchorEnd   = y3 + lambdaEnd * ( y4 - y3 );
    }
   
    return {
            'xAnchorStart': xAnchorStart,
            'yAnchorStart': yAnchorStart,
            'xHandleStart': xHandleStart,
            'yHandleStart': yHandleStart,
            'xHandleEnd'  : xHandleEnd,
            'yHandleEnd'  : yHandleEnd,
            'xAnchorEnd'  : xAnchorEnd,
            'yAnchorEnd'  : yAnchorEnd
           };
   }  
  };
  
 
 
 
  //****************************************************************************
  //                                                                          
  // 
  //****************************************************************************
  
  function Main(
                containerId,
                width,
                height
               ) {
   'use strict';
 
   var errorMsg;
 
   this.model = new Model();
 
   //***************************************************************************
   // check dependancies                                                                           
   //***************************************************************************
 
    if ( !(this instanceof Main) ||
         !this.model ||
         !utilities ) {
 
    errorMsg = '';
 
    if ( !(this instanceof Main) ) { errorMsg += 'use \'new\' for Main...\n'; }
    if ( !this.model ) { errorMsg += '\'model\' not present...\n'; }
    if ( !utilities ) { errorMsg += '\'utilities\' not present...\n'; }
 
    if ( errorMsg !== '' ) {
     throw new Error('- ' + Main.OBJECT_NAME + ' ----\n' + errorMsg); 
    }
   }
 
 
   this.utilities = utilities;
   this.width = width;
   this.height = height;
   this.containerId = containerId;
   this.container = undefined;
   this.lambdaAnimation = 0.0;
   this.offsetAnimation = 0.0;
   this.path = undefined;
   this.flagEndOfAnimation = false;
   this.svg = undefined;
   this.svgRoot = undefined;
   this.flagRequestUpdate = false;
   this.flagToggle = false;
 
   //***************************************************************************
   // 
   //***************************************************************************
 
   this.lookupOutlines = [
                      ["m|0", "l|1", "l|2", "l|3", "l|4", "l|5", "l|6", "l|7", "l|8", "l|9", "l|10", "l|11", "l|12", "l|13", "l|14", "l|15", "l|16", "l|17", "l|18", "l|19", "l|20", "l|21", "l|22", "l|23", "l|24", "l|25", "l|26", "l|27", "l|28", "l|29", "l|30", "l|31", "l|32", "l|33", "l|34", "l|35", "l|36", "l|37", "l|38", "l|39", "l|40", "l|41", "l|0"], 
                      ["m|42", "l|43", "l|44", "l|45", "l|42"], 
                      ["m|0", "l|1", "l|2", "l|3", "l|4", "l|5", "l|6", "l|7", "l|8", "l|9", "l|10", "l|11", "l|12", "l|13", "l|14", "l|15", "l|16", "l|17", "l|18", "l|19", "l|20", "l|21", "l|22", "l|23", "l|24", "l|25", "l|26", "l|27", "l|28", "l|29", "l|30", "l|31", "l|32", "l|33", "l|34", "l|35", "l|36", "l|37", "l|38", "l|39", "l|40", "l|41", "l|0"], 
                      ["m|42", "l|43", "l|44", "l|45", "l|42"], 
                      ["m|0", "l|1", "l|2", "l|3", "l|4", "l|5", "l|6", "l|7", "l|8", "l|9", "l|10", "l|11", "l|12", "l|13", "l|14", "l|15", "l|16", "l|17", "l|18", "l|19", "l|20", "l|21", "l|22", "l|23", "l|24", "l|25", "l|26", "l|27", "l|28", "l|29", "l|30", "l|31", "l|32", "l|33", "l|34", "l|35", "l|36", "l|37", "l|38", "l|39", "l|40", "l|41", "l|0"], 
                      ["m|42", "l|43", "l|44", "l|45", "l|42"], 
                      ["m|46", "l|47", "l|48", "l|49", "l|50", "l|51", "l|52", "l|53", "l|54", "l|55", "l|56", "l|57", "l|46"], 
                      ["m|46", "l|47", "l|48", "l|49", "l|50", "l|51", "l|52", "l|53", "l|54", "l|55", "l|56", "l|57", "l|46"], 
                      ["m|46", "l|47", "l|48", "l|49", "l|50", "l|51", "l|52", "l|53", "l|54", "l|55", "l|56", "l|57", "l|46"], 
                      ["m|58", "l|59", "l|60", "l|61", "l|62", "l|63", "l|64", "l|65", "l|66", "l|67", "l|68", "l|69", "l|70", "l|71", "l|72", "l|73", "l|74", "l|75", "l|76", "l|77", "l|78", "l|79", "l|80", "l|81", "l|82", "l|83", "l|84", "l|58"], 
                      ["m|58", "l|59", "l|60", "l|61", "l|62", "l|63", "l|64", "l|65", "l|66", "l|67", "l|68", "l|69", "l|70", "l|71", "l|72", "l|73", "l|74", "l|75", "l|76", "l|77", "l|78", "l|79", "l|80", "l|81", "l|82", "l|83", "l|84", "l|58"], 
                      ["m|58", "l|59", "l|60", "l|61", "l|62", "l|63", "l|64", "l|65", "l|66", "l|67", "l|68", "l|69", "l|70", "l|71", "l|72", "l|73", "l|74", "l|75", "l|76", "l|77", "l|78", "l|79", "l|80", "l|81", "l|82", "l|83", "l|84", "l|58"], 
                      ["m|85", "l|86", "l|87", "l|88", "l|89", "l|90", "l|91", "l|92", "l|93", "l|94", "l|95", "l|96", "l|97", "l|98", "l|99", "l|100", "l|101", "l|102", "l|103", "l|104", "l|85"], 
                      ["m|105", "l|106", "l|107", "l|108", "l|105"], 
                      ["m|85", "l|86", "l|87", "l|88", "l|89", "l|90", "l|91", "l|92", "l|93", "l|94", "l|95", "l|96", "l|97", "l|98", "l|99", "l|100", "l|101", "l|102", "l|103", "l|104", "l|85"], 
                      ["m|105", "l|106", "l|107", "l|108", "l|105"], 
                      ["m|85", "l|86", "l|87", "l|88", "l|89", "l|90", "l|91", "l|92", "l|93", "l|94", "l|95", "l|96", "l|97", "l|98", "l|99", "l|100", "l|101", "l|102", "l|103", "l|104", "l|85"], 
                      ["m|105", "l|106", "l|107", "l|108", "l|105"], 
                      ["m|109", "l|110", "l|111", "l|112", "l|113", "l|114", "l|115", "l|116", "l|117", "l|118", "l|119", "l|120", "l|121", "l|122", "l|123", "l|124", "l|109"], 
                      ["m|109", "l|110", "l|111", "l|112", "l|113", "l|114", "l|115", "l|116", "l|117", "l|118", "l|119", "l|120", "l|121", "l|122", "l|123", "l|124", "l|109"], 
                      ["m|109", "l|110", "l|111", "l|112", "l|113", "l|114", "l|115", "l|116", "l|117", "l|118", "l|119", "l|120", "l|121", "l|122", "l|123", "l|124", "l|109"], 
                      ["m|125", "l|126", "l|127", "l|128", "l|129", "l|130", "l|131", "l|132", "l|133", "l|134", "l|135", "l|136", "l|137", "l|138", "l|139", "l|140", "l|141", "l|142", "l|143", "l|144", "l|125"], 
                      ["m|125", "l|126", "l|127", "l|128", "l|129", "l|130", "l|131", "l|132", "l|133", "l|134", "l|135", "l|136", "l|137", "l|138", "l|139", "l|140", "l|141", "l|142", "l|143", "l|144", "l|125"], 
                      ["m|125", "l|126", "l|127", "l|128", "l|129", "l|130", "l|131", "l|132", "l|133", "l|134", "l|135", "l|136", "l|137", "l|138", "l|139", "l|140", "l|141", "l|142", "l|143", "l|144", "l|125"], 
                      ["m|145", "c|146|147|148", "l|149", "l|150", "l|151", "l|152", "l|153", "l|154", "l|155", "c|156|157|145"], 
                      ["m|158", "l|159", "c|160|161|162", "c|163|164|165", "l|166", "l|158"], 
                      ["m|145", "c|146|147|148", "l|149", "l|150", "l|151", "l|152", "l|153", "l|154", "l|155", "c|156|157|145"], 
                      ["m|158", "l|159", "c|160|161|162", "c|163|164|165", "l|166", "l|158"], 
                      ["m|145", "c|146|147|148", "l|149", "l|150", "l|151", "l|152", "l|153", "l|154", "l|155", "c|156|157|145"], 
                      ["m|158", "l|159", "c|160|161|162", "c|163|164|165", "l|166", "l|158"], 
                      ["m|167", "c|168|169|170", "c|171|172|173", "l|174", "l|175", "l|176", "l|177", "l|178", "l|179", "l|180", "c|181|182|183", "c|184|185|167"], 
                      ["m|186", "l|187", "c|188|189|190", "c|191|192|193", "l|194", "l|186"], 
                      ["m|195", "l|196", "l|197", "l|198", "c|199|200|201", "c|202|203|195"], 
                      ["m|167", "c|168|169|170", "c|171|172|173", "l|174", "l|175", "l|176", "l|177", "l|178", "l|179", "l|180", "c|181|182|183", "c|184|185|167"], 
                      ["m|186", "l|187", "c|188|189|190", "c|191|192|193", "l|194", "l|186"], 
                      ["m|195", "l|196", "l|197", "l|198", "c|199|200|201", "c|202|203|195"], 
                      ["m|167", "c|168|169|170", "c|171|172|173", "l|174", "l|175", "l|176", "l|177", "l|178", "l|179", "l|180", "c|181|182|183", "c|184|185|167"], 
                      ["m|186", "l|187", "c|188|189|190", "c|191|192|193", "l|194", "l|186"], 
                      ["m|195", "l|196", "l|197", "l|198", "c|199|200|201", "c|202|203|195"], 
                      ["m|204", "l|205", "l|206", "l|207", "l|204"], 
                      ["m|204", "l|205", "l|206", "l|207", "l|204"], 
                      ["m|204", "l|205", "l|206", "l|207", "l|204"], 
                      ["m|208", "l|209", "l|210", "l|211", "l|212", "l|213", "l|214", "l|215", "l|216", "l|217", "l|218", "l|219", "l|220", "l|221", "l|222", "l|223", "l|224", "l|225", "l|226", "l|227", "l|208"], 
                      ["m|208", "l|209", "l|210", "l|211", "l|212", "l|213", "l|214", "l|215", "l|216", "l|217", "l|218", "l|219", "l|220", "l|221", "l|222", "l|223", "l|224", "l|225", "l|226", "l|227", "l|208"], 
                      ["m|208", "l|209", "l|210", "l|211", "l|212", "l|213", "l|214", "l|215", "l|216", "l|217", "l|218", "l|219", "l|220", "l|221", "l|222", "l|223", "l|224", "l|225", "l|226", "l|227", "l|208"], 
                      ["m|228", "l|229", "l|230", "l|231", "l|232", "l|233", "l|234", "l|235", "l|236", "l|237", "l|238", "l|239", "l|240", "l|241", "l|228"], 
                      ["m|228", "l|229", "l|230", "l|231", "l|232", "l|233", "l|234", "l|235", "l|236", "l|237", "l|238", "l|239", "l|240", "l|241", "l|228"], 
                      ["m|228", "l|229", "l|230", "l|231", "l|232", "l|233", "l|234", "l|235", "l|236", "l|237", "l|238", "l|239", "l|240", "l|241", "l|228"], 
                      ["m|242", "l|243", "l|244", "l|245", "l|246", "l|247", "l|248", "l|249", "l|250", "l|251", "l|252", "l|253", "l|242"], 
                      ["m|242", "l|243", "l|244", "l|245", "l|246", "l|247", "l|248", "l|249", "l|250", "l|251", "l|252", "l|253", "l|242"], 
                      ["m|242", "l|243", "l|244", "l|245", "l|246", "l|247", "l|248", "l|249", "l|250", "l|251", "l|252", "l|253", "l|242"], 
                      ["m|254", "l|255", "l|256", "l|257", "l|258", "l|259", "l|260", "l|261", "l|262", "l|263", "l|264", "l|265", "l|266", "l|267", "l|268", "l|269", "l|270", "l|271", "l|272", "l|273", "l|254"], 
                      ["m|254", "l|255", "l|256", "l|257", "l|258", "l|259", "l|260", "l|261", "l|262", "l|263", "l|264", "l|265", "l|266", "l|267", "l|268", "l|269", "l|270", "l|271", "l|272", "l|273", "l|254"], 
                      ["m|254", "l|255", "l|256", "l|257", "l|258", "l|259", "l|260", "l|261", "l|262", "l|263", "l|264", "l|265", "l|266", "l|267", "l|268", "l|269", "l|270", "l|271", "l|272", "l|273", "l|254"], 
                      ["m|274", "c|275|276|277", "l|278", "l|279", "l|280", "l|281", "l|282", "l|283", "l|284", "l|285", "l|286", "l|287", "l|288", "l|289", "l|290", "l|291", "l|292", "l|293", "c|294|295|274"], 
                      ["m|296", "l|297", "l|298", "l|299", "c|300|301|302", "c|303|304|296"], 
                      ["m|274", "c|275|276|277", "l|278", "l|279", "l|280", "l|281", "l|282", "l|283", "l|284", "l|285", "l|286", "l|287", "l|288", "l|289", "l|290", "l|291", "l|292", "l|293", "c|294|295|274"], 
                      ["m|296", "l|297", "l|298", "l|299", "c|300|301|302", "c|303|304|296"], 
                      ["m|274", "c|275|276|277", "l|278", "l|279", "l|280", "l|281", "l|282", "l|283", "l|284", "l|285", "l|286", "l|287", "l|288", "l|289", "l|290", "l|291", "l|292", "l|293", "c|294|295|274"], 
                      ["m|296", "l|297", "l|298", "l|299", "c|300|301|302", "c|303|304|296"], 
                      ["m|305", "l|306", "c|307|308|309", "c|310|311|312", "c|313|314|315", "c|316|317|318", "l|319", "l|320", "l|321", "l|322", "c|323|324|325", "c|326|327|328", "c|329|330|331", "c|332|333|305"], 
                      ["m|305", "l|306", "c|307|308|309", "c|310|311|312", "c|313|314|315", "c|316|317|318", "l|319", "l|320", "l|321", "l|322", "c|323|324|325", "c|326|327|328", "c|329|330|331", "c|332|333|305"], 
                      ["m|305", "l|306", "c|307|308|309", "c|310|311|312", "c|313|314|315", "c|316|317|318", "l|319", "l|320", "l|321", "l|322", "c|323|324|325", "c|326|327|328", "c|329|330|331", "c|332|333|305"], 
                      ["m|334", "c|335|336|337", "l|338", "l|339", "l|340", "l|341", "l|342", "l|343", "l|344", "c|345|346|347", "c|348|349|350", "l|351", "l|352", "l|353", "l|354", "l|355", "l|356", "l|357", "c|358|359|334"], 
                      ["m|334", "c|335|336|337", "l|338", "l|339", "l|340", "l|341", "l|342", "l|343", "l|344", "c|345|346|347", "c|348|349|350", "l|351", "l|352", "l|353", "l|354", "l|355", "l|356", "l|357", "c|358|359|334"], 
                      ["m|334", "c|335|336|337", "l|338", "l|339", "l|340", "l|341", "l|342", "l|343", "l|344", "c|345|346|347", "c|348|349|350", "l|351", "l|352", "l|353", "l|354", "l|355", "l|356", "l|357", "c|358|359|334"], 
                      ["m|360", "l|361", "l|362", "l|363", "l|364", "l|365", "c|366|367|368", "c|369|370|371", "l|372", "l|373", "l|374", "l|375", "l|376", "l|377", "l|378", "l|379", "l|380", "l|381", "l|360"], 
                      ["m|382", "l|383", "c|384|385|386", "c|387|388|389", "l|390", "l|382"], 
                      ["m|360", "l|361", "l|362", "l|363", "l|364", "l|365", "c|366|367|368", "c|369|370|371", "l|372", "l|373", "l|374", "l|375", "l|376", "l|377", "l|378", "l|379", "l|380", "l|381", "l|360"], 
                      ["m|382", "l|383", "c|384|385|386", "c|387|388|389", "l|390", "l|382"], 
                      ["m|360", "l|361", "l|362", "l|363", "l|364", "l|365", "c|366|367|368", "c|369|370|371", "l|372", "l|373", "l|374", "l|375", "l|376", "l|377", "l|378", "l|379", "l|380", "l|381", "l|360"], 
                      ["m|382", "l|383", "c|384|385|386", "c|387|388|389", "l|390", "l|382"], 
                      ["m|391", "l|392", "l|393", "l|394", "l|395", "l|396", "l|397", "l|398", "l|399", "l|400", "l|401", "l|402", "l|403", "l|404", "l|405", "l|391"], 
                      ["m|391", "l|392", "l|393", "l|394", "l|395", "l|396", "l|397", "l|398", "l|399", "l|400", "l|401", "l|402", "l|403", "l|404", "l|405", "l|391"], 
                      ["m|391", "l|392", "l|393", "l|394", "l|395", "l|396", "l|397", "l|398", "l|399", "l|400", "l|401", "l|402", "l|403", "l|404", "l|405", "l|391"], 
                      ["m|406", "l|407", "l|408", "l|409", "l|410", "l|411", "l|412", "l|413", "l|414", "l|415", "l|416", "l|417", "l|418", "l|419", "l|420", "l|421", "l|422", "l|423", "l|424", "l|425", "l|406"], 
                      ["m|406", "l|407", "l|408", "l|409", "l|410", "l|411", "l|412", "l|413", "l|414", "l|415", "l|416", "l|417", "l|418", "l|419", "l|420", "l|421", "l|422", "l|423", "l|424", "l|425", "l|406"], 
                      ["m|406", "l|407", "l|408", "l|409", "l|410", "l|411", "l|412", "l|413", "l|414", "l|415", "l|416", "l|417", "l|418", "l|419", "l|420", "l|421", "l|422", "l|423", "l|424", "l|425", "l|406"], 
                      ["m|426", "c|427|428|429", "c|430|431|432", "c|433|434|435", "c|436|437|438", "c|439|440|441", "c|442|443|444", "c|445|446|447", "c|448|449|450", "c|451|452|453", "l|454", "l|455", "l|456", "l|457", "l|458", "c|459|460|461", "c|462|463|464", "c|465|466|467", "c|468|469|470", "l|471", "c|472|473|474", "l|475", "l|476", "l|477", "l|478", "l|479", "c|480|481|482", "c|483|484|485", "l|486", "l|487", "l|488", "l|489", "l|490", "l|491", "l|492", "c|493|494|495", "l|496", "l|497", "l|498", "l|499", "l|500", "l|501", "l|502", "c|503|504|505", "l|506", "l|507", "l|508", "l|509", "l|510", "l|511", "l|512", "l|513", "l|514", "l|515", "l|516", "l|517", "c|518|519|520", "c|521|522|523", "l|524", "c|525|526|527", "c|528|529|530", "c|531|532|533", "c|534|535|536", "c|537|538|539", "l|540", "c|541|542|543", "c|544|545|546", "c|547|548|549", "c|550|551|552", "c|553|554|555", "c|556|557|558", "c|559|560|561", "l|562", "l|563", "c|564|565|566", "l|567", "l|568", "l|569", "l|570", "l|571", "c|572|573|574", "c|575|576|577", "l|578", "l|579", "l|580", "l|581", "l|582", "l|583", "l|584", "c|585|586|587", "l|588", "l|589", "l|590", "l|591", "l|592", "l|593", "l|594", "l|595", "l|596", "c|597|598|599", "c|600|601|602", "c|603|604|605", "c|606|607|608", "c|609|610|611", "c|612|613|614", "c|615|616|617", "l|618", "c|619|620|621", "c|622|623|624", "c|625|626|426"], 
                      ["m|627", "l|628", "l|629", "l|630", "l|627"], 
                      ["m|631", "l|632", "c|633|634|635", "l|631"], 
                      ["m|636", "l|637", "c|638|639|640", "l|636"], 
                      ["m|641", "c|642|643|644", "l|645", "c|646|647|648", "c|649|650|641"], 
                      ["m|426", "c|427|428|429", "c|430|431|432", "c|433|434|435", "c|436|437|438", "c|439|440|441", "c|442|443|444", "c|445|446|447", "c|448|449|450", "c|451|452|453", "l|454", "l|455", "l|456", "l|457", "l|458", "c|459|460|461", "c|462|463|464", "c|465|466|467", "c|468|469|470", "l|471", "c|472|473|474", "l|475", "l|476", "l|477", "l|478", "l|479", "c|480|481|482", "c|483|484|485", "l|486", "l|487", "l|488", "l|489", "l|490", "l|491", "l|492", "c|493|494|495", "l|496", "l|497", "l|498", "l|499", "l|500", "l|501", "l|502", "c|503|504|505", "l|506", "l|507", "l|508", "l|509", "l|510", "l|511", "l|512", "l|513", "l|514", "l|515", "l|516", "l|517", "c|518|519|520", "c|521|522|523", "l|524", "c|525|526|527", "c|528|529|530", "c|531|532|533", "c|534|535|536", "c|537|538|539", "l|540", "c|541|542|543", "c|544|545|546", "c|547|548|549", "c|550|551|552", "c|553|554|555", "c|556|557|558", "c|559|560|561", "l|562", "l|563", "c|564|565|566", "l|567", "l|568", "l|569", "l|570", "l|571", "c|572|573|574", "c|575|576|577", "l|578", "l|579", "l|580", "l|581", "l|582", "l|583", "l|584", "c|585|586|587", "l|588", "l|589", "l|590", "l|591", "l|592", "l|593", "l|594", "l|595", "l|596", "c|597|598|599", "c|600|601|602", "c|603|604|605", "c|606|607|608", "c|609|610|611", "c|612|613|614", "c|615|616|617", "l|618", "c|619|620|621", "c|622|623|624", "c|625|626|426"], 
                      ["m|627", "l|628", "l|629", "l|630", "l|627"], 
                      ["m|631", "l|632", "c|633|634|635", "l|631"], 
                      ["m|636", "l|637", "c|638|639|640", "l|636"], 
                      ["m|641", "c|642|643|644", "l|645", "c|646|647|648", "c|649|650|641"], 
                      ["m|426", "c|427|428|429", "c|430|431|432", "c|433|434|435", "c|436|437|438", "c|439|440|441", "c|442|443|444", "c|445|446|447", "c|448|449|450", "c|451|452|453", "l|454", "l|455", "l|456", "l|457", "l|458", "c|459|460|461", "c|462|463|464", "c|465|466|467", "c|468|469|470", "l|471", "c|472|473|474", "l|475", "l|476", "l|477", "l|478", "l|479", "c|480|481|482", "c|483|484|485", "l|486", "l|487", "l|488", "l|489", "l|490", "l|491", "l|492", "c|493|494|495", "l|496", "l|497", "l|498", "l|499", "l|500", "l|501", "l|502", "c|503|504|505", "l|506", "l|507", "l|508", "l|509", "l|510", "l|511", "l|512", "l|513", "l|514", "l|515", "l|516", "l|517", "c|518|519|520", "c|521|522|523", "l|524", "c|525|526|527", "c|528|529|530", "c|531|532|533", "c|534|535|536", "c|537|538|539", "l|540", "c|541|542|543", "c|544|545|546", "c|547|548|549", "c|550|551|552", "c|553|554|555", "c|556|557|558", "c|559|560|561", "l|562", "l|563", "c|564|565|566", "l|567", "l|568", "l|569", "l|570", "l|571", "c|572|573|574", "c|575|576|577", "l|578", "l|579", "l|580", "l|581", "l|582", "l|583", "l|584", "c|585|586|587", "l|588", "l|589", "l|590", "l|591", "l|592", "l|593", "l|594", "l|595", "l|596", "c|597|598|599", "c|600|601|602", "c|603|604|605", "c|606|607|608", "c|609|610|611", "c|612|613|614", "c|615|616|617", "l|618", "c|619|620|621", "c|622|623|624", "c|625|626|426"], 
                      ["m|627", "l|628", "l|629", "l|630", "l|627"], 
                      ["m|631", "l|632", "c|633|634|635", "l|631"], 
                      ["m|636", "l|637", "c|638|639|640", "l|636"], 
                      ["m|641", "c|642|643|644", "l|645", "c|646|647|648", "c|649|650|641"], 
                      ["m|651", "l|652", "l|653", "l|654", "l|655", "l|656", "l|657", "l|658", "l|659", "l|660", "l|661", "l|662", "l|663", "l|664", "l|665", "l|666", "l|651"], 
                      ["m|651", "l|652", "l|653", "l|654", "l|655", "l|656", "l|657", "l|658", "l|659", "l|660", "l|661", "l|662", "l|663", "l|664", "l|665", "l|666", "l|651"], 
                      ["m|651", "l|652", "l|653", "l|654", "l|655", "l|656", "l|657", "l|658", "l|659", "l|660", "l|661", "l|662", "l|663", "l|664", "l|665", "l|666", "l|651"], 
                      ["m|667", "l|668", "l|669", "c|670|671|672", "c|673|674|675", "l|676", "l|677", "l|678", "l|679", "l|680", "l|681", "l|682", "c|683|684|685", "c|686|687|688", "l|689", "l|690", "l|691", "l|692", "l|667"], 
                      ["m|667", "l|668", "l|669", "c|670|671|672", "c|673|674|675", "l|676", "l|677", "l|678", "l|679", "l|680", "l|681", "l|682", "c|683|684|685", "c|686|687|688", "l|689", "l|690", "l|691", "l|692", "l|667"], 
                      ["m|667", "l|668", "l|669", "c|670|671|672", "c|673|674|675", "l|676", "l|677", "l|678", "l|679", "l|680", "l|681", "l|682", "c|683|684|685", "c|686|687|688", "l|689", "l|690", "l|691", "l|692", "l|667"], 
                      ["m|693", "l|694", "l|695", "l|696", "l|697", "l|698", "l|699", "l|700", "l|701", "l|702", "l|703", "l|704", "l|705", "l|706", "l|707", "l|708", "l|693"], 
                      ["m|693", "l|694", "l|695", "l|696", "l|697", "l|698", "l|699", "l|700", "l|701", "l|702", "l|703", "l|704", "l|705", "l|706", "l|707", "l|708", "l|693"], 
                      ["m|693", "l|694", "l|695", "l|696", "l|697", "l|698", "l|699", "l|700", "l|701", "l|702", "l|703", "l|704", "l|705", "l|706", "l|707", "l|708", "l|693"], 
                      ["m|709", "c|710|711|712", "c|713|714|715", "c|716|717|718", "c|719|720|709"], 
                      ["m|721", "c|722|723|724", "c|725|726|727", "c|728|729|730", "c|731|732|721"], 
                      ["m|709", "c|710|711|712", "c|713|714|715", "c|716|717|718", "c|719|720|709"], 
                      ["m|721", "c|722|723|724", "c|725|726|727", "c|728|729|730", "c|731|732|721"], 
                      ["m|709", "c|710|711|712", "c|713|714|715", "c|716|717|718", "c|719|720|709"], 
                      ["m|721", "c|722|723|724", "c|725|726|727", "c|728|729|730", "c|731|732|721"], 
                      ["m|733", "l|734", "l|735", "l|736", "l|737", "l|738", "c|739|740|741", "c|742|743|744", "l|745", "l|746", "l|747", "l|748", "l|749", "l|750", "l|751", "l|752", "l|753", "l|754", "l|733"], 
                      ["m|755", "l|756", "c|757|758|759", "c|760|761|762", "l|763", "l|755"], 
                      ["m|733", "l|734", "l|735", "l|736", "l|737", "l|738", "c|739|740|741", "c|742|743|744", "l|745", "l|746", "l|747", "l|748", "l|749", "l|750", "l|751", "l|752", "l|753", "l|754", "l|733"], 
                      ["m|755", "l|756", "c|757|758|759", "c|760|761|762", "l|763", "l|755"], 
                      ["m|733", "l|734", "l|735", "l|736", "l|737", "l|738", "c|739|740|741", "c|742|743|744", "l|745", "l|746", "l|747", "l|748", "l|749", "l|750", "l|751", "l|752", "l|753", "l|754", "l|733"], 
                      ["m|755", "l|756", "c|757|758|759", "c|760|761|762", "l|763", "l|755"]
                 ];
 
 
   this.init();                    
  }
                     
  //****************************************************************************
  //                                                                          
  // 
  //****************************************************************************
 
  Main.OBJECT_NAME = 'main';
 
 
  //****************************************************************************
  //                                                                          
  // 
  //****************************************************************************
 
  Main.prototype = {
 
   //***************************************************************************
   //
   //***************************************************************************  
 
   init: function() {
    'use strict';
     
 
    var a, entries, self;
 
    self = this;
 
    if ( SVG && SVG.isAvailable() ) { 
 
     this.container = document.getElementById( this.containerId );
     this.utilities.removeChildrenContainer(this.container);
 
   
     this.svg = SVG.createSvg(
                              '100%',
                              '100%',
                              this.width,
                              this.height
                             );
     
     SVG.drawRectangle(
                       this.svg,
                       0,
                       0,
                       this.width,
                       this.height,
                       { 'pointer-events': 'none', 'fill': (255<<16)|(255<<8)|255 } 
                      );
 
     this.container.appendChild( this.svg );
 
     //*************************************************************************
     // 
     //*************************************************************************
 
     SVG.title(
               this.svg,
               'animated bezier curve animation'
              );
 
     //*************************************************************************
     // 
     //*************************************************************************
 
     this.resize();
 
     $(window).resize(function() { 
      self.resize();
     });
 
     //*************************************************************************
     // 
     //*************************************************************************
 
     this.svgRoot = document.createElementNS(
                                             SVG.NAME_SPACE,
                                             'g'
                                            );
 
     this.svgRoot.setAttribute( 'visibility', 'inherit' );  
     this.svgRoot.setAttribute( 'pointer-events', 'none' ); 
 
     this.svg.appendChild( this.svgRoot );
 
     //*************************************************************************
     // 
     //*************************************************************************
        
     this.path = document.createElementNS(
                                          SVG.NAME_SPACE,
                                          'path'
                                         );
 
     this.path.setAttribute( 'pointer-events', 'none' ); 
     this.path.setAttribute( 'fill', 'none' ); 
     this.path.setAttribute( 'stroke', 'black' );
     this.path.setAttribute( 'stroke-width', '2.0' );
     this.path.setAttribute( 'stroke-linecap', 'round' );
     this.path.setAttribute( 'pointer-events', 'none' ); 
     
     this.svgRoot.appendChild( this.path ); 
     
     //*************************************************************************
     // replace array content (indexes becomes outline object)                                                                         
     //*************************************************************************
 
     entries = this.lookupOutlines.length;
 
     for ( a = 0; a < entries; a += 1 ) {
      this.lookupOutlines[ a ] = new Outline( this.lookupOutlines[ a ] );
     }
 
     //*************************************************************************
     // 
     //*************************************************************************
  
     this.model.subscribe(
                          function( propName, propValue ) {
                           self.modelEventListener( propName, propValue );
                          },
                          'all'
                         );
 
     this.animate();
    }
   },
 
 
   //***************************************************************************
   //
   //***************************************************************************  
 
   resize: function() {
    'use strict';
   
    var scale, w, h, elm;
 
    elm = $('#' + this.containerId )
 
    if ( elm ) {  
     scale = this.height / this.width;
     w = elm.width();
     h = w * scale; 
    
     elm.css( { 'height': h + 'px' } );
    }
   },
   
 
   //***************************************************************************
   //
   //***************************************************************************  
 
   modelEventListener: function( 
                                propName,
                                propValue
                               ) {
    'use strict';
 
 
    switch ( propName ) {
     case 'event_request_update': 
      this.requestUpdate();
      break;
    }
   },
 
 
   //***************************************************************************
   //
   //***************************************************************************  
 
   requestUpdate: function() {
    'use strict';
       
    var self;
 
    if ( !this.flagRequestUpdate ) {
     this.flagRequestUpdate = true;
     self = this;   
     requestAnimFrame( function() { self.update(); } );
    }
   },
 
 
   //***************************************************************************
   //
   //***************************************************************************  
  
   update: function() {
    'use strict';
  
    this.flagRequestUpdate = false;
   // $( this.container ).css( { 'visibility': 'hidden' } );
    this.animate();
   // $( this.container ).css( { 'visibility': 'visible' } );
   },
 
 
   //***************************************************************************
   //
   //***************************************************************************
 
   animate: function() {
    'use strict';     
      
    var self;
 
    self = this;
    this.lambdaAnimation += this.flagToggle ? 0.025 : 0.005;
 
 
 
    if ( !this.flagEndOfAnimation ) {
     if ( this.lambdaAnimation > 1.0 ) {
      this.lambdaAnimation = 1.0;
      this.flagEndOfAnimation = true;
     }
 
 
     this.model.generateEvent( 'event_request_update' ); 
 
     this.render();
 
 
    }
 
    else {
 
     this.lambdaAnimation = 0.0;
     this.offsetAnimation += 0.13;
 
     if ( this.offsetAnimation >= 1.0 ) {  
      this.offsetAnimation -= 1.0;
     }
 
     this.flagEndOfAnimation = false;   
     this.flagToggle = !this.flagToggle;
 
     setTimeout(
                function(){
                 self.model.generateEvent( 'event_request_update' );
                },
                this.flagToggle ? 2000 : 500
               );
    }
   },
 
 
   /****************************************************************************/
   /*                                                                          */
   /****************************************************************************/
 
   render: function() {
    'use strict';     
      
    var a, entries, lookupOutlinesLocal, lookupPath, path;
 
    lookupOutlinesLocal = this.lookupOutlines;
    entries             = lookupOutlinesLocal.length;
    lookupPath          = [];
    
    for ( a = 0; a < entries; a += 1 ) {
     lookupPath[ a ] = lookupOutlinesLocal[ a ].getPath(
                                                        (this.flagToggle ? 1.0 : 0.0 ) + this.lambdaAnimation,
                                                        this.offsetAnimation
                                                       );
    } 
 
    path = lookupPath.join('');
 
    // chrome generates error is path is empty
 
    if ( path === '' ){
     this.path.setAttribute( 'd', 'M0 0' ); 
    } else {
     this.path.setAttribute( 'd' , path ); 
    }
 
   }
  };
 
 
 
  //****************************************************************************
  //
  //
  //****************************************************************************
 
  function Outline(
                   lookup
                  ) { 
   'use strict';
 
   var errorMsg;
 
   //***************************************************************************
   // check dependancies                                                                           
   //***************************************************************************
 
   if ( !(this instanceof Outline) ||
        !utilities ) {
 
    errorMsg = '';
 
    if ( !(this instanceof Outline) ) { errorMsg += 'use \'new\' for Outline...\n'; }
    if ( !utilities ) { errorMsg += '\'utilities\' not present...\n'; }
 
    if ( errorMsg !== '' ) {
     throw new Error('- ' + Outline.OBJECT_NAME + ' ----\n' + errorMsg); 
    }
   }
 
 
   this.utilities = utilities;
   this.lookupBezierCurves = [];
   this.totalLength = 0.0;
 
   this.init( lookup );
  }
 
 
  //****************************************************************************
  //
  //
  //****************************************************************************
 
  Outline.OBJECT_NAME = 'outline';
  Outline.LENGTH_NUMBER_OF_SAMPLE_POSITION = 100;  
 
  Outline.uniquePositions = [
                            [192.89,124.35], [183.98,124.35], [189.67,107.81], [215.87,107.81], [221.24,124.35], [212.22,124.35], [212.22,133.47], [240.36,133.47], [240.79,133.47], [270.32,133.47], [270.32,124.35], [259.80,124.35], [259.80,71.94], [260.01,71.94], [294.59,134.22], [306.08,134.22], [306.08,69.69], [316.82,69.69], [316.82,60.56], [286.86,60.56], [286.86,69.69], [297.06,69.69], [297.06,117.26], [296.84,117.26], [265.27,60.56], [240.36,60.56], 
                             [240.36,69.69], [250.78,69.69], [250.78,124.35], [240.79,124.35], [240.36,124.35], [232.63,124.35], [212.97,68.72], [221.57,68.72], [221.57,60.56], [184.30,60.56], [184.30,68.72], [192.89,68.72], [172.92,124.35], [164.12,124.35], [164.12,133.47], [192.89,133.47], [202.45,68.72], [203.42,68.72], [213.08,99.33], [192.36,99.33], [347.31,124.35], [339.37,124.35], [339.37,69.69], [347.31,69.69], [347.31,60.56], 
                             [320.47,60.56], [320.47,69.69], [328.41,69.69], [328.41,124.35], [320.47,124.35], [320.47,133.47], [347.31,133.47], [379.10,124.35], [371.26,124.35], [371.26,69.69], [371.47,69.69], [396.06,134.22], [398.21,134.22], [423.02,69.58], [423.23,69.58], [423.23,124.35], [415.39,124.35], [415.39,133.47], [442.13,133.47], [442.13,124.35], [433.33,124.35], [433.33,69.69], [442.13,69.69], [442.13,60.56], [416.68,60.56], 
                             [397.46,110.49], [378.45,60.56], [353.33,60.56], [353.33,69.69], [362.24,69.69], [362.24,124.35], [353.33,124.35], [353.33,133.47], [379.10,133.47], [472.63,124.35], [463.72,124.35], [469.41,107.81], [495.61,107.81], [500.98,124.35], [491.96,124.35], [491.96,133.47], [520.52,133.47], [520.52,124.35], [512.36,124.35], [492.71,68.72], [501.30,68.72], [501.30,60.56], [464.04,60.56], [464.04,68.72], [472.63,68.72], 
                             [452.66,124.35], [443.85,124.35], [443.85,133.47], [472.63,133.47], [482.19,68.72], [483.16,68.72], [492.82,99.33], [472.10,99.33], [527.72,69.69], [542.76,69.69], [542.76,124.35], [533.20,124.35], [533.20,133.47], [563.26,133.47], [563.26,124.35], [553.71,124.35], [553.71,69.69], [568.74,69.69], [568.74,88.27], [577.76,88.27], [577.76,60.56], [518.70,60.56], [518.70,88.27], [527.72,88.27], [642.51,111.03], 
                             [633.50,111.03], [633.50,124.35], [602.46,124.35], [602.46,100.51], [629.52,100.51], [629.52,91.38], [602.46,91.38], [602.46,69.69], [633.50,69.69], [633.50,82.47], [642.51,82.47], [642.51,60.56], [582.06,60.56], [582.06,69.69], [591.51,69.69], [591.51,124.35], [582.06,124.35], [582.06,133.47], [642.51,133.47], [718.97,96.32], [718.97,78.82], [710.06,60.56], [681.82,60.56], [647.57,60.56], [647.57,69.69], 
                             [657.44,69.69], [657.44,124.35], [647.57,124.35], [647.57,133.47], [680.85,133.47], [707.05,133.47], [718.97,119.84], [668.40,69.69], [681.50,69.69], [700.07,69.69], [707.81,81.07], [707.81,96.64], [707.81,112.00], [701.47,124.35], [681.28,124.35], [668.40,124.35], [45.85,182.67], [51.54,179.88], [54.87,174.29], [54.87,167.20], [54.87,157.75], [48.74,148.41], [32.53,148.41], [3.00,148.41], [3.00,157.54], 
                             [11.91,157.54], [11.91,212.20], [3.00,212.20], [3.00,221.32], [31.56,221.32], [53.79,221.32], [58.52,208.98], [58.52,200.60], [58.52,192.01], [53.90,185.46], [22.87,157.54], [29.74,157.54], [39.40,157.54], [43.70,160.76], [43.70,167.96], [43.70,173.65], [40.91,178.80], [31.03,178.80], [22.87,178.80], [31.46,212.20], [22.87,212.20], [22.87,187.93], [31.67,187.93], [44.13,187.93], [47.24,193.83], 
                             [47.24,199.85], [47.24,207.79], [42.84,212.20], [108.88,125.00], [94.38,125.00], [86.97,141.65], [93.74,141.65], [126.60,198.88], [117.58,198.88], [117.58,212.20], [86.54,212.20], [86.54,188.36], [113.60,188.36], [113.60,179.23], [86.54,179.23], [86.54,157.54], [117.58,157.54], [117.58,170.32], [126.60,170.32], [126.60,148.41], [66.14,148.41], [66.14,157.54], [75.59,157.54], [75.59,212.20], [66.14,212.20], 
                             [66.14,221.32], [126.60,221.32], [187.16,198.13], [178.14,198.13], [178.14,212.20], [146.14,212.20], [185.98,156.47], [185.98,148.41], [134.65,148.41], [134.65,170.32], [143.67,170.32], [143.67,157.54], [172.02,157.54], [132.94,212.20], [132.94,221.32], [187.16,221.32], [220.88,157.54], [220.88,148.41], [194.04,148.41], [194.04,157.54], [201.98,157.54], [201.98,212.20], [194.04,212.20], [194.04,221.32], [220.88,221.32], 
                             [220.88,212.20], [212.94,212.20], [212.94,157.54], [287.78,170.32], [287.78,148.41], [227.33,148.41], [227.33,157.54], [236.77,157.54], [236.77,212.20], [227.33,212.20], [227.33,221.32], [287.78,221.32], [287.78,198.88], [278.76,198.88], [278.76,212.20], [247.73,212.20], [247.73,188.36], [274.79,188.36], [274.79,179.23], [247.73,179.23], [247.73,157.54], [278.76,157.54], [278.76,170.32], [349.74,167.42], [349.74,156.36], 
                             [342.98,148.41], [326.55,148.41], [292.83,148.41], [292.83,157.54], [302.82,157.54], [302.82,212.20], [292.83,212.20], [292.83,221.32], [323.22,221.32], [323.22,212.20], [313.77,212.20], [313.77,187.18], [324.19,187.18], [340.72,221.32], [356.51,221.32], [356.51,212.20], [347.59,212.20], [334.71,185.67], [344.48,183.20], [349.74,176.76], [326.12,178.05], [313.77,178.05], [313.77,157.54], [327.09,157.54], [334.06,157.54], 
                             [338.58,160.98], [338.58,167.42], [338.58,172.25], [336.43,178.05], [459.60,196.95], [450.04,191.69], [446.39,206.08], [434.90,212.63], [425.02,212.63], [410.63,212.63], [399.79,200.49], [399.79,184.60], [399.79,168.49], [410.09,156.90], [424.59,156.90], [434.90,156.90], [443.92,162.59], [448.11,171.82], [457.56,171.82], [457.56,148.41], [448.11,148.41], [448.11,155.07], [441.77,150.02], [433.29,147.23], [424.06,147.23], 
                             [402.15,147.23], [387.76,162.27], [387.76,184.92], [387.76,207.04], [402.69,222.51], [424.27,222.51], [441.88,222.51], [455.30,212.84], [501.69,222.51], [513.29,222.51], [526.93,218.32], [526.93,199.53], [526.93,157.54], [536.06,157.54], [536.06,148.41], [507.49,148.41], [507.49,157.54], [515.98,157.54], [515.98,198.88], [515.98,209.08], [511.68,213.70], [500.83,213.70], [492.57,213.70], [486.23,210.16], [486.23,199.74], 
                             [486.23,157.54], [494.71,157.54], [494.71,148.41], [466.15,148.41], [466.15,157.54], [475.28,157.54], [475.28,199.42], [475.28,211.88], [480.65,222.51], [570.20,187.18], [586.74,221.32], [602.52,221.32], [602.52,212.20], [593.61,212.20], [580.73,185.67], [590.50,183.20], [595.76,176.76], [595.76,167.42], [595.76,156.36], [589.00,148.41], [572.57,148.41], [538.85,148.41], [538.85,157.54], [548.84,157.54], [548.84,212.20], 
                             [538.85,212.20], [538.85,221.32], [569.24,221.32], [569.24,212.20], [559.79,212.20], [559.79,187.18], [559.79,157.54], [573.10,157.54], [580.08,157.54], [584.59,160.98], [584.59,167.42], [584.59,172.25], [582.45,178.05], [572.14,178.05], [559.79,178.05], [633.35,222.08], [643.55,222.08], [667.60,157.54], [676.51,157.54], [676.51,148.41], [648.49,148.41], [648.49,157.54], [656.97,157.54], [638.82,206.51], [620.25,157.54], 
                             [628.73,157.54], [628.73,148.41], [599.95,148.41], [599.95,157.54], [608.97,157.54], [739.66,170.32], [739.66,148.41], [679.20,148.41], [679.20,157.54], [688.65,157.54], [688.65,212.20], [679.20,212.20], [679.20,221.32], [739.66,221.32], [739.66,198.88], [730.64,198.88], [730.64,212.20], [699.60,212.20], [699.60,188.36], [726.66,188.36], [726.66,179.23], [699.60,179.23], [699.60,157.54], [730.64,157.54], [730.64,170.32], 
                             [790.77,185.35], [787.70,182.28], [783.45,180.46], [779.00,179.10], [779.75,177.92], [780.20,176.52], [780.20,175.01], [780.20,170.81], [776.80,167.40], [772.59,167.40], [768.39,167.40], [764.98,170.81], [764.98,175.01], [764.98,175.12], [765.01,175.22], [765.02,175.33], [762.55,174.50], [760.47,173.52], [759.09,172.14], [757.59,170.64], [756.63,168.39], [756.63,165.92], [756.63,160.33], [761.46,156.57], [768.87,156.57], 
                             [775.52,156.57], [780.36,159.26], [784.33,165.06], [784.33,170.10], [793.35,170.10], [793.35,148.09], [784.33,148.09], [784.33,152.92], [779.39,149.16], [773.81,147.23], [768.01,147.23], [757.06,147.23], [746.75,153.67], [746.75,167.20], [746.75,173.33], [748.78,177.62], [751.58,180.41], [755.59,184.42], [761.02,186.40], [766.38,187.92], [759.99,206.96], [758.59,205.36], [757.25,203.51], [755.98,201.35], [755.98,194.91], 
                             [746.96,194.91], [746.96,221.32], [755.17,221.32], [722.11,319.91], [722.15,299.61], [711.45,284.42], [690.38,275.36], [664.59,264.27], [623.46,262.97], [577.03,270.99], [577.03,245.39], [586.27,245.39], [586.27,236.26], [556.41,236.26], [556.41,245.39], [566.08,245.39], [566.08,273.04], [557.58,274.75], [548.93,276.75], [540.19,279.06], [527.96,244.42], [536.54,244.42], [536.54,236.26], [499.28,236.26], [499.28,244.42], 
                             [507.87,244.42], [489.45,295.72], [485.03,297.48], [480.72,299.28], [476.52,301.14], [476.52,300.05], [468.57,300.05], [468.57,245.39], [476.52,245.39], [476.52,236.26], [449.67,236.26], [449.67,245.39], [457.62,245.39], [457.62,300.05], [449.67,300.05], [449.67,309.17], [459.61,309.17], [427.66,325.49], [404.36,344.39], [394.45,363.04], [387.55,376.03], [384.42,393.96], [400.52,412.85], [266.63,326.87], [266.90,326.09], 
                             [267.08,325.27], [267.08,324.40], [267.08,320.19], [263.68,316.79], [259.47,316.79], [255.28,316.79], [251.86,320.19], [251.86,324.40], [251.86,328.60], [255.28,332.01], [259.47,332.01], [261.51,332.01], [263.35,331.19], [264.71,329.89], [413.44,425.40], [412.95,426.60], [412.67,427.91], [412.67,429.29], [412.67,434.90], [417.21,439.44], [422.82,439.44], [428.41,439.44], [432.96,434.90], [432.96,429.29], [432.96,423.68], 
                             [428.41,419.15], [422.82,419.15], [420.02,419.15], [417.49,420.28], [415.65,422.10], [392.73,404.62], [386.65,385.35], [397.61,364.72], [407.86,345.45], [433.04,325.82], [467.58,309.17], [476.52,309.17], [476.52,305.04], [477.37,304.65], [478.23,304.27], [479.10,303.90], [479.10,309.17], [507.87,309.17], [507.87,300.05], [498.96,300.05], [500.61,295.26], [509.50,291.99], [518.77,288.91], [528.38,286.08], [529.39,285.78], 
                             [530.40,285.50], [531.41,285.21], [536.22,300.05], [527.20,300.05], [527.20,309.17], [555.77,309.17], [555.77,300.05], [547.60,300.05], [541.39,282.45], [549.72,280.25], [557.97,278.33], [566.08,276.69], [566.08,300.05], [556.41,300.05], [556.41,309.17], [609.89,309.17], [609.89,275.24], [599.79,275.24], [599.79,300.05], [577.03,300.05], [577.03,274.61], [623.01,266.57], [663.64,267.76], [688.97,278.65], [713.34,289.13], 
                             [722.71,307.64], [716.93,333.76], [716.61,333.73], [716.29,333.71], [715.96,333.71], [710.36,333.71], [705.82,338.25], [705.82,343.85], [705.82,349.46], [710.36,354.00], [715.96,354.00], [721.57,354.00], [726.11,349.46], [726.11,343.85], [726.11,340.01], [723.98,336.68], [720.84,334.95], [759.94,218.38], [764.20,221.14], [768.87,222.51], [773.91,222.51], [787.12,222.51], [797.00,213.38], [797.00,201.03], [797.00,195.12], 
                             [794.64,189.22], [517.43,244.42], [518.40,244.42], [528.06,275.03], [507.34,275.03], [504.65,283.51], [524.51,283.51], [516.82,285.83], [509.34,288.30], [502.10,290.91], [755.98,218.91], [755.98,215.31], [756.29,215.59], [756.61,215.84], [756.92,216.11], [772.95,213.38], [769.15,213.38], [765.83,212.09], [762.85,209.70], [769.84,188.85], [778.36,191.09], [785.83,192.98], [785.83,201.14], [785.83,208.12], [780.36,213.38], 
                             [102.39,263.97], [111.41,263.97], [111.41,245.39], [126.45,245.39], [126.45,300.05], [116.89,300.05], [116.89,309.17], [146.96,309.17], [146.96,300.05], [137.40,300.05], [137.40,245.39], [152.43,245.39], [152.43,263.97], [161.45,263.97], [161.45,236.26], [102.39,236.26], [205.48,245.39], [213.96,245.39], [213.96,286.73], [213.96,296.93], [209.67,301.55], [198.82,301.55], [190.56,301.55], [184.22,298.01], [184.22,287.59], 
                             [184.22,245.39], [192.70,245.39], [192.70,236.26], [164.14,236.26], [164.14,245.39], [173.27,245.39], [173.27,287.27], [173.27,299.72], [178.64,310.35], [199.68,310.35], [211.28,310.35], [224.92,306.17], [224.92,287.37], [224.92,245.39], [234.04,245.39], [234.04,236.26], [205.48,236.26], [251.12,300.05], [251.12,309.17], [281.19,309.17], [281.19,300.05], [271.63,300.05], [271.63,245.39], [286.66,245.39], [286.66,263.97], 
                             [295.68,263.97], [295.68,236.26], [236.62,236.26], [236.62,263.97], [245.64,263.97], [245.64,245.39], [260.68,245.39], [260.68,300.05], [300.73,272.77], [300.73,294.78], [316.41,310.35], [338.42,310.35], [360.33,310.35], [376.11,294.68], [376.11,272.77], [376.11,250.87], [360.33,235.08], [338.42,235.08], [316.52,235.08], [300.73,250.76], [364.09,272.77], [364.09,288.45], [352.92,300.69], [338.42,300.69], [323.93,300.69], 
                             [312.76,288.45], [312.76,272.77], [312.76,256.99], [323.93,244.74], [338.42,244.74], [352.92,244.74], [364.09,256.99], [414.24,275.03], [430.77,309.17], [446.56,309.17], [446.56,300.05], [437.65,300.05], [424.76,273.52], [434.53,271.05], [439.79,264.61], [439.79,255.27], [439.79,244.21], [433.03,236.26], [416.60,236.26], [382.88,236.26], [382.88,245.39], [392.87,245.39], [392.87,300.05], [382.88,300.05], [382.88,309.17], 
                             [413.27,309.17], [413.27,300.05], [403.82,300.05], [403.82,275.03], [403.82,245.39], [417.13,245.39], [424.11,245.39], [428.62,248.82], [428.62,255.27], [428.62,260.10], [426.48,265.90], [416.17,265.90], [403.82,265.90]
                            ];
 
    
  //****************************************************************************
  //
  //
  //****************************************************************************
 
  Outline.prototype = {
 
   //***************************************************************************
   //
   //***************************************************************************
 
   init: function( lookup ) {
    'use strict';
 
    var a, i0, i1, i2, i3, obj, entries, lookupIndexes, type, indexPrevious;
 
 
    entries = lookup.length;
 
    //**************************************************************************
    // check for presence
    //**************************************************************************
     
    if ( entries === 0 ) {
     throw new Error( '- ' + Outline.OBJECT_NAME + ' ----\n array is empty... ' ); 
    }
    
    //**************************************************************************
    // init bezier curve
    //**************************************************************************
 
    else {
    
     for ( a = 0; a < entries; a += 1 ) {
 
      lookupIndexes = lookup[ a ].split( '|' );
      type          = lookupIndexes[ 0 ];
       
      if ( type !== 'm' ) {      
 
       //***********************************************************************
       // linear bezier
       //***********************************************************************
 
       if ( type === 'l'  && lookupIndexes.length === 2 ) {
           
        i0 = parseInt( indexPrevious     , 10 ); 
        i1 = parseInt( lookupIndexes[ 1 ], 10 );
           
        obj = new BezierLinear(
                               Outline.uniquePositions[ i0 ][ 0 ],
                               Outline.uniquePositions[ i0 ][ 1 ],
                               Outline.uniquePositions[ i1 ][ 0 ],
                               Outline.uniquePositions[ i1 ][ 1 ]
                              );
 
        this.totalLength += obj.getLength();
        this.lookupBezierCurves[ this.lookupBezierCurves.length ] = obj;
       } 
 
       //***********************************************************************
       // quadratic bezier
       //***********************************************************************
 
       else if ( type === 'q' && lookupIndexes.length === 3 ) {
 
        i0 = parseInt( indexPrevious     , 10 ); 
        i1 = parseInt( lookupIndexes[ 1 ], 10 );    
        i2 = parseInt( lookupIndexes[ 2 ], 10 );    
 
        obj = new BezierQuadratic(
                                  Outline.uniquePositions[ i0 ][ 0 ],
                                  Outline.uniquePositions[ i0 ][ 1 ],
                                  Outline.uniquePositions[ i1 ][ 0 ],
                                  Outline.uniquePositions[ i1 ][ 1 ],
                                  Outline.uniquePositions[ i2 ][ 0 ],
                                  Outline.uniquePositions[ i2 ][ 1 ]
                                 );
 
        this.totalLength += obj.getLength();
        this.lookupBezierCurves[ this.lookupBezierCurves.length ] = obj; 
       }
 
 
       //***********************************************************************
       // cubic bezier
       //***********************************************************************
 
       else if ( type === 'c' && lookupIndexes.length === 4 ) {
           
        i0 = parseInt( indexPrevious     , 10 ); 
        i1 = parseInt( lookupIndexes[ 1 ], 10 );    
        i2 = parseInt( lookupIndexes[ 2 ], 10 );    
        i3 = parseInt( lookupIndexes[ 3 ], 10 );    
 
        obj = new BezierCubic(
                              Outline.uniquePositions[ i0 ][ 0 ],
                              Outline.uniquePositions[ i0 ][ 1 ],
                              Outline.uniquePositions[ i1 ][ 0 ],
                              Outline.uniquePositions[ i1 ][ 1 ],
                              Outline.uniquePositions[ i2 ][ 0 ],
                              Outline.uniquePositions[ i2 ][ 1 ],
                              Outline.uniquePositions[ i3 ][ 0 ],
                              Outline.uniquePositions[ i3 ][ 1 ]     
                             );
 
        this.totalLength += obj.getLength();
        this.lookupBezierCurves[ this.lookupBezierCurves.length ] = obj;  
       }
                             
       //***********************************************************************
       // unknown
       //***********************************************************************
           
       else {
        throw new Error( '- ' + Outline.OBJECT_NAME + ' ----\n unknown type (' + type + ')... ' ); 
       }
      }
                                      
      indexPrevious = parseInt( lookupIndexes[ lookupIndexes.length - 1 ], 10 );
     }
    }
   },
 
 
   //***************************************************************************
   //
   //***************************************************************************
 
   getPath: function(
                     lambdaAnimation,
                     offsetAnimation
                    ) { 
    'use strict';
 
 
    var a, index, lambdaStart, lambdaEnd, totalLength, length, start, end, lookup, path,
        flag, entries, tmp, lookupPath, path, flagInside, lengthOutline, positionStart, positionEnd;
 
 
    totalLength  = this.totalLength;
    flagInside   = true;
    lookupPath   = [];
 
    if ( lambdaAnimation < 1.0 ) {
     start        = lambdaAnimation + offsetAnimation;
     start        = start - Math.floor( start );
     end          = start + lambdaAnimation  ;
    } else {
     start        = lambdaAnimation ;
     start        = (start - Math.floor( start ) ) * 0.75;
     end          = start +  2.0 - lambdaAnimation ;
    }
 
 
    if ( end > 1.0 ) {
     end -= 1.0;
    } 
 
    start *= totalLength;
    end   *= totalLength;
 
    if ( start > end ) { 
     tmp   = start;
     start = end;
     end   = tmp;
     flagInside = false;
    }
 
    lookup       = this.lookupBezierCurves;   
    entries      = lookup.length;
    path         = '';
    lengthOutline = 0.0;
 
    for ( a = 0; a < entries; a += 1 ) {
 
     index         = a % entries;
     length        = lookup[ index ].getLength();
     positionStart = lengthOutline;
     positionEnd   = lengthOutline + length;
 
     //*************************************************************************
     // 
     // position 'inside'
     //
     // ------##################-----
     //  ---                     ---  not relevant; completly outside segment
     //   -------------------------   modification required
     //      ---              ---     modification required
     //              ---              use without modification
     //
     //*************************************************************************
 
     if( flagInside &&
         !( positionEnd < start || positionStart > end ) ) {
 
      lambdaStart = 0.0;
      lambdaEnd   = 1.0;
 
      if ( positionStart < start ) { 
       lambdaStart = ( start - positionStart ) / length;
      }
    
      if ( positionEnd > end ) { 
       lambdaEnd = ( end - positionStart ) / length;
      }
 
      if( lambdaStart < lambdaEnd ) {
        lookupPath [ lookupPath.length ] = lookup[ index ].getPath(
                                                            lambdaStart,
                                                            lambdaEnd
                                                           );
      }
     }
 
     //*************************************************************************
     // 
     // position 'outside'
     //
     // ------##################-----
     //  ---                     ---  use without modification
     //   -------------------------   modification required; two segments
     //      ---              ---     modification required
     //              ---              not relevant; completly inside segment
     //
     //*************************************************************************
 
     else if( !flagInside &&
              !( positionStart > start && positionEnd < end ) ) {
 
 
      if( positionStart < start && positionEnd > end ) { 
 
       lambdaStart = 0.0;
       lambdaEnd   = ( start - positionStart ) / length;
 
       if ( lambdaStart < lambdaEnd ) {
        lookupPath [ lookupPath.length ] = lookup[ index ].getPath(
                                        lambdaStart,
                                        lambdaEnd
                                       );
       }
 
       lambdaStart = ( end - positionStart ) / length;
       lambdaEnd   = 1.0;
 
       if ( lambdaStart < lambdaEnd ) {
        lookupPath [ lookupPath.length ] = lookup[ index ].getPath(
                                                            lambdaStart,
                                                            lambdaEnd
                                                           );
       }
      }
 
      else {
 
       lambdaStart = 0.0;
       lambdaEnd   = 1.0;
 
              if ( positionStart < start  ) {  
        lambdaEnd = ( start - positionStart ) / length;
       } else if ( positionStart < end  ) { 
        lambdaStart = ( end - positionStart ) / length;
       }
 
       if ( lambdaStart < lambdaEnd ) {
        lookupPath [ lookupPath.length ] = lookup[ index ].getPath(
                                                            lambdaStart,
                                                            lambdaEnd
                                                           );
       }
      }
     }
 
     //*************************************************************************
     //
     //*************************************************************************
 
     lengthOutline += length; 
    }
 
 
    return lookupPath.join('');
   }
  };
  
 
 
 
  /*
   * public methods
   */
 
   initBezierCurves = function(
                               containerName,
                               width,
                               height
                              ) {
 
    'use strict';
 
    var main = new Main(
                        containerName,
                        width,
                        height
                       );
   };
 
   return {
           initBezierCurves : initBezierCurves
          };
 
 
 
 


}(this, document));

