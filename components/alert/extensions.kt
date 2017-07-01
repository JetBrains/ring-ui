package ring.alert

enum class AlertType {
  ERROR, MESSAGE, SUCCESS, WARNING, LOADING
}

var AlertProps.type: AlertType
  get() = AlertType.valueOf(stringType.toUpperCase())
  set(value) {
    stringType = value.name.toLowerCase()
  }
