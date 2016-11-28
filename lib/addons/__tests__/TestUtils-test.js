'use strict';

var _TestUtils = require('../TestUtils');

var TestUtils = _interopRequireWildcard(_TestUtils);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

describe('TestUtils', function () {
  describe('#simulateAction', function () {
    it('calls the stores handler', function () {
      var store = mockStore();
      var actionFunc = function actionFunc() {};
      actionFunc._id = 'actionFunc';

      TestUtils.simulateAction(store, 'foo', 'foo body');
      TestUtils.simulateAction(store, actionFunc, 'actionFunc body');

      expect(store.handler.calledTwice).to.be['true'];

      expect(store.handler.getCall(0).args[0]).to.deep.equal({
        actionId: 'foo',
        body: 'foo body'
      });

      expect(store.handler.getCall(1).args[0]).to.deep.equal({
        actionId: 'actionFunc',
        body: 'actionFunc body'
      });
    });
  });

  describe('#simulateActionAsync', function () {
    it('it handles async begin', function () {
      var store = mockStore();

      TestUtils.simulateActionAsync(store, 'foo', 'begin');

      expect(store.handler.calledOnce).to.be['true'];
      expect(store.handler.firstCall.args[0]).to.deep.equal({
        actionId: 'foo',
        async: 'begin'
      });
    });

    it('it handles async begin w/ action args', function () {
      var store = mockStore();

      TestUtils.simulateActionAsync(store, 'foo', 'begin', 'arg1', 'arg2');

      expect(store.handler.calledOnce).to.be['true'];
      expect(store.handler.firstCall.args[0]).to.deep.equal({
        actionId: 'foo',
        async: 'begin',
        actionArgs: ['arg1', 'arg2']
      });
    });

    it('it handles async success', function () {
      var store = mockStore();

      TestUtils.simulateActionAsync(store, 'foo', 'success', { foo: 'bar' });

      expect(store.handler.calledOnce).to.be['true'];
      expect(store.handler.firstCall.args[0]).to.deep.equal({
        actionId: 'foo',
        async: 'success',
        body: {
          foo: 'bar'
        }
      });
    });

    it('it handles async failure', function () {
      var store = mockStore();

      TestUtils.simulateActionAsync(store, 'foo', 'failure', 'error message');

      expect(store.handler.calledOnce).to.be['true'];
      expect(store.handler.firstCall.args[0]).to.deep.equal({
        actionId: 'foo',
        async: 'failure',
        error: 'error message'
      });
    });

    it('it throws error with invalid asyncAction', function () {
      var store = mockStore();
      var simulate = function simulate() {
        return TestUtils.simulateActionAsync(store, 'foo', 'fizbin');
      };

      expect(simulate).to['throw']('asyncAction must be one of: begin, success or failure');
    });
  });
});

