@file:JsModule("ring-ui/components/alert/alert")
package ring.alert

import org.w3c.dom.events.*
import react.*
import react.dom.*

@JsName("default")
external val Alert: RClass<AlertProps>
external interface AlertProps: WithClassName {
  var closeable: Boolean
  var showWithAnimation: Boolean
  @JsName("type")
  var stringType: String
  var inline: Boolean
  var isClosing: Boolean
  var timeout: Int
  var onClose: () -> Unit
  var onCloseRequest: (MouseEvent?) -> Unit
  var count: Int
}

external val Container: RClass<ContainerProps>
external interface ContainerProps: DOMProps
