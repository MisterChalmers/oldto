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

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var _fillDetails = __webpack_require__(4);

	function getCookie(name) {
	  var b = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
	  return b ? b.pop() : '';
	}

	function getParameterByName(name) {
	  var url = window.location.href;
	  name = name.replace(/[\[\]]/g, "\\$&");
	  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
	      results = regex.exec(url);
	  if (!results) return null;
	  if (!results[2]) return '';
	  return decodeURIComponent(results[2].replace(/\+/g, " "));
	}

	var numCompleted = Number(getParameterByName('num') || '0');
	if (numCompleted === 1) {
	  $('.popup').show();
	}

	var id = getParameterByName('id');
	var dataPromise = $.get('/api/layer/oldtoronto/' + id);

	var target = getParameterByName('target');
	if (target) {
	  $('form').attr('target', target);
	}

	function initMap() {
	  var initLatLng = void 0;

	  var geocoder = new google.maps.Geocoder();
	  var map = new google.maps.Map(document.getElementById('map'), {
	    center: { lat: 43.652505, lng: -79.384424 },
	    zoom: 13
	  });
	  window.map = map; // for debugging
	  var marker = null;
	  var card = document.getElementById('pac-card');
	  var input = document.getElementById('pac-input');

	  function updateHiddenFieldWithLatLng(latLng) {
	    if (latLng.equals(initLatLng)) {
	      $('#submit').text('Location is correct');
	      $('#reset').hide();
	    } else {
	      $('#submit').text('Submit correction');
	      $('#reset').show();
	    }

	    $('#lat').val(latLng.lat());
	    $('#lng').val(latLng.lng());
	  }

	  function setMarkerLatLng(latLng) {
	    marker.setPosition(latLng);
	    marker.setMap(map);
	    updateHiddenFieldWithLatLng(latLng);
	  }

	  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card);

	  var autocomplete = new google.maps.places.Autocomplete(input);

	  google.maps.event.addDomListener(input, 'keydown', function (event) {
	    if (event.keyCode === 13) {
	      event.preventDefault();
	    }
	  });

	  // Bind the map's bounds (viewport) property to the autocomplete object,
	  // so that the autocomplete requests use the current map bounds for the
	  // bounds option in the request.
	  autocomplete.bindTo('bounds', map);

	  marker = new google.maps.Marker({
	    map: null, // Hidden initially
	    position: map.getCenter(),
	    draggable: true,
	    animation: google.maps.Animation.DROP
	  });

	  google.maps.event.addListener(marker, 'dragend', function () {
	    updateHiddenFieldWithLatLng(marker.getPosition());
	    $('#method').val('drag');
	    $('#last-search').val('');
	  });

	  map.addListener('click', function (e) {
	    setMarkerLatLng(e.latLng);
	    $('#method').val('map-click');
	  });

	  autocomplete.addListener('place_changed', function () {
	    var place = autocomplete.getPlace();
	    if (!place.geometry) {
	      // User entered the name of a Place that was not suggested and
	      // pressed the Enter key, or the Place Details request failed.
	      geocoder.geocode({
	        address: place.name,
	        componentRestrictions: {
	          country: 'CA',
	          administrativeArea: 'ON',
	          locality: 'Toronto'
	        }
	      }, function (results, status) {
	        console.log(status, results);
	        var geometry = results[0].geometry;
	        if (geometry) {
	          setMarkerLatLng(geometry.location);
	          map.fitBounds(geometry.viewport);
	          $('#method').val('search');
	          $('#last-search').val(place.name);
	        }
	      });
	      return;
	    }

	    // If the place has a geometry, then present it on a map.
	    if (place.geometry.viewport) {
	      map.fitBounds(place.geometry.viewport);
	    } else {
	      map.setCenter(place.geometry.location);
	      map.setZoom(17); // Why 17? Because it looks good.
	    }
	    setMarkerLatLng(place.geometry.location);
	    $('#method').val('search');
	    $('#last-search').val(place.name);
	  });

	  dataPromise.done(function (feature) {
	    var _feature$geometry$coo = _slicedToArray(feature.geometry.coordinates, 2),
	        lng = _feature$geometry$coo[0],
	        lat = _feature$geometry$coo[1];

	    var properties = feature.properties;
	    var image = properties.image;


	    var $pane = $('.inputside');
	    (0, _fillDetails.fillDetailsPanel)(feature.id, properties, $pane);

	    $pane.find('a img').attr('src', image.url);
	    $('#photo-id').val(feature.id);

	    $('#loading').hide();
	    $('.container').show();

	    var latLng = new google.maps.LatLng(lat, lng);
	    initLatLng = latLng;
	    $('#init-lat').val(lat);
	    $('#init-lng').val(lng);
	    setMarkerLatLng(latLng);
	    map.setCenter(latLng);
	    map.setZoom(15);
	  });

	  $('#reset').on('click', function () {
	    setMarkerLatLng(initLatLng);
	  });
	}

	$('button[type="submit"]').on('click', function () {
	  $('#outcome').val($(this).text()); // record which button was clicked.
	  $('#user-cookie').val(getCookie('_gid'));
	  // do validation here.
	});

	$('form').on('submit', function () {
	  var next = getParameterByName('next'); // 'random' is default; could be 'location'

	  var newId = void 0;
	  if (next === 'location') {
	    // Pick the next image from this location.
	    var idNum = Number(id);
	    for (var ll in ll_to_ids) {
	      var ids = ll_to_ids[ll];
	      var idx = ids.indexOf(idNum);
	      if (idx >= 0) {
	        newId = ids[(idx + 1) % ids.length];
	        break;
	      }
	    }
	  } else {
	    // Pick a random image from a random location.
	    // This is deliberately _not_ a uniform sample of photos. We want location coverage.
	    var locs = Object.keys(ll_to_ids);
	    var loc = locs[Math.floor(Math.random() * locs.length)];
	    var idsForLoc = ll_to_ids[loc];
	    newId = idsForLoc[Math.floor(Math.random() * idsForLoc.length)];
	  }
	  var params = {
	    id: newId,
	    num: numCompleted + 1
	  };
	  if (next) {
	    params.next = next;
	  }
	  if (target) {
	    params.target = target;
	  }

	  // Wait 100ms to make sure the form submission goes through.
	  window.setTimeout(function () {
	    document.location.search = '?' + $.param(params);
	  }, 100);
	});

	window.initMap = initMap; // Move into the global scope for gmaps.

