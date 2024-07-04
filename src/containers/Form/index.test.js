import { fireEvent, render, screen } from "@testing-library/react";
import Form from "./index";


describe("When Events is created", () => {
  it("a list of event card is displayed", async () => {
    render(<Form />);
    await screen.findByText("Email");
    await screen.findByText("Nom");
    await screen.findByText("Prénom");
    await screen.findByText("Personel / Entreprise");
  });
  
  describe("and a click is triggered on the submit button", () => {
    
    it("the success action is called", async () => {
      const onSuccess = jest.fn();
      render(<Form onSuccess={onSuccess} />);
      const nameInput = screen.getByPlaceholderText('Nom')
      fireEvent.change(nameInput, {target: {value: "test"}})
      const prenomInput = screen.getByPlaceholderText('Prénom')
      fireEvent.change(prenomInput, {target: {value: "jean"}})
      const emailInput = screen.getByPlaceholderText('Email')
      fireEvent.change(emailInput, {target: {value: "test@gamil.com"}})
      const textareaInput = screen.getByPlaceholderText('Message')
      fireEvent.change(textareaInput, {target: {value: "test text"}})
      fireEvent(
        await screen.findByTestId("button-test-id"),
        new MouseEvent("click", {
          cancelable: true,
          bubbles: true,
        }
       )
      );
      await screen.findByText("En cours");
      await screen.findByText("Envoyer");
      expect(onSuccess).toHaveBeenCalled();
    });
  });
});
