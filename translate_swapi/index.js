const translate_swapi = require("./translate_swapi");

exports.translator = async (event) => {
/*
 * `handler` solo es el entrypoint, quien agrupa la logica de negocio es `translate_swapi`
 * El trabgajo de handler es servir como adapter para que translate_swapi pueda recibir los parametros como los necesita
 * Asi separamos el entorno de la logica y translate_swapi no depende de ningun entorno en particular, esto hace mas facil hacer pruebas por separado 
 * de la logica de negocio (mockery o unitarias) o migrar a otro entorno.
 */
 
    let response = {
        statusCode: 200,
        body: '',
    };

    try {

        // - Conseguir el path y el query
        const path = event.path;
        const queryStringParameters = event.queryStringParameters;

        // - Buscar y traducir
        const translatedPayload = await translate_swapi(path, queryStringParameters);

        // - Prepara para devolver la info
        response.body = JSON.stringify(translatedPayload);

    } catch (error) {
        response = {
            statusCode: 503,
            body: "Error interno :(",
        }
    }

    return response;
};
