package ring.alert

enum class Type {
  ERROR, MESSAGE, SUCCESS, WARNING, LOADING
}

fun AlertProps.type(enum: Type) {
  type = enum.name.toLowerCase()
}
