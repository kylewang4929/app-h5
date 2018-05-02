import React, { Component, PropTypes } from 'react';
import ZScroller from 'zscroller';

import 'zscroller/assets/index.css';

const styles = {
  container: {
    position: 'relative',
    height: '100%',
  },
};

class Scroll extends Component {

  componentDidMount() {
    const { bounce } = this.props;
    setTimeout(() => {
      this.zscroller = new ZScroller(this.contentDom, {
        scrollbars: false,
        scrollingX: false,
        scrollingY: true,
        locking: true,
        bouncing: bounce === true ? true : false,
      });
      this.props.initSuccess(this.zscroller);
    });
  }

  render() {
    return (
      <div
        ref={(c) => { this.dom = c; }}
        style={Object.assign({}, styles.container, this.props.style)}
      >
        <div
          ref={(c) => { this.contentDom = c; }}
        >
          {this.props.children}
        </div>
      </div>
    );
  }
}

Scroll.defaultProps = {
  initSuccess: () => { },
};
Scroll.propTypes = {
  initSuccess: PropTypes.func,
  children: PropTypes.any,
  style: PropTypes.object,
};

export default Scroll;
