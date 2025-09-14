import {Grid, Row, Col} from './grid';

export default {
  title: 'Components/Grid',

  parameters: {
    notes:
      'Implements a flexbox-like grid system for components placement. Inspired by react-flexbox-grid, see http://roylee0704.github.io/react-flexbox-grid/ and http://flexboxgrid.com/ for additional information.',
  },
};

export const responsive = () => (
  <Grid>
    <Row start='xs'>
      <Col xs={12} sm={4} md={6} lg={3}>
        <div className='cell'>Cell 1</div>
      </Col>
      <Col xs={12} sm={8} md={6} lg={3}>
        <div className='cell'>Cell 2</div>
      </Col>
      <Col xs={12} smOffset={4} sm={8} md={12} lg={6}>
        <div className='cell'>Cell 3</div>
      </Col>
    </Row>
  </Grid>
);

responsive.storyName = 'responsive';

responsive.parameters = {
  storyStyles: `
<style>
  .cell {
    background-color: var(--ring-selected-background-color);
  }
</style>`,
};

export const offset = () => (
  <div>
    <h4>Offset a column.</h4>
    <Grid data-test='offset'>
      <Row>
        <Col xsOffset={11} xs={1}>
          <div className='cell'>
            xsOffset={11} xs={1}
          </div>
        </Col>
        <Col xsOffset={10} xs={2}>
          <div className='cell'>
            xsOffset={10} xs={2}
          </div>
        </Col>
        <Col xsOffset={9} xs={3}>
          <div className='cell'>
            xsOffset={9} xs={3}
          </div>
        </Col>
        <Col xsOffset={8} xs={4}>
          <div className='cell'>
            xsOffset={8} xs={4}
          </div>
        </Col>
        <Col xsOffset={7} xs={5}>
          <div className='cell'>
            xsOffset={7} xs={5}
          </div>
        </Col>
        <Col xsOffset={6} xs={6}>
          <div className='cell'>
            xsOffset={6} xs={6}
          </div>
        </Col>
        <Col xsOffset={5} xs={7}>
          <div className='cell'>
            xsOffset={5} xs={7}
          </div>
        </Col>
        <Col xsOffset={4} xs={8}>
          <div className='cell'>
            xsOffset={4} xs={8}
          </div>
        </Col>
        <Col xsOffset={3} xs={9}>
          <div className='cell'>
            xsOffset={3} xs={9}
          </div>
        </Col>
        <Col xsOffset={2} xs={10}>
          <div className='cell'>
            xsOffset={2} xs={10}
          </div>
        </Col>
        <Col xsOffset={1} xs={11}>
          <div className='cell'>
            xsOffset={1} xs={11}
          </div>
        </Col>
      </Row>
    </Grid>
  </div>
);

offset.storyName = 'offset';

offset.parameters = {
  storyStyles: `
<style>
  .cell {
    background-color: var(--ring-selected-background-color);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>`,
};

export const autoSize = () => (
  <div>
    <h4>Auto Width: add any number of auto sizing columns to a row. Let the grid figure it out.</h4>
    <Grid data-test='auto-size'>
      <Row>
        <Col xs>
          <div className='cell'>Autosize</div>
        </Col>
        <Col xs>
          <div className='cell'>Autosize column with larger text</div>
        </Col>
      </Row>
      <Row>
        <Col xs>
          <div className='cell'>Autosize</div>
        </Col>
        <Col xs>
          <div className='cell'>Autosize column with much much much larger text</div>
        </Col>
        <Col xs>
          <div className='cell'>Autosize</div>
        </Col>
      </Row>
    </Grid>
  </div>
);

autoSize.storyName = 'auto size';

autoSize.parameters = {
  storyStyles: `
<style>
  .cell {
    background-color: var(--ring-selected-background-color);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>`,
};

export const alignment = () => (
  <div>
    <h4>Add classes to align elements to the start or end of row as well as the top, bottom, or center of a column</h4>
    <Grid data-test='alignment'>
      <Row>
        <Col xs={12}>
          <Row start='xs'>
            <Col xs={6} className='cell'>
              start
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Row center='xs'>
            <Col xs={6} className='cell'>
              center
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Row end='xs'>
            <Col xs={6} className='cell'>
              end
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Row top='xs'>
            <Col xs={6}>
              <div className='cell'>top</div>
            </Col>
            <Col xs={6}>
              <div className='cell cell_tall' />
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Row middle='xs'>
            <Col xs={6}>
              <div className='cell'>middle</div>
            </Col>
            <Col xs={6}>
              <div className='cell cell_tall' />
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Row bottom='xs'>
            <Col xs={6}>
              <div className='cell'>bottom</div>
            </Col>
            <Col xs={6}>
              <div className='cell cell_tall' />
            </Col>
          </Row>
        </Col>
      </Row>
    </Grid>
  </div>
);

alignment.storyName = 'alignment';

alignment.parameters = {
  storyStyles: `
<style>
  .cell {
    background-color: var(--ring-selected-background-color);
  }
  .cell_tall {
    height: 64px;
  }
</style>`,
};

export const columnsDistribution = () => (
  <div>
    <h4>Distribution: add classes to distribute the contents of a row or column.</h4>
    <Grid data-test='distribution'>
      <Row around='xs'>
        <Col xs={2}>
          <div className='cell'>around</div>
        </Col>
        <Col xs={2}>
          <div className='cell'>around</div>
        </Col>
        <Col xs={2}>
          <div className='cell'>around</div>
        </Col>
      </Row>
      <Row between='xs'>
        <Col xs={2}>
          <div className='cell'>between</div>
        </Col>
        <Col xs={2}>
          <div className='cell'>between</div>
        </Col>
        <Col xs={2}>
          <div className='cell'>between</div>
        </Col>
      </Row>
    </Grid>
  </div>
);

columnsDistribution.storyName = 'columns distribution';

columnsDistribution.parameters = {
  storyStyles: `
<style>
  .cell {
    background-color: var(--ring-selected-background-color);
  }
</style>`,
};
