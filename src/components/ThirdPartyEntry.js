import React, { PropTypes } from 'react';

const imgStyle = {
  borderRadius: '50%',
  width: '1.2rem',
  height: '1.2rem',
  backgroundColor: '#fff',
  padding: '0.14rem',
  boxSizing: 'border-box',
};

const textStyle = {
  marginTop: '0.3rem',
  fontSize: '0.28rem',
  color: '#9b9b9b',
};

const wrapper = {
  textAlign: 'center',
};

const ThirdPartyEntry = (props) => {
  const { onClick } = props;
  return (
    <div style={wrapper} onClick={onClick}>
      <img role="presentation" style={imgStyle} src={props.src} />
      <div style={textStyle}>{props.text}</div>
    </div>
  );
};

ThirdPartyEntry.propTypes = {
  src: PropTypes.string,
};

export default ThirdPartyEntry;
