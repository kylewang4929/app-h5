import React from 'react';
import { WingBlank } from 'antd-mobile';
import { connect } from 'dva';

import SetPassPhone from '../containers/SetPassPhone';
import SetPassEmail from '../containers/SetPassEmail';
import NavBar from '../containers/NavBar';
import BackButton from '../containers/MenuButton/BackButton';
import MenuPage from '../components/MenuPage';

class Register extends React.Component {

  render() {
    const { params } = this.props;
    const { type } = params;
    return (
      <div>
        <NavBar
          title="SET_PASSWORD"
          leftButton={<BackButton />}
        />
        <MenuPage>
          <WingBlank>
            {
              type === 'phone' ? <SetPassPhone /> : null
            }
            {
              type === 'email' ? <SetPassEmail /> : null
            }
          </WingBlank>
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

export default connect(mapStateToProps)(Register);
