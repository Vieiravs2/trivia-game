import React from "react";
import { screen, act, waitFor, fireEvent, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import Ranking from "../Pages/Ranking";
import { renderWithRouterAndRedux } from "./helpers/renderWithRouterAndRedux";


const reduxInitialState = {
  player: {
    name: "",
    assertions: 0,
    score: 0,
    gravatarEmail: "",
  },
  game: {
    questions: {
      response_code: 0,
    }
  }
}

const questions = {
  response_code: 0,
  results: [
    {
      category: "Science: Computers",
      type: "multiple",
      difficulty: "medium",
      question: "While Apple was formed in California, in which western state was Microsoft founded?",
      correct_answer: "New Mexico",
      incorrect_answers: [
        "Washington",
        "Colorado",
        "Arizona"
      ]
    },
    {
      category: "General Knowledge",
      type: "multiple",
      difficulty: "hard",
      question: "Nephelococcygia is the practice of doing what?",
      correct_answer: "Finding shapes in clouds",
      incorrect_answers: [
        "Sleeping with your eyes open",
        "Breaking glass with your voice",
        "Swimming in freezing water"
      ]
    },
    {
      category: "Entertainment: Video Games",
      type: "multiple",
      difficulty: "medium",
      question: "In the PAYDAY series, who is the iconic leader of the PAYDAY gang?",
      correct_answer: "Dallas",
      incorrect_answers: [
        "Wolf",
        "Chains",
        "Hoxton"
      ]
    },
    {
      category: "General Knowledge",
      type: "multiple",
      difficulty: "hard",
      question: "The word &quot;abulia&quot; means which of the following?",
      correct_answer: "The inability to make decisions",
      incorrect_answers: [
        "The inability to stand up",
        "The inability to concentrate on anything",
        "A feverish desire to rip one&#039;s clothes off"
      ]
    },
    {
      category: "Entertainment: Television",
      type: "multiple",
      difficulty: "medium",
      question: "The fictional movie &#039;Rochelle, Rochelle&#039; features in which sitcom?",
      correct_answer: "Seinfeld",
      incorrect_answers: [
        "Frasier",
        "Cheers",
        "Friends"
      ]
    }
  ]
}

const renderGame = async () => {

  jest.spyOn(global, 'fetch');
  global.fetch.mockResolvedValue({
    json: jest.fn().mockResolvedValue('token'),
  });

  let page

  await act(async () => {
    page = renderWithRouterAndRedux(<App />);
  });

  global.fetch.mockResolvedValue({
    json: jest.fn().mockResolvedValue(questions),
  });

  const playerNameInput = screen.getByTestId("input-player-name");
  const gravatarEmailInput = screen.getByTestId("input-gravatar-email");
  const playButton = screen.getByTestId("btn-play");

  await act(async () => {
    userEvent.type(playerNameInput, "Teste");
    userEvent.type(gravatarEmailInput, "test@example.com");
    userEvent.click(playButton);
  });

  return page
};

it('Renderiza a página corretamente', () => {
  const { getByTestId } = renderWithRouterAndRedux(
    <Ranking />,
    reduxInitialState, 
    '/ranking'
  );
  const title = getByTestId('ranking-title');
  expect(title).toBeInTheDocument();
});

it('Organiza os jogadores por pontuacao', () => {
  const players = [
    { name: 'Alice', score: 10 },
    { name: 'Bob', score: 5 },
    { name: 'Charlie', score: 8 },
  ];
  localStorage.setItem('ranking', JSON.stringify(players));
  const { getByTestId } = renderWithRouterAndRedux(<Ranking />, reduxInitialState, '/ranking');
  const playerNames = [...Array(3)].map((_, i) => getByTestId(`player-name-${i}`).textContent);
  expect(playerNames).toEqual(['Alice', 'Charlie', 'Bob']);
});

it('Navega para a pagina de login', async () => {
  const { history } = await renderGame();
  act( () => {
    history.push('/ranking')
  })
  act(() => {
    userEvent.click(screen.getByTestId('btn-go-home'));
  })
  await waitFor(() => {
    expect(history.location.pathname).toBe('/');
  })
});