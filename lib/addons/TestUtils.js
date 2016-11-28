'use strict';

exports.__esModule = true;
exports.simulateAction = simulateAction;
exports.simulateActionAsync = simulateActionAsync;
/**
 * Used for simulating actions on stores when testing.
 *
 */
function simulateAction(store, action, body) {
  var actionId = ensureActionId(action);
  store.handler({ actionId: actionId, body: body });
}

/**
 * Used for simulating asynchronous actions on stores when testing.
 *
 * asyncAction must be one of the following: begin, success or failure.
 *
 * When simulating the 'begin' action, all arguments after 'begin' will
 * be passed to the action handler in the store.
 *
 * @example
 *
 * TestUtils.simulateActionAsync(store, 'actionId', 'begin', 'arg1', 'arg2');
 * TestUtils.simulateActionAsync(store, 'actionId', 'success', { foo: 'bar' });
 * TestUtils.simulateActionAsync(store, 'actionId', 'failure', new Error('action failed'));
 */
function simulateActionAsync(store, action, asyncAction) {
  var actionId = ensureActionId(action);
  var payload = {
    actionId: actionId, async: asyncAction
  };

  for (var _len = arguments.length, args = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
    args[_key - 3] = arguments[_key];
  }

  switch (asyncAction) {
    case 'begin':
      if (args.length) {
        payload.actionArgs = args;
      }
      break;
    case 'success':
      payload.body = args[0];
      break;
    case 'failure':
      payload.error = args[0];
      break;
    default:
      throw new Error('asyncAction must be one of: begin, success or failure');
  }

  store.handler(payload);
}

