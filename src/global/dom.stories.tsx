import {ReactNode, useEffect, useRef, useState} from 'react';

import {getStyles, getRect, getPixelRatio, getWindowHeight} from './dom';

export default {
  title: 'Utilities/DOM',

  parameters: {
    notes: 'A collection of DOM utilities.',
    screenshots: {skip: true}
  }
};

export const Basic = () => {
  const rectTarget = useRef<HTMLDivElement>(null);
  const [rectTargetContent, setRectTargetContent] = useState<ReactNode>();
  const [reportContent, setReportContent] = useState<ReactNode>();

  useEffect(() => {
    if (rectTarget.current != null) {
      setRectTargetContent(<>
        Element min-width = {getStyles(rectTarget.current).minWidth} <br/>
        Element rect = {JSON.stringify(getRect(rectTarget.current))} <br/>
      </>);
    }

    setReportContent(<>
      Pixel ratio = {getPixelRatio()} <br/>
      Window height = {getWindowHeight()} <br/>
    </>);
  }, []);

  return (
    <>
      <div ref={rectTarget} style={{minWidth: 200}}>{rectTargetContent}</div>
      <div>{reportContent}</div>
    </>
  );
};

Basic.storyName = 'DOM';
