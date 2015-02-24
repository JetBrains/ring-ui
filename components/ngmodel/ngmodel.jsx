var NgModelMixin = {
  componentDidUpdate: function() {
    if (this.props._onModelChange) {
      var data;
      if (this.ngModelStateField) {
        if (typeof this.ngModelStateField === 'string' && this.state[this.ngModelStateField] !== undefined) {
          data = this.state[this.ngModelStateField];
        } else if (typeof this.ngModelStateField === 'object') {
          data = {};
          for (var stateFieldName in this.state) {
            if (this.state.hasOwnProperty(stateFieldName) && this.ngModelStateField[stateFieldName]) {
              data[stateFieldName] = this.state[stateFieldName];
            }
          }
        } else {
          return;
        }
      }

      this.props._onModelChange(data);
    }
  }
};

module.exports = NgModelMixin;
