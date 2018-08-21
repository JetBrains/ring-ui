window.source = {
  "title": "Link",
  "url": "link.html",
  "type": "js",
  "content": "import React, {Component} from 'react';\nimport PropTypes from 'prop-types';\nimport classNames from 'classnames';\n\nimport memoize from '../global/memoize';\nimport dataTests from '../global/data-tests';\n\nimport ClickableLink from './clickableLink';\nimport styles from './link.css';\n\n/**\n * @name Link\n * @category Components\n * @tags Ring UI Language\n * @constructor\n * @description Displays a link.\n * @extends {ReactComponent}\n * @example-file ./link.examples.html\n */\n\nlet isCompatibilityMode = false;\n\nexport function setCompatibilityMode(isEnabled) {\n  isCompatibilityMode = isEnabled;\n}\n\nconst makeWrapText = memoize(innerClassName => {\n  const WrapText = ({className, children}) => {\n    const classes = classNames(styles.inner, className, innerClassName);\n    return <span className={classes}>{children}</span>;\n  };\n\n  WrapText.propTypes = {\n    className: PropTypes.string,\n    children: PropTypes.node\n  };\n\n  return WrapText;\n});\n\nexport function linkHOC(ComposedComponent) {\n  const isCustom = typeof ComposedComponent !== 'string' && ComposedComponent !== ClickableLink;\n\n  return class Link extends Component {\n    static propTypes = {\n      className: PropTypes.string,\n      innerClassName: PropTypes.string,\n      active: PropTypes.bool,\n      inherit: PropTypes.bool,\n      pseudo: PropTypes.bool,\n      hover: PropTypes.bool,\n      children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),\n      'data-test': PropTypes.string,\n      href: PropTypes.string\n    };\n\n    getChildren() {\n      const {children, innerClassName} = this.props;\n\n      const WrapText = makeWrapText(innerClassName);\n\n      return typeof children === 'function'\n        ? children(WrapText)\n        : <WrapText>{children}</WrapText>;\n    }\n\n    render() {\n      const {\n        active,\n        inherit,\n        pseudo,\n        hover,\n        className,\n        'data-test': dataTest,\n        href,\n        // eslint-disable-next-line no-unused-vars\n        innerClassName, children,\n        ...props\n      } = this.props;\n      const useButton = pseudo || !isCustom && !href;\n\n      const classes = classNames(styles.link, className, {\n        [styles.active]: active,\n        [styles.inherit]: inherit,\n        [styles.hover]: hover,\n        [styles.compatibilityUnderlineMode]: isCompatibilityMode,\n        [styles.pseudo]: useButton\n      });\n\n      if (isCustom && !props.activeClassName) {\n        props.activeClassName = styles.active;\n      }\n\n      if (useButton) {\n        return (\n          <button\n            type=\"button\"\n            {...props}\n            className={classes}\n            data-test={dataTests('ring-link', dataTest)}\n          >{this.getChildren()}</button>\n        );\n      }\n\n      return (\n        <ComposedComponent\n          {...props}\n          href={href}\n          className={classes}\n          data-test={dataTests('ring-link', dataTest)}\n        >\n          {this.getChildren()}\n        </ComposedComponent>\n      );\n    }\n  };\n}\n\nexport default linkHOC(ClickableLink);\n",
  "examples": [
    {
      "name": "Link",
      "url": "examples/link/link.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"link\"></div>\n  ",
          "showCode": true
        },
        {
          "type": "css",
          "content": "\n:global(.container) {\n  width: 240px;\n  display: flex;\n  flex-direction: column;\n  align-items: flex-start;\n}\n\n:global(.container > * ~ *) {\n  margin-top: 8px;\n}\n\n:global(.hub-link) {\n  text-align: center;\n}\n\n:global(.hub-icon) {\n  margin: 16px 0 8px;\n}\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport React, {Component} from 'react';\nimport {render} from 'react-dom';\nimport classNames from 'classnames';\nimport Link, {linkHOC, setCompatibilityMode} from '@jetbrains/ring-ui/components/link/link';\nimport Icon from '@jetbrains/ring-ui/components/icon/icon';\nimport Toggle from '@jetbrains/ring-ui/components/toggle/toggle';\nimport hubLogo from '@jetbrains/logos/hub/hub.svg';\n\nclass CustomComponent extends Component {\n  render() {\n    const {active, activeClassName, className,...props} = this.props;\n    const classes = classNames(className, {\n      [activeClassName]: active\n    });\n    return (\n      <a\n        {...props}\n        className={className}\n      />\n    );\n  }\n}\n\nconst CustomLink = linkHOC(CustomComponent);\nclass LinkDemo extends Component {\n  state = {compatibility: false};\n\n  changeCompatibility = () => {\n    setCompatibilityMode(!this.state.compatibility);\n\n    this.setState({compatibility: !this.state.compatibility});\n  };\n\n  render() {\n    return (\n     <div className=\"container\">\n       <Link href=\"#hash\">Ordinary link</Link>\n       <Link href=\"#hash\" active>Active link (inherits color)</Link>\n       <Link href=\"#hash\" pseudo>Pseudo link (no underline on hover)</Link>\n       <CustomLink href=\"#hash\">Custom link component</CustomLink>\n       <CustomLink href=\"#hash\" active>Active custom link component</CustomLink>\n       <Link href=\"#hash\">Link with a very long text, wrapping over lines</Link>\n\n       <Link href=\"#hash\" className=\"hub-link\">\n        {WrapText => [\n          <Icon key=\"icon\" glyph={hubLogo} size={Icon.Size.Size128} className=\"hub-icon\"/>,\n          <div key=\"text\"><WrapText>Link with non-text content</WrapText></div>\n        ]}\n       </Link>\n\n       <span>\n         <Toggle onChange={this.changeCompatibility}>Compatibility mode</Toggle>\n       </span>\n     </div>\n    );\n  }\n}\nrender(<LinkDemo />, document.getElementById('link'));\n  ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "Displays a link.",
  "attrs": {
    "name": "Link",
    "category": "Components",
    "tags": "Ring UI Language",
    "constructor": "",
    "description": "Displays a link.",
    "extends": "{ReactComponent}",
    "example-file": "./link.examples.html"
  }
};