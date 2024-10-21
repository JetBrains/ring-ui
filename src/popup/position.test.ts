/* eslint-disable @typescript-eslint/no-magic-numbers */
import {Rect} from '../global/dom';

import {maxHeightForDirection} from './position';
import {Directions} from './popup.consts';

interface NodeData {
  scrollTop?: number;
  scrollHeight?: number;
  getBoundingClientRect?: () => Rect;
}

describe('position', () => {
  describe('maxHeightForDirection', () => {
    it('should return max height for specified direction relative to container', () => {
      const containerNode = createNode(
        {},
        createClientRectMock({
          top: 10,
          left: 10,
          width: 30,
          height: 40,
        }),
      );

      const topMaxHeight = 20;
      const bottomMaxHeight = 10;

      const anchorNode = createNode(
        {},
        createClientRectMock({
          top: containerNode.getBoundingClientRect().top + topMaxHeight,
          left: containerNode.getBoundingClientRect().left + 10,
          width: 10,
          height: 10,
        }),
      );

      checkMaxHeight(anchorNode, containerNode, [topMaxHeight, bottomMaxHeight]);
    });

    it('should NOT include scroll height when calculate max height', () => {
      const containerNode = createNode(
        {
          scrollTop: 10,
          scrollHeight: 50,
        },
        createClientRectMock({
          top: 10,
          left: 10,
          width: 30,
          height: 30,
        }),
      );

      const anchorNode = createNode({
        getBoundingClientRect: () =>
          createClientRectMock({
            top: containerNode.getBoundingClientRect().top + 10,
            left: containerNode.getBoundingClientRect().left + 10,
            width: 10,
            height: 10,
          }),
      });

      const topMaxHeight = 10;
      const bottomMaxHeight = 10;
      checkMaxHeight(anchorNode, containerNode, [topMaxHeight, bottomMaxHeight]);
    });

    it('should handle case when both element out of the top border of viewport', () => {
      const containerNode = createNode(
        {},
        createClientRectMock({
          top: -50,
          left: 10,
          width: 30,
          height: 30,
        }),
      );

      const anchorNode = createNode(
        {},
        createClientRectMock({
          top: containerNode.getBoundingClientRect().top + 10,
          left: containerNode.getBoundingClientRect().left + 10,
          width: 10,
          height: 10,
        }),
      );

      const topMaxHeight = 10;
      const bottomMaxHeight = 10;
      checkMaxHeight(anchorNode, containerNode, [topMaxHeight, bottomMaxHeight]);
    });

    it('should cover all defined directions', () => {
      const anchorNode = createNode();
      Object.values(Directions).forEach(value => {
        should.exist(maxHeightForDirection(value, anchorNode));
      });
    });
  });

  function checkMaxHeight(
    anchorNode: Element,
    containerNode: Element,
    [topMaxHeight, bottomMaxHeight]: [number, number],
  ) {
    const expectedValues = [
      topMaxHeight,
      bottomMaxHeight,
      bottomMaxHeight + anchorNode.getBoundingClientRect().height,
      topMaxHeight + anchorNode.getBoundingClientRect().height,
      Math.min(bottomMaxHeight / 2, topMaxHeight / 2) + anchorNode.getBoundingClientRect().height / 2,
    ];

    [
      [Directions.TOP_LEFT, Directions.TOP_RIGHT, Directions.TOP_CENTER],
      [Directions.BOTTOM_LEFT, Directions.BOTTOM_RIGHT, Directions.BOTTOM_CENTER],
      [Directions.RIGHT_BOTTOM, Directions.LEFT_BOTTOM],
      [Directions.RIGHT_TOP, Directions.LEFT_TOP],
      [Directions.RIGHT_CENTER, Directions.LEFT_CENTER],
    ].forEach((directions, i) => {
      directions.forEach(d => {
        const maxHeight = maxHeightForDirection(d, anchorNode, containerNode);
        should.exist(maxHeight);
        maxHeight?.should.be.equal(expectedValues[i]);
      });
    });
  }

  function createNode(data?: NodeData, domRect: Partial<Rect> = {}) {
    if (domRect.hasOwnProperty('height') && data != null && !data.hasOwnProperty('scrollHeight')) {
      data.scrollHeight = domRect.height;
    }

    return {
      scrollTop: 0,
      getBoundingClientRect: sandbox.stub().returns(domRect),
      ...data,
    } as Element;
  }

  function createClientRectMock(data: Partial<Rect> = {}) {
    if (data.left != null && data.width != null && data.right == null) {
      data.right = data.left + data.width;
    }

    if (data.top != null && data.height != null && data.bottom == null) {
      data.bottom = data.top + data.height;
    }

    return {
      height: 0,
      width: 0,
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      ...data,
    };
  }
});
