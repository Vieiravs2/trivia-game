import React from "react";
import { screen, act, waitFor, fireEvent, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import { renderWithRouterAndRedux } from "./helpers/renderWithRouterAndRedux";

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

const token = {
  response_code:0,
  response_message:"Token Generated Successfully!",
  token:"90942eaca1773f1a0eeabc8e6502bc876399836df84f61a94e4428c1d2962c69"
}

const renderGame = async () => {

  jest.spyOn(global, 'fetch');
  global.fetch.mockResolvedValue({
    json: jest.fn().mockResolvedValue(token),
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

describe("Teste a página Game", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("Caso o token seja inválido, deve deslogar e redirecionar até a página de login", async () => {
    jest.spyOn(global, 'fetch');
    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(token),
    });

    let page

    await act(async () => {
      page = renderWithRouterAndRedux(<App />);
    });
  
    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue({
        response_code: 3,
        results: []
      }),
    });
  
    const playerNameInput = screen.getByTestId("input-player-name");
    const gravatarEmailInput = screen.getByTestId("input-gravatar-email");
    const playButton = screen.getByTestId("btn-play");
  
    await act(async () => {
      userEvent.type(playerNameInput, "Teste");
      userEvent.type(gravatarEmailInput, "test@example.com");
      userEvent.click(playButton);
    });

    const {history} = page
    expect(history.location.pathname).toBe('/')
  })

  it("A API deve ser chamada", async () => {
    await renderGame();
    expect(fetch).toHaveBeenCalled();
  });

  it("A categoria deve ser renderizada", async () => {
    await renderGame();
    const category = await screen.findByTestId("question-category");
    expect(category).toBeInTheDocument();
  });

  it("As opções de respostas devem ser renderizadas", async () => {
    await renderGame();
    const answerOptions = await screen.findByTestId("answer-options");
    expect(answerOptions).toBeInTheDocument();
  });

  it("O temporizador mostra a contagem regressiva corretamente", async () => {
    await renderGame();
    const countdownTimer = await screen.findByTestId("answer-time");
    expect(countdownTimer).toHaveTextContent("30 segundos");

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      expect(countdownTimer).toHaveTextContent("29 segundos");
    });

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      expect(countdownTimer).toHaveTextContent("28 segundos");
    });

    for (let i = 0; i < 30; i++) {
      act(() => {
        jest.advanceTimersByTime(1000);
      })
    }

    await waitFor(() => {
      expect(countdownTimer).toHaveTextContent("0 segundos");
    });

  });

  it("A página inicia sem renderizar o botão Next", async () => {
    await renderGame();
    const nextButton = screen.queryByTestId("btn-next");
    expect(nextButton).not.toBeInTheDocument();
  });

  it("A pergunta deve mudar após a escolha de uma alternativa", async () => {
    await renderGame();
    const correctAnswer = await screen.findByTestId("correct-answer");
    expect(correctAnswer).toBeInTheDocument();

    await act(async () => {
      userEvent.click(correctAnswer);
    });

    const nextButton = await screen.findByTestId("btn-next");
    expect(nextButton).toBeInTheDocument();
  });

  it("Ao responder 5 questões, deverá redirecionar para a pág de Feedback", async () => {
    const { history } = await renderGame();
    for (let i = 0; i < 5; i++) {
      await act(async () => {
        userEvent.click(await screen.findByTestId("correct-answer"));
      });
      await act(async () => {
        userEvent.click(await screen.findByTestId("btn-next"));
      });
    }
    await waitFor(() => {
      expect(history.location.pathname).toBe("/feedback");
    });
  })


})