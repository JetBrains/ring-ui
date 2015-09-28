import React from 'react';
import classNames from 'classnames';

import RingComponent from 'ring-component/ring-component';
import RingComponentWithShortcuts from 'ring-component/ring-component_with-shortcuts';
import Select from 'select/select';
import Tag from 'tag/tag';
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
      className: 'test-additional-class',
      tags: [
        {key: 'test1', label: 'test1'},
        {key: 'test2', label: 'test2'}
      ],
      dataSource: function() {
        return Promise.resolve([
          {key: 'test3', label: 'test3'},
          {key: 'test4', label: 'test4'}
        ]);
      }
    };

    render(TagsInput.factory(props), document.getElementById('demo'));
   </file>
 </example>

 <example name="Simple tags input via react-ng">
  <file name="index.html">
    <div ng-app="test-tags-app" ng-controller="testCtrl">
      <a href class="ring-link" ng-click="addTag()">Add a tag</a>
      <span react="TagsInput" ng-model="tagsArray" x-data-source="suggestionsSource()"></span>
      <div><span>tags = {{tagsArray}}</span></div>
    </div>
  </file>
  <file name="index.js" webpack="true">
    require('angular/angular.min.js');
    require('react-ng/react-ng')({
      TagsInput: require('tags-input/tags-input')
    });

    angular.module('test-tags-app', ['Ring.react-ng'])
      .controller('testCtrl', function($q, $scope) {
        $scope.tagsArray = [
          {key: 'test1', label: 'test1'},
          {key: 'test2', label: 'test2'}
        ];

        $scope.suggestionsSource = function() {
          return $q.when([
            {key: 'test3', label: 'test3'},
            {key: 'test4', label: 'test4'}
          ]);
        };

        $scope.addTag = function() {
          $scope.tagsArray.push({key: Math.random().toFixed(3), label: Math.random().toFixed(3)})
        };
      });
  </file>
 </example>

  <example name="TagsInput with icons">
   <file name="index.html">
    <div id="demo"></div>
   </file>
   <file name="index.js" webpack="true">
    var render = require('react-dom').render;
    var TagsInput = require('tags-input/tags-input');

    var props = {
      tags: [
        {key: 'test1', label: 'test1', rgTagIcon: 'group'},
        {key: 'test2', label: 'test2'}
      ],
      dataSource: function(query) {
        return [
          {key: 'test3', label: 'test3', rgTagIcon: 'bug'},
          {key: 'test4', label: 'test4', rgTagIcon: 'frown', icon: 'frown'}
        ];
      }
    };
    render(TagsInput.factory(props), document.getElementById('demo'));
   </file>
 </example>
*/

export default class TagsInput extends RingComponentWithShortcuts {
  static propTypes = {
    tags: React.PropTypes.array,
    /**
     * Datasource should return array(or promise) of suggestions.
     * Each suggestion should contain key and label fields.
     * DataSource should handle caching and responce racing (when later request
     * responded earlier) by himself.
     */
    dataSource: React.PropTypes.func,
    onRemoveTags: React.PropTypes.func,
    customTagComponent: React.PropTypes.func
  };

  static defaultProps = {
    dataSource: null,
    onRemoveTags: () => {},
    customTagComponent: null
  };

  state = {
    tags: [],
    suggestions: [],
    shortcuts: true,
    loading: false
  };

  static ngModelStateField = 'tags';
  ngModelStateField = TagsInput.ngModelStateField;

  getShortcutsProps() {
    return {
      map: {
        backspace: (...args) => this.handleBackspace(...args)
      },
      scope: () => this.constructor.getUID()
    };
  }

  updateStateFromProps(props) {
    if (props.tags) {
      this.setState({tags: props.tags});
    }
  }

  addTag(tag) {
    let tags = this.state.tags.concat([tag]);
    this.setState({tags});
    this.refs.select.clear();
    this.refs.select.filterValue('');
  }

  onRemoveTag(tagToRemove) {
    let tags = this.state.tags.filter(tag => tag !== tagToRemove);
    this.setState({tags});
  }

  handleBackspace() {
    let currentInputValue =  this._inputNode.value;
    if (!currentInputValue) {
      let tagsLength = this.state.tags.length;
      this.onRemoveTag(this.state.tags[tagsLength-1]);
    }
  }

  get _inputNode() {
    return this.refs.select.refs.filter.node;
  }

  clickHandler() {
    this.loadSuggestions();
    this._inputNode.focus();
  }

  filterExistTags(suggestions) {
    let tagsMap = new Map(this.state.tags.map(tag => [tag.key, tag]));
    return suggestions.filter(suggestion => !tagsMap.has(suggestion.key));
  }

  loadSuggestions(query) {
    this.setState({loading: true});
    return Promise.resolve(this.props.dataSource({query}))
      .then(::this.filterExistTags)
      .then(suggestions => this.setState({suggestions: suggestions, loading: false}))
      .catch(() => this.setState({loading: false}));
  }

  willMount() {
    this.updateStateFromProps(this.props);
  }

  willReceiveProps(props) {
    this.updateStateFromProps(props);
  }

  renderTag(tag) {
    let TagComponent = this.props.customTagComponent || Tag;
    return <TagComponent {...tag} onRemove={() => this.onRemoveTag(tag)}>{tag.label}</TagComponent>;
  }

  render() {
    let classes = classNames('ring-js-shortcuts', 'ring-tags-input', this.props.className);

    return (<div className={classes} onClick={::this.clickHandler}>
      {this.state.tags.map(::this.renderTag)}
      <Select ref="select"
        type={Select.Type.INPUT}
        data={this.state.suggestions}
        onSelect={::this.addTag}
        filter={{
          fn: () => true
        }}
        loading={this.state.loading}
        onFilter={::this.loadSuggestions}
        label=""/>
    </div>)
  }
}
