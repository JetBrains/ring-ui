import React from 'react';
import classNames from 'classnames';

import RingComponentWithShortcuts from '../ring-component/ring-component_with-shortcuts';
import Select from '../select/select';
import Tag from '../tag/tag';
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
    var TagsInput = require('ring-ui/components/tags-input/tags-input');

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
    require('angular');
    require('ring-ui/components/react-ng/react-ng')({
      TagsInput: require('ring-ui/components/tags-input/tags-input')
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
    var TagsInput = require('ring-ui/components/tags-input/tags-input');
    var GroupIcon = require('jetbrains-icons/group.svg');
    var BugIcon = require('jetbrains-icons/bug.svg');
    var FrownIcon = require('jetbrains-icons/frown.svg');

    var props = {
      tags: [
        {key: 'test1', label: 'test1', rgTagIcon: GroupIcon},
        {key: 'test2', label: 'test2'}
      ],
      dataSource: function(query) {
        return [
          {key: 'test3', label: 'test3', rgTagIcon: BugIcon},
          {key: 'test4', label: 'test4', rgTagIcon: FrownIcon, icon: FrownIcon}
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
    customTagComponent: React.PropTypes.func,
    maxPopupHeight: React.PropTypes.number,
    placeholder: React.PropTypes.string
  };

  static defaultProps = {
    dataSource: null,
    onRemoveTags: () => { /* do nothing */ },
    customTagComponent: null,
    maxPopupHeight: 500
  };

  state = {
    tags: [],
    suggestions: [],
    shortcuts: true,
    loading: true
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
    const tags = this.state.tags.concat([tag]);
    this.setState({tags});
    this.refs.select.clear();
    this.refs.select.filterValue('');
  }

  onRemoveTag(tagToRemove) {
    const tags = this.state.tags.filter(tag => tag !== tagToRemove);
    this.setState({tags});
  }

  handleBackspace() {
    const currentInputValue = this._inputNode.value;
    if (!currentInputValue) {
      const tagsLength = this.state.tags.length;
      this.onRemoveTag(this.state.tags[tagsLength - 1]);
    }
  }

  get _inputNode() {
    return this.refs.select.refs.filter.node;
  }

  clickHandler() {
    this.loadSuggestions(this._inputNode.value);
    this._inputNode.focus();
  }

  filterExistTags(suggestions) {
    const tagsMap = new Map(this.state.tags.map(tag => [tag.key, tag]));
    return suggestions.filter(suggestion => !tagsMap.has(suggestion.key));
  }

  loadSuggestions(query) {
    this.setState({loading: true});
    return Promise.resolve(this.props.dataSource({query}))
      .then(::this.filterExistTags)
      .then(suggestions => {
        if (this.node) {
          this.setState({suggestions: suggestions, loading: false});
        }
      })
      .catch(() => this.setState({loading: false}));
  }

  willMount() {
    this.updateStateFromProps(this.props);
  }

  willReceiveProps(props) {
    this.updateStateFromProps(props);
  }

  renderTag(tag) {
    const TagComponent = this.props.customTagComponent || Tag;
    return (
      <TagComponent
        {...tag}
        onRemove={() => this.onRemoveTag(tag)}
      >{tag.label}</TagComponent>);
  }

  render() {
    const classes = classNames('ring-js-shortcuts', 'ring-tags-input', this.props.className);

    return (
      <div
        className={classes}
        onClick={::this.clickHandler}
      >
      {this.state.tags.map(::this.renderTag)}
      <Select
        ref="select"
        type={Select.Type.INPUT}
        label={this.props.placeholder}
        data={this.state.suggestions}
        onSelect={::this.addTag}
        filter={{
          fn: () => true
        }}
        maxHeight={this.props.maxPopupHeight}
        loading={this.state.loading}
        onFilter={::this.loadSuggestions}
      />
    </div>);
  }
}
