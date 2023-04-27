import React from "react";
import { screen } from "@testing-library/react";
import { renderWithRouterAndRedux } from "../tests/helpers/renderWithRouterAndRedux";
import App from '../App.js'
import userEvent from "@testing-library/user-event";

describe('Feedback', () => {
  it('Verifica a renderização em feedback caso não tenha menos que 3 acertos', () => {
    const initialState = {
      player: {
        name: "Hector Souza e Souza",
        assertions: 0,
        score: 0,
        gravatarEmail: "hectorsouzass@gmail.com",
        rightQuestions: 0,
      },
    };
    const route = '/feedback';
    renderWithRouterAndRedux(<App />, initialState, route);

    const feedback = screen.getByText(/could be better\.\.\./i);
    expect(feedback).toBeInTheDocument();
  });

  it('Verifica a renderização em feedback caso não tenha mais que 3 acertos', () => {
    const initialState = {
      player: {
        name: 'Hector Souza e Souza',
        assertions: 5,
        score: 199,
        gravatarEmail: 'hectorsouzass@gmail.com',
        rightQuestions: 0
      },
    };
    const route = '/feedback';
    renderWithRouterAndRedux(<App />, initialState, route);

    const feedback = screen.getByText(/well done!/i);
    expect(feedback).toBeInTheDocument();
  });

  it('Verifica a renderização em feedback caso não tenha mais que 3 acertos', () => {
    const initialState = {
      player: {
        name: 'Hector Souza e Souza',
        assertions: 5,
        score: 199,
        gravatarEmail: 'hectorsouzass@gmail.com',
        rightQuestions: 0
      },
    };
    const route = '/feedback';
    renderWithRouterAndRedux(<App />, initialState, route);

    const feedback = screen.getByText(/well done!/i);
    expect(feedback).toBeInTheDocument();
  });

  it('Verifica se é redirecionado para a rota / ao clicar no botão "Play Again"', () => {
    const initialState = {
      player: {
        name: 'Hector Souza e Souza',
        assertions: 5,
        score: 199,
        gravatarEmail: 'hectorsouzass@gmail.com',
        rightQuestions: 0
      },
    };
    const route = '/feedback';
    const { history } = renderWithRouterAndRedux(<App />, initialState, route);
    
    expect(history.location.pathname).toBe('/feedback')
    
    const playAgain = screen.getByRole('button', {  name: /play again/i });
    userEvent.click(playAgain)
    
    expect(history.location.pathname).toBe('/')
  });

  it('Verifica se é redirecionado para a rota /ranking ao clicar no botão "Ranking"', () => {
    const initialState = {
      player: {
        name: 'Hector Souza e Souza',
        assertions: 5,
        score: 199,
        gravatarEmail: 'hectorsouzass@gmail.com',
        rightQuestions: 0
      },
    };
    const route = '/feedback';
    const { history } = renderWithRouterAndRedux(<App />, initialState, route);

    const ranking = localStorage.getItem('ranking');
    let parsedArray;
    if (ranking === null) {
      parsedArray = [];
    } else { parsedArray = JSON.parse(ranking); }

    const userObject = {
      name: "Hector Souza e Souza",
      score: 176,
      picture: "https://www.gravatar.com/avatar/fecc2f3daf7e6f652e8418cab6f89560"
    }
    parsedArray.push(userObject);
    const toLocalStorage = JSON.stringify(parsedArray);
    localStorage.setItem('ranking', toLocalStorage);
    
    expect(history.location.pathname).toBe('/feedback')
    
    const playAgain = screen.getByRole('button', {  name: /ranking/i });
    userEvent.click(playAgain)
    
    expect(history.location.pathname).toBe('/ranking')
  });
})

