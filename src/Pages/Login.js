import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { AiOutlineSetting } from '@react-icons/all-files/ai/AiOutlineSetting';
import { tokenTrivia, saveUserData, clearPlayer } from '../Redux/actions';
import logo from '../image/logo trivia.png';
import '../Styles/Login.css';

class Login extends Component {
  state = {
    email: '',
    name: '',
    enable: true,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(clearPlayer());
  }

  onClickPlay = async () => {
    const { email, name } = this.state;
    const { dispatch } = this.props;
    dispatch(saveUserData({ name, gravatarEmail: email, score: 0 }));
    const { history } = this.props;
    await tokenTrivia();
    history.push('/game');
  };

  pushSettings = () => {
    const { history } = this.props;
    history.push('/settings');
  };

  validateFields = () => {
    const { email, name } = this.state;
    const nameLength = 1;
    const validador = name.length >= nameLength;
    const regexEmail = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email);
    if (validador && regexEmail === true) {
      this.setState({ enable: false });
    } else this.setState({ enable: true });
  };

  handleChange = ({ target: { name, value } }) => {
    this.setState({ [name]: value }, () => this.validateFields());
  };

  render() {
    const { email, name, enable } = this.state;
    return (
      <>
        <img src={ logo } alt="logo" name="logo" className="logo" />
        <div className="container-login">
          <input
            className="input-login"
            type="text"
            name="name"
            data-testid="input-player-name"
            value={ name }
            onChange={ this.handleChange }
            placeholder="Qual é o seu nome?"
          />
          <input
            className="input-login"
            type="text"
            name="email"
            data-testid="input-gravatar-email"
            value={ email }
            onChange={ this.handleChange }
            placeholder="Qual é o seu e-mail do gravatar?"
          />
          <button
            className="button-play"
            data-testid="btn-play"
            disabled={ enable }
            onClick={ this.onClickPlay }
          >
            Play
          </button>
          <button
            data-testid="btn-settings"
            onClick={ this.pushSettings }
            className="button-settings"
          >
            <AiOutlineSetting color="rgba(255, 255, 255, 0.63)" />
            {' '}
            Settings
          </button>
        </div>
      </>
    );
  }
}
Login.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default connect()(Login);
