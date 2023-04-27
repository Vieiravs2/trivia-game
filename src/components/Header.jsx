import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AiFillStar } from '@react-icons/all-files/ai/AiFillStar';
import md5 from 'crypto-js/md5';
import '../Styles/HeaderGame.css';
import '../Styles/HeaderFeedback.css';

class Header extends Component {
  render() {
    const { name, gravatarEmail, score, history, assertions } = this.props;
    if (history.location.pathname === '/game') {
      return (
        <header className="header-game">
          <img
            src={ `https://www.gravatar.com/avatar/${md5(gravatarEmail).toString()}` }
            alt={ `${name}'s profile ` }
            data-testid="header-profile-picture"
            className="img-game"
          />
          <h1 data-testid="header-player-name" className="name-game">{ name }</h1>
          <h2 className="score-game">
            <AiFillStar className="icon-star" />
            <p>
              Pontos:
              {' '}
              <span data-testid="header-score">{ score }</span>
            </p>
          </h2>
        </header>
      );
    }
    if (history.location.pathname === '/feedback') {
      const MAX_QUESTIONS = 3;
      return (
        <header className="header-feedback">
          <img
            src={ `https://www.gravatar.com/avatar/${md5(gravatarEmail).toString()}` }
            alt={ `${name}'s profile ` }
            data-testid="header-profile-picture"
            className={ `img-feedback ${assertions > MAX_QUESTIONS ? 'win' : 'lose'}` }
          />
          <h1 data-testid="header-player-name" className="name-feedback">{ name }</h1>
          <h2 className="score-feedback">
            <AiFillStar className="icon-star" />
            <p>
              Pontos:
              {' '}
              <span data-testid="header-score">{ score }</span>
            </p>
          </h2>
        </header>
      );
    }
  }
}

Header.propTypes = {
  gravatarEmail: PropTypes.string.isRequired,
  history: PropTypes.shape({
    location: PropTypes.shape({
      pathname: PropTypes.string,
    }),
  }).isRequired,
  name: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
  assertions: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => ({
  name: state.player.name,
  gravatarEmail: state.player.gravatarEmail,
  score: state.player.score,
  assertions: state.player.assertions,
});

export default connect(mapStateToProps)(Header);
