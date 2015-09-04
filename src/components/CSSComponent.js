import { Component } from 'reactcss';
import React from 'react';
import merge from 'merge';
import shouldPureComponentUpdate from 'react-pure-render/function';

export default class CSSComponent extends Component {}
CSSComponent.prototype.shouldComponentUpdate = shouldPureComponentUpdate;
CSSComponent.prototype.merge = merge;
