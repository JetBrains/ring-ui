import {type ReactNode} from 'react';

import Heading, {Levels} from '../../../heading/heading';
import Text from '../../../text/text';
import Tag from '../../../tag/tag';
import ButtonToolbar from '../../../button-toolbar/button-toolbar';

import styles from '../qodana-cloud.css';

export interface QodanaPageHeaderProps {
  title: string;
  subtitle: string;
  visibilityLabel?: string;
  actions?: ReactNode;
}

export function QodanaPageHeader({title, subtitle, visibilityLabel, actions}: QodanaPageHeaderProps) {
  return (
    <header className={styles.qodanaPageHeader}>
      <div className={styles.qodanaPageHeaderMain}>
        <div className={styles.qodanaPageTitleRow}>
          <Heading level={Levels.H2}>{title}</Heading>
          {visibilityLabel != null && (
            <Tag readOnly outline>
              {visibilityLabel}
            </Tag>
          )}
        </div>
        <Text info>{subtitle}</Text>
      </div>
      {actions != null && <ButtonToolbar>{actions}</ButtonToolbar>}
    </header>
  );
}
