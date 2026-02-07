import {useRef, useState} from 'react';
import buildTypeIcon from '@jetbrains/icons/buildType-12px';

import Avatar, {Size as AvatarSize} from '../avatar/avatar';
import Button from '../button/button';
import Icon from '../icon/icon';
import Input from '../input/input';
import Expand from './expand';

import styles from './expand.stories.css';

export default {
  title: 'Components/Expand',
};

const bodyText =
  "This is example of data that is showing in expand in body Here you can view all deployments, including their status, history, and associated resources. Filter by environment, region, or service to quickly find what you're looking for. Click on a deployment to view detailed logs and metrics.";

export const ExpandPreview = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const rowClassName = styles.row;
  const [stepName, setStepName] = useState('Build artifacts');
  const [stepDescription, setStepDescription] = useState(
    'Builds the application and produces the deployment artifacts.',
  );

  return (
    <div className={rowClassName}>
      <Expand
        ref={ref}
        className={styles.card}
        title={'Deployments'}
        subtitle={'Additional context'}
        avatar={<Avatar size={AvatarSize.Size28} round info={<Icon glyph={buildTypeIcon} />} />}
        expanded={isExpanded}
        onChange={setIsExpanded}
        interactive
      >
        <div className={styles.bodyText}>{bodyText}</div>
        <form className={styles.form} onSubmit={event => event.preventDefault()}>
          <Input
            label='Step name'
            value={stepName}
            onChange={event => setStepName(event.currentTarget.value)}
            placeholder='Add a step name'
          />
          <Input
            multiline
            label='Description'
            value={stepDescription}
            onChange={event => setStepDescription(event.currentTarget.value)}
            placeholder='Describe what this step does'
          />
          <div className={styles.formActions}>
            <Button primary>Save step</Button>
            <Button>Cancel</Button>
          </div>
        </form>
      </Expand>
    </div>
  );
};
