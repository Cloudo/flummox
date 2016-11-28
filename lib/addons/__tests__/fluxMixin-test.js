'use strict';

var _fluxMixin = require('../fluxMixin');

var _fluxMixin2 = _interopRequireDefault(_fluxMixin);

var _Flux = require('../../Flux');

var _addContext = require('./addContext');

var _addContext2 = _interopRequireDefault(_addContext);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactAddonsTestUtils = require('react-addons-test-utils');

var _reactAddonsTestUtils2 = _interopRequireDefault(_reactAddonsTestUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PropTypes = _react2['default'].PropTypes;


describe('fluxMixin', function () {
  var TestActions = function (_Actions) {
    _inherits(TestActions, _Actions);

    function TestActions() {
      _classCallCheck(this, TestActions);

      return _possibleConstructorReturn(this, _Actions.apply(this, arguments));
    }

    TestActions.prototype.getSomething = function getSomething(something) {
      return something;
    };

    return TestActions;
  }(_Flux.Actions);

  var TestStore = function (_Store) {
    _inherits(TestStore, _Store);

    function TestStore(flux) {
      _classCallCheck(this, TestStore);

      var _this2 = _possibleConstructorReturn(this, _Store.call(this));

      var testActions = flux.getActions('test');
      _this2.register(testActions.getSomething, _this2.handleGetSomething);

      _this2.state = {
        something: null
      };
      return _this2;
    }

    TestStore.prototype.handleGetSomething = function handleGetSomething(something) {
      this.setState({ something: something });
    };

    return TestStore;
  }(_Flux.Store);

  var Flux = function (_Flummox) {
    _inherits(Flux, _Flummox);

    function Flux() {
      _classCallCheck(this, Flux);

      var _this3 = _possibleConstructorReturn(this, _Flummox.call(this));

      _this3.createActions('test', TestActions);
      _this3.createStore('test', TestStore, _this3);
      _this3.createStore('test2', TestStore, _this3);
      return _this3;
    }

    return Flux;
  }(_Flux.Flummox);

  var ComponentWithFluxMixin = _react2['default'].createClass({
    displayName: 'ComponentWithFluxMixin',

    mixins: [(0, _fluxMixin2['default'])()],

    render: function render() {
      return null;
    }
  });

  it('gets flux from either props or context', function () {
    var flux = new Flux();
    var contextComponent = void 0,
        propsComponent = void 0;

    var ContextComponent = (0, _addContext2['default'])(ComponentWithFluxMixin, { flux: flux }, { flux: _react2['default'].PropTypes.instanceOf(_Flux.Flummox) });

    var tree = _reactAddonsTestUtils2['default'].renderIntoDocument(_react2['default'].createElement(ContextComponent, null));

    contextComponent = _reactAddonsTestUtils2['default'].findRenderedComponentWithType(tree, ComponentWithFluxMixin);

    propsComponent = _reactAddonsTestUtils2['default'].renderIntoDocument(_react2['default'].createElement(ComponentWithFluxMixin, { flux: flux }));

    expect(contextComponent.flux).to.be.an['instanceof'](_Flux.Flummox);
    expect(propsComponent.flux).to.be.an['instanceof'](_Flux.Flummox);
  });

  it('exposes flux as context', function () {
    var flux = new Flux();

    var ChildComponent = _react2['default'].createClass({
      displayName: 'ChildComponent',

      contextTypes: {
        flux: PropTypes.instanceOf(_Flux.Flummox)
      },

      render: function render() {
        return _react2['default'].createElement('div', null);
      }
    });

    var Component = _react2['default'].createClass({
      displayName: 'Component',

      mixins: [(0, _fluxMixin2['default'])()],

      render: function render() {
        return _react2['default'].createElement(
          'div',
          null,
          _react2['default'].createElement(ChildComponent, { key: 'test' })
        );
      }
    });

    var tree = _reactAddonsTestUtils2['default'].renderIntoDocument(_react2['default'].createElement(Component, { flux: flux }));

    var childComponent = _reactAddonsTestUtils2['default'].findRenderedComponentWithType(tree, ChildComponent);

    expect(childComponent.context.flux).to.equal(flux);
  });

  it('throws error if neither props or context is set', function () {
    var flux = new Flux();

    expect(_reactAddonsTestUtils2['default'].renderIntoDocument.bind(null, _react2['default'].createElement(ComponentWithFluxMixin, null))).to['throw']('fluxMixin: Could not find Flux instance. Ensure that your component ' + 'has either `this.context.flux` or `this.props.flux`.');
  });

  it('ignores change event after unmounted', function () {
    var flux = new Flux();
    flux.getActions('test').getSomething('foo');

    var getterMap = {
      test: function test(store) {
        return { something: store.state.something };
      }
    };
    var Component = _react2['default'].createClass({
      displayName: 'Component',

      mixins: [(0, _fluxMixin2['default'])(getterMap)],

      render: function render() {
        return null;
      }
    });

    var container = document.createElement('div');
    var component = _reactDom2['default'].render(_react2['default'].createElement(Component, { flux: flux }), container);
    var listener = flux.getStore('test').listeners('change')[0];

    _reactDom2['default'].unmountComponentAtNode(container);

    flux.getActions('test').getSomething('bar');
    listener();

    expect(component.state.something).to.equal('foo');
  });

  it('uses #connectToStores() to get initial state', function () {
    var flux = new Flux();

    flux.getActions('test').getSomething('foobar');

    var getterMap = {
      test: function test(store) {
        return {
          something: store.state.something,
          custom: true
        };
      }
    };

    var mixin = (0, _fluxMixin2['default'])(getterMap);

    var connectToStores = _sinon2['default'].spy(mixin, 'connectToStores');

    var Component = _react2['default'].createClass({
      displayName: 'Component',

      mixins: [mixin],

      getInitialState: function getInitialState() {
        return {
          foobar: 'baz'
        };
      },
      render: function render() {
        return null;
      }
    });

    var component = _reactAddonsTestUtils2['default'].renderIntoDocument(_react2['default'].createElement(Component, { key: 'test', flux: flux }));

    expect(connectToStores.calledOnce).to.be['true'];
    expect(connectToStores.firstCall.args[0]).to.equal(getterMap);

    expect(flux.getStore('test').listeners('change')).to.have.length(1);

    expect(component.state).to.deep.equal({
      something: 'foobar',
      custom: true,
      foobar: 'baz'
    });
  });

  describe('#connectToStores', function () {

    it('returns initial state', function () {
      var flux = new Flux();

      var component = _reactAddonsTestUtils2['default'].renderIntoDocument(_react2['default'].createElement(ComponentWithFluxMixin, { key: 'test', flux: flux }));

      var initialState = component.connectToStores('test');

      expect(initialState).to.deep.equal({
        something: null
      });
    });

    it('merges store state with component state on change', function () {
      var flux = new Flux();

      var component = _reactAddonsTestUtils2['default'].renderIntoDocument(_react2['default'].createElement(ComponentWithFluxMixin, { key: 'test', flux: flux }));

      component.setState({ otherThing: 'barbaz' });

      component.connectToStores('test');
      flux.getActions('test').getSomething('foobar');

      expect(component.state).to.deep.equal({
        something: 'foobar',
        otherThing: 'barbaz'
      });
    });

    it('uses custom state getter, if given', function () {
      var flux = new Flux();

      var component = _reactAddonsTestUtils2['default'].renderIntoDocument(_react2['default'].createElement(ComponentWithFluxMixin, { key: 'test', flux: flux, bar: 'baz' }));

      component.setState({ otherThing: 'barbaz' });

      component.connectToStores('test', function (store, props) {
        return {
          something: store.state.something,
          barbaz: 'bar' + props.bar
        };
      });

      flux.getActions('test').getSomething('foobar');

      expect(component.state).to.deep.equal({
        something: 'foobar',
        otherThing: 'barbaz',
        barbaz: 'barbaz'
      });
    });

    it('syncs with store after prop change', function () {
      var flux = new Flux();

      var Component = _react2['default'].createClass({
        displayName: 'Component',

        mixins: [(0, _fluxMixin2['default'])({
          test: function test(store, props) {
            return {
              foo: 'foo is ' + props.foo
            };
          }
        })],

        render: function render() {
          return null;
        }
      });

      var component = _reactAddonsTestUtils2['default'].renderIntoDocument(_react2['default'].createElement(Component, { key: 'test', flux: flux, foo: 'bar' }));

      expect(component.state.foo).to.equal('foo is bar');

      component = _reactAddonsTestUtils2['default'].renderIntoDocument(_react2['default'].createElement(Component, { key: 'test', flux: flux, foo: 'baz' }));

      expect(component.state.foo).to.equal('foo is baz');
    });

    it('accepts object of keys to state getters', function () {
      var flux = new Flux();

      var component = _reactAddonsTestUtils2['default'].renderIntoDocument(_react2['default'].createElement(ComponentWithFluxMixin, { key: 'test', flux: flux }));

      component.setState({ otherThing: 'barbaz' });

      component.connectToStores({
        test: function test(store) {
          return {
            something: store.state.something,
            custom: true
          };
        }
      });

      flux.getActions('test').getSomething('foobar');

      expect(component.state).to.deep.equal({
        something: 'foobar',
        otherThing: 'barbaz',
        custom: true
      });
    });

    it('calls default state getter once with array of stores', function () {
      var flux = new Flux();

      flux.getStore('test2').setState({ otherThing: 'barbaz' });

      var component = _reactAddonsTestUtils2['default'].renderIntoDocument(_react2['default'].createElement(ComponentWithFluxMixin, { key: 'test', flux: flux }));

      component.connectToStores(['test', 'test2']);

      flux.getActions('test').getSomething('foobar');

      expect(component.state).to.deep.equal({
        something: 'foobar',
        otherThing: 'barbaz'
      });
    });

    it('calls custom state getter once with array of stores', function () {
      var flux = new Flux();
      var testStore = flux.getStore('test');
      var test2Store = flux.getStore('test2');

      testStore._testId = 'test';
      test2Store._testId = 'test2';

      var component = _reactAddonsTestUtils2['default'].renderIntoDocument(_react2['default'].createElement(ComponentWithFluxMixin, { key: 'test', flux: flux }));

      var stateGetter = _sinon2['default'].stub().returns({ foo: 'bar' });
      var state = component.connectToStores(['test', 'test2'], stateGetter);

      expect(stateGetter.calledOnce).to.be['true'];
      // Use _testId as unique identifier on store.
      expect(stateGetter.firstCall.args[0][0]._testId).to.equal('test');
      expect(stateGetter.firstCall.args[0][1]._testId).to.equal('test2');

      expect(state).to.deep.equal({
        foo: 'bar'
      });
    });

    it('uses default getter if null is passed as getter', function () {
      var flux = new Flux();

      var component = _reactAddonsTestUtils2['default'].renderIntoDocument(_react2['default'].createElement(ComponentWithFluxMixin, { key: 'test', flux: flux }));

      component.setState({ otherThing: 'barbaz' });

      component.connectToStores('test', null);

      flux.getActions('test').getSomething('foobar');

      expect(component.state).to.deep.equal({
        something: 'foobar',
        otherThing: 'barbaz'
      });
    });

    it('removes listener before unmounting', function () {
      var flux = new Flux();
      var div = document.createElement('div');

      var component = _reactDom2['default'].render(_react2['default'].createElement(ComponentWithFluxMixin, { flux: flux }), div);

      var store = flux.getStore('test');
      component.connectToStores('test');

      expect(store.listeners('change').length).to.equal(1);
      _reactDom2['default'].unmountComponentAtNode(div);
      expect(store.listeners('change').length).to.equal(0);
    });
  });

  describe('#getStoreState', function () {
    it('gets combined state of connected stores', function () {
      var flux = new Flux();

      var component = _reactAddonsTestUtils2['default'].renderIntoDocument(_react2['default'].createElement(ComponentWithFluxMixin, { key: 'test', flux: flux }));

      component.connectToStores({
        test: function test(store) {
          return {
            foo: 'bar'
          };
        },
        test2: function test2(store) {
          return {
            bar: 'baz'
          };
        }
      });

      component.setState({ baz: 'foo' });

      expect(component.getStoreState()).to.deep.equal({
        foo: 'bar',
        bar: 'baz'
      });
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hZGRvbnMvX190ZXN0c19fL2ZsdXhNaXhpbi10ZXN0LmpzIl0sIm5hbWVzIjpbIlByb3BUeXBlcyIsImRlc2NyaWJlIiwiVGVzdEFjdGlvbnMiLCJnZXRTb21ldGhpbmciLCJzb21ldGhpbmciLCJUZXN0U3RvcmUiLCJmbHV4IiwidGVzdEFjdGlvbnMiLCJnZXRBY3Rpb25zIiwicmVnaXN0ZXIiLCJoYW5kbGVHZXRTb21ldGhpbmciLCJzdGF0ZSIsInNldFN0YXRlIiwiRmx1eCIsImNyZWF0ZUFjdGlvbnMiLCJjcmVhdGVTdG9yZSIsIkNvbXBvbmVudFdpdGhGbHV4TWl4aW4iLCJjcmVhdGVDbGFzcyIsIm1peGlucyIsInJlbmRlciIsIml0IiwiY29udGV4dENvbXBvbmVudCIsInByb3BzQ29tcG9uZW50IiwiQ29udGV4dENvbXBvbmVudCIsImluc3RhbmNlT2YiLCJ0cmVlIiwicmVuZGVySW50b0RvY3VtZW50IiwiZmluZFJlbmRlcmVkQ29tcG9uZW50V2l0aFR5cGUiLCJleHBlY3QiLCJ0byIsImJlIiwiYW4iLCJDaGlsZENvbXBvbmVudCIsImNvbnRleHRUeXBlcyIsIkNvbXBvbmVudCIsImNoaWxkQ29tcG9uZW50IiwiY29udGV4dCIsImVxdWFsIiwiYmluZCIsImdldHRlck1hcCIsInRlc3QiLCJzdG9yZSIsImNvbnRhaW5lciIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImNvbXBvbmVudCIsImxpc3RlbmVyIiwiZ2V0U3RvcmUiLCJsaXN0ZW5lcnMiLCJ1bm1vdW50Q29tcG9uZW50QXROb2RlIiwiY3VzdG9tIiwibWl4aW4iLCJjb25uZWN0VG9TdG9yZXMiLCJzcHkiLCJnZXRJbml0aWFsU3RhdGUiLCJmb29iYXIiLCJjYWxsZWRPbmNlIiwiZmlyc3RDYWxsIiwiYXJncyIsImhhdmUiLCJsZW5ndGgiLCJkZWVwIiwiaW5pdGlhbFN0YXRlIiwib3RoZXJUaGluZyIsInByb3BzIiwiYmFyYmF6IiwiYmFyIiwiZm9vIiwidGVzdFN0b3JlIiwidGVzdDJTdG9yZSIsIl90ZXN0SWQiLCJzdGF0ZUdldHRlciIsInN0dWIiLCJyZXR1cm5zIiwiZGl2IiwidGVzdDIiLCJiYXoiLCJnZXRTdG9yZVN0YXRlIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0lBQ1FBLFMsc0JBQUFBLFM7OztBQUVSQyxTQUFTLFdBQVQsRUFBc0IsWUFBTTtBQUFBLE1BRXBCQyxXQUZvQjtBQUFBOztBQUFBO0FBQUE7O0FBQUE7QUFBQTs7QUFBQSwwQkFHeEJDLFlBSHdCLHlCQUdYQyxTQUhXLEVBR0E7QUFDdEIsYUFBT0EsU0FBUDtBQUNELEtBTHVCOztBQUFBO0FBQUE7O0FBQUEsTUFRcEJDLFNBUm9CO0FBQUE7O0FBU3hCLHVCQUFZQyxJQUFaLEVBQWtCO0FBQUE7O0FBQUEsb0RBQ2hCLGlCQURnQjs7QUFHaEIsVUFBTUMsY0FBY0QsS0FBS0UsVUFBTCxDQUFnQixNQUFoQixDQUFwQjtBQUNBLGFBQUtDLFFBQUwsQ0FBY0YsWUFBWUosWUFBMUIsRUFBd0MsT0FBS08sa0JBQTdDOztBQUVBLGFBQUtDLEtBQUwsR0FBYTtBQUNYUCxtQkFBVztBQURBLE9BQWI7QUFOZ0I7QUFTakI7O0FBbEJ1Qix3QkFvQnhCTSxrQkFwQndCLCtCQW9CTE4sU0FwQkssRUFvQk07QUFDNUIsV0FBS1EsUUFBTCxDQUFjLEVBQUVSLG9CQUFGLEVBQWQ7QUFDRCxLQXRCdUI7O0FBQUE7QUFBQTs7QUFBQSxNQXlCcEJTLElBekJvQjtBQUFBOztBQTBCeEIsb0JBQWM7QUFBQTs7QUFBQSxvREFDWixtQkFEWTs7QUFHWixhQUFLQyxhQUFMLENBQW1CLE1BQW5CLEVBQTJCWixXQUEzQjtBQUNBLGFBQUthLFdBQUwsQ0FBaUIsTUFBakIsRUFBeUJWLFNBQXpCO0FBQ0EsYUFBS1UsV0FBTCxDQUFpQixPQUFqQixFQUEwQlYsU0FBMUI7QUFMWTtBQU1iOztBQWhDdUI7QUFBQTs7QUFtQzFC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LE1BQU1PLFNBQU4sQ0FBZ0IsUUFBaEIsRUFBMEJZLE1BQWpDLEVBQXlDL0IsRUFBekMsQ0FBNENRLEtBQTVDLENBQWtELENBQWxEO0FBQ0QsS0FaRDtBQWNELEdBN0xEOztBQStMQXBDLFdBQVMsZ0JBQVQsRUFBMkIsWUFBTTtBQUMvQm1CLE9BQUcseUNBQUgsRUFBOEMsWUFBTTtBQUNsRCxVQUFNZCxPQUFPLElBQUlPLElBQUosRUFBYjs7QUFFQSxVQUFNZ0MsWUFBWSxrQ0FBVW5CLGtCQUFWLENBQ2hCLGlDQUFDLHNCQUFELElBQXdCLEtBQUksTUFBNUIsRUFBbUMsTUFBTXBCLElBQXpDLEdBRGdCLENBQWxCOztBQUlBdUMsZ0JBQVVPLGVBQVYsQ0FBMEI7QUFDeEJaLGNBQU07QUFBQSxpQkFBVTtBQUNkMkIsaUJBQUs7QUFEUyxXQUFWO0FBQUEsU0FEa0I7QUFJeEJRLGVBQU87QUFBQSxpQkFBVTtBQUNmVCxpQkFBSztBQURVLFdBQVY7QUFBQTtBQUppQixPQUExQjs7QUFTQXJCLGdCQUFVakMsUUFBVixDQUFtQixFQUFFZ0UsS0FBSyxLQUFQLEVBQW5COztBQUVBaEQsYUFBT2lCLFVBQVVnQyxhQUFWLEVBQVAsRUFBa0NoRCxFQUFsQyxDQUFxQ2dDLElBQXJDLENBQTBDeEIsS0FBMUMsQ0FBZ0Q7QUFDOUM4QixhQUFLLEtBRHlDO0FBRTlDRCxhQUFLO0FBRnlDLE9BQWhEO0FBSUQsS0F0QkQ7QUF1QkQsR0F4QkQ7QUEwQkQsQ0FyWkQiLCJmaWxlIjoiZmx1eE1peGluLXRlc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZmx1eE1peGluIGZyb20gJy4uL2ZsdXhNaXhpbic7XG5pbXBvcnQgeyBGbHVtbW94LCBTdG9yZSwgQWN0aW9ucyB9IGZyb20gJy4uLy4uL0ZsdXgnO1xuaW1wb3J0IGFkZENvbnRleHQgZnJvbSAnLi9hZGRDb250ZXh0JztcbmltcG9ydCBzaW5vbiBmcm9tICdzaW5vbic7XG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUmVhY3RET00gZnJvbSAncmVhY3QtZG9tJztcbmltcG9ydCBUZXN0VXRpbHMgZnJvbSAncmVhY3QtYWRkb25zLXRlc3QtdXRpbHMnXG5jb25zdCB7IFByb3BUeXBlcyB9ID0gUmVhY3Q7XG5cbmRlc2NyaWJlKCdmbHV4TWl4aW4nLCAoKSA9PiB7XG5cbiAgY2xhc3MgVGVzdEFjdGlvbnMgZXh0ZW5kcyBBY3Rpb25zIHtcbiAgICBnZXRTb21ldGhpbmcoc29tZXRoaW5nKSB7XG4gICAgICByZXR1cm4gc29tZXRoaW5nO1xuICAgIH1cbiAgfVxuXG4gIGNsYXNzIFRlc3RTdG9yZSBleHRlbmRzIFN0b3JlIHtcbiAgICBjb25zdHJ1Y3RvcihmbHV4KSB7XG4gICAgICBzdXBlcigpO1xuXG4gICAgICBjb25zdCB0ZXN0QWN0aW9ucyA9IGZsdXguZ2V0QWN0aW9ucygndGVzdCcpO1xuICAgICAgdGhpcy5yZWdpc3Rlcih0ZXN0QWN0aW9ucy5nZXRTb21ldGhpbmcsIHRoaXMuaGFuZGxlR2V0U29tZXRoaW5nKTtcblxuICAgICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgICAgc29tZXRoaW5nOiBudWxsXG4gICAgICB9O1xuICAgIH1cblxuICAgIGhhbmRsZUdldFNvbWV0aGluZyhzb21ldGhpbmcpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBzb21ldGhpbmcgfSk7XG4gICAgfVxuICB9XG5cbiAgY2xhc3MgRmx1eCBleHRlbmRzIEZsdW1tb3gge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgc3VwZXIoKTtcblxuICAgICAgdGhpcy5jcmVhdGVBY3Rpb25zKCd0ZXN0JywgVGVzdEFjdGlvbnMpO1xuICAgICAgdGhpcy5jcmVhdGVTdG9yZSgndGVzdCcsIFRlc3RTdG9yZSwgdGhpcyk7XG4gICAgICB0aGlzLmNyZWF0ZVN0b3JlKCd0ZXN0MicsIFRlc3RTdG9yZSwgdGhpcyk7XG4gICAgfVxuICB9XG5cbiAgY29uc3QgQ29tcG9uZW50V2l0aEZsdXhNaXhpbiA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgICBtaXhpbnM6IFtmbHV4TWl4aW4oKV0sXG5cbiAgICByZW5kZXIoKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH0pO1xuXG4gIGl0KCdnZXRzIGZsdXggZnJvbSBlaXRoZXIgcHJvcHMgb3IgY29udGV4dCcsICgpID0+IHtcbiAgICBjb25zdCBmbHV4ID0gbmV3IEZsdXgoKTtcbiAgICBsZXQgY29udGV4dENvbXBvbmVudCwgcHJvcHNDb21wb25lbnQ7XG5cbiAgICBjb25zdCBDb250ZXh0Q29tcG9uZW50ID0gYWRkQ29udGV4dChcbiAgICAgIENvbXBvbmVudFdpdGhGbHV4TWl4aW4sXG4gICAgICB7IGZsdXggfSxcbiAgICAgIHsgZmx1eDogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoRmx1bW1veCkgfVxuICAgICk7XG5cbiAgICBjb25zdCB0cmVlID0gVGVzdFV0aWxzLnJlbmRlckludG9Eb2N1bWVudChcbiAgICAgIDxDb250ZXh0Q29tcG9uZW50IC8+XG4gICAgKTtcblxuICAgIGNvbnRleHRDb21wb25lbnQgPSBUZXN0VXRpbHMuZmluZFJlbmRlcmVkQ29tcG9uZW50V2l0aFR5cGUoXG4gICAgICB0cmVlLCBDb21wb25lbnRXaXRoRmx1eE1peGluXG4gICAgKTtcblxuICAgIHByb3BzQ29tcG9uZW50ID0gVGVzdFV0aWxzLnJlbmRlckludG9Eb2N1bWVudChcbiAgICAgIDxDb21wb25lbnRXaXRoRmx1eE1peGluIGZsdXg9e2ZsdXh9IC8+XG4gICAgKTtcblxuICAgIGV4cGVjdChjb250ZXh0Q29tcG9uZW50LmZsdXgpLnRvLmJlLmFuLmluc3RhbmNlb2YoRmx1bW1veCk7XG4gICAgZXhwZWN0KHByb3BzQ29tcG9uZW50LmZsdXgpLnRvLmJlLmFuLmluc3RhbmNlb2YoRmx1bW1veCk7XG4gIH0pO1xuXG4gIGl0KCdleHBvc2VzIGZsdXggYXMgY29udGV4dCcsICgpID0+IHtcbiAgICBjb25zdCBmbHV4ID0gbmV3IEZsdXgoKTtcblxuICAgIGNvbnN0IENoaWxkQ29tcG9uZW50ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICAgICAgY29udGV4dFR5cGVzOiB7XG4gICAgICAgIGZsdXg6IFByb3BUeXBlcy5pbnN0YW5jZU9mKEZsdW1tb3gpLFxuICAgICAgfSxcblxuICAgICAgcmVuZGVyKCkge1xuICAgICAgICByZXR1cm4gPGRpdiAvPjtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGNvbnN0IENvbXBvbmVudCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgICAgIG1peGluczogW2ZsdXhNaXhpbigpXSxcblxuICAgICAgcmVuZGVyKCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8Q2hpbGRDb21wb25lbnQga2V5PVwidGVzdFwiIC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25zdCB0cmVlID0gVGVzdFV0aWxzLnJlbmRlckludG9Eb2N1bWVudCg8Q29tcG9uZW50IGZsdXg9e2ZsdXh9IC8+KTtcblxuICAgIGNvbnN0IGNoaWxkQ29tcG9uZW50ID0gVGVzdFV0aWxzLmZpbmRSZW5kZXJlZENvbXBvbmVudFdpdGhUeXBlKFxuICAgICAgdHJlZSxcbiAgICAgIENoaWxkQ29tcG9uZW50XG4gICAgKTtcblxuICAgIGV4cGVjdChjaGlsZENvbXBvbmVudC5jb250ZXh0LmZsdXgpLnRvLmVxdWFsKGZsdXgpO1xuICB9KTtcblxuICBpdCgndGhyb3dzIGVycm9yIGlmIG5laXRoZXIgcHJvcHMgb3IgY29udGV4dCBpcyBzZXQnLCAoKSA9PiB7XG4gICAgY29uc3QgZmx1eCA9IG5ldyBGbHV4KCk7XG5cbiAgICBleHBlY3QoVGVzdFV0aWxzLnJlbmRlckludG9Eb2N1bWVudC5iaW5kKG51bGwsIDxDb21wb25lbnRXaXRoRmx1eE1peGluIC8+KSlcbiAgICAgIC50by50aHJvdyhcbiAgICAgICAgJ2ZsdXhNaXhpbjogQ291bGQgbm90IGZpbmQgRmx1eCBpbnN0YW5jZS4gRW5zdXJlIHRoYXQgeW91ciBjb21wb25lbnQgJ1xuICAgICAgKyAnaGFzIGVpdGhlciBgdGhpcy5jb250ZXh0LmZsdXhgIG9yIGB0aGlzLnByb3BzLmZsdXhgLidcbiAgICAgICk7XG4gIH0pO1xuXG4gIGl0KCdpZ25vcmVzIGNoYW5nZSBldmVudCBhZnRlciB1bm1vdW50ZWQnLCAoKSA9PiB7XG4gICAgY29uc3QgZmx1eCA9IG5ldyBGbHV4KCk7XG4gICAgZmx1eC5nZXRBY3Rpb25zKCd0ZXN0JykuZ2V0U29tZXRoaW5nKCdmb28nKTtcblxuICAgIGNvbnN0IGdldHRlck1hcCA9IHtcbiAgICAgIHRlc3Q6IHN0b3JlID0+ICh7IHNvbWV0aGluZzogc3RvcmUuc3RhdGUuc29tZXRoaW5nIH0pXG4gICAgfTtcbiAgICBjb25zdCBDb21wb25lbnQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gICAgICBtaXhpbnM6IFtmbHV4TWl4aW4oZ2V0dGVyTWFwKV0sXG5cbiAgICAgIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBjb25zdCBjb21wb25lbnQgPSBSZWFjdERPTS5yZW5kZXIoPENvbXBvbmVudCBmbHV4PXtmbHV4fSAvPiwgY29udGFpbmVyKTtcbiAgICBjb25zdCBsaXN0ZW5lciA9IGZsdXguZ2V0U3RvcmUoJ3Rlc3QnKS5saXN0ZW5lcnMoJ2NoYW5nZScpWzBdO1xuXG4gICAgUmVhY3RET00udW5tb3VudENvbXBvbmVudEF0Tm9kZShjb250YWluZXIpO1xuXG4gICAgZmx1eC5nZXRBY3Rpb25zKCd0ZXN0JykuZ2V0U29tZXRoaW5nKCdiYXInKTtcbiAgICBsaXN0ZW5lcigpO1xuXG4gICAgZXhwZWN0KGNvbXBvbmVudC5zdGF0ZS5zb21ldGhpbmcpLnRvLmVxdWFsKCdmb28nKTtcbiAgfSk7XG5cbiAgaXQoJ3VzZXMgI2Nvbm5lY3RUb1N0b3JlcygpIHRvIGdldCBpbml0aWFsIHN0YXRlJywgKCkgPT4ge1xuICAgIGNvbnN0IGZsdXggPSBuZXcgRmx1eCgpO1xuXG4gICAgZmx1eC5nZXRBY3Rpb25zKCd0ZXN0JykuZ2V0U29tZXRoaW5nKCdmb29iYXInKTtcblxuICAgIGNvbnN0IGdldHRlck1hcCA9IHtcbiAgICAgIHRlc3Q6IHN0b3JlID0+ICh7XG4gICAgICAgIHNvbWV0aGluZzogc3RvcmUuc3RhdGUuc29tZXRoaW5nLFxuICAgICAgICBjdXN0b206IHRydWUsXG4gICAgICB9KSxcbiAgICB9O1xuXG4gICAgY29uc3QgbWl4aW4gPSBmbHV4TWl4aW4oZ2V0dGVyTWFwKTtcblxuICAgIGNvbnN0IGNvbm5lY3RUb1N0b3JlcyA9IHNpbm9uLnNweShtaXhpbiwgJ2Nvbm5lY3RUb1N0b3JlcycpO1xuXG4gICAgY29uc3QgQ29tcG9uZW50ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICAgICAgbWl4aW5zOiBbbWl4aW5dLFxuXG4gICAgICBnZXRJbml0aWFsU3RhdGUoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZm9vYmFyOiAnYmF6JyxcbiAgICAgICAgfTtcbiAgICAgIH0sXG5cbiAgICAgIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25zdCBjb21wb25lbnQgPSBUZXN0VXRpbHMucmVuZGVySW50b0RvY3VtZW50KFxuICAgICAgPENvbXBvbmVudCBrZXk9XCJ0ZXN0XCIgZmx1eD17Zmx1eH0gLz5cbiAgICApO1xuXG4gICAgZXhwZWN0KGNvbm5lY3RUb1N0b3Jlcy5jYWxsZWRPbmNlKS50by5iZS50cnVlO1xuICAgIGV4cGVjdChjb25uZWN0VG9TdG9yZXMuZmlyc3RDYWxsLmFyZ3NbMF0pLnRvLmVxdWFsKGdldHRlck1hcCk7XG5cbiAgICBleHBlY3QoZmx1eC5nZXRTdG9yZSgndGVzdCcpLmxpc3RlbmVycygnY2hhbmdlJykpLnRvLmhhdmUubGVuZ3RoKDEpO1xuXG4gICAgZXhwZWN0KGNvbXBvbmVudC5zdGF0ZSkudG8uZGVlcC5lcXVhbCh7XG4gICAgICBzb21ldGhpbmc6ICdmb29iYXInLFxuICAgICAgY3VzdG9tOiB0cnVlLFxuICAgICAgZm9vYmFyOiAnYmF6JyxcbiAgICB9KTtcblxuICB9KTtcblxuICBkZXNjcmliZSgnI2Nvbm5lY3RUb1N0b3JlcycsICgpID0+IHtcblxuICAgIGl0KCdyZXR1cm5zIGluaXRpYWwgc3RhdGUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBmbHV4ID0gbmV3IEZsdXgoKTtcblxuICAgICAgY29uc3QgY29tcG9uZW50ID0gVGVzdFV0aWxzLnJlbmRlckludG9Eb2N1bWVudChcbiAgICAgICAgPENvbXBvbmVudFdpdGhGbHV4TWl4aW4ga2V5PVwidGVzdFwiIGZsdXg9e2ZsdXh9IC8+XG4gICAgICApO1xuXG4gICAgICBjb25zdCBpbml0aWFsU3RhdGUgPSBjb21wb25lbnQuY29ubmVjdFRvU3RvcmVzKCd0ZXN0Jyk7XG5cbiAgICAgIGV4cGVjdChpbml0aWFsU3RhdGUpLnRvLmRlZXAuZXF1YWwoe1xuICAgICAgICBzb21ldGhpbmc6IG51bGwsXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdtZXJnZXMgc3RvcmUgc3RhdGUgd2l0aCBjb21wb25lbnQgc3RhdGUgb24gY2hhbmdlJywgKCkgPT4ge1xuICAgICAgY29uc3QgZmx1eCA9IG5ldyBGbHV4KCk7XG5cbiAgICAgIGNvbnN0IGNvbXBvbmVudCA9IFRlc3RVdGlscy5yZW5kZXJJbnRvRG9jdW1lbnQoXG4gICAgICAgIDxDb21wb25lbnRXaXRoRmx1eE1peGluIGtleT1cInRlc3RcIiBmbHV4PXtmbHV4fSAvPlxuICAgICAgKTtcblxuICAgICAgY29tcG9uZW50LnNldFN0YXRlKHsgb3RoZXJUaGluZzogJ2JhcmJheicgfSk7XG5cbiAgICAgIGNvbXBvbmVudC5jb25uZWN0VG9TdG9yZXMoJ3Rlc3QnKTtcbiAgICAgIGZsdXguZ2V0QWN0aW9ucygndGVzdCcpLmdldFNvbWV0aGluZygnZm9vYmFyJyk7XG5cbiAgICAgIGV4cGVjdChjb21wb25lbnQuc3RhdGUpLnRvLmRlZXAuZXF1YWwoe1xuICAgICAgICBzb21ldGhpbmc6ICdmb29iYXInLFxuICAgICAgICBvdGhlclRoaW5nOiAnYmFyYmF6JyxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3VzZXMgY3VzdG9tIHN0YXRlIGdldHRlciwgaWYgZ2l2ZW4nLCAoKSA9PiB7XG4gICAgICBjb25zdCBmbHV4ID0gbmV3IEZsdXgoKTtcblxuICAgICAgY29uc3QgY29tcG9uZW50ID0gVGVzdFV0aWxzLnJlbmRlckludG9Eb2N1bWVudChcbiAgICAgICAgPENvbXBvbmVudFdpdGhGbHV4TWl4aW4ga2V5PVwidGVzdFwiIGZsdXg9e2ZsdXh9IGJhcj1cImJhelwiIC8+XG4gICAgICApO1xuXG4gICAgICBjb21wb25lbnQuc2V0U3RhdGUoeyBvdGhlclRoaW5nOiAnYmFyYmF6JyB9KTtcblxuICAgICAgY29tcG9uZW50LmNvbm5lY3RUb1N0b3JlcygndGVzdCcsIChzdG9yZSwgcHJvcHMpID0+ICh7XG4gICAgICAgIHNvbWV0aGluZzogc3RvcmUuc3RhdGUuc29tZXRoaW5nLFxuICAgICAgICBiYXJiYXo6ICdiYXInICsgcHJvcHMuYmFyLFxuICAgICAgfSkpO1xuXG4gICAgICBmbHV4LmdldEFjdGlvbnMoJ3Rlc3QnKS5nZXRTb21ldGhpbmcoJ2Zvb2JhcicpO1xuXG4gICAgICBleHBlY3QoY29tcG9uZW50LnN0YXRlKS50by5kZWVwLmVxdWFsKHtcbiAgICAgICAgc29tZXRoaW5nOiAnZm9vYmFyJyxcbiAgICAgICAgb3RoZXJUaGluZzogJ2JhcmJheicsXG4gICAgICAgIGJhcmJhejogJ2JhcmJheicsXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzeW5jcyB3aXRoIHN0b3JlIGFmdGVyIHByb3AgY2hhbmdlJywgKCkgPT4ge1xuICAgICAgY29uc3QgZmx1eCA9IG5ldyBGbHV4KCk7XG5cbiAgICAgIGNvbnN0IENvbXBvbmVudCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgICAgICAgbWl4aW5zOiBbZmx1eE1peGluKHtcbiAgICAgICAgICB0ZXN0OiBmdW5jdGlvbihzdG9yZSwgcHJvcHMpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIGZvbzogJ2ZvbyBpcyAnICsgcHJvcHMuZm9vLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9LFxuICAgICAgICB9KV0sXG5cbiAgICAgICAgcmVuZGVyKCkge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgbGV0IGNvbXBvbmVudCA9IFRlc3RVdGlscy5yZW5kZXJJbnRvRG9jdW1lbnQoXG4gICAgICAgIDxDb21wb25lbnQga2V5PVwidGVzdFwiIGZsdXg9e2ZsdXh9IGZvbz1cImJhclwiIC8+XG4gICAgICApO1xuXG4gICAgICBleHBlY3QoY29tcG9uZW50LnN0YXRlLmZvbykudG8uZXF1YWwoJ2ZvbyBpcyBiYXInKTtcblxuICAgICAgY29tcG9uZW50ID0gVGVzdFV0aWxzLnJlbmRlckludG9Eb2N1bWVudChcbiAgICAgICAgPENvbXBvbmVudCBrZXk9XCJ0ZXN0XCIgZmx1eD17Zmx1eH0gZm9vPVwiYmF6XCIgLz5cbiAgICAgICk7XG5cbiAgICAgIGV4cGVjdChjb21wb25lbnQuc3RhdGUuZm9vKS50by5lcXVhbCgnZm9vIGlzIGJheicpO1xuICAgIH0pO1xuXG4gICAgaXQoJ2FjY2VwdHMgb2JqZWN0IG9mIGtleXMgdG8gc3RhdGUgZ2V0dGVycycsICgpID0+IHtcbiAgICAgIGNvbnN0IGZsdXggPSBuZXcgRmx1eCgpO1xuXG4gICAgICBjb25zdCBjb21wb25lbnQgPSBUZXN0VXRpbHMucmVuZGVySW50b0RvY3VtZW50KFxuICAgICAgICA8Q29tcG9uZW50V2l0aEZsdXhNaXhpbiBrZXk9XCJ0ZXN0XCIgZmx1eD17Zmx1eH0gLz5cbiAgICAgICk7XG5cbiAgICAgIGNvbXBvbmVudC5zZXRTdGF0ZSh7IG90aGVyVGhpbmc6ICdiYXJiYXonIH0pO1xuXG4gICAgICBjb21wb25lbnQuY29ubmVjdFRvU3RvcmVzKHtcbiAgICAgICAgdGVzdDogc3RvcmUgPT4gKHtcbiAgICAgICAgICBzb21ldGhpbmc6IHN0b3JlLnN0YXRlLnNvbWV0aGluZyxcbiAgICAgICAgICBjdXN0b206IHRydWUsXG4gICAgICAgIH0pLFxuICAgICAgfSk7XG5cbiAgICAgIGZsdXguZ2V0QWN0aW9ucygndGVzdCcpLmdldFNvbWV0aGluZygnZm9vYmFyJyk7XG5cbiAgICAgIGV4cGVjdChjb21wb25lbnQuc3RhdGUpLnRvLmRlZXAuZXF1YWwoe1xuICAgICAgICBzb21ldGhpbmc6ICdmb29iYXInLFxuICAgICAgICBvdGhlclRoaW5nOiAnYmFyYmF6JyxcbiAgICAgICAgY3VzdG9tOiB0cnVlLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnY2FsbHMgZGVmYXVsdCBzdGF0ZSBnZXR0ZXIgb25jZSB3aXRoIGFycmF5IG9mIHN0b3JlcycsICgpID0+IHtcbiAgICAgIGNvbnN0IGZsdXggPSBuZXcgRmx1eCgpO1xuXG4gICAgICBmbHV4LmdldFN0b3JlKCd0ZXN0MicpLnNldFN0YXRlKHsgb3RoZXJUaGluZzogJ2JhcmJheicgfSk7XG5cbiAgICAgIGNvbnN0IGNvbXBvbmVudCA9IFRlc3RVdGlscy5yZW5kZXJJbnRvRG9jdW1lbnQoXG4gICAgICAgIDxDb21wb25lbnRXaXRoRmx1eE1peGluIGtleT1cInRlc3RcIiBmbHV4PXtmbHV4fSAvPlxuICAgICAgKTtcblxuICAgICAgY29tcG9uZW50LmNvbm5lY3RUb1N0b3JlcyhbJ3Rlc3QnLCAndGVzdDInXSk7XG5cbiAgICAgIGZsdXguZ2V0QWN0aW9ucygndGVzdCcpLmdldFNvbWV0aGluZygnZm9vYmFyJyk7XG5cbiAgICAgIGV4cGVjdChjb21wb25lbnQuc3RhdGUpLnRvLmRlZXAuZXF1YWwoe1xuICAgICAgICBzb21ldGhpbmc6ICdmb29iYXInLFxuICAgICAgICBvdGhlclRoaW5nOiAnYmFyYmF6J1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnY2FsbHMgY3VzdG9tIHN0YXRlIGdldHRlciBvbmNlIHdpdGggYXJyYXkgb2Ygc3RvcmVzJywgKCkgPT4ge1xuICAgICAgY29uc3QgZmx1eCA9IG5ldyBGbHV4KCk7XG4gICAgICBjb25zdCB0ZXN0U3RvcmUgPSBmbHV4LmdldFN0b3JlKCd0ZXN0Jyk7XG4gICAgICBjb25zdCB0ZXN0MlN0b3JlID0gZmx1eC5nZXRTdG9yZSgndGVzdDInKTtcblxuICAgICAgdGVzdFN0b3JlLl90ZXN0SWQgPSAndGVzdCc7XG4gICAgICB0ZXN0MlN0b3JlLl90ZXN0SWQgPSAndGVzdDInO1xuXG4gICAgICBjb25zdCBjb21wb25lbnQgPSBUZXN0VXRpbHMucmVuZGVySW50b0RvY3VtZW50KFxuICAgICAgICA8Q29tcG9uZW50V2l0aEZsdXhNaXhpbiBrZXk9XCJ0ZXN0XCIgZmx1eD17Zmx1eH0gLz5cbiAgICAgICk7XG5cbiAgICAgIGNvbnN0IHN0YXRlR2V0dGVyID0gc2lub24uc3R1YigpLnJldHVybnMoeyBmb286ICdiYXInIH0pO1xuICAgICAgY29uc3Qgc3RhdGUgPSBjb21wb25lbnQuY29ubmVjdFRvU3RvcmVzKFsndGVzdCcsICd0ZXN0MiddLCBzdGF0ZUdldHRlcik7XG5cbiAgICAgIGV4cGVjdChzdGF0ZUdldHRlci5jYWxsZWRPbmNlKS50by5iZS50cnVlO1xuICAgICAgLy8gVXNlIF90ZXN0SWQgYXMgdW5pcXVlIGlkZW50aWZpZXIgb24gc3RvcmUuXG4gICAgICBleHBlY3Qoc3RhdGVHZXR0ZXIuZmlyc3RDYWxsLmFyZ3NbMF1bMF0uX3Rlc3RJZCkudG8uZXF1YWwoJ3Rlc3QnKTtcbiAgICAgIGV4cGVjdChzdGF0ZUdldHRlci5maXJzdENhbGwuYXJnc1swXVsxXS5fdGVzdElkKS50by5lcXVhbCgndGVzdDInKTtcblxuICAgICAgZXhwZWN0KHN0YXRlKS50by5kZWVwLmVxdWFsKHtcbiAgICAgICAgZm9vOiAnYmFyJ1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgndXNlcyBkZWZhdWx0IGdldHRlciBpZiBudWxsIGlzIHBhc3NlZCBhcyBnZXR0ZXInLCAoKSA9PiB7XG4gICAgICBjb25zdCBmbHV4ID0gbmV3IEZsdXgoKTtcblxuICAgICAgY29uc3QgY29tcG9uZW50ID0gVGVzdFV0aWxzLnJlbmRlckludG9Eb2N1bWVudChcbiAgICAgICAgPENvbXBvbmVudFdpdGhGbHV4TWl4aW4ga2V5PVwidGVzdFwiIGZsdXg9e2ZsdXh9IC8+XG4gICAgICApO1xuXG4gICAgICBjb21wb25lbnQuc2V0U3RhdGUoeyBvdGhlclRoaW5nOiAnYmFyYmF6JyB9KTtcblxuICAgICAgY29tcG9uZW50LmNvbm5lY3RUb1N0b3JlcygndGVzdCcsIG51bGwpO1xuXG4gICAgICBmbHV4LmdldEFjdGlvbnMoJ3Rlc3QnKS5nZXRTb21ldGhpbmcoJ2Zvb2JhcicpO1xuXG4gICAgICBleHBlY3QoY29tcG9uZW50LnN0YXRlKS50by5kZWVwLmVxdWFsKHtcbiAgICAgICAgc29tZXRoaW5nOiAnZm9vYmFyJyxcbiAgICAgICAgb3RoZXJUaGluZzogJ2JhcmJheicsXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdyZW1vdmVzIGxpc3RlbmVyIGJlZm9yZSB1bm1vdW50aW5nJywgKCkgPT4ge1xuICAgICAgY29uc3QgZmx1eCA9IG5ldyBGbHV4KCk7XG4gICAgICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuICAgICAgY29uc3QgY29tcG9uZW50ID0gUmVhY3RET00ucmVuZGVyKDxDb21wb25lbnRXaXRoRmx1eE1peGluIGZsdXg9e2ZsdXh9IC8+LCBkaXYpO1xuXG4gICAgICBjb25zdCBzdG9yZSA9IGZsdXguZ2V0U3RvcmUoJ3Rlc3QnKTtcbiAgICAgIGNvbXBvbmVudC5jb25uZWN0VG9TdG9yZXMoJ3Rlc3QnKTtcblxuICAgICAgZXhwZWN0KHN0b3JlLmxpc3RlbmVycygnY2hhbmdlJykubGVuZ3RoKS50by5lcXVhbCgxKTtcbiAgICAgIFJlYWN0RE9NLnVubW91bnRDb21wb25lbnRBdE5vZGUoZGl2KTtcbiAgICAgIGV4cGVjdChzdG9yZS5saXN0ZW5lcnMoJ2NoYW5nZScpLmxlbmd0aCkudG8uZXF1YWwoMCk7XG4gICAgfSk7XG5cbiAgfSk7XG5cbiAgZGVzY3JpYmUoJyNnZXRTdG9yZVN0YXRlJywgKCkgPT4ge1xuICAgIGl0KCdnZXRzIGNvbWJpbmVkIHN0YXRlIG9mIGNvbm5lY3RlZCBzdG9yZXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBmbHV4ID0gbmV3IEZsdXgoKTtcblxuICAgICAgY29uc3QgY29tcG9uZW50ID0gVGVzdFV0aWxzLnJlbmRlckludG9Eb2N1bWVudChcbiAgICAgICAgPENvbXBvbmVudFdpdGhGbHV4TWl4aW4ga2V5PVwidGVzdFwiIGZsdXg9e2ZsdXh9IC8+XG4gICAgICApO1xuXG4gICAgICBjb21wb25lbnQuY29ubmVjdFRvU3RvcmVzKHtcbiAgICAgICAgdGVzdDogc3RvcmUgPT4gKHtcbiAgICAgICAgICBmb286ICdiYXInLFxuICAgICAgICB9KSxcbiAgICAgICAgdGVzdDI6IHN0b3JlID0+ICh7XG4gICAgICAgICAgYmFyOiAnYmF6J1xuICAgICAgICB9KVxuICAgICAgfSk7XG5cbiAgICAgIGNvbXBvbmVudC5zZXRTdGF0ZSh7IGJhejogJ2ZvbycgfSk7XG5cbiAgICAgIGV4cGVjdChjb21wb25lbnQuZ2V0U3RvcmVTdGF0ZSgpKS50by5kZWVwLmVxdWFsKHtcbiAgICAgICAgZm9vOiAnYmFyJyxcbiAgICAgICAgYmFyOiAnYmF6J1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG59KTtcbiJdfQ==