function ensureActionId(actionOrActionId) {
  return typeof actionOrActionId === 'function' ? actionOrActionId._id : actionOrActionId;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hZGRvbnMvVGVzdFV0aWxzLmpzIl0sIm5hbWVzIjpbInNpbXVsYXRlQWN0aW9uIiwic2ltdWxhdGVBY3Rpb25Bc3luYyIsInN0b3JlIiwiYWN0aW9uIiwiYm9keSIsImFjdGlvbklkIiwiZW5zdXJlQWN0aW9uSWQiLCJoYW5kbGVyIiwiYXN5bmNBY3Rpb24iLCJwYXlsb2FkIiwiYXN5bmMiLCJhcmdzIiwibGVuZ3RoIiwiYWN0aW9uQXJncyIsImVycm9yIiwiRXJyb3IiLCJhY3Rpb25PckFjdGlvbklkIiwiX2lkIl0sIm1hcHBpbmdzIjoiOzs7UUFJZ0JBLGMsR0FBQUEsYztRQW1CQUMsbUIsR0FBQUEsbUI7QUF2QmhCOzs7O0FBSU8sU0FBU0QsY0FBVCxDQUF3QkUsS0FBeEIsRUFBK0JDLE1BQS9CLEVBQXVDQyxJQUF2QyxFQUE2QztBQUNsRCxNQUFNQyxXQUFXQyxlQUFlSCxNQUFmLENBQWpCO0FBQ0FELFFBQU1LLE9BQU4sQ0FBYyxFQUFFRixrQkFBRixFQUFZRCxVQUFaLEVBQWQ7QUFDRDs7QUFFRDs7Ozs7Ozs7Ozs7Ozs7QUFjTyxTQUFTSCxtQkFBVCxDQUE2QkMsS0FBN0IsRUFBb0NDLE1BQXBDLEVBQTRDSyxXQUE1QyxFQUFrRTtBQUN2RSxNQUFNSCxXQUFXQyxlQUFlSCxNQUFmLENBQWpCO0FBQ0EsTUFBTU0sVUFBVTtBQUNkSixzQkFEYyxFQUNKSyxPQUFPRjtBQURILEdBQWhCOztBQUZ1RSxvQ0FBTkcsSUFBTTtBQUFOQSxRQUFNO0FBQUE7O0FBTXZFLFVBQU9ILFdBQVA7QUFDRSxTQUFLLE9BQUw7QUFDRSxVQUFJRyxLQUFLQyxNQUFULEVBQWlCO0FBQ2ZILGdCQUFRSSxVQUFSLEdBQXFCRixJQUFyQjtBQUNEO0FBQ0Q7QUFDRixTQUFLLFNBQUw7QUFDRUYsY0FBUUwsSUFBUixHQUFlTyxLQUFLLENBQUwsQ0FBZjtBQUNBO0FBQ0YsU0FBSyxTQUFMO0FBQ0VGLGNBQVFLLEtBQVIsR0FBZ0JILEtBQUssQ0FBTCxDQUFoQjtBQUNBO0FBQ0Y7QUFDRSxZQUFNLElBQUlJLEtBQUosQ0FBVSx1REFBVixDQUFOO0FBYko7O0FBZ0JBYixRQUFNSyxPQUFOLENBQWNFLE9BQWQ7QUFDRDs7QUFFRCxTQUFTSCxjQUFULENBQXdCVSxnQkFBeEIsRUFBMEM7QUFDeEMsU0FBTyxPQUFPQSxnQkFBUCxLQUE0QixVQUE1QixHQUNIQSxpQkFBaUJDLEdBRGQsR0FFSEQsZ0JBRko7QUFHRCIsImZpbGUiOiJUZXN0VXRpbHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFVzZWQgZm9yIHNpbXVsYXRpbmcgYWN0aW9ucyBvbiBzdG9yZXMgd2hlbiB0ZXN0aW5nLlxuICpcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNpbXVsYXRlQWN0aW9uKHN0b3JlLCBhY3Rpb24sIGJvZHkpIHtcbiAgY29uc3QgYWN0aW9uSWQgPSBlbnN1cmVBY3Rpb25JZChhY3Rpb24pO1xuICBzdG9yZS5oYW5kbGVyKHsgYWN0aW9uSWQsIGJvZHkgfSk7XG59XG5cbi8qKlxuICogVXNlZCBmb3Igc2ltdWxhdGluZyBhc3luY2hyb25vdXMgYWN0aW9ucyBvbiBzdG9yZXMgd2hlbiB0ZXN0aW5nLlxuICpcbiAqIGFzeW5jQWN0aW9uIG11c3QgYmUgb25lIG9mIHRoZSBmb2xsb3dpbmc6IGJlZ2luLCBzdWNjZXNzIG9yIGZhaWx1cmUuXG4gKlxuICogV2hlbiBzaW11bGF0aW5nIHRoZSAnYmVnaW4nIGFjdGlvbiwgYWxsIGFyZ3VtZW50cyBhZnRlciAnYmVnaW4nIHdpbGxcbiAqIGJlIHBhc3NlZCB0byB0aGUgYWN0aW9uIGhhbmRsZXIgaW4gdGhlIHN0b3JlLlxuICpcbiAqIEBleGFtcGxlXG4gKlxuICogVGVzdFV0aWxzLnNpbXVsYXRlQWN0aW9uQXN5bmMoc3RvcmUsICdhY3Rpb25JZCcsICdiZWdpbicsICdhcmcxJywgJ2FyZzInKTtcbiAqIFRlc3RVdGlscy5zaW11bGF0ZUFjdGlvbkFzeW5jKHN0b3JlLCAnYWN0aW9uSWQnLCAnc3VjY2VzcycsIHsgZm9vOiAnYmFyJyB9KTtcbiAqIFRlc3RVdGlscy5zaW11bGF0ZUFjdGlvbkFzeW5jKHN0b3JlLCAnYWN0aW9uSWQnLCAnZmFpbHVyZScsIG5ldyBFcnJvcignYWN0aW9uIGZhaWxlZCcpKTtcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNpbXVsYXRlQWN0aW9uQXN5bmMoc3RvcmUsIGFjdGlvbiwgYXN5bmNBY3Rpb24sIC4uLmFyZ3MpIHtcbiAgY29uc3QgYWN0aW9uSWQgPSBlbnN1cmVBY3Rpb25JZChhY3Rpb24pO1xuICBjb25zdCBwYXlsb2FkID0ge1xuICAgIGFjdGlvbklkLCBhc3luYzogYXN5bmNBY3Rpb25cbiAgfTtcblxuICBzd2l0Y2goYXN5bmNBY3Rpb24pIHtcbiAgICBjYXNlICdiZWdpbic6XG4gICAgICBpZiAoYXJncy5sZW5ndGgpIHtcbiAgICAgICAgcGF5bG9hZC5hY3Rpb25BcmdzID0gYXJncztcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ3N1Y2Nlc3MnOlxuICAgICAgcGF5bG9hZC5ib2R5ID0gYXJnc1swXTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ2ZhaWx1cmUnOlxuICAgICAgcGF5bG9hZC5lcnJvciA9IGFyZ3NbMF07XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdhc3luY0FjdGlvbiBtdXN0IGJlIG9uZSBvZjogYmVnaW4sIHN1Y2Nlc3Mgb3IgZmFpbHVyZScpO1xuICB9XG5cbiAgc3RvcmUuaGFuZGxlcihwYXlsb2FkKTtcbn1cblxuZnVuY3Rpb24gZW5zdXJlQWN0aW9uSWQoYWN0aW9uT3JBY3Rpb25JZCkge1xuICByZXR1cm4gdHlwZW9mIGFjdGlvbk9yQWN0aW9uSWQgPT09ICdmdW5jdGlvbidcbiAgICA/IGFjdGlvbk9yQWN0aW9uSWQuX2lkXG4gICAgOiBhY3Rpb25PckFjdGlvbklkO1xufVxuIl19