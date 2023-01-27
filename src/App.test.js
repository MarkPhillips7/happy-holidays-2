import { render, screen } from "@testing-library/react";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

test("renders happy holidays", () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  const happyHolidaysElement = screen.getByText(/happy holidays/i);
  expect(happyHolidaysElement).toBeInTheDocument();
});
