const translations = {
    "es": require("./es_props_translations.json"),
    "en": require("./en_props_translations.json")
};
/**
 * @param {string} lang idioma al que se va a traducir, debe estar configurado para que se pueda usar.
 * @param {string} word Palabra que se quiere traducir.
 * @returns {string} La traduccion de la palabra, si no hay traduccion para la palabra devuelve la palabra sin cambios
 */
function translateWord(lang, word) {
    if (!translations[lang]) { throw new Error(`no se ha configurado la traduccion para ${lang}`); }
    return translations[lang][word] || word;
}

/**
 * Traduce el payload, el payload esperado puede ser:
 * - Un objeto, entonces traducira las propiedades del objeto.
 * - Un array de objetos, entonces recorrera cada objeto y traducira sus propiedades recursivamente.  
 * Si no se tiene la traduccion de alguna propiedad entonces de dejara sin cambios
 * @param {Object<string, string|Array<Object>>} payload 
 * @returns {Object<string, any>|Array<Object<string, any>>}
 */
function translatePayload(lang, payload) {

    if (!translations[lang]) { throw new Error(`no se ha configurado la traduccion para ${lang}`); }

    /**
     * @type {Object<string, any>|Array<Object<string, any>>}
     */
    let translatedPayload = {};
    for (const [property, value] of Object.entries(payload)) {
        let propertyValue;
        if (property == "results" && Array.isArray(value)) {
            propertyValue = value.map(p => translatePayload(lang, p));
        } else {
            propertyValue = value;
        }
        const translatedPropertyName = translateWord(lang, property);
        translatedPayload[translatedPropertyName] = propertyValue;
    }

    return translatedPayload;
}

//FIXME: Decidir si quitar o quedarse con esta funcion porque no se usa.
/**
 * Intenta traducir todas las palabras en `payloadString`, si no encuentra la traduccion deja la palabra original.
 * @param {string} payloadString 
 * @returns {string}
 */
function translatePayloadRE(lang, payloadString) {
    /*
    La funcion busca en la cadena las palabras de la lista, la busqueda se hace con una expresion regular uniendo todas las palabras de las que se tiene traduccion
    La expresion regular se crea en 2 partes, primero la parte de las URLs y despues la parte de las propiedades de los modelos.
    por ejemplo:
    
    genera (https://swapi.py4e.com/api/starships/)|(https://swapi.py4e.com/api/vehicles/)

    translations = {
        "name": "nombre",
        "mass": "masa",
        "https://swapi.py4e.com/api/starships/": "https://mi-api/naves/",
        "https://swapi.py4e.com/api/vehicles/": "https://mi-api/vehiculos/"
    }
    genera (name)|(masa)
    /(https://swapi.py4e.com/api/starships/)|(https://swapi.py4e.com/api/vehicles/)|(name)|(masa)/g

    Despues se usa la fucion STRING.replace para reemplazar cada coincidencia con su respectiva traduccion
     */

    if (!translations[lang]) { throw new Error(`no se ha configurado la traduccion para ${lang}`); }

    const partTranslations = Object.keys(translations[lang]).map(s => `(${s})`).join('|');
    var re = new RegExp(partTranslations, 'g');

    const translatedPayloadString = payloadString.replace(re, (strMatched) => {
        return translateWord(lang, strMatched);
    })

    return translatedPayloadString;

}

/**
 * 
 * @param {*} lang 
 * @param {*} path 
 * @param {*} query 
 * @return
 */
function translatePath(lang, path, queryObject = null) {

    if (!translations[lang]) { throw new Error(`no se ha configurado la traduccion para ${lang}`); }

    let translatedPath = path.replace(/\/$/, "").split("/").map(str => translateWord(lang, str)).join("/");
    let translatedQuery = "";
    let translatedFinal = translatedPath;
    let queryParams;

    if (queryObject) {

        queryParams = new URLSearchParams(queryObject);
        let translatedQueryParams = [];

        for (const [key, value] of queryParams.entries()) {
            const translatedKey = translateWord(lang, key);
            translatedQueryParams.push(`${translatedKey}=${value}`);
        }
        translatedFinal += '?' + translatedQueryParams.join("&");
    }

    return translatedFinal;
}

module.exports.translatePayload = translatePayload;
module.exports.translatePayloadRE = translatePayloadRE;
module.exports.translateWord = translateWord;
module.exports.translatePath = translatePath;
