import { decorate } from 'react-mixin';
import mui from 'material-ui';
import React from 'react';

import autoBind from '../utils/autoBind';
import PureComponent from './PureComponent';

const { StylePropable } = mui.Mixins;

@decorate(StylePropable)
@decorate(autoBind(StylePropable))
class StyleableComponent extends PureComponent {}

export default StyleableComponent;
