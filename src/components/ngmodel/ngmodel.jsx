var NgModelMixin = {
  componentDidUpdate: function() {
    if (this.props._onModelChange) {
      var model = this.state;
      if (this.ngModelStateField && this.state[this.ngModelStateField] !== undefined) {
        model = this.state[this.ngModelStateField];
      }

      this.props._onModelChange(model);
    }
  }
};

module.exports = NgModelMixin;