function mockStore() {
  return {
    handler: _sinon2['default'].spy()
  };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hZGRvbnMvX190ZXN0c19fL1Rlc3RVdGlscy10ZXN0LmpzIl0sIm5hbWVzIjpbIlRlc3RVdGlscyIsImRlc2NyaWJlIiwiaXQiLCJzdG9yZSIsIm1vY2tTdG9yZSIsImFjdGlvbkZ1bmMiLCJfaWQiLCJzaW11bGF0ZUFjdGlvbiIsImV4cGVjdCIsImhhbmRsZXIiLCJjYWxsZWRUd2ljZSIsInRvIiwiYmUiLCJnZXRDYWxsIiwiYXJncyIsImRlZXAiLCJlcXVhbCIsImFjdGlvbklkIiwiYm9keSIsInNpbXVsYXRlQWN0aW9uQXN5bmMiLCJjYWxsZWRPbmNlIiwiZmlyc3RDYWxsIiwiYXN5bmMiLCJhY3Rpb25BcmdzIiwiZm9vIiwiZXJyb3IiLCJzaW11bGF0ZSIsInNweSJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7SUFBWUEsUzs7QUFDWjs7Ozs7Ozs7QUFHQUMsU0FBUyxXQUFULEVBQXNCLFlBQU07QUFDMUJBLFdBQVMsaUJBQVQsRUFBNEIsWUFBTTtBQUNoQ0MsT0FBRywwQkFBSCxFQUErQixZQUFNO0FBQ25DLFVBQU1DLFFBQVFDLFdBQWQ7QUFDQSxVQUFNQyxhQUFhLFNBQWJBLFVBQWEsR0FBVyxDQUFFLENBQWhDO0FBQ0FBLGlCQUFXQyxHQUFYLEdBQWlCLFlBQWpCOztBQUVBTixnQkFBVU8sY0FBVixDQUF5QkosS0FBekIsRUFBZ0MsS0FBaEMsRUFBdUMsVUFBdkM7QUFDQUgsZ0JBQVVPLGNBQVYsQ0FBeUJKLEtBQXpCLEVBQWdDRSxVQUFoQyxFQUE0QyxpQkFBNUM7O0FBRUFHLGFBQU9MLE1BQU1NLE9BQU4sQ0FBY0MsV0FBckIsRUFBa0NDLEVBQWxDLENBQXFDQyxFQUFyQzs7QUFFQUosYUFBT0wsTUFBTU0sT0FBTixDQUFjSSxPQUFkLENBQXNCLENBQXRCLEVBQXlCQyxJQUF6QixDQUE4QixDQUE5QixDQUFQLEVBQXlDSCxFQUF6QyxDQUE0Q0ksSUFBNUMsQ0FBaURDLEtBQWpELENBQXVEO0FBQ3JEQyxrQkFBVSxLQUQyQztB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VUFBTXNCLFdBQVcsU0FBWEEsUUFBVztBQUFBLGVBQU0xQixVQUFVbUIsbUJBQVYsQ0FBOEJoQixLQUE5QixFQUFxQyxLQUFyQyxFQUE0QyxRQUE1QyxDQUFOO0FBQUEsT0FBakI7O0FBRUFLLGFBQU9rQixRQUFQLEVBQWlCZixFQUFqQixVQUEwQix1REFBMUI7QUFDRCxLQUxEO0FBTUQsR0E1REQ7QUE2REQsQ0FyRkQ7O0FBdUZBLFNBQVNQLFNBQVQsR0FBcUI7QUFDbkIsU0FBTztBQUNMSyxhQUFTLG1CQUFNa0IsR0FBTjtBQURKLEdBQVA7QUFHRCIsImZpbGUiOiJUZXN0VXRpbHMtdGVzdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIFRlc3RVdGlscyBmcm9tICcuLi9UZXN0VXRpbHMnO1xuaW1wb3J0IHNpbm9uIGZyb20gJ3Npbm9uJztcblxuXG5kZXNjcmliZSgnVGVzdFV0aWxzJywgKCkgPT4ge1xuICBkZXNjcmliZSgnI3NpbXVsYXRlQWN0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdjYWxscyB0aGUgc3RvcmVzIGhhbmRsZXInLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdG9yZSA9IG1vY2tTdG9yZSgpO1xuICAgICAgY29uc3QgYWN0aW9uRnVuYyA9IGZ1bmN0aW9uKCkge307XG4gICAgICBhY3Rpb25GdW5jLl9pZCA9ICdhY3Rpb25GdW5jJztcblxuICAgICAgVGVzdFV0aWxzLnNpbXVsYXRlQWN0aW9uKHN0b3JlLCAnZm9vJywgJ2ZvbyBib2R5Jyk7XG4gICAgICBUZXN0VXRpbHMuc2ltdWxhdGVBY3Rpb24oc3RvcmUsIGFjdGlvbkZ1bmMsICdhY3Rpb25GdW5jIGJvZHknKTtcblxuICAgICAgZXhwZWN0KHN0b3JlLmhhbmRsZXIuY2FsbGVkVHdpY2UpLnRvLmJlLnRydWU7XG5cbiAgICAgIGV4cGVjdChzdG9yZS5oYW5kbGVyLmdldENhbGwoMCkuYXJnc1swXSkudG8uZGVlcC5lcXVhbCh7XG4gICAgICAgIGFjdGlvbklkOiAnZm9vJyxcbiAgICAgICAgYm9keTogJ2ZvbyBib2R5J1xuICAgICAgfSk7XG5cbiAgICAgIGV4cGVjdChzdG9yZS5oYW5kbGVyLmdldENhbGwoMSkuYXJnc1swXSkudG8uZGVlcC5lcXVhbCh7XG4gICAgICAgIGFjdGlvbklkOiAnYWN0aW9uRnVuYycsXG4gICAgICAgIGJvZHk6ICdhY3Rpb25GdW5jIGJvZHknXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJyNzaW11bGF0ZUFjdGlvbkFzeW5jJywgKCkgPT4ge1xuICAgIGl0KCdpdCBoYW5kbGVzIGFzeW5jIGJlZ2luJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RvcmUgPSBtb2NrU3RvcmUoKTtcblxuICAgICAgVGVzdFV0aWxzLnNpbXVsYXRlQWN0aW9uQXN5bmMoc3RvcmUsICdmb28nLCAnYmVnaW4nKTtcblxuICAgICAgZXhwZWN0KHN0b3JlLmhhbmRsZXIuY2FsbGVkT25jZSkudG8uYmUudHJ1ZTtcbiAgICAgIGV4cGVjdChzdG9yZS5oYW5kbGVyLmZpcnN0Q2FsbC5hcmdzWzBdKS50by5kZWVwLmVxdWFsKHtcbiAgICAgICAgYWN0aW9uSWQ6ICdmb28nLFxuICAgICAgICBhc3luYzogJ2JlZ2luJ1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnaXQgaGFuZGxlcyBhc3luYyBiZWdpbiB3LyBhY3Rpb24gYXJncycsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0b3JlID0gbW9ja1N0b3JlKCk7XG5cbiAgICAgIFRlc3RVdGlscy5zaW11bGF0ZUFjdGlvbkFzeW5jKHN0b3JlLCAnZm9vJywgJ2JlZ2luJywgJ2FyZzEnLCAnYXJnMicpO1xuXG4gICAgICBleHBlY3Qoc3RvcmUuaGFuZGxlci5jYWxsZWRPbmNlKS50by5iZS50cnVlO1xuICAgICAgZXhwZWN0KHN0b3JlLmhhbmRsZXIuZmlyc3RDYWxsLmFyZ3NbMF0pLnRvLmRlZXAuZXF1YWwoe1xuICAgICAgICBhY3Rpb25JZDogJ2ZvbycsXG4gICAgICAgIGFzeW5jOiAnYmVnaW4nLFxuICAgICAgICBhY3Rpb25BcmdzOiBbJ2FyZzEnLCAnYXJnMiddXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdpdCBoYW5kbGVzIGFzeW5jIHN1Y2Nlc3MnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdG9yZSA9IG1vY2tTdG9yZSgpO1xuXG4gICAgICBUZXN0VXRpbHMuc2ltdWxhdGVBY3Rpb25Bc3luYyhzdG9yZSwgJ2ZvbycsICdzdWNjZXNzJywgeyBmb286ICdiYXInIH0pO1xuXG4gICAgICBleHBlY3Qoc3RvcmUuaGFuZGxlci5jYWxsZWRPbmNlKS50by5iZS50cnVlO1xuICAgICAgZXhwZWN0KHN0b3JlLmhhbmRsZXIuZmlyc3RDYWxsLmFyZ3NbMF0pLnRvLmRlZXAuZXF1YWwoe1xuICAgICAgICBhY3Rpb25JZDogJ2ZvbycsXG4gICAgICAgIGFzeW5jOiAnc3VjY2VzcycsXG4gICAgICAgIGJvZHk6IHtcbiAgICAgICAgICBmb286ICdiYXInXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ2l0IGhhbmRsZXMgYXN5bmMgZmFpbHVyZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0b3JlID0gbW9ja1N0b3JlKCk7XG5cbiAgICAgIFRlc3RVdGlscy5zaW11bGF0ZUFjdGlvbkFzeW5jKHN0b3JlLCAnZm9vJywgJ2ZhaWx1cmUnLCAnZXJyb3IgbWVzc2FnZScpO1xuXG4gICAgICBleHBlY3Qoc3RvcmUuaGFuZGxlci5jYWxsZWRPbmNlKS50by5iZS50cnVlO1xuICAgICAgZXhwZWN0KHN0b3JlLmhhbmRsZXIuZmlyc3RDYWxsLmFyZ3NbMF0pLnRvLmRlZXAuZXF1YWwoe1xuICAgICAgICBhY3Rpb25JZDogJ2ZvbycsXG4gICAgICAgIGFzeW5jOiAnZmFpbHVyZScsXG4gICAgICAgIGVycm9yOiAnZXJyb3IgbWVzc2FnZSdcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ2l0IHRocm93cyBlcnJvciB3aXRoIGludmFsaWQgYXN5bmNBY3Rpb24nLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdG9yZSA9IG1vY2tTdG9yZSgpO1xuICAgICAgY29uc3Qgc2ltdWxhdGUgPSAoKSA9PiBUZXN0VXRpbHMuc2ltdWxhdGVBY3Rpb25Bc3luYyhzdG9yZSwgJ2ZvbycsICdmaXpiaW4nKTtcblxuICAgICAgZXhwZWN0KHNpbXVsYXRlKS50by50aHJvdygnYXN5bmNBY3Rpb24gbXVzdCBiZSBvbmUgb2Y6IGJlZ2luLCBzdWNjZXNzIG9yIGZhaWx1cmUnKTtcbiAgICB9KTtcbiAgfSk7XG59KTtcblxuZnVuY3Rpb24gbW9ja1N0b3JlKCkge1xuICByZXR1cm4ge1xuICAgIGhhbmRsZXI6IHNpbm9uLnNweSgpXG4gIH07XG59XG4iXX0=