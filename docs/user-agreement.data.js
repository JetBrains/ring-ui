window.source = {
  "title": "User Agreement",
  "url": "user-agreement.html",
  "type": "js",
  "content": "/**\n * @name User Agreement\n * @category Components\n * @framework React\n * @tags Ring UI Language\n * @constructor\n * @description A component that displays a user agreement dialog.\n * @example-file ./user-agreement.examples.html\n */\n\nimport React, {PureComponent} from 'react';\nimport PropTypes from 'prop-types';\n\nimport Dialog from '../dialog/dialog';\nimport {Content, Header} from '../island/island';\nimport Panel from '../panel/panel';\nimport Button from '../button/button';\nimport Markdown from '../markdown/markdown';\n\nimport style from './user-agreement.css';\n\nexport default class UserAgreement extends PureComponent {\n  static propTypes = {\n    show: PropTypes.bool,\n    preview: PropTypes.bool,\n    text: PropTypes.string.isRequired,\n    onAccept: PropTypes.func.isRequired,\n    onDecline: PropTypes.func.isRequired,\n    onClose: PropTypes.func.isRequired,\n    onRemindLater: PropTypes.func,\n    translations: PropTypes.object\n  };\n\n  static defaultProps = {\n    translations: {\n      accept: 'Accept',\n      decline: 'Decline',\n      close: 'Close',\n      scrollToAccept: 'View the entire agreement to continue',\n      remindLater: 'Remind me later'\n    },\n    show: false\n  };\n\n  state = {\n    scrolledDown: false\n  };\n\n  onScrollToBottom = () => this.setState({scrolledDown: true});\n\n  render() {\n    const {scrolledDown} = this.state;\n    // eslint-disable-next-line max-len\n    const {translations, onAccept, onDecline, onClose, onRemindLater, text, show, preview} = this.props;\n\n    return (\n      <Dialog\n        show={show}\n        contentClassName={style.dialogContent}\n        trapFocus\n        autoFocusFirst={false}\n      >\n        <Header>&nbsp;</Header>\n        <Content\n          scrollableWrapperClassName={style.scrollableWrapper}\n          fade\n          onScrollToBottom={this.onScrollToBottom}\n        >\n          <Markdown source={text} tabindex={-1}/>\n        </Content>\n        {!preview && (\n          <Panel>\n            {onRemindLater && !scrolledDown && (\n              <div className={style.suggestion}>{translations.scrollToAccept}</div>\n            )}\n            <Button primary disabled={!scrolledDown} onClick={onAccept} data-test=\"accept\">\n              {translations.accept}\n            </Button>\n            <Button onClick={onDecline} autoFocus data-test=\"decline\">\n              {translations.decline}\n            </Button>\n\n            {!onRemindLater && !scrolledDown && (\n              <span className={style.suggestion}>{translations.scrollToAccept}</span>\n            )}\n            {onRemindLater && (\n              <Button className={style.remindLaterButton} onClick={onRemindLater} data-test=\"later\">\n                {translations.remindLater}\n              </Button>\n            )}\n          </Panel>\n        )}\n        {preview && (\n          <Panel>\n            <Button onClick={onClose} autoFocus data-test=\"close\">{translations.close}</Button>\n          </Panel>\n        )}\n      </Dialog>\n    );\n  }\n}\n",
  "examples": [
    {
      "name": "User Agreement Dialog",
      "url": "examples/user-agreement/user-agreement-dialog.html",
      "disableAutoSize": true,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"demo\"></div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport React, {Component} from 'react';\nimport {render} from 'react-dom';\nimport UserAgreement from '@jetbrains/ring-ui/components/user-agreement/user-agreement';\nimport text from './toolbox.eula';\n\nconst onAccept = () => console.log('accept');\n\nconst onDecline = () => console.log('decline');\n\nconst onClose = () => console.log('close');\n\nclass Demo extends Component {\n  render() {\n    return (\n      <div>\n         <UserAgreement\n           show\n           text={text}\n           onAccept={onAccept}\n           onDecline={onDecline}\n           onClose={onClose}\n         />\n      </div>\n     );\n   }\n}\n\nrender(<Demo />, document.getElementById('demo'));\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "User Agreement Service",
      "url": "examples/user-agreement/user-agreement-service.html",
      "disableAutoSize": true,
      "files": [
        {
          "type": "html",
          "content": "",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport UserAgreementService from '@jetbrains/ring-ui/components/user-agreement/service';\nimport text from './toolbox.eula';\n\nconst fakeUserAgreement = {\n  enabled: true,\n  majorVersion: 1.0,\n  text\n};\n\nconst fakeUserConsent = {\n  guest: true,\n  accepted: false\n}\n\nconst agreementService = new UserAgreementService({\n  getUserAgreement: async () => console.log('getUserAgreement') || fakeUserAgreement,\n  getUserConsent: async () => console.log('getUserConsent') || fakeUserConsent,\n  setUserConsent: async () => console.log('User consent has been set'),\n  onAccept: () => console.log('Agreement accepted'),\n  onDecline: () => console.log('Agreement declined'),\n  onDialogShow: () => console.log('Dialog shown'),\n  onDialogHide: () => console.log('Dialog hidden'),\n  interval: 10000\n});\n\nagreementService.startChecking();\n  ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "A component that displays a user agreement dialog.",
  "attrs": {
    "name": "User Agreement",
    "category": "Components",
    "framework": "React",
    "tags": "Ring UI Language",
    "constructor": "",
    "description": "A component that displays a user agreement dialog.",
    "example-file": "./user-agreement.examples.html"
  }
};