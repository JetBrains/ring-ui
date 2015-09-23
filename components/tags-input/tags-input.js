import React from 'react';
import RingComponentWithShortcuts from 'ring-component/ring-component_with-shortcuts';
import Select from 'select/select';
import Tag from './tags-input__tag';
import './tags-input.scss';

/**
 * @name Tags Input
 * @constructor
 * @extends {ReactComponent}
 * @example
 <example name="Simple tags input">
   <file name="index.html">
    <div id="demo"></div>
   </file>
   <file name="index.js" webpack="true">
    var render = require('react-dom').render;
    var TagsInput = require('tags-input/tags-input');

    var props = {

    };

    render(TagsInput.factory(props), document.getElementById('demo'));
   </file>
 </example>
*/

export default class TagsInput extends RingComponentWithShortcuts {

  static defaultProps = {
    completeDataSource: null
  };


  getTags() {
    return ['test1', 'fooo', 'bar'].map((item) => {
      return <Tag key={item}>{item}</Tag>
    });
  }

  render() {
    return (<div className="tags-input">
      {this.getTags()}
      <Select type={Select.Type.INPUT} data={[]} label=""/>
    </div>)
  }
}
