"use strict";(globalThis.webpackChunk_jetbrains_ring_ui=globalThis.webpackChunk_jetbrains_ring_ui||[]).push([[6460],{"./src/grid/grid.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{alignment:()=>alignment,autoSize:()=>autoSize,columnsDistribution:()=>columnsDistribution,default:()=>__WEBPACK_DEFAULT_EXPORT__,offset:()=>offset,responsive:()=>responsive});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_grid__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./src/grid/grid.tsx"),_grid__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/grid/row.tsx"),_grid__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./src/grid/col.tsx");const __WEBPACK_DEFAULT_EXPORT__={title:"Components/Grid",parameters:{storySource:{source:'import React from \'react\';\n\n\nimport {Grid, Row, Col} from \'./grid\';\n\nexport default {\n  title: \'Components/Grid\',\n\n  parameters: {\n    notes:\n      \'Implements a flexbox-like grid system for components placement. Inspired by react-flexbox-grid, see http://roylee0704.github.io/react-flexbox-grid/ and http://flexboxgrid.com/ for additional information.\'\n  }\n};\n\nexport const responsive = () => (\n  <Grid>\n    <Row start="xs">\n      <Col xs={12} sm={4} md={6} lg={3}>\n        <div className="cell">Cell 1</div>\n      </Col>\n      <Col xs={12} sm={8} md={6} lg={3}>\n        <div className="cell">Cell 2</div>\n      </Col>\n      <Col xs={12} smOffset={4} sm={8} md={12} lg={6}>\n        <div className="cell">Cell 3</div>\n      </Col>\n    </Row>\n  </Grid>\n);\n\nresponsive.storyName = \'responsive\';\n\nresponsive.parameters = {\n  storyStyles: `\n<style>\n  .cell {\n    background-color: silver;\n  }\n</style>`\n};\n\nexport const offset = () => (\n  <div>\n    <h4>Offset a column.</h4>\n    <Grid data-test="offset">\n      <Row>\n        <Col xsOffset={11} xs={1}>\n          <div className="cell">\n            xsOffset={11} xs={1}\n          </div>\n        </Col>\n        <Col xsOffset={10} xs={2}>\n          <div className="cell">\n            xsOffset={10} xs={2}\n          </div>\n        </Col>\n        <Col xsOffset={9} xs={3}>\n          <div className="cell">\n            xsOffset={9} xs={3}\n          </div>\n        </Col>\n        <Col xsOffset={8} xs={4}>\n          <div className="cell">\n            xsOffset={8} xs={4}\n          </div>\n        </Col>\n        <Col xsOffset={7} xs={5}>\n          <div className="cell">\n            xsOffset={7} xs={5}\n          </div>\n        </Col>\n        <Col xsOffset={6} xs={6}>\n          <div className="cell">\n            xsOffset={6} xs={6}\n          </div>\n        </Col>\n        <Col xsOffset={5} xs={7}>\n          <div className="cell">\n            xsOffset={5} xs={7}\n          </div>\n        </Col>\n        <Col xsOffset={4} xs={8}>\n          <div className="cell">\n            xsOffset={4} xs={8}\n          </div>\n        </Col>\n        <Col xsOffset={3} xs={9}>\n          <div className="cell">\n            xsOffset={3} xs={9}\n          </div>\n        </Col>\n        <Col xsOffset={2} xs={10}>\n          <div className="cell">\n            xsOffset={2} xs={10}\n          </div>\n        </Col>\n        <Col xsOffset={1} xs={11}>\n          <div className="cell">\n            xsOffset={1} xs={11}\n          </div>\n        </Col>\n      </Row>\n    </Grid>\n  </div>\n);\n\noffset.storyName = \'offset\';\n\noffset.parameters = {\n  storyStyles: `\n<style>\n  .cell {\n    background-color: silver;\n    overflow: hidden;\n    text-overflow: ellipsis;\n    white-space: nowrap;\n  }\n</style>`\n};\n\nexport const autoSize = () => (\n  <div>\n    <h4>Auto Width: add any number of auto sizing columns to a row. Let the grid figure it out.</h4>\n    <Grid data-test="auto-size">\n      <Row>\n        <Col xs>\n          <div className="cell">Autosize</div>\n        </Col>\n        <Col xs>\n          <div className="cell">Autosize column with larger text</div>\n        </Col>\n      </Row>\n      <Row>\n        <Col xs>\n          <div className="cell">Autosize</div>\n        </Col>\n        <Col xs>\n          <div className="cell">Autosize column with much much much larger text</div>\n        </Col>\n        <Col xs>\n          <div className="cell">Autosize</div>\n        </Col>\n      </Row>\n    </Grid>\n  </div>\n);\n\nautoSize.storyName = \'auto size\';\n\nautoSize.parameters = {\n  storyStyles: `\n<style>\n  .cell {\n    background-color: silver;\n    overflow: hidden;\n    text-overflow: ellipsis;\n    white-space: nowrap;\n  }\n</style>`\n};\n\nexport const alignment = () => (\n  <div>\n    <h4>\n      Add classes to align elements to the start or end of row as well as the top, bottom, or center\n      of a column\n    </h4>\n    <Grid data-test="alignment">\n      <Row>\n        <Col xs={12}>\n          <Row start="xs">\n            <Col xs={6} className="cell">\n              start\n            </Col>\n          </Row>\n        </Col>\n      </Row>\n      <Row>\n        <Col xs={12}>\n          <Row center="xs">\n            <Col xs={6} className="cell">\n              center\n            </Col>\n          </Row>\n        </Col>\n      </Row>\n      <Row>\n        <Col xs={12}>\n          <Row end="xs">\n            <Col xs={6} className="cell">\n              end\n            </Col>\n          </Row>\n        </Col>\n      </Row>\n      <Row>\n        <Col xs={12}>\n          <Row top="xs">\n            <Col xs={6}>\n              <div className="cell">top</div>\n            </Col>\n            <Col xs={6}>\n              <div className="cell cell_tall"/>\n            </Col>\n          </Row>\n        </Col>\n      </Row>\n      <Row>\n        <Col xs={12}>\n          <Row middle="xs">\n            <Col xs={6}>\n              <div className="cell">middle</div>\n            </Col>\n            <Col xs={6}>\n              <div className="cell cell_tall"/>\n            </Col>\n          </Row>\n        </Col>\n      </Row>\n      <Row>\n        <Col xs={12}>\n          <Row bottom="xs">\n            <Col xs={6}>\n              <div className="cell">bottom</div>\n            </Col>\n            <Col xs={6}>\n              <div className="cell cell_tall"/>\n            </Col>\n          </Row>\n        </Col>\n      </Row>\n    </Grid>\n  </div>\n);\n\nalignment.storyName = \'alignment\';\n\nalignment.parameters = {\n  storyStyles: `\n<style>\n  .cell {\n    background-color: silver;\n  }\n  .cell_tall {\n    height: 64px;\n  }\n</style>`\n};\n\nexport const columnsDistribution = () => (\n  <div>\n    <h4>Distribution: add classes to distribute the contents of a row or column.</h4>\n    <Grid data-test="distribution">\n      <Row around="xs">\n        <Col xs={2}>\n          <div className="cell">around</div>\n        </Col>\n        <Col xs={2}>\n          <div className="cell">around</div>\n        </Col>\n        <Col xs={2}>\n          <div className="cell">around</div>\n        </Col>\n      </Row>\n      <Row between="xs">\n        <Col xs={2}>\n          <div className="cell">between</div>\n        </Col>\n        <Col xs={2}>\n          <div className="cell">between</div>\n        </Col>\n        <Col xs={2}>\n          <div className="cell">between</div>\n        </Col>\n      </Row>\n    </Grid>\n  </div>\n);\n\ncolumnsDistribution.storyName = \'columns distribution\';\n\ncolumnsDistribution.parameters = {\n  storyStyles: `\n<style>\n  .cell {\n    background-color: silver;\n  }\n</style>`\n};\n',locationsMap:{responsive:{startLoc:{col:26,line:15},endLoc:{col:1,line:29},startBody:{col:26,line:15},endBody:{col:1,line:29}},offset:{startLoc:{col:22,line:42},endLoc:{col:1,line:105},startBody:{col:22,line:42},endBody:{col:1,line:105}},"auto-size":{startLoc:{col:24,line:121},endLoc:{col:1,line:146},startBody:{col:24,line:121},endBody:{col:1,line:146}},alignment:{startLoc:{col:25,line:162},endLoc:{col:1,line:234},startBody:{col:25,line:162},endBody:{col:1,line:234}},"columns-distribution":{startLoc:{col:35,line:250},endLoc:{col:1,line:278},startBody:{col:35,line:250},endBody:{col:1,line:278}}}},notes:"Implements a flexbox-like grid system for components placement. Inspired by react-flexbox-grid, see http://roylee0704.github.io/react-flexbox-grid/ and http://flexboxgrid.com/ for additional information."}},responsive=()=>react__WEBPACK_IMPORTED_MODULE_0__.createElement(_grid__WEBPACK_IMPORTED_MODULE_1__.xA,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(_grid__WEBPACK_IMPORTED_MODULE_2__.A,{start:"xs"},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_grid__WEBPACK_IMPORTED_MODULE_3__.A,{xs:12,sm:4,md:6,lg:3},react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"cell"},"Cell 1")),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_grid__WEBPACK_IMPORTED_MODULE_3__.A,{xs:12,sm:8,md:6,lg:3},react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"cell"},"Cell 2")),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_grid__WEBPACK_IMPORTED_MODULE_3__.A,{xs:12,smOffset:4,sm:8,md:12,lg:6},react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"cell"},"Cell 3"))));responsive.storyName="responsive",responsive.parameters={storyStyles:"\n<style>\n  .cell {\n    background-color: silver;\n  }\n</style>"};const offset=()=>react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",null,react__WEBPACK_IMPORTED_MODULE_0__.createElement("h4",null,"Offset a column."),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_grid__WEBPACK_IMPORTED_MODULE_1__.xA,{"data-test":"offset"},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_grid__WEBPACK_IMPORTED_MODULE_2__.A,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(_grid__WEBPACK_IMPORTED_MODULE_3__.A,{xsOffset:11,xs:1},react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"cell"},"xsOffset=",11," xs=",1)),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_grid__WEBPACK_IMPORTED_MODULE_3__.A,{xsOffset:10,xs:2},react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"cell"},"xsOffset=",10," xs=",2)),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_grid__WEBPACK_IMPORTED_MODULE_3__.A,{xsOffset:9,xs:3},react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"cell"},"xsOffset=",9," xs=",3)),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_grid__WEBPACK_IMPORTED_MODULE_3__.A,{xsOffset:8,xs:4},react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"cell"},"xsOffset=",8," xs=",4)),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_grid__WEBPACK_IMPORTED_MODULE_3__.A,{xsOffset:7,xs:5},react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"cell"},"xsOffset=",7," xs=",5)),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_grid__WEBPACK_IMPORTED_MODULE_3__.A,{xsOffset:6,xs:6},react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"cell"},"xsOffset=",6," xs=",6)),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_grid__WEBPACK_IMPORTED_MODULE_3__.A,{xsOffset:5,xs:7},react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"cell"},"xsOffset=",5," xs=",7)),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_grid__WEBPACK_IMPORTED_MODULE_3__.A,{xsOffset:4,xs:8},react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"cell"},"xsOffset=",4," xs=",8)),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_grid__WEBPACK_IMPORTED_MODULE_3__.A,{xsOffset:3,xs:9},react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"cell"},"xsOffset=",3," xs=",9)),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_grid__WEBPACK_IMPORTED_MODULE_3__.A,{xsOffset:2,xs:10},react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"cell"},"xsOffset=",2," xs=",10)),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_grid__WEBPACK_IMPORTED_MODULE_3__.A,{xsOffset:1,xs:11},react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"cell"},"xsOffset=",1," xs=",11)))));offset.storyName="offset",offset.parameters={storyStyles:"\n<style>\n  .cell {\n    background-color: silver;\n    overflow: hidden;\n    text-overflow: ellipsis;\n    white-space: nowrap;\n  }\n</style>"};const autoSize=()=>react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",null,react__WEBPACK_IMPORTED_MODULE_0__.createElement("h4",null,"Auto Width: add any number of auto sizing columns to a row. Let the grid figure it out."),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_grid__WEBPACK_IMPORTED_MODULE_1__.xA,{"data-test":"auto-size"},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_grid__WEBPACK_IMPORTED_MODULE_2__.A,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(_grid__WEBPACK_IMPORTED_MODULE_3__.A,{xs:!0},react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"cell"},"Autosize")),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_grid__WEBPACK_IMPORTED_MODULE_3__.A,{xs:!0},react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"cell"},"Autosize column with larger text"))),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_grid__WEBPACK_IMPORTED_MODULE_2__.A,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(_grid__WEBPACK_IMPORTED_MODULE_3__.A,{xs:!0},react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"cell"},"Autosize")),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_grid__WEBPACK_IMPORTED_MODULE_3__.A,{xs:!0},react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"cell"},"Autosize column with much much much larger text")),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_grid__WEBPACK_IMPORTED_MODULE_3__.A,{xs:!0},react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"cell"},"Autosize")))));autoSize.storyName="auto size",autoSize.parameters={storyStyles:"\n<style>\n  .cell {\n    background-color: silver;\n    overflow: hidden;\n    text-overflow: ellipsis;\n    white-space: nowrap;\n  }\n</style>"};const alignment=()=>react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",null,react__WEBPACK_IMPORTED_MODULE_0__.createElement("h4",null,"Add classes to align elements to the start or end of row as well as the top, bottom, or center of a column"),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_grid__WEBPACK_IMPORTED_MODULE_1__.xA,{"data-test":"alignment"},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_grid__WEBPACK_IMPORTED_MODULE_2__.A,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(_grid__WEBPACK_IMPORTED_MODULE_3__.A,{xs:12},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_grid__WEBPACK_IMPORTED_MODULE_2__.A,{start:"xs"},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_grid__WEBPACK_IMPORTED_MODULE_3__.A,{xs:6,className:"cell"},"start")))),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_grid__WEBPACK_IMPORTED_MODULE_2__.A,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(_grid__WEBPACK_IMPORTED_MODULE_3__.A,{xs:12},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_grid__WEBPACK_IMPORTED_MODULE_2__.A,{center:"xs"},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_grid__WEBPACK_IMPORTED_MODULE_3__.A,{xs:6,className:"cell"},"center")))),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_grid__WEBPACK_IMPORTED_MODULE_2__.A,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(_grid__WEBPACK_IMPORTED_MODULE_3__.A,{xs:12},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_grid__WEBPACK_IMPORTED_MODULE_2__.A,{end:"xs"},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_grid__WEBPACK_IMPORTED_MODULE_3__.A,{xs:6,className:"cell"},"end")))),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_grid__WEBPACK_IMPORTED_MODULE_2__.A,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(_grid__WEBPACK_IMPORTED_MODULE_3__.A,{xs:12},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_grid__WEBPACK_IMPORTED_MODULE_2__.A,{top:"xs"},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_grid__WEBPACK_IMPORTED_MODULE_3__.A,{xs:6},react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"cell"},"top")),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_grid__WEBPACK_IMPORTED_MODULE_3__.A,{xs:6},react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"cell cell_tall"}))))),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_grid__WEBPACK_IMPORTED_MODULE_2__.A,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(_grid__WEBPACK_IMPORTED_MODULE_3__.A,{xs:12},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_grid__WEBPACK_IMPORTED_MODULE_2__.A,{middle:"xs"},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_grid__WEBPACK_IMPORTED_MODULE_3__.A,{xs:6},react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"cell"},"middle")),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_grid__WEBPACK_IMPORTED_MODULE_3__.A,{xs:6},react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"cell cell_tall"}))))),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_grid__WEBPACK_IMPORTED_MODULE_2__.A,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(_grid__WEBPACK_IMPORTED_MODULE_3__.A,{xs:12},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_grid__WEBPACK_IMPORTED_MODULE_2__.A,{bottom:"xs"},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_grid__WEBPACK_IMPORTED_MODULE_3__.A,{xs:6},react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"cell"},"bottom")),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_grid__WEBPACK_IMPORTED_MODULE_3__.A,{xs:6},react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"cell cell_tall"})))))));alignment.storyName="alignment",alignment.parameters={storyStyles:"\n<style>\n  .cell {\n    background-color: silver;\n  }\n  .cell_tall {\n    height: 64px;\n  }\n</style>"};const columnsDistribution=()=>react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",null,react__WEBPACK_IMPORTED_MODULE_0__.createElement("h4",null,"Distribution: add classes to distribute the contents of a row or column."),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_grid__WEBPACK_IMPORTED_MODULE_1__.xA,{"data-test":"distribution"},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_grid__WEBPACK_IMPORTED_MODULE_2__.A,{around:"xs"},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_grid__WEBPACK_IMPORTED_MODULE_3__.A,{xs:2},react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"cell"},"around")),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_grid__WEBPACK_IMPORTED_MODULE_3__.A,{xs:2},react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"cell"},"around")),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_grid__WEBPACK_IMPORTED_MODULE_3__.A,{xs:2},react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"cell"},"around"))),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_grid__WEBPACK_IMPORTED_MODULE_2__.A,{between:"xs"},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_grid__WEBPACK_IMPORTED_MODULE_3__.A,{xs:2},react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"cell"},"between")),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_grid__WEBPACK_IMPORTED_MODULE_3__.A,{xs:2},react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"cell"},"between")),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_grid__WEBPACK_IMPORTED_MODULE_3__.A,{xs:2},react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"cell"},"between")))));columnsDistribution.storyName="columns distribution",columnsDistribution.parameters={storyStyles:"\n<style>\n  .cell {\n    background-color: silver;\n  }\n</style>"}}}]);