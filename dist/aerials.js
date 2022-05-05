/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(1);

	var BASE_STYLE = 'mapbox://styles/rvilim/cjg87z8j1068k2sp653i9xpbm?fresh=true';

	// TODO(danvk): show minor roads depending on zoom level, building names.
	/* global mapboxgl */

	var LABEL_LAYERS = ['road_major', 'road_major_label', 'poi_label', 'bridge_major', 'bridge_minor'];
	var YEARS = [1947, 1983, 1985, 1987, 1989, 1991, 1992, 2018];

	mapboxgl.accessToken = 'pk.eyJ1IjoibnRocnNuIiwiYSI6ImNraW1yeHdoaTB3NzgycHE5d3VmaGk2cXoifQ.IP0DPIuQX6LEdakdEodv6Q';

	var map = new mapboxgl.Map({
	  container: 'map',
	  style: BASE_STYLE,
	  center: [-79.3738487, 43.6486135],
	  zoom: 13
	});
	map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'bottom-right');
	map.addControl(new mapboxgl.GeolocateControl({
	  positionOptions: {
	    enableHighAccuracy: true
	  }
	}), 'bottom-right');

	var map2 = new mapboxgl.Map({
	  container: 'map2',
	  style: BASE_STYLE,
	  center: [-79.3738487, 43.6486135],
	  zoom: 13
	});

	new mapboxgl.Compare(map, map2, {
	  // mousemove: true // Optional. Set to true to enable swiping during cursor movement.
	});

	var marker = void 0;

	map.on('load', function () {
	  window.map = map;

	  map.setLayoutProperty('Satellite', 'visibility', 'none');
	  var _iteratorNormalCompletion = true;
	  var _didIteratorError = false;
	  var _iteratorError = undefined;

	  try {
	    for (var _iterator = YEARS[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	      var year = _step.value;

	      map.setPaintProperty('' + year, 'raster-fade-duration', 0);
	      map2.setPaintProperty('' + year, 'raster-fade-duration', 0);
	    }
	  } catch (err) {
	    _didIteratorError = true;
	    _iteratorError = err;
	  } finally {
	    try {
	      if (!_iteratorNormalCompletion && _iterator.return) {
	        _iterator.return();
	      }
	    } finally {
	      if (_didIteratorError) {
	        throw _iteratorError;
	      }
	    }
	  }

	  showYear('1947', map);
	  showYear('2018', map2);
	});

	function showYear(year, map) {
	  var newLayer = '' + year;

	  $('#year').text(year);
	  var currentLayer = newLayer;
	  map.setLayoutProperty(currentLayer, 'visibility', 'visible');
	  map.moveLayer(currentLayer, 'landuse_overlay_national_park'); // move to, below labels
	  var _iteratorNormalCompletion2 = true;
	  var _didIteratorError2 = false;
	  var _iteratorError2 = undefined;

	  try {
	    for (var _iterator2 = YEARS[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	      var _year = _step2.value;

	      var layer = '' + _year;
	      if (layer !== currentLayer) {
	        map.setLayoutProperty(layer, 'visibility', 'none');
	      }
	    }
	  } catch (err) {
	    _didIteratorError2 = true;
	    _iteratorError2 = err;
	  } finally {
	    try {
	      if (!_iteratorNormalCompletion2 && _iterator2.return) {
	        _iterator2.return();
	      }
	    } finally {
	      if (_didIteratorError2) {
	        throw _iteratorError2;
	      }
	    }
	  }
	}

	var labelsVisible = false;
	function setLabelVisibility() {
	  var visibility = labelsVisible ? 'visible' : 'none';
	  var _iteratorNormalCompletion3 = true;
	  var _didIteratorError3 = false;
	  var _iteratorError3 = undefined;

	  try {
	    for (var _iterator3 = LABEL_LAYERS[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
	      var label = _step3.value;

	      map.setLayoutProperty(label, 'visibility', visibility);
	      map2.setLayoutProperty(label, 'visibility', visibility);
	    }
	  } catch (err) {
	    _didIteratorError3 = true;
	    _iteratorError3 = err;
	  } finally {
	    try {
	      if (!_iteratorNormalCompletion3 && _iterator3.return) {
	        _iterator3.return();
	      }
	    } finally {
	      if (_didIteratorError3) {
	        throw _iteratorError3;
	      }
	    }
	  }
	}

	$('#year-select').on('change', function () {
	  var year = $(this).val();
	  showYear(year, map);
	});

	$('#show-labels').on('change', function () {
	  labelsVisible = $(this).is(':checked');
	  setLabelVisibility();
	});

	$('#location-search').on('keypress', function (e) {
	  if (e.which !== 13) return;

	  document.activeElement.blur(); // hides keyboard for kiosk

	  var address = $(this).val();
	  $.getJSON('https://maps.googleapis.com/maps/api/geocode/json', {
	    address: address,
	    key: 'AIzaSyCS3o6gGDBx16T0OQtb_2wJRuxlcFjfnyA',
	    // This is a bit tight to avoid a bug with how Google geocodes "140 Yonge".
	    bounds: '43.598284,-79.448761|43.712376, -79.291565'
	  }).done(function (response) {
	    var latLng = response.results[0].geometry.location;
	    if (marker) {
	      marker.setMap(null);
	    }

	    var lng = latLng.lng,
	        lat = latLng.lat;

	    marker = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map);

	    map.setCenter([lng, lat]);
	    map.setZoom(15);
	  }).fail(function (e) {
	    console.error(e);
	    ga('send', 'event', 'link', 'address-search-fail');
	  });
	});

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	/* global mapboxgl */

	var syncMove = __webpack_require__(2);
	var EventEmitter = __webpack_require__(3).EventEmitter;

	function Compare(a, b, options) {
	  this.options = options ? options : {};
	  this._onDown = this._onDown.bind(this);
	  this._onMove = this._onMove.bind(this);
	  this._onMouseUp = this._onMouseUp.bind(this);
	  this._onTouchEnd = this._onTouchEnd.bind(this);
	  this._ev = new EventEmitter();
	  this._swiper = document.createElement('div');
	  this._swiper.className = 'compare-swiper';

	  this._container = document.createElement('div');
	  this._container.className = 'mapboxgl-compare';
	  this._container.appendChild(this._swiper);

	  a.getContainer().appendChild(this._container);

	  this._clippedMap = b;
	  this._bounds = b.getContainer().getBoundingClientRect();
	  this._setPosition(this._bounds.width / 2);
	  syncMove(a, b);

	  b.on(
	    'resize',
	    function() {
	      this._bounds = b.getContainer().getBoundingClientRect();
	      if (this.currentPosition) this._setPosition(this.currentPosition);
	    }.bind(this)
	  );

	  if (this.options && this.options.mousemove) {
	    a.getContainer().addEventListener('mousemove', this._onMove);
	    b.getContainer().addEventListener('mousemove', this._onMove);
	  }

	  this._swiper.addEventListener('mousedown', this._onDown);
	  this._swiper.addEventListener('touchstart', this._onDown);
	}

	Compare.prototype = {
	  _setPointerEvents: function(v) {
	    this._container.style.pointerEvents = v;
	    this._swiper.style.pointerEvents = v;
	  },

	  _onDown: function(e) {
	    if (e.touches) {
	      document.addEventListener('touchmove', this._onMove);
	      document.addEventListener('touchend', this._onTouchEnd);
	    } else {
	      document.addEventListener('mousemove', this._onMove);
	      document.addEventListener('mouseup', this._onMouseUp);
	    }
	  },

	  _setPosition: function(x) {
	    x = Math.min(x, this._bounds.width);
	    var pos = 'translate(' + x + 'px, 0)';
	    this._container.style.transform = pos;
	    this._container.style.WebkitTransform = pos;
	    this._clippedMap.getContainer().style.clip =
	      'rect(0, 999em, ' + this._bounds.height + 'px,' + x + 'px)';
	    this.currentPosition = x;
	  },

	  _onMove: function(e) {
	    if (this.options && this.options.mousemove) {
	      this._setPointerEvents(e.touches ? 'auto' : 'none');
	    }

	    this._setPosition(this._getX(e));
	  },

	  _onMouseUp: function() {
	    document.removeEventListener('mousemove', this._onMove);
	    document.removeEventListener('mouseup', this._onMouseUp);
	    this.fire('slideend', { currentPosition: this.currentPosition });
	  },

	  _onTouchEnd: function() {
	    document.removeEventListener('touchmove', this._onMove);
	    document.removeEventListener('touchend', this._onTouchEnd);
	  },

	  _getX: function(e) {
	    e = e.touches ? e.touches[0] : e;
	    var x = e.clientX - this._bounds.left;
	    if (x < 0) x = 0;
	    if (x > this._bounds.width) x = this._bounds.width;
	    return x;
	  },

	  setSlider: function(x) {
	    this._setPosition(x);
	  },

	  on: function(type, fn) {
	    this._ev.on(type, fn);
	    return this;
	  },

	  fire: function(type, data) {
	    this._ev.emit(type, data);
	    return this;
	  },

	  off: function(type, fn) {
	    this._ev.removeListener(type, fn);
	    return this;
	  }
	};

	if (window.mapboxgl) {
	  mapboxgl.Compare = Compare;
	} else if (true) {
	  module.exports = Compare;
	}


/***/ }),
/* 2 */
/***/ (function(module, exports) {

	function moveToMapPosition(referenceMap, mapToMove) {
	  mapToMove.jumpTo({
	    center: referenceMap.getCenter(),
	    zoom: referenceMap.getZoom(),
	    bearing: referenceMap.getBearing(),
	    pitch: referenceMap.getPitch()
	  });
	}

	// Sync movements of two maps.
	//
	// All interactions that result in movement end up firing
	// a "move" event. The trick here, though, is to
	// ensure that movements don't cycle from one map
	// to the other and back again, because such a cycle
	// - could cause an infinite loop
	// - prematurely halts prolonged movements like
	//   double-click zooming, box-zooming, and flying
	function syncMaps(a, b) {
	  on();

	  function on() {
	    a.on('move', a2b);
	    b.on('move', b2a);
	  }
	  function off() {
	    a.off('move', a2b);
	    b.off('move', b2a);
	  }

	  // When one map moves, we turn off the movement listeners
	  // on the both maps, move it, then turn the listeners on again
	  function a2b() {
	    off();
	    moveToMapPosition(a, b);
	    on();
	  }
	  function b2a() {
	    off();
	    moveToMapPosition(b, a);
	    on();
	  }
	}

	module.exports = syncMaps;


/***/ }),
/* 3 */
/***/ (function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	function EventEmitter() {
	  this._events = this._events || {};
	  this._maxListeners = this._maxListeners || undefined;
	}
	module.exports = EventEmitter;

	// Backwards-compat with node 0.10.x
	EventEmitter.EventEmitter = EventEmitter;

	EventEmitter.prototype._events = undefined;
	EventEmitter.prototype._maxListeners = undefined;

	// By default EventEmitters will print a warning if more than 10 listeners are
	// added to it. This is a useful default which helps finding memory leaks.
	EventEmitter.defaultMaxListeners = 10;

	// Obviously not all Emitters should be limited to 10. This function allows
	// that to be increased. Set to zero for unlimited.
	EventEmitter.prototype.setMaxListeners = function(n) {
	  if (!isNumber(n) || n < 0 || isNaN(n))
	    throw TypeError('n must be a positive number');
	  this._maxListeners = n;
	  return this;
	};

	EventEmitter.prototype.emit = function(type) {
	  var er, handler, len, args, i, listeners;

	  if (!this._events)
	    this._events = {};

	  // If there is no 'error' event listener then throw.
	  if (type === 'error') {
	    if (!this._events.error ||
	        (isObject(this._events.error) && !this._events.error.length)) {
	      er = arguments[1];
	      if (er instanceof Error) {
	        throw er; // Unhandled 'error' event
	      } else {
	        // At least give some kind of context to the user
	        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
	        err.context = er;
	        throw err;
	      }
	    }
	  }

	  handler = this._events[type];

	  if (isUndefined(handler))
	    return false;

	  if (isFunction(handler)) {
	    switch (arguments.length) {
	      // fast cases
	      case 1:
	        handler.call(this);
	        break;
	      case 2:
	        handler.call(this, arguments[1]);
	        break;
	      case 3:
	        handler.call(this, arguments[1], arguments[2]);
	        break;
	      // slower
	      default:
	        args = Array.prototype.slice.call(arguments, 1);
	        handler.apply(this, args);
	    }
	  } else if (isObject(handler)) {
	    args = Array.prototype.slice.call(arguments, 1);
	    listeners = handler.slice();
	    len = listeners.length;
	    for (i = 0; i < len; i++)
	      listeners[i].apply(this, args);
	  }

	  return true;
	};

	EventEmitter.prototype.addListener = function(type, listener) {
	  var m;

	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  if (!this._events)
	    this._events = {};

	  // To avoid recursion in the case that type === "newListener"! Before
	  // adding it to the listeners, first emit "newListener".
	  if (this._events.newListener)
	    this.emit('newListener', type,
	              isFunction(listener.listener) ?
	              listener.listener : listener);

	  if (!this._events[type])
	    // Optimize the case of one listener. Don't need the extra array object.
	    this._events[type] = listener;
	  else if (isObject(this._events[type]))
	    // If we've already got an array, just append.
	    this._events[type].push(listener);
	  else
	    // Adding the second element, need to change to array.
	    this._events[type] = [this._events[type], listener];

	  // Check for listener leak
	  if (isObject(this._events[type]) && !this._events[type].warned) {
	    if (!isUndefined(this._maxListeners)) {
	      m = this._maxListeners;
	    } else {
	      m = EventEmitter.defaultMaxListeners;
	    }

	    if (m && m > 0 && this._events[type].length > m) {
	      this._events[type].warned = true;
	      console.error('(node) warning: possible EventEmitter memory ' +
	                    'leak detected. %d listeners added. ' +
	                    'Use emitter.setMaxListeners() to increase limit.',
	                    this._events[type].length);
	      if (typeof console.trace === 'function') {
	        // not supported in IE 10
	        console.trace();
	      }
	    }
	  }

	  return this;
	};

	EventEmitter.prototype.on = EventEmitter.prototype.addListener;

	EventEmitter.prototype.once = function(type, listener) {
	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  var fired = false;

	  function g() {
	    this.removeListener(type, g);

	    if (!fired) {
	      fired = true;
	      listener.apply(this, arguments);
	    }
	  }

	  g.listener = listener;
	  this.on(type, g);

	  return this;
	};

	// emits a 'removeListener' event iff the listener was removed
	EventEmitter.prototype.removeListener = function(type, listener) {
	  var list, position, length, i;

	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  if (!this._events || !this._events[type])
	    return this;

	  list = this._events[type];
	  length = list.length;
	  position = -1;

	  if (list === listener ||
	      (isFunction(list.listener) && list.listener === listener)) {
	    delete this._events[type];
	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);

	  } else if (isObject(list)) {
	    for (i = length; i-- > 0;) {
	      if (list[i] === listener ||
	          (list[i].listener && list[i].listener === listener)) {
	        position = i;
	        break;
	      }
	    }

	    if (position < 0)
	      return this;

	    if (list.length === 1) {
	      list.length = 0;
	      delete this._events[type];
	    } else {
	      list.splice(position, 1);
	    }

	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);
	  }

	  return this;
	};

	EventEmitter.prototype.removeAllListeners = function(type) {
	  var key, listeners;

	  if (!this._events)
	    return this;

	  // not listening for removeListener, no need to emit
	  if (!this._events.removeListener) {
	    if (arguments.length === 0)
	      this._events = {};
	    else if (this._events[type])
	      delete this._events[type];
	    return this;
	  }

	  // emit removeListener for all listeners on all events
	  if (arguments.length === 0) {
	    for (key in this._events) {
	      if (key === 'removeListener') continue;
	      this.removeAllListeners(key);
	    }
	    this.removeAllListeners('removeListener');
	    this._events = {};
	    return this;
	  }

	  listeners = this._events[type];

	  if (isFunction(listeners)) {
	    this.removeListener(type, listeners);
	  } else if (listeners) {
	    // LIFO order
	    while (listeners.length)
	      this.removeListener(type, listeners[listeners.length - 1]);
	  }
	  delete this._events[type];

	  return this;
	};

	EventEmitter.prototype.listeners = function(type) {
	  var ret;
	  if (!this._events || !this._events[type])
	    ret = [];
	  else if (isFunction(this._events[type]))
	    ret = [this._events[type]];
	  else
	    ret = this._events[type].slice();
	  return ret;
	};

	EventEmitter.prototype.listenerCount = function(type) {
	  if (this._events) {
	    var evlistener = this._events[type];

	    if (isFunction(evlistener))
	      return 1;
	    else if (evlistener)
	      return evlistener.length;
	  }
	  return 0;
	};

	EventEmitter.listenerCount = function(emitter, type) {
	  return emitter.listenerCount(type);
	};

	function isFunction(arg) {
	  return typeof arg === 'function';
	}

	function isNumber(arg) {
	  return typeof arg === 'number';
	}

	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}

	function isUndefined(arg) {
	  return arg === void 0;
	}


/***/ })
/******/ ]);
//# sourceMappingURL=aerials.js.map