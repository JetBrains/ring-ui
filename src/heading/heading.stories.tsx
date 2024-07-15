import Heading, {H2, H3, H4} from './heading';

const lorem = (
  <div>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
    labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
    laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
    voluptate velit esse cillum dolore eu fugiat nulla pariatur.
  </div>
);

export default {
  title: 'Components/Heading',

  parameters: {
    notes: 'A component for rendering h1-h5 tags.'
  }
};

export const basic = () => (
  <div>
    <Heading level={Heading.Levels.H1}>Heading 1</Heading>
    {lorem}
    <H2>Heading 2</H2>
    {lorem}
    <H3>Heading 3</H3>
    {lorem}
    <H4>Heading 4</H4>
    {lorem}
    <H4 bold>Heading 4 bold</H4>
    {lorem}
  </div>
);

basic.storyName = 'Heading';
