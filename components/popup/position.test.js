/* eslint-disable no-magic-numbers */
import {Directions, maxHeightForDirection} from './position';

describe('position', () => {
  describe('maxHeightForDirection', () => {
    it('should return max height for specified direction relative to container', () => {
      const containerNode = createNode({},
        createClientRectMock({
          top: 10,
          left: 10,
          width: 30,
          height: 30
        })
      );

      const anchorNode = createNode({},
        createClientRectMock({
          top: containerNode.getBoundingClientRect().top + 10,
          left: containerNode.getBoundingClientRect().left + 10,
          width: 10,
          height: 10
        })
      );

      const topMaxHeight = 10;
      const bottomMaxHeight = 10;
      checkMaxHeight(anchorNode, containerNode, [
        topMaxHeight,
        bottomMaxHeight
      ]);
    });


    it('should NOT include scroll height when calculate max height', () => {
      const containerNode = createNode(
        {
          scrollTop: 10,
          scrollHeight: 50
        },
        createClientRectMock({
          top: 10,
          left: 10,
          width: 30,
          height: 30
        })
      );

      const anchorNode = createNode({
        getBoundingClientRect: () => (createClientRectMock({
          top: containerNode.getBoundingClientRect().top + 10,
          left: containerNode.getBoundingClientRect().left + 10,
          width: 10,
          height: 10
        }))
      });

      const topMaxHeight = 10;
      const bottomMaxHeight = 10;
      checkMaxHeight(anchorNode, containerNode, [
        topMaxHeight,
        bottomMaxHeight
      ]);
    });


    it('should handle case when both element out of the top border of viewport', () => {
      const containerNode = createNode({},
        createClientRectMock({
          top: -50,
          left: 10,
          width: 30,
          height: 30
        })
      );

      const anchorNode = createNode({},
        createClientRectMock({
          top: containerNode.getBoundingClientRect().top + 10,
          left: containerNode.getBoundingClientRect().left + 10,
          width: 10,
          height: 10
        })
      );

      const topMaxHeight = 10;
      const bottomMaxHeight = 10;
      checkMaxHeight(anchorNode, containerNode, [
        topMaxHeight,
        bottomMaxHeight
      ]);
    });


    it('should cover all defined directions', () => {
      const anchorNode = createNode();
      Object.keys(Directions).forEach(key => {
        maxHeightForDirection(Directions[key], anchorNode).
          should.not.be.undefined;
      });
    });
  });


  function checkMaxHeight(anchorNode, containerNode, [topMaxHeight, bottomMaxHeight]) {
    const expectedValues = [
      topMaxHeight,
      bottomMaxHeight,
      topMaxHeight + anchorNode.getBoundingClientRect().height,
      bottomMaxHeight + anchorNode.getBoundingClientRect().height / 2
    ];

    [
      [
        Directions.TOP_LEFT,
        Directions.TOP_RIGHT,
        Directions.TOP_CENTER
      ],
      [
        Directions.BOTTOM_LEFT,
        Directions.BOTTOM_RIGHT,
        Directions.BOTTOM_CENTER,
        Directions.RIGHT_BOTTOM,
        Directions.LEFT_BOTTOM
      ],
      [
        Directions.RIGHT_TOP,
        Directions.LEFT_TOP
      ],
      [
        Directions.RIGHT_CENTER,
        Directions.LEFT_CENTER
      ]
    ].forEach((directions, i) => {
      directions.forEach(d => {
        maxHeightForDirection(d, anchorNode, containerNode).
          should.
          be.
          equal(expectedValues[i]);
      });
    });
  }


  function createNode(data, domRect = {}) {
    if (
      domRect.hasOwnProperty('height') &&
      !data.hasOwnProperty('scrollHeight')) {
      data.scrollHeight = domRect.height;
    }

    return {
      scrollTop: 0,
      getBoundingClientRect: sandbox.stub().returns(domRect),
      ...data
    };
  }


  function createClientRectMock(data = {}) {
    if (
      data.hasOwnProperty('left') &&
      data.hasOwnProperty('width') &&
      !data.hasOwnProperty('right')
    ) {
      data.right = data.left + data.width;
    }

    if (
      data.hasOwnProperty('top') &&
      data.hasOwnProperty('height') &&
      !data.hasOwnProperty('bottom')
    ) {
      data.bottom = data.top + data.height;
    }

    return {
      height: 0,
      width: 0,
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      ...data
    };
  }
});
