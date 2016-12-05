import React, { Component } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

class PureComponent extends Component {}

export default PureComponent;
PureComponent.prototype.shouldComponentUpdate = shouldPureComponentUpdate;
