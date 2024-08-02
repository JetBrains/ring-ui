// Inspired by https://github.com/sairion/svg-inline-react
import {memo, SVGAttributes} from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import memoize from '../global/memoize';

import styles from './icon.css';

function convertReactSVGDOMProperty(str: string) {
  return str.replace(/[-|:]([a-z])/g, g => g[1].toUpperCase());
}

function serializeAttrs(map: NamedNodeMap) {
  const res: Record<string, string> = {};
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

function extractSVGProps(svgNode: Element) {
  const map = svgNode.attributes;
  return (map.length > 0) ? serializeAttrs(map) : null;
}

const getSVGFromSource = memoize((src: string) => {
  const svgContainer = document.createElement('div');
  svgContainer.innerHTML = src;
  const svg = svgContainer.firstElementChild as Element;
  if (svg.remove) {
    svg.remove();
  } else {
    svgContainer.removeChild(svg);
  }
  return {
    props: extractSVGProps(svg),
    html: svg.innerHTML
  };
});

function isCompatibilityMode(iconSrc: string) {
  const hasWidth = /width="[\d\.]+"/ig.test(iconSrc);
  const hasHeight = /height="[\d\.]+"/ig.test(iconSrc);
  return !hasWidth || !hasHeight;
}

export interface IconSVGProps extends SVGAttributes<SVGSVGElement> {
  src: string,
}

function IconSVG({src, className, ...rest}: IconSVGProps) {
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
