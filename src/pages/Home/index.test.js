import { fireEvent, getByTestId, render, screen, waitFor } from "@testing-library/react";
import Home from "./index";
import { api, DataProvider } from "../../contexts/DataContext";

const data = {
  events: [
    {
      id: 1,
      type: "soirée entreprise",
      date: "2022-04-29T20:28:45.744Z",
      title: "Conférence #productCON",
      cover: "/images/stem-list-EVgsAbL51Rk-unsplash.png",
      description:
        "Présentation des outils analytics aux professionnels du secteur",
      nb_guesses: 1300,
      periode: "24-25-26 Février",
      prestations: [
        "1 espace d’exposition",
        "1 scéne principale",
        "2 espaces de restaurations",
        "1 site web dédié",
      ],
    },

    {
      id: 2,
      type: "forum",
      date: "2022-04-29T20:28:45.744Z",
      title: "Forum #productCON",
      cover: "/images/stem-list-EVgsAbL51Rk-unsplash.png",
      description:
        "Présentation des outils analytics aux professionnels du secteur",
      nb_guesses: 1300,
      periode: "24-25-26 Février",
      prestations: ["1 espace d’exposition", "1 scéne principale"],
    },
  ],
};

describe("When Form is created", () => {
  it("a list of fields card is displayed", async () => {
    render(<Home />);
    await screen.findByText("Email");
    await screen.findByText("Nom");
    await screen.findByText("Prénom");
    await screen.findByText("Personel / Entreprise");
  });

  describe("and a click is triggered on the submit button", () => {
    it("the success message is displayed", async () => {
      render(<Home />);
      const nameInput = screen.getByPlaceholderText('Nom')
      fireEvent.change(nameInput, { target: { value: "test" } })
      const prenomInput = screen.getByPlaceholderText('Prénom')
      fireEvent.change(prenomInput, { target: { value: "jean" } })
      const emailInput = screen.getByPlaceholderText('Email')
      fireEvent.change(emailInput, { target: { value: "test@gamil.com" } })
      const textareaInput = screen.getByPlaceholderText('Message')
      fireEvent.change(textareaInput, { target: { value: "test text" } })
      fireEvent(
        await screen.findByText("Envoyer"),
        new MouseEvent("click", {
          cancelable: true,
          bubbles: true,
        })
      );
      await screen.findByText("En cours");

      await screen.findByText("Message envoyé !");
    });
  });
});

describe("When a page is created", () => {
  beforeEach(() => {
    // API 호출을 모킹합니다.
    jest.spyOn(api, "loadData").mockReturnValue(Promise.resolve(data));

  });
  it("a list of events is displayed", async () => {
    render(
      <DataProvider>
        <Home />
      </DataProvider>
    );
    const eventLists = await screen.findByTestId('event-lists');
    const eventCards = await screen.findAllByTestId('event-card')
    screen.getByTestId('event-title');
    expect(eventLists).toBeInTheDocument()
    expect(eventCards.length).toBe(data.events.length)
    data.events.forEach((event, index) => {
      expect(screen.getByText(event.title)).toBeInTheDocument()
      expect(screen.getByText(event.type)).toBeInTheDocument()
      const image = screen.getByAltText(event.title)
      expect(image).toBeInTheDocument()
      expect(image).toHaveAttribute("src", data.events[index].cover)
    })
  })

  it("a list a people is displayed", async () => {
    render(
      <DataProvider>
        <Home />
      </DataProvider>
    );
    const peopleLists = await screen.findByTestId('people-list');
    expect(peopleLists).toBeInTheDocument()
    const peopleCards = screen.getAllByTestId("people-card")
    expect(peopleCards.length).toBeGreaterThan(0)
    peopleCards.forEach((card, index) => {
      const name = card.querySelector(".PeopleCard__name")
      expect(name).toBeInTheDocument()
      const position = card.querySelector(".PeopleCard__position")
      expect(position).toBeInTheDocument()
      const image = card.querySelector("img")
      expect(image).toBeInTheDocument()
      expect(image).toHaveAttribute("src")
      expect(image).toHaveAttribute("alt")
    })
  })

  it("a footer is displayed", async () => {
    render(
      <DataProvider>
        <Home />
      </DataProvider>
    );
    const Links = await screen.findAllByTestId ('link')
    Links.forEach((link) => { 
      expect(link).toHaveAttribute ('href')
    })
    const logo = await screen.findByTestId('logo-svg')
    expect(logo).toBeInTheDocument()
    expect(logo).toHaveAttribute('xmlns', 'http://www.w3.org/2000/svg')
  })

  it("an event card, with the last event, is displayed", async () => {
    render(
      <DataProvider>
        <Home />
      </DataProvider>
    );
    const eventCardsList = await screen.findAllByTestId('event-card')
    const lastEvent = eventCardsList.reduce((a, b) => (
      new Date(b.date) > new Date(a.date) ? b : a
    ))
    expect(lastEvent).toBeInTheDocument()
    const lastEventImage = lastEvent.querySelector("img")
    expect(lastEventImage).toBeInTheDocument()
    expect(lastEventImage).toHaveAttribute("src")
    expect(lastEvent.querySelector(".EventCard__title")).toBeInTheDocument()
    expect(lastEvent.querySelector(".EventCard__month")).toBeInTheDocument()
  })
});