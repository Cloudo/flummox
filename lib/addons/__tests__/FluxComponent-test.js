'use strict';

var _Flux = require('../../Flux');

var _addContext = require('./addContext');

var _addContext2 = _interopRequireDefault(_addContext);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactAddonsTestUtils = require('react-addons-test-utils');

var _reactAddonsTestUtils2 = _interopRequireDefault(_reactAddonsTestUtils);

var _FluxComponent = require('../FluxComponent');

var _FluxComponent2 = _interopRequireDefault(_FluxComponent);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

describe('FluxComponent', function () {
  var Inner = function (_React$Component) {
    _inherits(Inner, _React$Component);

    function Inner() {
      _classCallCheck(this, Inner);

      return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
    }

    Inner.prototype.render = function render() {
      return _react2['default'].createElement('div', null);
    };

    return Inner;
  }(_react2['default'].Component);

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

      var _this3 = _possibleConstructorReturn(this, _Store.call(this));

      var testActions = flux.getActions('test');
      _this3.register(testActions.getSomething, _this3.handleGetSomething);

      _this3.state = {
        something: null
      };
      return _this3;
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

      var _this4 = _possibleConstructorReturn(this, _Flummox.call(this));

      _this4.createActions('test', TestActions);
      _this4.createStore('test', TestStore, _this4);
      return _this4;
    }

    return Flux;
  }(_Flux.Flummox);

  it('gets Flux property from either props or context', function () {
    var flux = new Flux();
    var contextComponent = void 0,
        propsComponent = void 0;

    var ContextComponent = (0, _addContext2['default'])(_FluxComponent2['default'], { flux: flux }, { flux: _react2['default'].PropTypes.instanceOf(_Flux.Flummox) });

    var tree = _reactAddonsTestUtils2['default'].renderIntoDocument(_react2['default'].createElement(ContextComponent, null));

    contextComponent = _reactAddonsTestUtils2['default'].findRenderedComponentWithType(tree, _FluxComponent2['default']);

    propsComponent = _reactAddonsTestUtils2['default'].renderIntoDocument(_react2['default'].createElement(_FluxComponent2['default'], { flux: flux }));

    expect(contextComponent.flux).to.be.an['instanceof'](_Flux.Flummox);
    expect(propsComponent.flux).to.be.an['instanceof'](_Flux.Flummox);
  });

  it('allows for FluxComponents through the tree via context', function () {
    var flux = new Flux();
    var actions = flux.getActions('test');

    var TopView = function (_React$Component2) {
      _inherits(TopView, _React$Component2);

      function TopView() {
        _classCallCheck(this, TopView);

        return _possibleConstructorReturn(this, _React$Component2.apply(this, arguments));
      }

      TopView.prototype.render = function render() {
        return _react2['default'].createElement(
          _FluxComponent2['default'],
          { flux: flux },
          _react2['default'].createElement(SubView, null)
        );
      };

      return TopView;
    }(_react2['default'].Component);

    var SubView = function (_React$Component3) {
      _inherits(SubView, _React$Component3);

      function SubView() {
        _classCallCheck(this, SubView);

        return _possibleConstructorReturn(this, _React$Component3.apply(this, arguments));
      }

      SubView.prototype.render = function render() {
        return _react2['default'].createElement(SubSubView, null);
      };

      return SubView;
    }(_react2['default'].Component);

    var SubSubView = function (_React$Component4) {
      _inherits(SubSubView, _React$Component4);

      function SubSubView() {
        _classCallCheck(this, SubSubView);

        return _possibleConstructorReturn(this, _React$Component4.apply(this, arguments));
      }

      SubSubView.prototype.render = function render() {
        return _react2['default'].createElement(
          _FluxComponent2['default'],
          { connectToStores: 'test' },
          _react2['default'].createElement(InnerWithData, null)
        );
      };

      return SubSubView;
    }(_react2['default'].Component);

    var InnerWithData = function (_React$Component5) {
      _inherits(InnerWithData, _React$Component5);

      function InnerWithData() {
        _classCallCheck(this, InnerWithData);

        return _possibleConstructorReturn(this, _React$Component5.apply(this, arguments));
      }

      InnerWithData.prototype.render = function render() {
        return _react2['default'].createElement('div', { 'data-something': this.props.something });
      };

      return InnerWithData;
    }(_react2['default'].Component);

    var tree = _reactAddonsTestUtils2['default'].renderIntoDocument(_react2['default'].createElement(TopView, null));
    var div = _reactAddonsTestUtils2['default'].findRenderedDOMComponentWithTag(tree, 'div');

    actions.getSomething('something good');
    expect(div.getAttribute('data-something')).to.equal('something good');
  });

  it('passes connectToStore prop to reactComponentMethod connectToStores()', function () {
    var flux = new Flux();
    var actions = flux.getActions('test');

    var component = _reactAddonsTestUtils2['default'].renderIntoDocument(_react2['default'].createElement(_FluxComponent2['default'], { flux: flux, connectToStores: 'test' }));

    actions.getSomething('something good');
    expect(component.state.something).to.deep.equal('something good');
    actions.getSomething('something else');
    expect(component.state.something).to.deep.equal('something else');
  });

  it('passes stateGetter prop to reactComponentMethod connectToStores()', function () {
    var flux = new Flux();
    var actions = flux.getActions('test');
    var stateGetter = _sinon2['default'].stub().returns({ fiz: 'bin' });

    var component = _reactAddonsTestUtils2['default'].renderIntoDocument(_react2['default'].createElement(_FluxComponent2['default'], { flux: flux, connectToStores: 'test', stateGetter: stateGetter }));

    expect(component.state.fiz).to.equal('bin');
  });

  it('injects children with flux prop', function () {
    var flux = new Flux();
    var actions = flux.getActions('test');

    var tree = _reactAddonsTestUtils2['default'].renderIntoDocument(_react2['default'].createElement(
      _FluxComponent2['default'],
      { flux: flux },
      _react2['default'].createElement(Inner, null)
    ));

    var inner = _reactAddonsTestUtils2['default'].findRenderedComponentWithType(tree, Inner);
    expect(inner.props.flux).to.equal(flux);
  });

  it('injects children with props corresponding to component state', function () {
    var flux = new Flux();
    var actions = flux.getActions('test');

    var tree = _reactAddonsTestUtils2['default'].renderIntoDocument(_react2['default'].createElement(
      _FluxComponent2['default'],
      { flux: flux, connectToStores: 'test' },
      _react2['default'].createElement(Inner, null)
    ));

    var inner = _reactAddonsTestUtils2['default'].findRenderedComponentWithType(tree, Inner);

    actions.getSomething('something good');
    expect(inner.props.something).to.equal('something good');
    actions.getSomething('something else');
    expect(inner.props.something).to.equal('something else');
  });

  it('injects children with any extra props', function () {
    var flux = new Flux();
    var stateGetter = function stateGetter() {};

    // Pass all possible PropTypes to ensure only extra props
    // are injected.
    var tree = _reactAddonsTestUtils2['default'].renderIntoDocument(_react2['default'].createElement(_FluxComponent2['default'], {
      flux: flux,
      connectToStores: 'test',
      stateGetter: stateGetter,
      extraProp: 'hello',
      render: function render(props) {
        return _react2['default'].createElement(Inner, props);
      }
    }));

    var inner = _reactAddonsTestUtils2['default'].findRenderedComponentWithType(tree, Inner);

    expect(inner.props.extraProp).to.equal('hello');
    expect(Object.keys(inner.props)).to.deep.equal(['flux', 'extraProp']);
  });

  it('wraps multiple children in span tag', function () {
    var flux = new Flux();

    var tree = _reactAddonsTestUtils2['default'].renderIntoDocument(_react2['default'].createElement(
      _FluxComponent2['default'],
      { flux: flux },
      _react2['default'].createElement(Inner, null),
      _react2['default'].createElement(Inner, null)
    ));

    var inners = _reactAddonsTestUtils2['default'].scryRenderedComponentsWithType(tree, Inner);
    expect(inners.length).to.equal(2);
  });

  it('does not wrap single child in span tag', function () {
    var flux = new Flux();

    var tree = _reactAddonsTestUtils2['default'].renderIntoDocument(_react2['default'].createElement(
      _FluxComponent2['default'],
      { flux: flux },
      _react2['default'].createElement('div', null)
    ));

    expect(_reactAddonsTestUtils2['default'].findRenderedDOMComponentWithTag.bind(_reactAddonsTestUtils2['default'], tree, 'span')).to['throw']('Did not find exactly one match (found: 0) for tag:span');
  });

  it('allows for nested FluxComponents', function () {
    var flux = new Flux();
    var actions = flux.getActions('test');

    var tree = _reactAddonsTestUtils2['default'].renderIntoDocument(_react2['default'].createElement(
      _FluxComponent2['default'],
      { flux: flux, connectToStores: 'test' },
      _react2['default'].createElement(
        _FluxComponent2['default'],
        null,
        _react2['default'].createElement(Inner, null)
      )
    ));

    var inner = _reactAddonsTestUtils2['default'].findRenderedComponentWithType(tree, Inner);

    actions.getSomething('something good');
    expect(inner.props.something).to.equal('something good');
    actions.getSomething('something else');
    expect(inner.props.something).to.equal('something else');
  });

  it('uses `render` prop for custom rendering, if it exists', function () {
    var flux = new Flux();
    var actions = flux.getActions('test');

    var tree = _reactAddonsTestUtils2['default'].renderIntoDocument(_react2['default'].createElement(_FluxComponent2['default'], {
      flux: flux,
      connectToStores: 'test',
      render: function render(props) {
        return _react2['default'].createElement('div', { 'data-something': props.something });
      }
    }));

    var div = _reactAddonsTestUtils2['default'].findRenderedDOMComponentWithTag(tree, 'div');

    actions.getSomething('something good');
    expect(div.getAttribute('data-something')).to.equal('something good');
    actions.getSomething('something else');
    expect(div.getAttribute('data-something')).to.equal('something else');
  });

  it('updates with render-time computed values in state getters on componentWillReceiveProps()', function () {
    var flux = new Flux();

    var Owner = function (_React$Component6) {
      _inherits(Owner, _React$Component6);

      function Owner(props) {
        _classCallCheck(this, Owner);

        var _this9 = _possibleConstructorReturn(this, _React$Component6.call(this, props));

        _this9.state = {
          foo: 'bar'
        };
        return _this9;
      }

      Owner.prototype.render = function render() {
        var _this10 = this;

        return _react2['default'].createElement(_FluxComponent2['default'], {
          flux: flux,
          connectToStores: {
            test: function test(store) {
              return {
                yay: _this10.state.foo
              };
            }
          },
          render: function render(storeState) {
            return _react2['default'].createElement('div', { 'data-yay': storeState.yay });
          }
        });
      };

      return Owner;
    }(_react2['default'].Component);

    var owner = _reactAddonsTestUtils2['default'].renderIntoDocument(_react2['default'].createElement(Owner, null));
    var div = _reactAddonsTestUtils2['default'].findRenderedDOMComponentWithTag(owner, 'div');

    expect(div.getAttribute('data-yay')).to.equal('bar');
    owner.setState({ foo: 'baz' });
    expect(div.getAttribute('data-yay')).to.equal('baz');
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hZGRvbnMvX190ZXN0c19fL0ZsdXhDb21wb25lbnQtdGVzdC5qcyJdLCJuYW1lcyI6WyJkZXNjcmliZSIsIklubmVyIiwicmVuZGVyIiwiQ29tcG9uZW50IiwiVGVzdEFjdGlvbnMiLCJnZXRTb21ldGhpbmciLCJzb21ldGhpbmciLCJUZXN0U3RvcmUiLCJmbHV4IiwidGVzdEFjdGlvbnMiLCJnZXRBY3Rpb25zIiwicmVnaXN0ZXIiLCJoYW5kbGVHZXRTb21ldGhpbmciLCJzdGF0ZSIsInNldFN0YXRlIiwiRmx1eCIsImNyZWF0ZUFjdGlvbnMiLCJjcmVhdGVTdG9yZSIsIml0IiwiY29udGV4dENvbXBvbmVudCIsInByb3BzQ29tcG9uZW50IiwiQ29udGV4dENvbXBvbmVudCIsIlByb3BUeXBlcyIsImluc3RhbmNlT2YiLCJ0cmVlIiwicmVuZGVySW50b0RvY3VtZW50IiwiZmluZFJlbmRlcmVkQ29tcG9uZW50V2l0aFR5cGUiLCJleHBlY3QiLCJ0byIsImJlIiwiYW4iLCJhY3Rpb25zIiwiVG9wVmlldyIsIlN1YlZpZXciLCJTdWJTdWJWaWV3IiwiSW5uZXJXaXRoRGF0YSIsInByb3BzIiwiZGl2IiwiZmluZFJlbmRlcmVkRE9NQ29tcG9uZW50V2l0aFRhZyIsImdldEF0dHJpYnV0ZSIsImVxdWFsIiwiY29tcG9uZW50IiwiZGVlcCIsInN0YXRlR2V0dGVyIiwic3R1YiIsInJldHVybnMiLCJmaXoiLCJpbm5lciIsImV4dHJhUHJvcCIsIk9iamVjdCIsImtleXMiLCJpbm5lcnMiLCJzY3J5UmVuZGVyZWRDb21wb25lbnRzV2l0aFR5cGUiLCJsZW5ndGgiLCJiaW5kIiwiT3duZXIiLCJmb28iLCJ0ZXN0IiwieWF5Iiwic3RvcmVTdGF0ZSIsIm93bmVyIl0sIm1hcHBpbmdzIjoiOztBQUFBOztBQUNBOzs7O0FBRUE7Ozs7QUFDQTs7OztBQUVBOzs7O0FBQ0E7Ozs7Ozs7Ozs7OztBQUVBQSxTQUFTLGVBQVQsRUFBMEIsWUFBTTtBQUFB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SU8sSUFBSixFQUFiOztBQURtRyxRQUc3RndDLEtBSDZGO0FBQUE7O0FBSWpHLHFCQUFZbkIsS0FBWixFQUFtQjtBQUFBOztBQUFBLHNEQUNqQiw2QkFBTUEsS0FBTixDQURpQjs7QUFHakIsZUFBS3ZCLEtBQUwsR0FBYTtBQUNYMkMsZUFBSztBQURNLFNBQWI7QUFIaUI7QUFNbEI7O0FBVmdHLHNCQVlqR3RELE1BWmlHLHFCQVl4RjtBQUFBOztBQUNQLGVBQ0U7QUFDRSxnQkFBTU0sSUFEUjtBQUVFLDJCQUFpQjtBQUNmaUQsa0JBQU07QUFBQSxxQkFBVTtBQUNkQyxxQkFBSyxRQUFLN0MsS0FBTCxDQUFXMkM7QUFERixlQUFWO0FBQUE7QUFEUyxXQUZuQjtBQU9FLGtCQUFRO0FBQUEsbUJBQWMsMENBQUssWUFBVUcsV0FBV0QsR0FBMUIsR0FBZDtBQUFBO0FBUFYsVUFERjtBQVdELE9BeEJnRzs7QUFBQTtBQUFBLE1BRy9FLG1CQUFNdkQsU0FIeUU7O0FBMkJuRyxRQUFNeUQsUUFBUSxrQ0FBVW5DLGtCQUFWLENBQTZCLGlDQUFDLEtBQUQsT0FBN0IsQ0FBZDtBQUNBLFFBQU1ZLE1BQU0sa0NBQVVDLCtCQUFWLENBQTBDc0IsS0FBMUMsRUFBaUQsS0FBakQsQ0FBWjs7QUFFQWpDLFdBQU9VLElBQUlFLFlBQUosQ0FBaUIsVUFBakIsQ0FBUCxFQUFxQ1gsRUFBckMsQ0FBd0NZLEtBQXhDLENBQThDLEtBQTlDO0FBQ0FvQixVQUFNOUMsUUFBTixDQUFlLEVBQUUwQyxLQUFLLEtBQVAsRUFBZjtBQUNBN0IsV0FBT1UsSUFBSUUsWUFBSixDQUFpQixVQUFqQixDQUFQLEVBQXFDWCxFQUFyQyxDQUF3Q1ksS0FBeEMsQ0FBOEMsS0FBOUM7QUFDRCxHQWpDRDtBQW1DRCxDQTFTRCIsImZpbGUiOiJGbHV4Q29tcG9uZW50LXRlc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBGbHVtbW94LCBTdG9yZSwgQWN0aW9ucyB9IGZyb20gJy4uLy4uL0ZsdXgnO1xuaW1wb3J0IGFkZENvbnRleHQgZnJvbSAnLi9hZGRDb250ZXh0JztcblxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBUZXN0VXRpbHMgZnJvbSAncmVhY3QtYWRkb25zLXRlc3QtdXRpbHMnXG5cbmltcG9ydCBGbHV4Q29tcG9uZW50IGZyb20gJy4uL0ZsdXhDb21wb25lbnQnO1xuaW1wb3J0IHNpbm9uIGZyb20gJ3Npbm9uJztcblxuZGVzY3JpYmUoJ0ZsdXhDb21wb25lbnQnLCAoKSA9PiB7XG5cbiAgY2xhc3MgSW5uZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIHJlbmRlcigpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgLz5cbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgY2xhc3MgVGVzdEFjdGlvbnMgZXh0ZW5kcyBBY3Rpb25zIHtcbiAgICBnZXRTb21ldGhpbmcoc29tZXRoaW5nKSB7XG4gICAgICByZXR1cm4gc29tZXRoaW5nO1xuICAgIH1cbiAgfVxuXG4gIGNsYXNzIFRlc3RTdG9yZSBleHRlbmRzIFN0b3JlIHtcbiAgICBjb25zdHJ1Y3RvcihmbHV4KSB7XG4gICAgICBzdXBlcigpO1xuXG4gICAgICBjb25zdCB0ZXN0QWN0aW9ucyA9IGZsdXguZ2V0QWN0aW9ucygndGVzdCcpO1xuICAgICAgdGhpcy5yZWdpc3Rlcih0ZXN0QWN0aW9ucy5nZXRTb21ldGhpbmcsIHRoaXMuaGFuZGxlR2V0U29tZXRoaW5nKTtcblxuICAgICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgICAgc29tZXRoaW5nOiBudWxsXG4gICAgICB9O1xuICAgIH1cblxuICAgIGhhbmRsZUdldFNvbWV0aGluZyhzb21ldGhpbmcpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBzb21ldGhpbmcgfSk7XG4gICAgfVxuICB9XG5cbiAgY2xhc3MgRmx1eCBleHRlbmRzIEZsdW1tb3gge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgc3VwZXIoKTtcblxuICAgICAgdGhpcy5jcmVhdGVBY3Rpb25zKCd0ZXN0JywgVGVzdEFjdGlvbnMpO1xuICAgICAgdGhpcy5jcmVhdGVTdG9yZSgndGVzdCcsIFRlc3RTdG9yZSwgdGhpcyk7XG4gICAgfVxuICB9XG5cbiAgaXQoJ2dldHMgRmx1eCBwcm9wZXJ0eSBmcm9tIGVpdGhlciBwcm9wcyBvciBjb250ZXh0JywgKCkgPT4ge1xuICAgIGNvbnN0IGZsdXggPSBuZXcgRmx1eCgpO1xuICAgIGxldCBjb250ZXh0Q29tcG9uZW50LCBwcm9wc0NvbXBvbmVudDtcblxuICAgIGNvbnN0IENvbnRleHRDb21wb25lbnQgPSBhZGRDb250ZXh0KFxuICAgICAgRmx1eENvbXBvbmVudCxcbiAgICAgIHsgZmx1eCB9LFxuICAgICAgeyBmbHV4OiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihGbHVtbW94KSB9XG4gICAgKTtcblxuICAgIGNvbnN0IHRyZWUgPSBUZXN0VXRpbHMucmVuZGVySW50b0RvY3VtZW50KDxDb250ZXh0Q29tcG9uZW50IC8+KTtcblxuICAgIGNvbnRleHRDb21wb25lbnQgPSBUZXN0VXRpbHMuZmluZFJlbmRlcmVkQ29tcG9uZW50V2l0aFR5cGUoXG4gICAgICB0cmVlLCBGbHV4Q29tcG9uZW50XG4gICAgKTtcblxuICAgIHByb3BzQ29tcG9uZW50ID0gVGVzdFV0aWxzLnJlbmRlckludG9Eb2N1bWVudChcbiAgICAgIDxGbHV4Q29tcG9uZW50IGZsdXg9e2ZsdXh9IC8+XG4gICAgKTtcblxuICAgIGV4cGVjdChjb250ZXh0Q29tcG9uZW50LmZsdXgpLnRvLmJlLmFuLmluc3RhbmNlb2YoRmx1bW1veCk7XG4gICAgZXhwZWN0KHByb3BzQ29tcG9uZW50LmZsdXgpLnRvLmJlLmFuLmluc3RhbmNlb2YoRmx1bW1veCk7XG4gIH0pO1xuXG4gIGl0KCdhbGxvd3MgZm9yIEZsdXhDb21wb25lbnRzIHRocm91Z2ggdGhlIHRyZWUgdmlhIGNvbnRleHQnLCAoKSA9PiB7XG4gICAgY29uc3QgZmx1eCA9IG5ldyBGbHV4KCk7XG4gICAgY29uc3QgYWN0aW9ucyA9IGZsdXguZ2V0QWN0aW9ucygndGVzdCcpO1xuXG4gICAgY2xhc3MgVG9wVmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgICByZW5kZXIoKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgPEZsdXhDb21wb25lbnQgZmx1eD17Zmx1eH0+XG4gICAgICAgICAgICA8U3ViVmlldyAvPlxuICAgICAgICAgIDwvRmx1eENvbXBvbmVudD5cbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjbGFzcyBTdWJWaWV3IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICAgIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIDxTdWJTdWJWaWV3IC8+O1xuICAgICAgfVxuICAgIH1cblxuICAgIGNsYXNzIFN1YlN1YlZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgICAgcmVuZGVyKCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIDxGbHV4Q29tcG9uZW50IGNvbm5lY3RUb1N0b3Jlcz1cInRlc3RcIj5cbiAgICAgICAgICAgIDxJbm5lcldpdGhEYXRhIC8+XG4gICAgICAgICAgPC9GbHV4Q29tcG9uZW50PlxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNsYXNzIElubmVyV2l0aERhdGEgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgICAgcmVuZGVyKCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIDxkaXYgZGF0YS1zb21ldGhpbmc9e3RoaXMucHJvcHMuc29tZXRoaW5nfSAvPlxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHRyZWUgPSBUZXN0VXRpbHMucmVuZGVySW50b0RvY3VtZW50KFxuICAgICAgPFRvcFZpZXcgLz5cbiAgICApO1xuICAgIGNvbnN0IGRpdiA9IFRlc3RVdGlscy5maW5kUmVuZGVyZWRET01Db21wb25lbnRXaXRoVGFnKHRyZWUsICdkaXYnKTtcblxuICAgIGFjdGlvbnMuZ2V0U29tZXRoaW5nKCdzb21ldGhpbmcgZ29vZCcpO1xuICAgIGV4cGVjdChkaXYuZ2V0QXR0cmlidXRlKCdkYXRhLXNvbWV0aGluZycpKS50by5lcXVhbCgnc29tZXRoaW5nIGdvb2QnKTtcbiAgfSk7XG5cbiAgaXQoJ3Bhc3NlcyBjb25uZWN0VG9TdG9yZSBwcm9wIHRvIHJlYWN0Q29tcG9uZW50TWV0aG9kIGNvbm5lY3RUb1N0b3JlcygpJywgKCkgPT4ge1xuICAgIGNvbnN0IGZsdXggPSBuZXcgRmx1eCgpO1xuICAgIGNvbnN0IGFjdGlvbnMgPSBmbHV4LmdldEFjdGlvbnMoJ3Rlc3QnKTtcblxuICAgIGNvbnN0IGNvbXBvbmVudCA9IFRlc3RVdGlscy5yZW5kZXJJbnRvRG9jdW1lbnQoXG4gICAgICA8Rmx1eENvbXBvbmVudCBmbHV4PXtmbHV4fSBjb25uZWN0VG9TdG9yZXM9XCJ0ZXN0XCIgLz5cbiAgICApO1xuXG4gICAgYWN0aW9ucy5nZXRTb21ldGhpbmcoJ3NvbWV0aGluZyBnb29kJyk7XG4gICAgZXhwZWN0KGNvbXBvbmVudC5zdGF0ZS5zb21ldGhpbmcpLnRvLmRlZXAuZXF1YWwoJ3NvbWV0aGluZyBnb29kJyk7XG4gICAgYWN0aW9ucy5nZXRTb21ldGhpbmcoJ3NvbWV0aGluZyBlbHNlJyk7XG4gICAgZXhwZWN0KGNvbXBvbmVudC5zdGF0ZS5zb21ldGhpbmcpLnRvLmRlZXAuZXF1YWwoJ3NvbWV0aGluZyBlbHNlJyk7XG4gIH0pO1xuXG4gIGl0KCdwYXNzZXMgc3RhdGVHZXR0ZXIgcHJvcCB0byByZWFjdENvbXBvbmVudE1ldGhvZCBjb25uZWN0VG9TdG9yZXMoKScsICgpID0+IHtcbiAgICBjb25zdCBmbHV4ID0gbmV3IEZsdXgoKTtcbiAgICBjb25zdCBhY3Rpb25zID0gZmx1eC5nZXRBY3Rpb25zKCd0ZXN0Jyk7XG4gICAgY29uc3Qgc3RhdGVHZXR0ZXIgPSBzaW5vbi5zdHViKCkucmV0dXJucyh7IGZpejogJ2JpbicgfSk7XG5cbiAgICBjb25zdCBjb21wb25lbnQgPSBUZXN0VXRpbHMucmVuZGVySW50b0RvY3VtZW50KFxuICAgICAgPEZsdXhDb21wb25lbnQgZmx1eD17Zmx1eH0gY29ubmVjdFRvU3RvcmVzPVwidGVzdFwiIHN0YXRlR2V0dGVyPXtzdGF0ZUdldHRlcn0gLz5cbiAgICApO1xuXG4gICAgZXhwZWN0KGNvbXBvbmVudC5zdGF0ZS5maXopLnRvLmVxdWFsKCdiaW4nKTtcbiAgfSk7XG5cbiAgaXQoJ2luamVjdHMgY2hpbGRyZW4gd2l0aCBmbHV4IHByb3AnLCAoKSA9PiB7XG4gICAgY29uc3QgZmx1eCA9IG5ldyBGbHV4KCk7XG4gICAgY29uc3QgYWN0aW9ucyA9IGZsdXguZ2V0QWN0aW9ucygndGVzdCcpO1xuXG4gICAgY29uc3QgdHJlZSA9IFRlc3RVdGlscy5yZW5kZXJJbnRvRG9jdW1lbnQoXG4gICAgICA8Rmx1eENvbXBvbmVudCBmbHV4PXtmbHV4fT5cbiAgICAgICAgPElubmVyIC8+XG4gICAgICA8L0ZsdXhDb21wb25lbnQ+XG4gICAgKTtcblxuICAgIGNvbnN0IGlubmVyID0gVGVzdFV0aWxzLmZpbmRSZW5kZXJlZENvbXBvbmVudFdpdGhUeXBlKHRyZWUsIElubmVyKTtcbiAgICBleHBlY3QoaW5uZXIucHJvcHMuZmx1eCkudG8uZXF1YWwoZmx1eCk7XG4gIH0pO1xuXG4gIGl0KCdpbmplY3RzIGNoaWxkcmVuIHdpdGggcHJvcHMgY29ycmVzcG9uZGluZyB0byBjb21wb25lbnQgc3RhdGUnLCAoKSA9PiB7XG4gICAgY29uc3QgZmx1eCA9IG5ldyBGbHV4KCk7XG4gICAgY29uc3QgYWN0aW9ucyA9IGZsdXguZ2V0QWN0aW9ucygndGVzdCcpO1xuXG4gICAgY29uc3QgdHJlZSA9IFRlc3RVdGlscy5yZW5kZXJJbnRvRG9jdW1lbnQoXG4gICAgICA8Rmx1eENvbXBvbmVudCBmbHV4PXtmbHV4fSBjb25uZWN0VG9TdG9yZXM9XCJ0ZXN0XCI+XG4gICAgICAgIDxJbm5lciAvPlxuICAgICAgPC9GbHV4Q29tcG9uZW50PlxuICAgICk7XG5cbiAgICBjb25zdCBpbm5lciA9IFRlc3RVdGlscy5maW5kUmVuZGVyZWRDb21wb25lbnRXaXRoVHlwZSh0cmVlLCBJbm5lcik7XG5cbiAgICBhY3Rpb25zLmdldFNvbWV0aGluZygnc29tZXRoaW5nIGdvb2QnKTtcbiAgICBleHBlY3QoaW5uZXIucHJvcHMuc29tZXRoaW5nKS50by5lcXVhbCgnc29tZXRoaW5nIGdvb2QnKTtcbiAgICBhY3Rpb25zLmdldFNvbWV0aGluZygnc29tZXRoaW5nIGVsc2UnKTtcbiAgICBleHBlY3QoaW5uZXIucHJvcHMuc29tZXRoaW5nKS50by5lcXVhbCgnc29tZXRoaW5nIGVsc2UnKTtcbiAgfSk7XG5cbiAgaXQoJ2luamVjdHMgY2hpbGRyZW4gd2l0aCBhbnkgZXh0cmEgcHJvcHMnLCAoKSA9PiB7XG4gICAgY29uc3QgZmx1eCA9IG5ldyBGbHV4KCk7XG4gICAgY29uc3Qgc3RhdGVHZXR0ZXIgPSAoKSA9PiB7fTtcblxuICAgIC8vIFBhc3MgYWxsIHBvc3NpYmxlIFByb3BUeXBlcyB0byBlbnN1cmUgb25seSBleHRyYSBwcm9wc1xuICAgIC8vIGFyZSBpbmplY3RlZC5cbiAgICBjb25zdCB0cmVlID0gVGVzdFV0aWxzLnJlbmRlckludG9Eb2N1bWVudChcbiAgICAgIDxGbHV4Q29tcG9uZW50XG4gICAgICAgIGZsdXg9e2ZsdXh9XG4gICAgICAgIGNvbm5lY3RUb1N0b3Jlcz1cInRlc3RcIlxuICAgICAgICBzdGF0ZUdldHRlcj17c3RhdGVHZXR0ZXJ9XG4gICAgICAgIGV4dHJhUHJvcD1cImhlbGxvXCJcbiAgICAgICAgcmVuZGVyPXsocHJvcHMpID0+IDxJbm5lciB7Li4ucHJvcHN9IC8+fVxuICAgICAgLz5cbiAgICApO1xuXG4gICAgY29uc3QgaW5uZXIgPSBUZXN0VXRpbHMuZmluZFJlbmRlcmVkQ29tcG9uZW50V2l0aFR5cGUodHJlZSwgSW5uZXIpO1xuXG4gICAgZXhwZWN0KGlubmVyLnByb3BzLmV4dHJhUHJvcCkudG8uZXF1YWwoJ2hlbGxvJyk7XG4gICAgZXhwZWN0KE9iamVjdC5rZXlzKGlubmVyLnByb3BzKSkudG8uZGVlcC5lcXVhbChbJ2ZsdXgnLCAnZXh0cmFQcm9wJ10pO1xuICB9KTtcblxuICBpdCgnd3JhcHMgbXVsdGlwbGUgY2hpbGRyZW4gaW4gc3BhbiB0YWcnLCAoKSA9PiB7XG4gICAgY29uc3QgZmx1eCA9IG5ldyBGbHV4KCk7XG5cbiAgICBjb25zdCB0cmVlID0gVGVzdFV0aWxzLnJlbmRlckludG9Eb2N1bWVudChcbiAgICAgIDxGbHV4Q29tcG9uZW50IGZsdXg9e2ZsdXh9PlxuICAgICAgICA8SW5uZXIgLz5cbiAgICAgICAgPElubmVyIC8+XG4gICAgICA8L0ZsdXhDb21wb25lbnQ+XG4gICAgKTtcblxuICAgIGNvbnN0IGlubmVycyA9IFRlc3RVdGlscy5zY3J5UmVuZGVyZWRDb21wb25lbnRzV2l0aFR5cGUodHJlZSwgSW5uZXIpO1xuICAgIGV4cGVjdChpbm5lcnMubGVuZ3RoKS50by5lcXVhbCgyKTtcbiAgfSk7XG5cbiAgaXQoJ2RvZXMgbm90IHdyYXAgc2luZ2xlIGNoaWxkIGluIHNwYW4gdGFnJywgKCkgPT4ge1xuICAgIGNvbnN0IGZsdXggPSBuZXcgRmx1eCgpO1xuXG4gICAgY29uc3QgdHJlZSA9IFRlc3RVdGlscy5yZW5kZXJJbnRvRG9jdW1lbnQoXG4gICAgICA8Rmx1eENvbXBvbmVudCBmbHV4PXtmbHV4fT5cbiAgICAgICAgPGRpdiAvPlxuICAgICAgPC9GbHV4Q29tcG9uZW50PlxuICAgICk7XG5cbiAgICBleHBlY3QoXG4gICAgICBUZXN0VXRpbHMuZmluZFJlbmRlcmVkRE9NQ29tcG9uZW50V2l0aFRhZy5iaW5kKFRlc3RVdGlscywgdHJlZSwgJ3NwYW4nKVxuICAgICkudG8udGhyb3coJ0RpZCBub3QgZmluZCBleGFjdGx5IG9uZSBtYXRjaCAoZm91bmQ6IDApIGZvciB0YWc6c3BhbicpO1xuICB9KTtcblxuICBpdCgnYWxsb3dzIGZvciBuZXN0ZWQgRmx1eENvbXBvbmVudHMnLCAoKSA9PiB7XG4gICAgY29uc3QgZmx1eCA9IG5ldyBGbHV4KCk7XG4gICAgY29uc3QgYWN0aW9ucyA9IGZsdXguZ2V0QWN0aW9ucygndGVzdCcpO1xuXG4gICAgY29uc3QgdHJlZSA9IFRlc3RVdGlscy5yZW5kZXJJbnRvRG9jdW1lbnQoXG4gICAgICA8Rmx1eENvbXBvbmVudCBmbHV4PXtmbHV4fSBjb25uZWN0VG9TdG9yZXM9XCJ0ZXN0XCI+XG4gICAgICAgIDxGbHV4Q29tcG9uZW50PlxuICAgICAgICAgIDxJbm5lciAvPlxuICAgICAgICA8L0ZsdXhDb21wb25lbnQ+XG4gICAgICA8L0ZsdXhDb21wb25lbnQ+XG4gICAgKTtcblxuICAgIGNvbnN0IGlubmVyID0gVGVzdFV0aWxzLmZpbmRSZW5kZXJlZENvbXBvbmVudFdpdGhUeXBlKHRyZWUsIElubmVyKTtcblxuICAgIGFjdGlvbnMuZ2V0U29tZXRoaW5nKCdzb21ldGhpbmcgZ29vZCcpO1xuICAgIGV4cGVjdChpbm5lci5wcm9wcy5zb21ldGhpbmcpLnRvLmVxdWFsKCdzb21ldGhpbmcgZ29vZCcpO1xuICAgIGFjdGlvbnMuZ2V0U29tZXRoaW5nKCdzb21ldGhpbmcgZWxzZScpO1xuICAgIGV4cGVjdChpbm5lci5wcm9wcy5zb21ldGhpbmcpLnRvLmVxdWFsKCdzb21ldGhpbmcgZWxzZScpO1xuICB9KTtcblxuICBpdCgndXNlcyBgcmVuZGVyYCBwcm9wIGZvciBjdXN0b20gcmVuZGVyaW5nLCBpZiBpdCBleGlzdHMnLCAoKSA9PiB7XG4gICAgY29uc3QgZmx1eCA9IG5ldyBGbHV4KCk7XG4gICAgY29uc3QgYWN0aW9ucyA9IGZsdXguZ2V0QWN0aW9ucygndGVzdCcpO1xuXG4gICAgY29uc3QgdHJlZSA9IFRlc3RVdGlscy5yZW5kZXJJbnRvRG9jdW1lbnQoXG4gICAgICA8Rmx1eENvbXBvbmVudFxuICAgICAgICBmbHV4PXtmbHV4fVxuICAgICAgICBjb25uZWN0VG9TdG9yZXM9XCJ0ZXN0XCJcbiAgICAgICAgcmVuZGVyPXtwcm9wcyA9PlxuICAgICAgICAgIDxkaXYgZGF0YS1zb21ldGhpbmc9e3Byb3BzLnNvbWV0aGluZ30gLz5cbiAgICAgICAgfVxuICAgICAgLz5cbiAgICApO1xuXG4gICAgY29uc3QgZGl2ID0gVGVzdFV0aWxzLmZpbmRSZW5kZXJlZERPTUNvbXBvbmVudFdpdGhUYWcodHJlZSwgJ2RpdicpO1xuXG4gICAgYWN0aW9ucy5nZXRTb21ldGhpbmcoJ3NvbWV0aGluZyBnb29kJyk7XG4gICAgZXhwZWN0KGRpdi5nZXRBdHRyaWJ1dGUoJ2RhdGEtc29tZXRoaW5nJykpLnRvLmVxdWFsKCdzb21ldGhpbmcgZ29vZCcpO1xuICAgIGFjdGlvbnMuZ2V0U29tZXRoaW5nKCdzb21ldGhpbmcgZWxzZScpO1xuICAgIGV4cGVjdChkaXYuZ2V0QXR0cmlidXRlKCdkYXRhLXNvbWV0aGluZycpKS50by5lcXVhbCgnc29tZXRoaW5nIGVsc2UnKTtcbiAgfSk7XG5cbiAgaXQoJ3VwZGF0ZXMgd2l0aCByZW5kZXItdGltZSBjb21wdXRlZCB2YWx1ZXMgaW4gc3RhdGUgZ2V0dGVycyBvbiBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKCknLCAoKSA9PiB7XG4gICAgY29uc3QgZmx1eCA9IG5ldyBGbHV4KCk7XG5cbiAgICBjbGFzcyBPd25lciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG5cbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgICAgICBmb286ICdiYXInXG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICA8Rmx1eENvbXBvbmVudFxuICAgICAgICAgICAgZmx1eD17Zmx1eH1cbiAgICAgICAgICAgIGNvbm5lY3RUb1N0b3Jlcz17e1xuICAgICAgICAgICAgICB0ZXN0OiBzdG9yZSA9PiAoe1xuICAgICAgICAgICAgICAgIHlheTogdGhpcy5zdGF0ZS5mb29cbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICByZW5kZXI9e3N0b3JlU3RhdGUgPT4gPGRpdiBkYXRhLXlheT17c3RvcmVTdGF0ZS55YXl9IC8+fVxuICAgICAgICAgIC8+XG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3Qgb3duZXIgPSBUZXN0VXRpbHMucmVuZGVySW50b0RvY3VtZW50KDxPd25lciAvPik7XG4gICAgY29uc3QgZGl2ID0gVGVzdFV0aWxzLmZpbmRSZW5kZXJlZERPTUNvbXBvbmVudFdpdGhUYWcob3duZXIsICdkaXYnKTtcblxuICAgIGV4cGVjdChkaXYuZ2V0QXR0cmlidXRlKCdkYXRhLXlheScpKS50by5lcXVhbCgnYmFyJyk7XG4gICAgb3duZXIuc2V0U3RhdGUoeyBmb286ICdiYXonIH0pO1xuICAgIGV4cGVjdChkaXYuZ2V0QXR0cmlidXRlKCdkYXRhLXlheScpKS50by5lcXVhbCgnYmF6Jyk7XG4gIH0pO1xuXG59KTtcbiJdfQ==