'use strict';

exports.__esModule = true;
exports['default'] = addContext;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function addContext(Component, context, contextTypes) {
  return _react2['default'].createClass({
    childContextTypes: contextTypes,

    getChildContext: function getChildContext() {
      return context;
    },
    render: function render() {
      return _react2['default'].createElement(Component, this.props);
    }
  });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hZGRvbnMvX190ZXN0c19fL2FkZENvbnRleHQuanMiXSwibmFtZXMiOlsiYWRkQ29udGV4dCIsIkNvbXBvbmVudCIsImNvbnRleHQiLCJjb250ZXh0VHlwZXMiLCJjcmVhdGVDbGFzcyIsImNoaWxkQ29udGV4dFR5cGVzIiwiZ2V0Q2hpbGRDb250ZXh0IiwicmVuZGVyIiwicHJvcHMiXSwibWFwcGluZ3MiOiI7OztxQkFFd0JBLFU7O0FBRnhCOzs7Ozs7QUFFZSxTQUFTQSxVQUFULENBQW9CQyxTQUFwQixFQUErQkMsT0FBL0IsRUFBd0NDLFlBQXhDLEVBQXNEO0FBQ25FLFNBQU8sbUJBQU1DLFdBQU4sQ0FBa0I7QUFDdkJDLHVCQUFtQkYsWUFESTs7QUFHdkJHLG1CQUh1Qiw2QkFHTDtBQUNoQixhQUFPSixPQUFQO0FBQ0QsS0FMc0I7QUFPdkJLLFVBUHVCLG9CQU9kO0FBQ1AsYUFBTyxpQ0FBQyxTQUFELEVBQWUsS0FBS0MsS0FBcEIsQ0FBUDtBQUNEO0FBVHNCLEdBQWxCLENBQVA7QUFXRCIsImZpbGUiOiJhZGRDb250ZXh0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYWRkQ29udGV4dChDb21wb25lbnQsIGNvbnRleHQsIGNvbnRleHRUeXBlcykge1xuICByZXR1cm4gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICAgIGNoaWxkQ29udGV4dFR5cGVzOiBjb250ZXh0VHlwZXMsXG5cbiAgICBnZXRDaGlsZENvbnRleHQoKSB7XG4gICAgICByZXR1cm4gY29udGV4dDtcbiAgICB9LFxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgcmV0dXJuIDxDb21wb25lbnQgey4uLnRoaXMucHJvcHN9IC8+O1xuICAgIH1cbiAgfSk7XG59XG4iXX0=