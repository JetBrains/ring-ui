import Footer from './footer';

export default {
  title: 'Components/Footer',

  parameters: {
    notes: `
Displays a configurable page footer.

A footer consists of three sections, each optional:

- left
- center
- right
    `,
    zeplinLink: 'https://app.zeplin.io/project/5afd8f5511c2d1c625752bb0/screen/5b2a6042114b24a11a8ac153'
  }
};

export const basic = () => (
  <Footer
    className="stuff"
    left={[
      [
        {
          url: 'http://www.jetbrains.com/teamcity/?fromserver',
          label: 'TeamCity'
        },
        ' by JetBrains'
      ],
      'Enterprise 8.0.2 EAP (build 27448)'
    ]}
    center={[
      [{copyright: 2000, label: ' JetBrains'}],
      {
        url: 'https://teamcity.jetbrains.com/showAgreement.html',
        label: 'License agreement',
        title: 'read me!',
        target: '_blank'
      }
    ]}
    right={[
      {
        url:
          'http://www.jetbrains.com/teamcity/feedback?source=footer&version=8.0.3%20(build%2027531)&build=27531&mode=ent',
        label: 'Feedback'
      }
    ]}
  />
);

basic.storyName = 'Footer';
