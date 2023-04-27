import React from "react";
import { screen, act, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import { renderWithRouterAndRedux } from "./helpers/renderWithRouterAndRedux";

describe("Teste o componente Login", () => {
  it("Testa o campo de nome", () => {
    renderWithRouterAndRedux(<App />);
    const name = screen.getByTestId("input-player-name");
    expect(name).toBeInTheDocument();
  });
  it("Testa o campo de email", () => {
    renderWithRouterAndRedux(<App />);
    const email = screen.getByTestId("input-gravatar-email");
    expect(email).toBeInTheDocument();
  });
  it("Teste se o botão está desabilitado", () => {
    renderWithRouterAndRedux(<App />);
    const button = screen.getByRole("button", {
      name: /play/i,
    });
    expect(button).toBeDisabled();
  });
  it("Testa o botão", () => {
    renderWithRouterAndRedux(<App />);
    const button = screen.getByRole("button", {
      name: /play/i,
    });
    expect(button).toBeInTheDocument();
  });
  it("Testa se o botão é habilitado e se há troca de página para o game", async () => {
    const { history } = renderWithRouterAndRedux(<App />);
    expect(history.location.pathname).toBe("/");
    const name = screen.getByTestId("input-player-name");
    userEvent.type(name, "aaaa");
    const email = screen.getByTestId("input-gravatar-email");
    userEvent.type(email, "aaaa@mail.com");
    const button = screen.getByTestId("btn-play");
    expect(button).toBeEnabled();
    userEvent.click(button);
    await waitFor(() => {
      expect(history.location.pathname).toBe("/game");
    });
  });
  it("Testa se ao clicar no botão settings, você é redirecionado para settings", () => {
    const { history } = renderWithRouterAndRedux(<App />);
    expect(window.location.pathname).toBe("/");
    const button = screen.getByTestId("btn-settings");
    expect(button).toBeInTheDocument();
    userEvent.click(button);
    act(() => {
      expect(history.location.pathname).toBe("/settings");
      const setting = screen.getByTestId("settings-title");
      expect(setting).toBeInTheDocument();
    });
  });
});
