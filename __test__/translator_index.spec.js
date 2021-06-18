const { TestWatcher } = require("jest");
const translator = require("../translator");

describe("traduce palabras del español al ingles", () => {

    test("buscar -> search", () => {
        expect(translator.translateWord("en", "buscar")).toBe("search");
    });

    test("peliculas -> films", () => {
        expect(translator.translateWord("en", "buscar")).toBe("search");
    });

    test("personajes -> people", () => {
        expect(translator.translateWord("en", "buscar")).toBe("search");
    });
});

describe("no traduce palabras desconocidas", () => {

    test("buscare -> buscare", () => {
        expect(translator.translateWord("en", "buscare")).toBe("buscare");
    });

    test("camino -> camino", () => {
        expect(translator.translateWord("en", "camino")).toBe("camino");
    });

});

describe("traduce URL del español al ingles ", () => {

    test("/planetas -> /planets", () => {
        expect(translator.translatePath("en", "planetas", null)).toBe("planets");
    });

    test("/peliculas -> /films", () => {
        expect(translator.translatePath("en", "peliculas", null)).toBe("films");
    });

    test("/personajes -> /people", () => {
        expect(translator.translatePath("en", "personajes", null)).toBe("people");
    });

    test("/planetas/5 -> /planets/5", () => {
        expect(translator.translatePath("en", "planetas/5", null)).toBe("planets/5");
    });

    test("/planetas/?buscar=tato -> /planets/5?search=tato", () => {
        expect(translator.translatePath("en", "planetas/", { buscar: "tato" })).toBe("planets?search=tato");
    });

    test("/planetas/?buscar=tato -> /planets/5?search=tato", () => {
        expect(translator.translatePath("en", "planetas/", { buscar: "tato" })).toBe("planets?search=tato");
    });
});

describe("traduce las propiedades del payload del español al ingles ", () => {
    const payload = { name: 'Yoda', gender: 'Male', mass: '34' };
    test("{name:'Yoda', gender:'Male', mass:'34'} -> {nombre:'Yoda', genero:'Male', masa:'34'}", () => {
        expect(translator.translatePayload("es", payload)).toEqual({ nombre: 'Yoda', genero: 'Male', masa: '34' });
    });

    test("STRING{name:'Yoda', gender:'Male', mass:'34'} -> STRING{nombre:'Yoda', genero:'Male', masa:'34'}", () => {
        expect(translator.translatePayloadRE("es", JSON.stringify(payload))).toBe("{\"nombre\":\"Yoda\",\"genero\":\"Male\",\"masa\":\"34\"}");
    });

});