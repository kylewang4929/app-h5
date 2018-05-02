import React, { Component } from 'react';
import Slider from 'rc-slider';
import Tooltip from 'rc-tooltip';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';

const Handle = Slider.Handle;

const handle = (props) => {
  const { value, dragging, index, ...restProps } = props;
  return (
    <Tooltip
      prefixCls="rc-slider-tooltip"
      overlay={value}
      visible={dragging}
      placement="top"
      key={index}
    >
      <Handle value={value} {...restProps} />
    </Tooltip>
  );
};

class SliderComponent extends Component {
  render() {
    const { disableHandle } = this.props;
    if (disableHandle) {
      return <Slider {...this.props} />;
    }
    return (
      <Slider handle={handle} {...this.props} />
    );
  }
}

export default SliderComponent;
