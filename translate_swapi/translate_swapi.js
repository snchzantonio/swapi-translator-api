const translator = require("./translator");
const swapi = require("./swapi");

module.exports = async (path, queryStringParameters) => {

    /*
    Esta funcion se apoya de ./translator y ./swapi
    ./translator es un paquete helper creado para este demo que tiene metodos para traducir unos pocos tipos de data que vamos a usar (paths url, payload de swapi y palabras).
    ./swapi busca en la api de swapi usando el path y el query, es solo un wrapper creado por comodidad
    */
    let response = {
        ok: true
        , error: false
        , data: false
    };

    try {
        // - Traducir la URL
        const swapiPath = translator.translatePath("en", path, queryStringParameters);

        // - Obtener la info
        const swapiPayload = await swapi.get(swapiPath);

        // - Traducir la info
        const translatedPayload = translator.translatePayload("es", swapiPayload.data);

        // - Preparar para devolver la info
        response.data = translatedPayload;

    } catch (error) {
        response.ok = false
        response.error = error;
    }


    return response;
};
