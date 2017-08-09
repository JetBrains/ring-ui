import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import highlight from 'highlight.js/lib/highlight';
import cpp from 'highlight.js/lib/languages/cpp';
import xml from 'highlight.js/lib/languages/xml';
import bash from 'highlight.js/lib/languages/bash';
import clojure from 'highlight.js/lib/languages/clojure';
import coffeescript from 'highlight.js/lib/languages/coffeescript';
import cs from 'highlight.js/lib/languages/cs';
import css from 'highlight.js/lib/languages/css';
import markdown from 'highlight.js/lib/languages/markdown';
import dockerfile from 'highlight.js/lib/languages/dockerfile';
import elixir from 'highlight.js/lib/languages/elixir';
import elm from 'highlight.js/lib/languages/elm';
import ruby from 'highlight.js/lib/languages/ruby';
import erlang from 'highlight.js/lib/languages/erlang';
import glsl from 'highlight.js/lib/languages/glsl';
import go from 'highlight.js/lib/languages/go';
import gradle from 'highlight.js/lib/languages/gradle';
import groovy from 'highlight.js/lib/languages/groovy';
import handlebars from 'highlight.js/lib/languages/handlebars';
import haskell from 'highlight.js/lib/languages/haskell';
import java from 'highlight.js/lib/languages/java';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import kotlin from 'highlight.js/lib/languages/kotlin';
import less from 'highlight.js/lib/languages/less';
import livescript from 'highlight.js/lib/languages/livescript';
import lua from 'highlight.js/lib/languages/lua';
import makefile from 'highlight.js/lib/languages/makefile';
import perl from 'highlight.js/lib/languages/perl';
import php from 'highlight.js/lib/languages/php';
import powershell from 'highlight.js/lib/languages/powershell';
import python from 'highlight.js/lib/languages/python';
import r from 'highlight.js/lib/languages/r';
import rust from 'highlight.js/lib/languages/rust';
import scala from 'highlight.js/lib/languages/scala';
import scss from 'highlight.js/lib/languages/scss';
import shell from 'highlight.js/lib/languages/shell';
import sql from 'highlight.js/lib/languages/sql';
import swift from 'highlight.js/lib/languages/swift';
import yaml from 'highlight.js/lib/languages/yaml';
import twig from 'highlight.js/lib/languages/twig';
import typescript from 'highlight.js/lib/languages/typescript';

import classNames from 'classnames';

import 'highlight.js/styles/github.css';

import normalizeIndent from '../global/normalize-indent';
import trivialTemplateTag from '../global/trivial-template-tag';

import styles from './code.css';

/**
 * @name Code
 * @category Components
 * @framework React
 * @constructor
 * @description Shows a block of code. By default highlights following languages: _cpp, xml, bash, clojure, coffeescript, cs, css, markdown, dockerfile, elixir, elm, ruby, erlang, glsl, go, gradle, groovy, handlebars, haskell, ava, javascript, json, kotlin, less, livescript, lua, makefile, perl, php, powershell, python, r, rust, scala, scss, shell, sql, swift, yaml, twig, typescript_.
 * But it's possible to enable support for  other languages manually:
 * ```
 * import {highlight} from '@jetbrains/ring-ui/components/code/code'
 * import 1c from 'highlight.js/lib/languages/1c';
 * highlight.registerLanguage('1c', 1c);
 * ```
 * @example-file ./code.examples.html
 */

highlight.registerLanguage('cpp', cpp);
highlight.registerLanguage('xml', xml);
highlight.registerLanguage('bash', bash);
highlight.registerLanguage('clojure', clojure);
highlight.registerLanguage('coffeescript', coffeescript);
highlight.registerLanguage('cs', cs);
highlight.registerLanguage('css', css);
highlight.registerLanguage('markdown', markdown);
highlight.registerLanguage('dockerfile', dockerfile);
highlight.registerLanguage('elixir', elixir);
highlight.registerLanguage('elm', elm);
highlight.registerLanguage('ruby', ruby);
highlight.registerLanguage('erlang', erlang);
highlight.registerLanguage('glsl', glsl);
highlight.registerLanguage('go', go);
highlight.registerLanguage('gradle', gradle);
highlight.registerLanguage('groovy', groovy);
highlight.registerLanguage('handlebars', handlebars);
highlight.registerLanguage('haskell', haskell);
highlight.registerLanguage('java', java);
highlight.registerLanguage('javascript', javascript);
highlight.registerLanguage('json', json);
highlight.registerLanguage('kotlin', kotlin);
highlight.registerLanguage('less', less);
highlight.registerLanguage('livescript', livescript);
highlight.registerLanguage('lua', lua);
highlight.registerLanguage('makefile', makefile);
highlight.registerLanguage('perl', perl);
highlight.registerLanguage('php', php);
highlight.registerLanguage('powershell', powershell);
highlight.registerLanguage('python', python);
highlight.registerLanguage('r', r);
highlight.registerLanguage('rust', rust);
highlight.registerLanguage('scala', scala);
highlight.registerLanguage('scss', scss);
highlight.registerLanguage('shell', shell);
highlight.registerLanguage('sql', sql);
highlight.registerLanguage('swift', swift);
highlight.registerLanguage('yaml', yaml);
highlight.registerLanguage('twig', twig);
highlight.registerLanguage('typescript', typescript);

export default class Code extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    code: PropTypes.string.isRequired,
    inline: PropTypes.bool,
    language: PropTypes.string
  };

  static defaultProps = {
    inline: false
  };

  componentDidMount() {
    this.highlight();
  }

  componentDidUpdate() {
    this.highlight();
  }

  highlight() {
    if (!this.props.inline) {
      highlight.highlightBlock(this.code);
    }
  }

  codeRef = el => {
    this.code = el;
  };

  render() {
    const {code, className, inline, language} = this.props;

    const Tag = inline ? 'span' : 'pre';
    const classes = classNames(styles.code, className, language, {
      [styles.inline]: inline
    });

    return (
      <Tag className={classes}>
        <code ref={this.codeRef}>{normalizeIndent(code)}</code>
      </Tag>
    );
  }
}

const code = trivialTemplateTag(source => <Code code={source}/>);

export {code, highlight};
