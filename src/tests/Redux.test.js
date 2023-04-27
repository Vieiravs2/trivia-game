import React from "react";
import { screen, act, waitFor, fireEvent, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import { renderWithRouterAndRedux } from "./helpers/renderWithRouterAndRedux";

it('Renderiza a aplicação com o estado inicial', () => {
  const {store} = renderWithRouterAndRedux();

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

  expect(store.getState()).toMatchObject(reduxInitialState)
})