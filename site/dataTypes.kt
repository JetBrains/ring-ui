external interface NavData {
  val version: String
  val categories: Array<Category>
}
external interface Category {
  val name: String
  val items: Array<Item>
}
external interface Item
external interface Source
