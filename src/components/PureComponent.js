import React, { Component } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

class PureComponent extends Component {
    shouldComponentUpdate = shouldPureComponentUpdate;
}

export default PureComponent;
