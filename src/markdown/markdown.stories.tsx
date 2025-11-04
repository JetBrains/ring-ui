import MarkdownIt from 'markdown-it';
import highlightJs from 'highlight.js';
import {type Meta, type StoryObj} from '@storybook/react-webpack5';

import Markdown from './markdown';

import highlightStyles from '../code/highlight.css';

const meta: Meta<typeof Markdown> = {
  title: 'Components/Markdown',
  component: Markdown,

  parameters: {
    docs: {
      importSubpath: 'components/markdown/markdown',
      exportName: 'Markdown',
    },
  },

  argTypes: {
    inline: {
      control: 'boolean',
      description: 'Display inline instead of block',
    },
    children: {
      control: false,
      description: 'Markdown content',
    },
    className: {
      control: 'text',
      description: 'Additional CSS class names',
    },
  },

  args: {
    inline: false,
  },
};

export default meta;
type Story = StoryObj<typeof Markdown>;

const markdownIt = new MarkdownIt('commonmark', {
  html: false,
  highlight(str, lang) {
    if (lang && highlightJs.getLanguage(lang)) {
      return highlightJs.highlight(str, {language: lang}).value;
    }

    return '';
  },
}).enable('table');

const exampleMarkdown = `
# Header

_Italic_ and **bold** text

[Link](/)

List:
* First item
* Second item

Some \`inline code\` inside text

## Code block
\`\`\`js
import {useState} from 'react';

const Counter = () => {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
};
\`\`\`
`;

export const Basic: Story = {
  render: args => {
    const renderedMarkdown = markdownIt.render(exampleMarkdown);

    return (
      <Markdown {...args} className={highlightStyles.highlightContainer}>
        {/* Be careful with passing user input down to `dangerouslySetInnerHTML`! */}
        <div dangerouslySetInnerHTML={{__html: renderedMarkdown}} />
      </Markdown>
    );
  },
};
