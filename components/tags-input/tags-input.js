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
      tags: [
        {key: 'test1', label: 'test1'},
        {key: 'test2', label: 'test2'}
      ]
    };

    render(TagsInput.factory(props), document.getElementById('demo'));
   </file>
 </example>

 <example name="Simple tags input via react-ng">
  <file name="index.html">
    <div ng-app="test-tags-app" ng-controller="testCtrl">
      <div><span>tags = {{tagsArray}}</span></div>
      <a href ng-click="addTag()">Add tag</a>
      <span react="TagsInput" ng-model="tagsArray"></span>
    </div>
  </file>
  <file name="index.js" webpack="true">
    require('angular/angular.min.js');
    require('react-ng/react-ng')({
      TagsInput: require('tags-input/tags-input')
    });

    angular.module('test-tags-app', ['Ring.react-ng'])
      .controller('testCtrl', function($scope) {
        $scope.tagsArray = [
          {key: 'test1', label: 'test1'},
          {key: 'test2', label: 'test2'}
        ];

        $scope.addTag = function() {
          $scope.tagsArray.push({key: Math.random().toFixed(3), label: Math.random().toFixed(3)})
        };
      });
  </file>
 </example>
*/

export default class TagsInput extends RingComponentWithShortcuts {
  static propTypes = {
    tags: React.PropTypes.array,
    completeDataSource: React.PropTypes.func,
    onRemoveTags: React.PropTypes.func,
    tagFormatter: React.PropTypes.func
  };

  static defaultProps = {
    completeDataSource: null,
    onRemoveTags: () => {},
    tagFormatter: tag => {
      return {
        key: tag.key,
        label: tag.label,
        tag: tag
      };
    }
  };

  state = {
    tags: []
  };

  static ngModelStateField = 'tags';
  ngModelStateField = TagsInput.ngModelStateField;

  updateStateFromProps(props) {
    if (props.tags) {
      this.setState({tags: props.tags});
    }
  }

  addTag(tag) {
    let tags = this.state.tags;
    tags.push(tag);

    this.setState({tags});
  }

  onRemoveTag(tagToRemove) {
    let tags = this.state.tags.filter(tag => tag !== tagToRemove);
    this.setState({tags});
  }

  focusOnSelect() {
    this.refs.select.refs.filter.node.focus();
  }

  willMount() {
    this.updateStateFromProps(this.props);
  }

  willReceiveProps(props) {
    this.updateStateFromProps(props);
  }

  getTags() {
    return this.state.tags.map((tag) => {
      let formattedTag = this.props.tagFormatter(tag);
      return <Tag key={formattedTag.key} onRemove={() => this.onRemoveTag(tag)}>{formattedTag.label}</Tag>
    });
  }

  render() {
    return (<div className="tags-input" onClick={::this.focusOnSelect}>
      {this.getTags()}
      <Select
        ref="select"
        type={Select.Type.INPUT}
        data={[{key: 1, label: 'test1'}, {key: 2, label: 'test2'}]}
        onSelect={::this.addTag}
        label=""/>
    </div>)
  }
}
