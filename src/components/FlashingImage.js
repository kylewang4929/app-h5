import React, { PropTypes, Component } from 'react';

const styles = {
  container: {
    width: '100%',
    height: '100%',
    backgroundPosition: 'center center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
  },
};

class FlashingImage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      image: props.image,
      value: true,
    };
  }

  componentWillMount() {
    const { image, activeImage, speed } = this.props;
    this.interval = setInterval(() => {
      const { value } = this.state;
      this.setState({
        image: value ? activeImage : image,
        value: !value,
      });
    }, speed);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const { image } = this.state;
    return (
      <div style={{ ...styles.container, backgroundImage: `url(${image})` }} />
    );
  }
}

FlashingImage.propTypes = {
};

export default FlashingImage;
