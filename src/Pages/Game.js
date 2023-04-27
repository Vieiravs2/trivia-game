import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Header from '../components/Header';
import Questions from '../components/Questions';
import Logo from '../image/logo trivia.png';

class Game extends Component {
  render() {
    const { history } = this.props;
    return (
      <>
        <Header history={ history } />
        <img src={ Logo } alt="logo" className="logo-game" />
        <Questions history={ history } />
      </>
    );
  }
}

Game.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

export default connect()(Game);
