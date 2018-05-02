import React, { PropTypes, Component } from 'react';
import { connect } from 'dva';
import NavBar from '../containers/NavBar';
import RegisterForm from '../containers/RegisterForm';
import MenuPage from '../components/MenuPage';
import BackButton from '../containers/MenuButton/BackButton';

const wrapper = {
  textAlign: 'center',
  padding: '0.24rem 0rem',
  margin: 'auto',
};

class Register extends Component {
  render() {
    return (
      <div>
        <NavBar
          title="REGISTER"
          leftButton={<BackButton />}
        />
        <MenuPage>
          <RegisterForm style={wrapper} />
        </MenuPage>
      </div>
    );
  }
}

Register.propTypes = {
  dispatch: PropTypes.any,
};

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(Register);
