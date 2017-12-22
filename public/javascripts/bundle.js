/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!*********************************!*\
  !*** ./src/client/app/index.js ***!
  \*********************************/
/*! no exports provided */
/*! all exports used */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("Object.defineProperty(__webpack_exports__, \"__esModule\", { value: true });\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__stripe_js__ = __webpack_require__(/*! ./stripe.js */ 1);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__stripe_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__stripe_js__);\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9jbGllbnQvYXBwL2luZGV4LmpzPzVjOTkiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICcuL3N0cmlwZS5qcyc7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9jbGllbnQvYXBwL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQTtBQUFBO0FBQUE7Iiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///0\n");

/***/ }),
/* 1 */
/*!**********************************!*\
  !*** ./src/client/app/stripe.js ***!
  \**********************************/
/*! dynamic exports provided */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("/* global Stripe */\n\n\n\ndocument.addEventListener('DOMContentLoaded', function() {\n\n  const addCardForm = document.querySelector('#add-card-form');\n  if (addCardForm) {\n    const stripeKey = addCardForm.dataset.stripeKey;\n    const stripe    = Stripe(stripeKey);\n    const elements  = stripe.elements();\n\n    const cardErrors = document.getElementById('card-errors');\n\n    const style = {\n      base: {\n        fontSize: '16px',\n        color: '#32325d'\n      }\n    };\n\n    const card = elements.create('card', { style, hidePostalCode: true });\n    card.mount('#card-element');\n\n    card.addEventListener('change', ({error}) => {\n      if (error) {\n        cardErrors.textContent = error.message;\n      } else {\n        cardErrors.textContent = '';\n      }\n    });\n\n    addCardForm.addEventListener('submit', (event) => {\n      event.preventDefault();\n\n      stripe.createToken(card).then((result) => {\n        if (result.error) {\n          cardErrors.textContent = result.error.message;\n        } else {\n          const input = document.createElement('input');\n          input.setAttribute('type', 'hidden');\n          input.setAttribute('name', 'stripeToken');\n          input.value = result.token.id;\n          addCardForm.appendChild(input);\n\n          addCardForm.submit();\n        }\n      });\n    });\n\n  }\n\n});\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMS5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9jbGllbnQvYXBwL3N0cmlwZS5qcz9jZWRlIl0sInNvdXJjZXNDb250ZW50IjpbIi8qIGdsb2JhbCBTdHJpcGUgKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24oKSB7XG5cbiAgY29uc3QgYWRkQ2FyZEZvcm0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYWRkLWNhcmQtZm9ybScpO1xuICBpZiAoYWRkQ2FyZEZvcm0pIHtcbiAgICBjb25zdCBzdHJpcGVLZXkgPSBhZGRDYXJkRm9ybS5kYXRhc2V0LnN0cmlwZUtleTtcbiAgICBjb25zdCBzdHJpcGUgICAgPSBTdHJpcGUoc3RyaXBlS2V5KTtcbiAgICBjb25zdCBlbGVtZW50cyAgPSBzdHJpcGUuZWxlbWVudHMoKTtcblxuICAgIGNvbnN0IGNhcmRFcnJvcnMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FyZC1lcnJvcnMnKTtcblxuICAgIGNvbnN0IHN0eWxlID0ge1xuICAgICAgYmFzZToge1xuICAgICAgICBmb250U2l6ZTogJzE2cHgnLFxuICAgICAgICBjb2xvcjogJyMzMjMyNWQnXG4gICAgICB9XG4gICAgfTtcblxuICAgIGNvbnN0IGNhcmQgPSBlbGVtZW50cy5jcmVhdGUoJ2NhcmQnLCB7IHN0eWxlLCBoaWRlUG9zdGFsQ29kZTogdHJ1ZSB9KTtcbiAgICBjYXJkLm1vdW50KCcjY2FyZC1lbGVtZW50Jyk7XG5cbiAgICBjYXJkLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsICh7ZXJyb3J9KSA9PiB7XG4gICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgY2FyZEVycm9ycy50ZXh0Q29udGVudCA9IGVycm9yLm1lc3NhZ2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjYXJkRXJyb3JzLnRleHRDb250ZW50ID0gJyc7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBhZGRDYXJkRm9ybS5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCAoZXZlbnQpID0+IHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgIHN0cmlwZS5jcmVhdGVUb2tlbihjYXJkKS50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgICAgaWYgKHJlc3VsdC5lcnJvcikge1xuICAgICAgICAgIGNhcmRFcnJvcnMudGV4dENvbnRlbnQgPSByZXN1bHQuZXJyb3IubWVzc2FnZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCBpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgICAgICAgaW5wdXQuc2V0QXR0cmlidXRlKCd0eXBlJywgJ2hpZGRlbicpO1xuICAgICAgICAgIGlucHV0LnNldEF0dHJpYnV0ZSgnbmFtZScsICdzdHJpcGVUb2tlbicpO1xuICAgICAgICAgIGlucHV0LnZhbHVlID0gcmVzdWx0LnRva2VuLmlkO1xuICAgICAgICAgIGFkZENhcmRGb3JtLmFwcGVuZENoaWxkKGlucHV0KTtcblxuICAgICAgICAgIGFkZENhcmRGb3JtLnN1Ym1pdCgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcblxuICB9XG5cbn0pO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvY2xpZW50L2FwcC9zdHJpcGUuanNcbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOyIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///1\n");

/***/ })
/******/ ]);