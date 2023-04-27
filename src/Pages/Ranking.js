import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { AiFillStar } from '@react-icons/all-files/ai/AiFillStar';
import Logo from '../image/logo trivia.png';
import '../Styles/Ranking.css';

class Ranking extends Component {
  handleClick = () => {
    const { history } = this.props;
    history.push('/');
  };

  render() {
    const ranking = localStorage.getItem('ranking');
    const arrayRanking = JSON.parse(ranking || '[]');
    return (
      <div className="container-ranking">
        <img src={ Logo } alt="logo" className="logo-ranking" />
        <h1 data-testid="ranking-title" className="title-ranking">Ranking</h1>
        <ul className="list-ranking">
          {arrayRanking
            .sort((a, b) => b.score - a.score)
            .map((rank, index) => (
              <li key={ index }>
                <img src={ rank.picture } alt={ `${rank.name}'s profile` } />
                <p data-testid={ `player-name-${index}` }>{rank.name}</p>
                <p
                  data-testid={ `player-score-${index}` }
                  className="detail-score"
                >
                  <AiFillStar className="icon-ranking" />
                  {rank.score}
                </p>
              </li>
            ))}
        </ul>
        <button
          data-testid="btn-go-home"
          onClick={ this.handleClick }
          className="btn-hanking"
        >
          Jogar novamente
        </button>
      </div>
    );
  }
}
Ranking.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
};

export default connect()(Ranking);
