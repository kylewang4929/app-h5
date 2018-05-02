import React from 'react';
import { connect } from 'dva';
import BackButton from '../containers/MenuButton/BackButton';
import LoginForm from '../containers/LoginForm';
import ThirdPartyLogin from '../containers/ThirdPartyLogin';
import NavBar from '../containers/NavBar';
import MenuPage from '../components/MenuPage';

const wrapper = {
  textAlign: 'center',
  padding: '0.24rem 0rem',
};

const styles = {
  container: {
  },
};

class Login extends React.Component {

  render() {
    const { navState } = this.props;
    return (
      <div>
        <NavBar
          title="LOGIN"
          leftButton={<BackButton />}
        />
        <MenuPage style={styles.container}>
          <LoginForm style={wrapper} />
          <ThirdPartyLogin marginTop="3rem" />
        </MenuPage>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    language: state.language,
  };
}

export default connect(mapStateToProps)(Login);
