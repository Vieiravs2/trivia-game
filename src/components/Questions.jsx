import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AiOutlineCheck } from '@react-icons/all-files/ai/AiOutlineCheck';
import { AiOutlineClose } from '@react-icons/all-files/ai/AiOutlineClose';
import md5 from 'crypto-js/md5';
import { saveQuestionsData, addScore } from '../Redux/actions/index';
import '../Styles/Questions.css';

const interval = 1000;
const HALF = 0.5;
const greenBorder = 'green-border';
const redBorder = 'red-border';

class Questions extends Component {
  state = {
    time: 30,
    answerOptions: [],
    answerIndex: 0,
    buttonClicked: false,
    data: [],
  };

  async componentDidMount() {
    const { history, dispatch } = this.props;
    try {
      const recoveryToken = localStorage.getItem('token');
      const url = `https://opentdb.com/api.php?amount=5&token=${recoveryToken}`;
      const response = await fetch(url);
      const questionData = await response.json();
      dispatch(saveQuestionsData(questionData));
      const codeResponse = 3;
      if (questionData.response_code === codeResponse) {
        localStorage.removeItem('token');
        return history.push('/');
      }
      this.setState({
        data: questionData.results,
      }, () => this.sortAnswers(), this.startCountDown());
    } catch (error) {
      // console.error(error.message);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { answerIndex, data } = this.state;
    if (prevState.data !== data || prevState.answerIndex !== answerIndex) {
      if (data[prevState.answerIndex].question
        !== data[answerIndex].question) {
        this.sortAnswers();
      }
    } else {
      console.log();
    }
  }

  startCountDown = () => {
    this.setState({ time: 30 });
    this.timer = setInterval(() => {
      const { time } = this.state;
      if (time <= 0) {
        clearInterval(this.timer);
        return;
      }
      this.setState({
        time: time - 1,
      });
    }, interval);
  };

  stopCoundDown = () => {
    clearInterval(this.timer);
  };

  sortAnswers = () => {
    const { answerIndex, data } = this.state;
    const incorrect = data[answerIndex]?.incorrect_answers;
    const correct = data[answerIndex]?.correct_answer;
    const array = [...incorrect, correct].sort(() => Math.random() - HALF);
    this.setState({ answerOptions: array });
  };

  checkAnswer = ({ target }) => {
    const easy = 1;
    const medium = 2;
    const hard = 3;
    const correctAnswer = document.querySelector('.correct');
    const wrongAnswer = document.querySelectorAll('.wrong');
    const { dispatch } = this.props;
    const { time, data, answerIndex } = this.state;
    if (target.name === 'correct') {
      const dificult = data[answerIndex].difficulty;
      switch (dificult) {
      case 'easy':
        dispatch(addScore(time, easy));
        break;
      case 'medium':
        dispatch(addScore(time, medium));
        break;
      case 'hard':
        dispatch(addScore(time, hard));
        break;
      default:
        break;
      }
    }
    correctAnswer.className = `correct ${greenBorder}`;
    wrongAnswer.forEach((element) => {
      element.className = `wrong ${redBorder}`;
    });
    this.setState({ buttonClicked: true });
    this.stopCoundDown();
  };

  handleLocalStorage = () => {
    const ranking = localStorage.getItem('ranking');
    let parsedArray;
    if (ranking === null) {
      parsedArray = [];
    } else { parsedArray = JSON.parse(ranking); }

    const { gravatarEmail, name, score } = this.props;
    const picture = `https://www.gravatar.com/avatar/${md5(gravatarEmail).toString()}`;
    const userObject = {
      name,
      score,
      picture,
    };
    parsedArray.push(userObject);
    const toLocalStorage = JSON.stringify(parsedArray);
    localStorage.setItem('ranking', toLocalStorage);
  };

  handleClick = () => {
    const MAX_LENGTH = 4;
    const { answerIndex } = this.state;
    const { history } = this.props;

    if (answerIndex === MAX_LENGTH) {
      this.handleLocalStorage();
      history.push('/feedback');
    }
    this.stopCoundDown();
    this.setState((prev) => ({
      answerIndex: prev.answerIndex + 1,
      buttonClicked: false,
    }));
    const correctAnswer = document.querySelector('.correct');
    const wrongAnswer = document.querySelectorAll('.wrong');
    correctAnswer.className = 'correct';
    wrongAnswer.forEach((element) => {
      element.className = 'wrong';
    });
    this.startCountDown();
  };

  render() {
    const { time, answerIndex, buttonClicked, answerOptions, data } = this.state;
    const showButton = time === 0 || buttonClicked;
    const disebledButtonAnswer = time === 0;
    const correct = data[answerIndex]?.correct_answer;
    return (
      <div className="container-questions">
        <div className="container-answer">
          <div className="answer">
            <h2 data-testid="question-category">
              {data[answerIndex]?.category}
            </h2>
            <h2
              data-testid="question-text"
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={
                { __html: data[answerIndex]?.question }
              }
            />
            <h2 data-testid="answer-time">{ `${time} segundos`}</h2>
          </div>
        </div>
        <div data-testid="answer-options" className="container-options">
          {
            answerOptions
              .map((answer, index) => (
                <button
                  key={ index }
                  data-testid={
                    answer === correct
                      ? 'correct-answer' : `wrong-answer-${index}`
                  }
                  name={ answer === correct ? 'correct' : 'wrong' }
                  className={ answer === correct ? 'correct' : 'wrong' }
                  onClick={ (e) => this.checkAnswer(e) }
                  disabled={ disebledButtonAnswer }
                >
                  {buttonClicked && answer === correct && (
                    <AiOutlineCheck className="icon-correct" />
                  )}
                  {buttonClicked && answer !== correct && (
                    <AiOutlineClose className="icon-wrong" />
                  )}
                  <p>{answer}</p>
                </button>))
          }
          {
            showButton
            && (
              <button
                className="btn-next"
                data-testid="btn-next"
                onClick={ this.handleClick }
              >
                Next
              </button>)
          }
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  name: state.player.name,
  gravatarEmail: state.player.gravatarEmail,
  score: state.player.score,
});

Questions.propTypes = {
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  gravatarEmail: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
};

export default connect(mapStateToProps)(Questions);
