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
    expect(peopleCards.length).toBe(6)
    const expectedPeople = [
      { name: "Samira", position: "CEO", imageAlt: "Samira", imageSrc: "/images/stephanie-liverani-Zz5LQe-VSMY-unsplash.png" },
      { name: "Jean-baptiste", position: "Directeur marketing", imageAlt: "Jean-baptiste", imageSrc: "/images/linkedin-sales-solutions-pAtA8xe_iVM-unsplash.png" },
      { name: "Alice", position: "CXO", imageAlt: "Alice", imageSrc: "/images/christina-wocintechchat-com-SJvDxw0azqw-unsplash.png" },
      { name: "Luís", position: "Animateur", imageAlt: "Luís", imageSrc: "/images/jonas-kakaroto-KIPqvvTOC1s-unsplash.png" },
      { name: "Christine", position: "VP animation", imageAlt: "Christine", imageSrc: "/images/amy-hirschi-b3AYk8HKCl0-unsplash1.png" },
      { name: "Isabelle", position: "VP communication", imageAlt: "Isabelle", imageSrc: "/images/christina-wocintechchat-com-0Zx1bDv5BNY-unsplash.png" },
    ];

    peopleCards.forEach((card, index) => {
      const { name, position, imageAlt, imageSrc } = expectedPeople[index]
      expect(screen.getByText(name)).toBeInTheDocument()
      expect(screen.getByText(position)).toBeInTheDocument()
      const image = card.querySelector("img")
      expect(image).toBeInTheDocument()
      expect(image).toHaveAttribute("src", imageSrc)
      expect(image).toHaveAttribute("alt", imageAlt)
    })
  })

  it("a footer is displayed", async () => {
    render(
      <DataProvider>
        <Home />
      </DataProvider>
    );

    await screen.findByText("Notre derniére prestation")
    await screen.findByText("Contactez-nous")
    await screen.findByText("45 avenue de la République, 75000 Paris")
    await screen.findByText("01 23 45 67 89")
    await screen.findByText("contact@724events.com")
    await screen.findByTestId("footer-desc")
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
