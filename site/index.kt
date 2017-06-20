import kotlinext.js.*
import org.w3c.dom.*
import react.dom.*
import kotlin.browser.*
import react.*
import kotlin.js.*

@JsModule("ring-ui/components/content-layout/content-layout")
external object ContentLayout {
  val default: RClass<WithClassName>
  val Sidebar: RClass<*>
}

@JsModule("ring-ui/site/utils")
external object Utils {
  fun fetchNavData(): Promise<NavData>
  fun <T> fetchData(url: String): Promise<T>
}

@JsModule("ring-ui/site/components/header")
external object Header {
  val default: RClass<HeaderProps>
}
external interface HeaderProps: RProps {
  var version: String
  var docsItems: Array<Item>
}

@JsModule("ring-ui/site/components/nav")
external object Nav {
  val default: RClass<NavProps>
}
external interface NavProps: RProps {
  var categories: Array<Category>
}

@JsModule("ring-ui/site/components/content")
external object Content {
  val default: RClass<ContentProps>
}
external interface ContentProps: RProps, Source

@JsModule("ring-ui/site/index.css")
external val styles: dynamic

fun main(args: Array<String>) {
  val jsonURL = document.body!!.dataset["jsonUrl"]!!;
  val promises = arrayOf(Utils.fetchData(jsonURL), Utils.fetchNavData())

  Promise.all(promises).then({
    val source = it[0] as Source
    val navData = it[1] as NavData

    render(document.querySelector("#app")) {
      div(styles.app) {
        Header.default {
          attrs.version = navData.version
          attrs.docsItems = navData.categories.find {
            it.name === "Docs"
          }!!.items
        }
        ContentLayout.default {
          attrs.className = styles.main
          ContentLayout.Sidebar {
            Nav.default {
              attrs.categories = navData.categories.filter {
                it.name !== "Docs"
              }.toTypedArray()
            }
          }
          Content.default {
            assign(attrs, source)
          }
        }
      }
    }
  })

}
