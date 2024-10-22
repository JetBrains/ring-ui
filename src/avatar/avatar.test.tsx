import {render, screen} from '@testing-library/react';

import {getPixelRatio} from '../global/dom';

import Avatar from './avatar';

const dataURI = `data:image/svg+xml,${encodeURIComponent(`
  <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="50" fill="#00cc00"/>
  </svg>`)}`;

describe('Avatar', () => {
  it('should create component', () => {
    render(<Avatar />);
    screen.getByTestId('avatar').should.exist;
  });

  it('should use passed className', () => {
    render(<Avatar className="test-class" />);
    screen.getByTestId('avatar').should.have.class('test-class');
  });

  it('should use passed className when url is passed', () => {
    render(<Avatar className="test-class" url={dataURI} />);
    screen.getByAltText('User avatar').should.have.class('test-class');
  });

  it('should render span when no url is passed', () => {
    render(<Avatar />);
    screen.getByTestId('avatar').should.have.tagName('span');
  });

  it('should render image when url is passed', () => {
    render(<Avatar url={dataURI} />);
    screen.getByAltText('User avatar').should.exist;
  });

  it('should not append params when data:uri is passed', () => {
    render(<Avatar url={dataURI} />);
    const avatar = screen.getByAltText('User avatar') as HTMLImageElement;
    avatar.src.should.not.match(/dpr=|size=/);
  });

  it('should append params when http:uri is passed', () => {
    render(<Avatar url="http://" />);
    const avatar = screen.getByAltText('User avatar') as HTMLImageElement;
    avatar.src.should.match(/dpr=|size=/);
  });

  it('should set size 20 as default', () => {
    render(<Avatar url="http://" />);
    const avatar = screen.getByAltText('User avatar') as HTMLImageElement;
    avatar.src.should.match(/size=20/);
  });

  it('should set proper dpr', () => {
    render(<Avatar url="http://" />);
    const avatar = screen.getByAltText('User avatar') as HTMLImageElement;
    avatar.src.should.match(new RegExp(`dpr=${getPixelRatio()}`));
  });
});