/***/ }),
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.fillDetailsPanel = fillDetailsPanel;
	// This module allows both the photo viewer and corrections UI to share logic.

	// See get_source_properties in generate_geojson.py
	var ALL_FIELDS = ['date', // Both
	'physical_desc', 'citation', 'condition', 'scope', // Toronto Archives
	'creator', 'description', 'subject' // TPL
	];

	function fillDetailsPanel(photoId, info, $pane) {
	  var archives_fields = info.archives_fields,
	      geocode = info.geocode,
	      url = info.url,
	      tpl_fields = info.tpl_fields;


	  $pane.find('a.link').attr('href', url);
	  $pane.find('a.link.source').text(tpl_fields ? 'Toronto Public Library' : 'City of Toronto Archives');
	  $pane.find('a.feedback-button').attr('href', '/corrections/?id=' + photoId);

	  var fields = archives_fields || tpl_fields;

	  var _iteratorNormalCompletion = true;
	  var _didIteratorError = false;
	  var _iteratorError = undefined;

	  try {
	    for (var _iterator = ALL_FIELDS[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	      var k = _step.value;

	      var v = fields[k];
	      if (v) {
	        $pane.find('.' + k).show();
	        $pane.find('.value.' + k + ', a.' + k).text(v || '');
	      } else {
	        $pane.find('.' + k).hide(); // hide both key & value if value is missing.
	      }
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

	  $pane.find('.title').text(info.title);
	  $pane.find('.geocode-debug').text(JSON.stringify(geocode, null, 2));
	}

/***/ })
/******/ ]);
//# sourceMappingURL=corrections.js.map