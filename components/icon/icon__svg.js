// Inspired by https://github.com/sairion/svg-inline-react
import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import {pure} from 'recompose';

import sniffer from '../global/sniffer';

import styles from './icon.css';

const isIE = sniffer.browser.name === 'ie';

function convertReactSVGDOMProperty(str) {
  return str.replace(/[-|:]([a-z])/g, g => g[1].toUpperCase());
}

function serializeAttrs(map) {
  const res = {};
  for (let i = 0; i < map.length; i++) {
    const key = map[i].name;
    let prop = key;
    if (key === 'class') {
      prop = 'className';
    } else if (!key.startsWith('data-')) {
      prop = convertReactSVGDOMProperty(key);
    }

    res[prop] = map[i].value;
  }
  return res;
}

function getSVGFromSource(src) {
  const svgContainer = document.createElement('div');
  svgContainer.innerHTML = src;
  const svg = svgContainer.firstElementChild;
  svg.remove ? svg.remove() : svgContainer.removeChild(svg);
  return svg;
}

function getSVGInnerHTML(svgNode) {
  if (!isIE) {
    return svgNode.innerHTML;
  }
  // IE11 doesn't support svg.innerHTML https://stackoverflow.com/questions/28129956/get-innerhtml-of-svg-tag-result-in-undefined-in-ie
  const serializer = new XMLSerializer();

  return Array.from(svgNode.childNodes).
    map(child => serializer.serializeToString(child)).
    join('');
}

function extractSVGProps(svgNode) {
  const map = svgNode.attributes;
  return (map.length > 0) ? serializeAttrs(map) : null;
}

function isCompatibilityMode(iconSrc) {
  const hasWidth = /width="[\d\.]+"/ig.test(iconSrc);
  const hasHeight = /height="[\d\.]+"/ig.test(iconSrc);
  return !hasWidth || !hasHeight;
}

function IconSVG({src, className, ...rest}) {
  const glyphClasses = classNames(styles.glyph, {
    [styles.compatibilityMode]: isCompatibilityMode(src)
  }, className);

  const svgNode = getSVGFromSource(src);

  return (
    <svg
      {...extractSVGProps(svgNode)}
      {...rest}
      className={glyphClasses}
      dangerouslySetInnerHTML={{
        __html: getSVGInnerHTML(svgNode)
      }}
    />
  );
}

IconSVG.propTypes = {
  className: PropTypes.string,
  src: PropTypes.string.isRequired,
  style: PropTypes.object
};

export default pure(IconSVG);
