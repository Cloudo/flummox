'use strict';

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiAsPromised = require('chai-as-promised');

var _chaiAsPromised2 = _interopRequireDefault(_chaiAsPromised);

var _es6Promise = require('es6-promise');

require('babel-runtime/regenerator/runtime');

var _jsdom2 = require('jsdom');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

global.expect = _chai2['default'].expect;

_chai2['default'].use(_chaiAsPromised2['default']);

if (!global.Promise) global.Promise = _es6Promise.Promise;

global.document = (0, _jsdom2.jsdom)('<!doctype html><html><body></body></html>');
global.window = document.defaultView;
global.navigator = window.navigator;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90ZXN0L2luaXQuanMiXSwibmFtZXMiOlsiZ2xvYmFsIiwiZXhwZWN0IiwidXNlIiwiUHJvbWlzZSIsImRvY3VtZW50Iiwid2luZG93IiwiZGVmYXVsdFZpZXciLCJuYXZpZ2F0b3IiXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7QUFHQTs7OztBQUdBOztBQUdBOztBQUVBOzs7O0FBVkFBLE9BQU9DLE1BQVAsR0FBZ0Isa0JBQUtBLE1BQXJCOztBQUdBLGtCQUFLQyxHQUFMOztBQUdBLElBQUksQ0FBQ0YsT0FBT0csT0FBWixFQUFxQkgsT0FBT0csT0FBUDs7QUFNckJILE9BQU9JLFFBQVAsR0FBa0IsbUJBQU8sMkNBQVAsQ0FBbEI7QUFDQUosT0FBT0ssTUFBUCxHQUFnQkQsU0FBU0UsV0FBekI7QUFDQU4sT0FBT08sU0FBUCxHQUFtQkYsT0FBT0UsU0FBMUIiLCJmaWxlIjoiaW5pdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjaGFpIGZyb20gJ2NoYWknO1xuZ2xvYmFsLmV4cGVjdCA9IGNoYWkuZXhwZWN0O1xuXG5pbXBvcnQgY2hhaUFzUHJvbWlzZWQgZnJvbSAnY2hhaS1hcy1wcm9taXNlZCc7XG5jaGFpLnVzZShjaGFpQXNQcm9taXNlZCk7XG5cbmltcG9ydCB7IFByb21pc2UgfSBmcm9tICdlczYtcHJvbWlzZSc7XG5pZiAoIWdsb2JhbC5Qcm9taXNlKSBnbG9iYWwuUHJvbWlzZSA9IFByb21pc2U7XG5cbmltcG9ydCAnYmFiZWwtcnVudGltZS9yZWdlbmVyYXRvci9ydW50aW1lJztcblxuaW1wb3J0IHsganNkb20gYXMgX2pzZG9tIH0gZnJvbSAnanNkb20nO1xuXG5nbG9iYWwuZG9jdW1lbnQgPSBfanNkb20oJzwhZG9jdHlwZSBodG1sPjxodG1sPjxib2R5PjwvYm9keT48L2h0bWw+Jyk7XG5nbG9iYWwud2luZG93ID0gZG9jdW1lbnQuZGVmYXVsdFZpZXc7XG5nbG9iYWwubmF2aWdhdG9yID0gd2luZG93Lm5hdmlnYXRvcjtcbiJdfQ==