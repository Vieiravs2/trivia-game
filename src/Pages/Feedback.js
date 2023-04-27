import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Header from '../components/Header';
import Logo from '../image/logo trivia.png';

class Feedback extends Component {
  redirecionaRanking = () => {
    const { history } = this.props;
    history.push('/ranking');
  };

  returnToHome = () => {
    const { history } = this.props;
    history.push('/');
  };

  render() {
    const { assertions, score, history } = this.props;
    const MAX_QUESTIONS = 3;
    return (
      <div className="container-feedback">
        <img src={ Logo } alt="logo" className="logo-feedback" />
        <div className="container-infor-feedback">
          <Header history={ history } />
          { assertions >= MAX_QUESTIONS
            ? (
              <p data-testid="feedback-text" className="feedback-win">Well Done!</p>
            ) : (
              <p
                data-testid="feedback-text"
                className="feedback-lose"
              >
                Could be better...
              </p>
            )}
          <div className="infor1-feedback">
            Você acertou
            <p data-testid="feedback-total-question">{ assertions }</p>
            questões!
          </div>
          <div className="infor2-feedback">
            Um total de pontos
            <p data-testid="feedback-total-score" className="infor-feedback">
              {score}
            </p>
            pontos
          </div>
        </div>
        <div className="container-options-feedback">
          <button
            data-testid="btn-ranking"
            onClick={ this.redirecionaRanking }
            className="button-ranking"
          >
            Ranking
          </button>
          <button
            data-testid="btn-play-again"
            onClick={ this.returnToHome }
            className="button-again"
          >
            Play Again
          </button>
        </div>
      </div>
    );
  }
}

Feedback.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
  assertions: PropTypes.number.isRequired,
  score: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => ({
  assertions: state.player.assertions,
  score: state.player.score,
});

export default connect(mapStateToProps)(Feedback);
