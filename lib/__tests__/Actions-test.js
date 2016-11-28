'use strict';

var _Flux = require('../Flux');

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

describe('Actions', function () {
  var TestActions = function (_Actions) {
    _inherits(TestActions, _Actions);

    function TestActions() {
      _classCallCheck(this, TestActions);

      return _possibleConstructorReturn(this, _Actions.apply(this, arguments));
    }

    TestActions.prototype.getFoo = function getFoo() {
      return { foo: 'bar' };
    };

    TestActions.prototype.getBar = function getBar() {
      return { bar: 'baz' };
    };

    TestActions.prototype.getBaz = function getBaz() {
      return;
    };

    TestActions.prototype.asyncAction = function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(returnValue) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                return _context.abrupt('return', returnValue);

              case 1:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function asyncAction(_x) {
        return _ref.apply(this, arguments);
      }

      return asyncAction;
    }();

    TestActions.prototype.badAsyncAction = function badAsyncAction() {
      return Promise.reject(new Error('some error'));
    };

    return TestActions;
  }(_Flux.Actions);

  describe('#getActionIds / #getConstants', function () {
    it('returns strings corresponding to action method names', function () {
      var actions = new TestActions();

      var actionIds = actions.getActionIds();

      expect(actionIds.getFoo).to.be.a('string');
      expect(actionIds.getBar).to.be.a('string');

      expect(actionIds.getFoo).to.be.a('string');
      expect(actionIds.getBar).to.be.a('string');
    });
  });

  describe('#[methodName]', function () {
    it('calls Flux dispatcher', function () {
      var actions = new TestActions();

      // Attach mock flux instance
      var dispatch = _sinon2['default'].spy();
      actions.dispatch = dispatch;

      actions.getFoo();
      expect(dispatch.firstCall.args[1]).to.deep.equal({ foo: 'bar' });
    });

    it('warns if actions have not been added to a Flux instance', function () {
      var actions = new TestActions();
      var warn = _sinon2['default'].spy(console, 'warn');

      actions.getFoo();

      expect(warn.firstCall.args[0]).to.equal('You\'ve attempted to perform the action TestActions#getFoo, but it ' + 'hasn\'t been added to a Flux instance.');

      actions.asyncAction();

      expect(warn.secondCall.args[0]).to.equal('You\'ve attempted to perform the asynchronous action ' + 'TestActions#asyncAction, but it hasn\'t been added ' + 'to a Flux instance.');

      console.warn.restore();
    });

    it('sends return value to Flux dispatch', function () {
      var actions = new TestActions();
      var actionId = actions.getActionIds().getFoo;
      var dispatch = _sinon2['default'].spy();
      actions.dispatch = dispatch;

      actions.getFoo();

      expect(dispatch.firstCall.args[0]).to.equal(actionId);
      expect(dispatch.firstCall.args[1]).to.deep.equal({ foo: 'bar' });
    });

    it('send async return value to Flux#dispatchAsync', _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
      var actions, actionId, dispatch, response;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              actions = new TestActions();
              actionId = actions.getActionIds().asyncAction;
              dispatch = _sinon2['default'].stub().returns(Promise.resolve());

              actions.dispatchAsync = dispatch;

              response = actions.asyncAction('foobar');


              expect(response.then).to.be.a('function');

              _context2.next = 8;
              return response;

            case 8:

              expect(dispatch.firstCall.args[0]).to.equal(actionId);
              expect(dispatch.firstCall.args[1]).to.be.an.instanceOf(Promise);

            case 10:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    })));

    it('skips disptach if return value is undefined', function () {
      var actions = new TestActions();
      var dispatch = _sinon2['default'].spy();
      actions.dispatch = dispatch;

      actions.getBaz();

      expect(dispatch.called).to.be['false'];
    });

    it('does not skip async dispatch, even if resolved value is undefined', function () {
      var actions = new TestActions();
      var dispatch = _sinon2['default'].stub().returns(Promise.resolve(undefined));
      actions.dispatchAsync = dispatch;

      actions.asyncAction();

      expect(dispatch.called).to.be['true'];
    });

    it('returns value from wrapped action', _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
      var flux, actions;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              flux = new _Flux.Flux();
              actions = flux.createActions('test', TestActions);


              expect(actions.getFoo()).to.deep.equal({ foo: 'bar' });
              _context3.next = 5;
              return expect(actions.asyncAction('async result')).to.eventually.equal('async result');

            case 5:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this);
    })));
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9fX3Rlc3RzX18vQWN0aW9ucy10ZXN0LmpzIl0sIm5hbWVzIjpbImRlc2NyaWJlIiwiVGVzdEFjdGlvbnMiLCJnZXRGb28iLCJmb28iLCJnZXRCYXIiLCJiYXIiLCJnZXRCYXoiLCJhc3luY0FjdGlvbiIsInJldHVyblZhbHVlIiwiYmFkQXN5bmNBY3Rpb24iLCJQcm9taXNlIiwicmVqZWN0IiwiRXJyb3IiLCJpdCIsImFjdGlvbnMiLCJhY3Rpb25JZHMiLCJnZXRBY3Rpb25JZHMiLCJleHBlY3QiLCJ0byIsImJlIiwiYSIsImRpc3BhdGNoIiwic3B5IiwiZmlyc3RDYWxsIiwiYXJncyIsImRlZXAiLCJlcXVhbCIsIndhcm4iLCJjb25zb2xlIiwic2Vjb25kQ2FsbCIsInJlc3RvcmUiLCJhY3Rpb25JZCIsInN0dWIiLCJyZXR1cm5zIiwicmVzb2x2ZSIsImRpc3BhdGNoQXN5bmMiLCJyZXNwb25zZSIsInRoZW4iLCJhbiIsImluc3RhbmNlT2YiLCJjYWxsZWQiLCJ1bmRlZmluZWQiLCJmbHV4IiwiY3JlYXRlQWN0aW9ucyIsImV2ZW50dWFsbHkiXSwibWFwcGluZ3MiOiI7O0FBQUE7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7O0FBRUFBLFNBQVMsU0FBVCxFQUFvQixZQUFNO0FBQUEsTUFFbEJDLFdBRmtCO0FBQUE7O0FBQUE7QUFBQTs7QUFBQTtBQUFBOztBQUFBLDBCQUd0QkMsTUFIc0IscUJBR2I7QUFDUCxhQUFPLEVBQUVDLEtBQUssS0FBUCxFQUFQO0FBQ0QsS0FMcUI7O0FBQUEsMEJBT3RCQyxNQVBzQixxQkFPYjtBQUNQLGFBQU8sRUFBRUMsS0FBSyxLQUFQLEVBQVA7QUFDRCxLQVRxQjs7QUFBQSwwQkFXdEJDLE1BWHNCLHFCQVdiO0FBQ1A7QUFDRCxLQWJxQjs7QUFBQSwwQkFlaEJDLFdBZmdCO0FBQUEsNEVBZUpDLFdBZkk7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGlEQWdCYkEsV0FoQmE7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFB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UUFBUXdCLE9BQVIsQ0FBZ0JPLFNBQWhCLENBQXJCLENBQWpCO0FBQ0EzQixjQUFRcUIsYUFBUixHQUF3QmQsUUFBeEI7O0FBRUFQLGNBQVFQLFdBQVI7O0FBRUFVLGFBQU9JLFNBQVNtQixNQUFoQixFQUF3QnRCLEVBQXhCLENBQTJCQyxFQUEzQjtBQUNELEtBUkQ7O0FBVUFOLE9BQUcsbUNBQUgsNENBQXdDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNoQzZCLGtCQURnQyxHQUN6QixnQkFEeUI7QUFFaEM1QixxQkFGZ0MsR0FFdEI0QixLQUFLQyxhQUFMLENBQW1CLE1BQW5CLEVBQTJCMUMsV0FBM0IsQ0FGc0I7OztBQUl0Q2dCLHFCQUFPSCxRQUFRWixNQUFSLEVBQVAsRUFBeUJnQixFQUF6QixDQUE0Qk8sSUFBNUIsQ0FBaUNDLEtBQWpDLENBQXVDLEVBQUV2QixLQUFLLEtBQVAsRUFBdkM7QUFKc0M7QUFBQSxxQkFLaENjLE9BQU9ILFFBQVFQLFdBQVIsQ0FBb0IsY0FBcEIsQ0FBUCxFQUNIVyxFQURHLENBQ0EwQixVQURBLENBQ1dsQixLQURYLENBQ2lCLGNBRGpCLENBTGdDOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEtBQXhDO0FBU0QsR0EzRkQ7QUE2RkQsQ0FwSUQiLCJmaWxlIjoiQWN0aW9ucy10ZXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRmx1eCwgQWN0aW9ucyB9IGZyb20gJy4uL0ZsdXgnO1xuaW1wb3J0IHNpbm9uIGZyb20gJ3Npbm9uJztcblxuZGVzY3JpYmUoJ0FjdGlvbnMnLCAoKSA9PiB7XG5cbiAgY2xhc3MgVGVzdEFjdGlvbnMgZXh0ZW5kcyBBY3Rpb25zIHtcbiAgICBnZXRGb28oKSB7XG4gICAgICByZXR1cm4geyBmb286ICdiYXInIH07XG4gICAgfVxuXG4gICAgZ2V0QmFyKCkge1xuICAgICAgcmV0dXJuIHsgYmFyOiAnYmF6JyB9O1xuICAgIH1cblxuICAgIGdldEJheigpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBhc3luYyBhc3luY0FjdGlvbihyZXR1cm5WYWx1ZSkge1xuICAgICAgcmV0dXJuIHJldHVyblZhbHVlO1xuICAgIH1cblxuICAgIGJhZEFzeW5jQWN0aW9uKCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcignc29tZSBlcnJvcicpKTtcbiAgICB9XG4gIH1cblxuICBkZXNjcmliZSgnI2dldEFjdGlvbklkcyAvICNnZXRDb25zdGFudHMnLCAoKSA9PiB7XG4gICAgaXQoJ3JldHVybnMgc3RyaW5ncyBjb3JyZXNwb25kaW5nIHRvIGFjdGlvbiBtZXRob2QgbmFtZXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBhY3Rpb25zID0gbmV3IFRlc3RBY3Rpb25zKCk7XG5cbiAgICAgIGNvbnN0IGFjdGlvbklkcyA9IGFjdGlvbnMuZ2V0QWN0aW9uSWRzKCk7XG5cbiAgICAgIGV4cGVjdChhY3Rpb25JZHMuZ2V0Rm9vKS50by5iZS5hKCdzdHJpbmcnKTtcbiAgICAgIGV4cGVjdChhY3Rpb25JZHMuZ2V0QmFyKS50by5iZS5hKCdzdHJpbmcnKTtcblxuICAgICAgZXhwZWN0KGFjdGlvbklkcy5nZXRGb28pLnRvLmJlLmEoJ3N0cmluZycpO1xuICAgICAgZXhwZWN0KGFjdGlvbklkcy5nZXRCYXIpLnRvLmJlLmEoJ3N0cmluZycpO1xuICAgIH0pO1xuXG4gIH0pO1xuXG4gIGRlc2NyaWJlKCcjW21ldGhvZE5hbWVdJywgKCkgPT4ge1xuICAgIGl0KCdjYWxscyBGbHV4IGRpc3BhdGNoZXInLCAoKSA9PiB7XG4gICAgICBjb25zdCBhY3Rpb25zID0gbmV3IFRlc3RBY3Rpb25zKCk7XG5cbiAgICAgIC8vIEF0dGFjaCBtb2NrIGZsdXggaW5zdGFuY2VcbiAgICAgIGNvbnN0IGRpc3BhdGNoID0gc2lub24uc3B5KCk7XG4gICAgICBhY3Rpb25zLmRpc3BhdGNoID0gZGlzcGF0Y2g7XG5cbiAgICAgIGFjdGlvbnMuZ2V0Rm9vKCk7XG4gICAgICBleHBlY3QoZGlzcGF0Y2guZmlyc3RDYWxsLmFyZ3NbMV0pLnRvLmRlZXAuZXF1YWwoeyBmb286ICdiYXInIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3dhcm5zIGlmIGFjdGlvbnMgaGF2ZSBub3QgYmVlbiBhZGRlZCB0byBhIEZsdXggaW5zdGFuY2UnLCAoKSA9PiB7XG4gICAgICBjb25zdCBhY3Rpb25zID0gbmV3IFRlc3RBY3Rpb25zKCk7XG4gICAgICBjb25zdCB3YXJuID0gc2lub24uc3B5KGNvbnNvbGUsICd3YXJuJyk7XG5cbiAgICAgIGFjdGlvbnMuZ2V0Rm9vKCk7XG5cbiAgICAgIGV4cGVjdCh3YXJuLmZpcnN0Q2FsbC5hcmdzWzBdKS50by5lcXVhbChcbiAgICAgICAgJ1lvdVxcJ3ZlIGF0dGVtcHRlZCB0byBwZXJmb3JtIHRoZSBhY3Rpb24gVGVzdEFjdGlvbnMjZ2V0Rm9vLCBidXQgaXQgJ1xuICAgICAgKyAnaGFzblxcJ3QgYmVlbiBhZGRlZCB0byBhIEZsdXggaW5zdGFuY2UuJ1xuICAgICAgKTtcblxuICAgICAgYWN0aW9ucy5hc3luY0FjdGlvbigpO1xuXG4gICAgICBleHBlY3Qod2Fybi5zZWNvbmRDYWxsLmFyZ3NbMF0pLnRvLmVxdWFsKFxuICAgICAgICBgWW91J3ZlIGF0dGVtcHRlZCB0byBwZXJmb3JtIHRoZSBhc3luY2hyb25vdXMgYWN0aW9uIGBcbiAgICAgICsgYFRlc3RBY3Rpb25zI2FzeW5jQWN0aW9uLCBidXQgaXQgaGFzbid0IGJlZW4gYWRkZWQgYFxuICAgICAgKyBgdG8gYSBGbHV4IGluc3RhbmNlLmBcbiAgICAgICk7XG5cbiAgICAgIGNvbnNvbGUud2Fybi5yZXN0b3JlKCk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2VuZHMgcmV0dXJuIHZhbHVlIHRvIEZsdXggZGlzcGF0Y2gnLCAoKSA9PiB7XG4gICAgICBjb25zdCBhY3Rpb25zID0gbmV3IFRlc3RBY3Rpb25zKCk7XG4gICAgICBjb25zdCBhY3Rpb25JZCA9IGFjdGlvbnMuZ2V0QWN0aW9uSWRzKCkuZ2V0Rm9vO1xuICAgICAgY29uc3QgZGlzcGF0Y2ggPSBzaW5vbi5zcHkoKTtcbiAgICAgIGFjdGlvbnMuZGlzcGF0Y2ggPSBkaXNwYXRjaDtcblxuICAgICAgYWN0aW9ucy5nZXRGb28oKTtcblxuICAgICAgZXhwZWN0KGRpc3BhdGNoLmZpcnN0Q2FsbC5hcmdzWzBdKS50by5lcXVhbChhY3Rpb25JZCk7XG4gICAgICBleHBlY3QoZGlzcGF0Y2guZmlyc3RDYWxsLmFyZ3NbMV0pLnRvLmRlZXAuZXF1YWwoeyBmb286ICdiYXInIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3NlbmQgYXN5bmMgcmV0dXJuIHZhbHVlIHRvIEZsdXgjZGlzcGF0Y2hBc3luYycsIGFzeW5jIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgYWN0aW9ucyA9IG5ldyBUZXN0QWN0aW9ucygpO1xuICAgICAgY29uc3QgYWN0aW9uSWQgPSBhY3Rpb25zLmdldEFjdGlvbklkcygpLmFzeW5jQWN0aW9uO1xuICAgICAgY29uc3QgZGlzcGF0Y2ggPSBzaW5vbi5zdHViKCkucmV0dXJucyhQcm9taXNlLnJlc29sdmUoKSk7XG4gICAgICBhY3Rpb25zLmRpc3BhdGNoQXN5bmMgPSBkaXNwYXRjaDtcblxuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhY3Rpb25zLmFzeW5jQWN0aW9uKCdmb29iYXInKTtcblxuICAgICAgZXhwZWN0KHJlc3BvbnNlLnRoZW4pLnRvLmJlLmEoJ2Z1bmN0aW9uJyk7XG5cbiAgICAgIGF3YWl0IHJlc3BvbnNlO1xuXG4gICAgICBleHBlY3QoZGlzcGF0Y2guZmlyc3RDYWxsLmFyZ3NbMF0pLnRvLmVxdWFsKGFjdGlvbklkKTtcbiAgICAgIGV4cGVjdChkaXNwYXRjaC5maXJzdENhbGwuYXJnc1sxXSkudG8uYmUuYW4uaW5zdGFuY2VPZihQcm9taXNlKTtcbiAgICB9KTtcblxuICAgIGl0KCdza2lwcyBkaXNwdGFjaCBpZiByZXR1cm4gdmFsdWUgaXMgdW5kZWZpbmVkJywgKCkgPT4ge1xuICAgICAgY29uc3QgYWN0aW9ucyA9IG5ldyBUZXN0QWN0aW9ucygpO1xuICAgICAgY29uc3QgZGlzcGF0Y2ggPSBzaW5vbi5zcHkoKTtcbiAgICAgIGFjdGlvbnMuZGlzcGF0Y2ggPSBkaXNwYXRjaDtcblxuICAgICAgYWN0aW9ucy5nZXRCYXooKTtcblxuICAgICAgZXhwZWN0KGRpc3BhdGNoLmNhbGxlZCkudG8uYmUuZmFsc2U7XG4gICAgfSk7XG5cbiAgICBpdCgnZG9lcyBub3Qgc2tpcCBhc3luYyBkaXNwYXRjaCwgZXZlbiBpZiByZXNvbHZlZCB2YWx1ZSBpcyB1bmRlZmluZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBhY3Rpb25zID0gbmV3IFRlc3RBY3Rpb25zKCk7XG4gICAgICBjb25zdCBkaXNwYXRjaCA9IHNpbm9uLnN0dWIoKS5yZXR1cm5zKFByb21pc2UucmVzb2x2ZSh1bmRlZmluZWQpKTtcbiAgICAgIGFjdGlvbnMuZGlzcGF0Y2hBc3luYyA9IGRpc3BhdGNoO1xuXG4gICAgICBhY3Rpb25zLmFzeW5jQWN0aW9uKCk7XG5cbiAgICAgIGV4cGVjdChkaXNwYXRjaC5jYWxsZWQpLnRvLmJlLnRydWU7XG4gICAgfSk7XG5cbiAgICBpdCgncmV0dXJucyB2YWx1ZSBmcm9tIHdyYXBwZWQgYWN0aW9uJywgYXN5bmMgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBmbHV4ID0gbmV3IEZsdXgoKTtcbiAgICAgIGNvbnN0IGFjdGlvbnMgPSBmbHV4LmNyZWF0ZUFjdGlvbnMoJ3Rlc3QnLCBUZXN0QWN0aW9ucyk7XG5cbiAgICAgIGV4cGVjdChhY3Rpb25zLmdldEZvbygpKS50by5kZWVwLmVxdWFsKHsgZm9vOiAnYmFyJyB9KTtcbiAgICAgIGF3YWl0IGV4cGVjdChhY3Rpb25zLmFzeW5jQWN0aW9uKCdhc3luYyByZXN1bHQnKSlcbiAgICAgICAgLnRvLmV2ZW50dWFsbHkuZXF1YWwoJ2FzeW5jIHJlc3VsdCcpO1xuICAgIH0pO1xuXG4gIH0pO1xuXG59KTtcbiJdfQ==