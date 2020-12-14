// Inspired by https://github.com/sairion/svg-inline-react
import React, {memo} from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import memoize from '../global/memoize';

import styles from './icon.css';

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

function extractSVGProps(svgNode) {
  const map = svgNode.attributes;
  return (map.length > 0) ? serializeAttrs(map) : null;
}

const getSVGFromSource = memoize(src => {
  const svgContainer = document.createElement('div');
  svgContainer.innerHTML = src;
  const svg = svgContainer.firstElementChild;
  svg.remove ? svg.remove() : svgContainer.removeChild(svg);
  return {
    props: extractSVGProps(svg),
    html: svg.innerHTML
  };
});

function isCompatibilityMode(iconSrc) {
  const hasWidth = /width="[\d\.]+"/ig.test(iconSrc);
  const hasHeight = /height="[\d\.]+"/ig.test(iconSrc);
  return !hasWidth || !hasHeight;
}

function IconSVG({src, className, ...rest}) {
  const glyphClasses = classNames(styles.glyph, {
    [styles.compatibilityMode]: isCompatibilityMode(src)
  }, className);

  const {props, html} = getSVGFromSource(src);

  return (
    <svg
      {...props}
      {...rest}
      className={glyphClasses}
      dangerouslySetInnerHTML={{
        __html: html
      }}
    />
  );
}

IconSVG.propTypes = {
  className: PropTypes.string,
  src: PropTypes.string.isRequired,
  style: PropTypes.object
};

export default memo(IconSVG);
