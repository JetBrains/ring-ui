import Link from '../link/link';

import Banner from './banner';

export default {
  title: 'Components/Banner',
};

const lorem =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';

export const Default = () => <Banner>{lorem}</Banner>;

export const WithIconTitleAndCloseButton = () => (
  <Banner withIcon title="Title" onClose={() => {}}>
    {lorem}
  </Banner>
);

export const MultipleParagraphs = () => (
  <Banner>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus dolor nulla, ultrices ut orci sed, commodo
      bibendum lectus. Nam dictum auctor convallis. Quisque a pretium libero. Morbi id sagittis est, vel sollicitudin
      nibh. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse scelerisque scelerisque massa eget
      ultricies. Vestibulum sed libero et mi dignissim viverra. Cras hendrerit quis augue ac ullamcorper. Nunc at enim
      id orci fermentum lobortis. Integer vitae massa vehicula, consectetur odio at, vulputate ante. Proin consectetur
      finibus velit vel maximus. In et justo dictum, faucibus libero a, mollis erat. Vivamus metus nisi, volutpat non
      bibendum sed, convallis nec lacus.
    </p>
    <p>
      Nulla volutpat posuere sapien. Phasellus diam orci, molestie at iaculis vitae, ultrices vel ex. Nam venenatis,
      neque ut condimentum euismod, lacus quam rutrum metus, a malesuada risus mauris id lectus. Donec varius, justo
      vitae tempus vehicula, nisi ligula mollis urna, in porta lorem turpis ac ante. Morbi et ullamcorper tortor, sit
      amet commodo justo. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Fusce
      varius ut turpis ac ornare.
    </p>
    <p>
      Nullam condimentum porttitor nisi, quis suscipit ipsum ultricies eget. Fusce metus nisl, consectetur vitae
      scelerisque in, pretium in nisl. Nullam odio orci, condimentum id nibh eget, rutrum iaculis libero. In blandit
      lobortis nunc in malesuada. Donec tristique tortor quis purus dapibus aliquet non quis eros. Nullam a ultrices
      magna, at mattis risus. Donec in ante quis urna lacinia mollis. Cras maximus ullamcorper leo. Donec lacus ex,
      rutrum ut elementum quis, venenatis a dui. Duis luctus eros a nisl faucibus, ac rhoncus urna ultrices. Etiam vel
      dolor odio. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
      Phasellus ac mollis lorem. Fusce feugiat sit amet nibh in pellentesque.
    </p>
    <Link href="#">Learn more</Link>
  </Banner>
);

export const Modes = () => (
  <>
    <p>
      <Banner mode="info" title="Info" withIcon onClose={() => {}}>
        {lorem}
      </Banner>
    </p>

    <p>
      <Banner mode="error" title="Error" withIcon onClose={() => {}}>
        {lorem}
      </Banner>
    </p>

    <p>
      <Banner mode="success" title="Success" withIcon onClose={() => {}}>
        {lorem}
      </Banner>
    </p>

    <p>
      <Banner mode="warning" title="Warning" withIcon onClose={() => {}}>
        {lorem}
      </Banner>
    </p>
  </>
);

export const Inline = () => (
  <>
    <p>
      <Banner mode="info" withIcon onClose={() => {}} inline>
        {lorem}
      </Banner>
    </p>

    <p>
      <Banner mode="error" withIcon onClose={() => {}} inline>
        {lorem}
      </Banner>
    </p>

    <p>
      <Banner mode="success" withIcon onClose={() => {}} inline>
        {lorem}
      </Banner>
    </p>

    <p>
      <Banner mode="warning" withIcon onClose={() => {}} inline>
        {lorem}
      </Banner>
    </p>
  </>
);
