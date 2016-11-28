'use strict';

var _Flux = require('../Flux');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

describe('Examples:', function () {

  /**
   * A simple Flummox example
   */
  describe('Messages', function () {

    /**
     * To create some actions, create a new class that extends from the base
     * Actions class. Methods on the class's prototype will be converted into
     * actions, each with its own action id.
     *
     * In this example, calling `newMessage` will fire the dispatcher, with
     * a payload containing the passed message content. Easy!
     */
    var MessageActions = function (_Actions) {
      _inherits(MessageActions, _Actions);

      function MessageActions() {
        _classCallCheck(this, MessageActions);

        return _possibleConstructorReturn(this, _Actions.apply(this, arguments));
      }

      MessageActions.prototype.newMessage = function newMessage(content) {

        // The return value from the action is sent to the dispatcher.
        return content;
      };

      return MessageActions;
    }(_Flux.Actions);

    /**
     * Now we need to a Store that will receive payloads from the dispatcher
     * and update itself accordingly. Like before, create a new class that
     * extends from the Store class.
     *
     * Stores are automatically registered with the dispatcher, but rather than
     * using a giant `switch` statement to check for specific action types, we
     * register handlers with action ids, or with a reference to the action
     * itself.
     *
     * Stores have a React-inspired API for managing state. Use `this.setState`
     * to update state within your handlers. Multiple calls to `this.setState`
     * within the same handler will be batched. A change event will fire after
     * the batched updates are applied. Your view controllers can listen
     * for change events using the EventEmitter API.
     */


    var MessageStore = function (_Store) {
      _inherits(MessageStore, _Store);

      // Note that passing a flux instance to the constructor is not required;
      // we do it here so we have access to any action ids we're interested in.
      function MessageStore(flux) {
        _classCallCheck(this, MessageStore);

        var _this2 = _possibleConstructorReturn(this, _Store.call(this));

        // Don't forget to call the super constructor


        var messageActions = flux.getActions('messages');
        _this2.register(messageActions.newMessage, _this2.handleNewMessage);
        _this2.messageCounter = 0;

        _this2.state = {};
        return _this2;
      }

      MessageStore.prototype.handleNewMessage = function handleNewMessage(content) {
        var _setState;

        var id = this.messageCounter++;

        this.setState((_setState = {}, _setState[id] = {
          content: content,
          id: id
        }, _setState));
      };

      return MessageStore;
    }(_Flux.Store);

    /**
     * Here's where it all comes together. Extend from the base Flummox class
     * to create a class that encapsulates your entire flux set-up.
     */


    var Flux = function (_Flummox) {
      _inherits(Flux, _Flummox);

      function Flux() {
        _classCallCheck(this, Flux);

        // Create actions first so our store can reference them in
        // its constructor
        var _this3 = _possibleConstructorReturn(this, _Flummox.call(this));

        _this3.createActions('messages', MessageActions);

        // Extra arguments are sent to the store's constructor. Here, we're
        // padding a reference to this flux instance
        _this3.createStore('messages', MessageStore, _this3);
        return _this3;
      }

      return Flux;
    }(_Flux.Flummox);

    /**
     * And that's it! No need for singletons or global references -- just create
     * a new instance.
     *
     * Now let's test it.
     */

    it('creates new messages', function () {
      var _expect$to$deep$equal;

      var flux = new Flux();
      var messageStore = flux.getStore('messages');
      var messageActions = flux.getActions('messages');

      expect(messageStore.state).to.deep.equal({});

      messageActions.newMessage('Hello, world!');
      expect(messageStore.state).to.deep.equal((_expect$to$deep$equal = {}, _expect$to$deep$equal[0] = {
        content: 'Hello, world!',
        id: 0
      }, _expect$to$deep$equal));
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9fX3Rlc3RzX18vZXhhbXBsZUZsdXgtdGVzdC5qcyJdLCJuYW1lcyI6WyJkZXNjcmliZSIsIk1lc3NhZ2VBY3Rpb25zIiwibmV3TWVzc2FnZSIsImNvbnRlbnQiLCJNZXNzYWdlU3RvcmUiLCJmbHV4IiwibWVzc2FnZUFjdGlvbnMiLCJnZXRBY3Rpb25zIiwicmVnaXN0ZXIiLCJoYW5kbGVOZXdNZXNzYWdlIiwibWVzc2FnZUNvdW50ZXIiLCJzdGF0ZSIsImlkIiwic2V0U3RhdGUiLCJGbHV4IiwiY3JlYXRlQWN0aW9ucyIsImNyZWF0ZVN0b3JlIiwiaXQiLCJtZXNzYWdlU3RvcmUiLCJnZXRTdG9yZSIsImV4cGVjdCIsInRvIiwiZGVlcCIsImVxdWFsIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7OztBQUVBQSxTQUFTLFdBQVQsRUFBc0IsWUFBTTs7QUFFMUI7OztBQUdBQSxXQUFTLFVBQVQsRUFBcUIsWUFBTTs7QUFFekI7Ozs7Ozs7O0FBRnlCLFFBVW5CQyxjQVZtQjtBQUFBOztBQUFBO0FBQUE7O0FBQUE7QUFBQTs7QUFBQSwrQkFXdkJDLFVBWHVCLHVCQVdaQyxPQVhZLEVBV0g7O0FBRWxCO0FBQ0EsZUFBT0EsT0FBUDtBQUNELE9BZnNCOztBQUFBO0FBQUE7O0FBa0J6Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBbEJ5QixRQWtDbkJDLFlBbENtQjtBQUFBOztBQW9DdkI7QUFDQTtBQUNBLDRCQUFZQyxJQUFaLEVBQWtCO0FBQUE7O0FBQUEsc0RBR2hCLGlCQUhnQjs7QUFFaEI7OztBQUdBLFlBQU1DLGlCQUFpQkQsS0FBS0UsVUFBTCxDQUFnQixVQUFoQixDQUF2QjtBQUNBLGVBQUtDLFFBQUwsQ0FBY0YsZUFBZUosVUFBN0IsRUFBeUMsT0FBS08sZ0JBQTlDO0FBQ0EsZUFBS0MsY0FBTCxHQUFzQixDQUF0Qjs7QUFFQSxlQUFLQyxLQUFMLEdBQWEsRUFBYjtBQVRnQjtBQVVqQjs7QUFoRHNCLDZCQWtEdkJGLGdCQWxEdUIsNkJBa0ROTixPQWxETSxFQWtERztBQUFBOztBQUN4QixZQUFNUyxLQUFLLEtBQUtGLGNBQUwsRUFBWDs7QUFFQSxhQUFLRyxRQUFMLDRCQUNHRCxFQURILElBQ1E7QUFDSlQsMEJBREk7QUFFSlM7QUFGSSxTQURSO0FBTUQsT0EzRHNCOztBQUFBO0FBQUE7O0FBK0R6Qjs7Ozs7O0FBL0R5QixRQW1FbkJFLElBbkVtQjtBQUFBOztBQW9FdkIsc0JBQWM7QUFBQTs7QUFHWjtBQUNBO0FBSlksc0RBQ1osbUJBRFk7O0FBS1osZUFBS0MsYUFBTCxDQUFtQixVQUFuQixFQUErQmQsY0FBL0I7O0FBRUE7QUFDQTtBQUNBLGVBQUtlLFdBQUwsQ0FBaUIsVUFBakIsRUFBNkJaLFlBQTdCO0FBVFk7QUFVYjs7QUE5RXNCO0FBQUE7O0FBaUZ6Qjs7Ozs7OztBQU9BYSxPQUFHLHNCQUFILEVBQTJCLFlBQU07QUFBQTs7QUFDL0IsVUFBTVosT0FBTyxJQUFJUyxJQUFKLEVBQWI7QUFDQSxVQUFNSSxlQUFlYixLQUFLYyxRQUFMLENBQWMsVUFBZCxDQUFyQjtBQUNBLFVBQU1iLGlCQUFpQkQsS0FBS0UsVUFBTCxDQUFnQixVQUFoQixDQUF2Qjs7QUFFQWEsYUFBT0YsYUFBYVAsS0FBcEIsRUFBMkJVLEVBQTNCLENBQThCQyxJQUE5QixDQUFtQ0MsS0FBbkMsQ0FBeUMsRUFBekM7O0FBRUFqQixxQkFBZUosVUFBZixDQUEwQixlQUExQjtBQUNBa0IsYUFBT0YsYUFBYVAsS0FBcEIsRUFBMkJVLEVBQTNCLENBQThCQyxJQUE5QixDQUFtQ0MsS0FBbkMsb0RBQ0csQ0FESCxJQUNPO0FBQ0hwQixpQkFBUyxlQUROO0FBRUhTLFlBQUk7QUFGRCxPQURQO0FBTUQsS0FkRDtBQWVELEdBdkdEO0FBeUdELENBOUdEIiwiZmlsZSI6ImV4YW1wbGVGbHV4LXRlc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBGbHVtbW94LCBTdG9yZSwgQWN0aW9ucyB9IGZyb20gJy4uL0ZsdXgnO1xuXG5kZXNjcmliZSgnRXhhbXBsZXM6JywgKCkgPT4ge1xuXG4gIC8qKlxuICAgKiBBIHNpbXBsZSBGbHVtbW94IGV4YW1wbGVcbiAgICovXG4gIGRlc2NyaWJlKCdNZXNzYWdlcycsICgpID0+IHtcblxuICAgIC8qKlxuICAgICAqIFRvIGNyZWF0ZSBzb21lIGFjdGlvbnMsIGNyZWF0ZSBhIG5ldyBjbGFzcyB0aGF0IGV4dGVuZHMgZnJvbSB0aGUgYmFzZVxuICAgICAqIEFjdGlvbnMgY2xhc3MuIE1ldGhvZHMgb24gdGhlIGNsYXNzJ3MgcHJvdG90eXBlIHdpbGwgYmUgY29udmVydGVkIGludG9cbiAgICAgKiBhY3Rpb25zLCBlYWNoIHdpdGggaXRzIG93biBhY3Rpb24gaWQuXG4gICAgICpcbiAgICAgKiBJbiB0aGlzIGV4YW1wbGUsIGNhbGxpbmcgYG5ld01lc3NhZ2VgIHdpbGwgZmlyZSB0aGUgZGlzcGF0Y2hlciwgd2l0aFxuICAgICAqIGEgcGF5bG9hZCBjb250YWluaW5nIHRoZSBwYXNzZWQgbWVzc2FnZSBjb250ZW50LiBFYXN5IVxuICAgICAqL1xuICAgIGNsYXNzIE1lc3NhZ2VBY3Rpb25zIGV4dGVuZHMgQWN0aW9ucyB7XG4gICAgICBuZXdNZXNzYWdlKGNvbnRlbnQpIHtcblxuICAgICAgICAvLyBUaGUgcmV0dXJuIHZhbHVlIGZyb20gdGhlIGFjdGlvbiBpcyBzZW50IHRvIHRoZSBkaXNwYXRjaGVyLlxuICAgICAgICByZXR1cm4gY29udGVudDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBOb3cgd2UgbmVlZCB0byBhIFN0b3JlIHRoYXQgd2lsbCByZWNlaXZlIHBheWxvYWRzIGZyb20gdGhlIGRpc3BhdGNoZXJcbiAgICAgKiBhbmQgdXBkYXRlIGl0c2VsZiBhY2NvcmRpbmdseS4gTGlrZSBiZWZvcmUsIGNyZWF0ZSBhIG5ldyBjbGFzcyB0aGF0XG4gICAgICogZXh0ZW5kcyBmcm9tIHRoZSBTdG9yZSBjbGFzcy5cbiAgICAgKlxuICAgICAqIFN0b3JlcyBhcmUgYXV0b21hdGljYWxseSByZWdpc3RlcmVkIHdpdGggdGhlIGRpc3BhdGNoZXIsIGJ1dCByYXRoZXIgdGhhblxuICAgICAqIHVzaW5nIGEgZ2lhbnQgYHN3aXRjaGAgc3RhdGVtZW50IHRvIGNoZWNrIGZvciBzcGVjaWZpYyBhY3Rpb24gdHlwZXMsIHdlXG4gICAgICogcmVnaXN0ZXIgaGFuZGxlcnMgd2l0aCBhY3Rpb24gaWRzLCBvciB3aXRoIGEgcmVmZXJlbmNlIHRvIHRoZSBhY3Rpb25cbiAgICAgKiBpdHNlbGYuXG4gICAgICpcbiAgICAgKiBTdG9yZXMgaGF2ZSBhIFJlYWN0LWluc3BpcmVkIEFQSSBmb3IgbWFuYWdpbmcgc3RhdGUuIFVzZSBgdGhpcy5zZXRTdGF0ZWBcbiAgICAgKiB0byB1cGRhdGUgc3RhdGUgd2l0aGluIHlvdXIgaGFuZGxlcnMuIE11bHRpcGxlIGNhbGxzIHRvIGB0aGlzLnNldFN0YXRlYFxuICAgICAqIHdpdGhpbiB0aGUgc2FtZSBoYW5kbGVyIHdpbGwgYmUgYmF0Y2hlZC4gQSBjaGFuZ2UgZXZlbnQgd2lsbCBmaXJlIGFmdGVyXG4gICAgICogdGhlIGJhdGNoZWQgdXBkYXRlcyBhcmUgYXBwbGllZC4gWW91ciB2aWV3IGNvbnRyb2xsZXJzIGNhbiBsaXN0ZW5cbiAgICAgKiBmb3IgY2hhbmdlIGV2ZW50cyB1c2luZyB0aGUgRXZlbnRFbWl0dGVyIEFQSS5cbiAgICAgKi9cbiAgICBjbGFzcyBNZXNzYWdlU3RvcmUgZXh0ZW5kcyBTdG9yZSB7XG5cbiAgICAgIC8vIE5vdGUgdGhhdCBwYXNzaW5nIGEgZmx1eCBpbnN0YW5jZSB0byB0aGUgY29uc3RydWN0b3IgaXMgbm90IHJlcXVpcmVkO1xuICAgICAgLy8gd2UgZG8gaXQgaGVyZSBzbyB3ZSBoYXZlIGFjY2VzcyB0byBhbnkgYWN0aW9uIGlkcyB3ZSdyZSBpbnRlcmVzdGVkIGluLlxuICAgICAgY29uc3RydWN0b3IoZmx1eCkge1xuXG4gICAgICAgIC8vIERvbid0IGZvcmdldCB0byBjYWxsIHRoZSBzdXBlciBjb25zdHJ1Y3RvclxuICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgIGNvbnN0IG1lc3NhZ2VBY3Rpb25zID0gZmx1eC5nZXRBY3Rpb25zKCdtZXNzYWdlcycpO1xuICAgICAgICB0aGlzLnJlZ2lzdGVyKG1lc3NhZ2VBY3Rpb25zLm5ld01lc3NhZ2UsIHRoaXMuaGFuZGxlTmV3TWVzc2FnZSk7XG4gICAgICAgIHRoaXMubWVzc2FnZUNvdW50ZXIgPSAwO1xuXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7fTtcbiAgICAgIH1cblxuICAgICAgaGFuZGxlTmV3TWVzc2FnZShjb250ZW50KSB7XG4gICAgICAgIGNvbnN0IGlkID0gdGhpcy5tZXNzYWdlQ291bnRlcisrO1xuXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgIFtpZF06IHtcbiAgICAgICAgICAgIGNvbnRlbnQsXG4gICAgICAgICAgICBpZCxcbiAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEhlcmUncyB3aGVyZSBpdCBhbGwgY29tZXMgdG9nZXRoZXIuIEV4dGVuZCBmcm9tIHRoZSBiYXNlIEZsdW1tb3ggY2xhc3NcbiAgICAgKiB0byBjcmVhdGUgYSBjbGFzcyB0aGF0IGVuY2Fwc3VsYXRlcyB5b3VyIGVudGlyZSBmbHV4IHNldC11cC5cbiAgICAgKi9cbiAgICBjbGFzcyBGbHV4IGV4dGVuZHMgRmx1bW1veCB7XG4gICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICAvLyBDcmVhdGUgYWN0aW9ucyBmaXJzdCBzbyBvdXIgc3RvcmUgY2FuIHJlZmVyZW5jZSB0aGVtIGluXG4gICAgICAgIC8vIGl0cyBjb25zdHJ1Y3RvclxuICAgICAgICB0aGlzLmNyZWF0ZUFjdGlvbnMoJ21lc3NhZ2VzJywgTWVzc2FnZUFjdGlvbnMpO1xuXG4gICAgICAgIC8vIEV4dHJhIGFyZ3VtZW50cyBhcmUgc2VudCB0byB0aGUgc3RvcmUncyBjb25zdHJ1Y3Rvci4gSGVyZSwgd2UncmVcbiAgICAgICAgLy8gcGFkZGluZyBhIHJlZmVyZW5jZSB0byB0aGlzIGZsdXggaW5zdGFuY2VcbiAgICAgICAgdGhpcy5jcmVhdGVTdG9yZSgnbWVzc2FnZXMnLCBNZXNzYWdlU3RvcmUsIHRoaXMpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFuZCB0aGF0J3MgaXQhIE5vIG5lZWQgZm9yIHNpbmdsZXRvbnMgb3IgZ2xvYmFsIHJlZmVyZW5jZXMgLS0ganVzdCBjcmVhdGVcbiAgICAgKiBhIG5ldyBpbnN0YW5jZS5cbiAgICAgKlxuICAgICAqIE5vdyBsZXQncyB0ZXN0IGl0LlxuICAgICAqL1xuXG4gICAgaXQoJ2NyZWF0ZXMgbmV3IG1lc3NhZ2VzJywgKCkgPT4ge1xuICAgICAgY29uc3QgZmx1eCA9IG5ldyBGbHV4KCk7XG4gICAgICBjb25zdCBtZXNzYWdlU3RvcmUgPSBmbHV4LmdldFN0b3JlKCdtZXNzYWdlcycpO1xuICAgICAgY29uc3QgbWVzc2FnZUFjdGlvbnMgPSBmbHV4LmdldEFjdGlvbnMoJ21lc3NhZ2VzJyk7XG5cbiAgICAgIGV4cGVjdChtZXNzYWdlU3RvcmUuc3RhdGUpLnRvLmRlZXAuZXF1YWwoe30pO1xuXG4gICAgICBtZXNzYWdlQWN0aW9ucy5uZXdNZXNzYWdlKCdIZWxsbywgd29ybGQhJyk7XG4gICAgICBleHBlY3QobWVzc2FnZVN0b3JlLnN0YXRlKS50by5kZWVwLmVxdWFsKHtcbiAgICAgICAgWzBdOiB7XG4gICAgICAgICAgY29udGVudDogJ0hlbGxvLCB3b3JsZCEnLFxuICAgICAgICAgIGlkOiAwLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG59KTtcbiJdfQ==