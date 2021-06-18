const got = require("got");

/**
 * 
 * @param {*} spanishResource 
 * @param {*} restParams 
 * @returns 
 */
module.exports.get = async function get(path) {

    const URL = "https://swapi.py4e.com/api";
    let info = false;
    let searchError = false;
    const matchSlashes = /(^\/)|(\/$)/g;

    try {
        const resourcePath = `${URL}/${path.replace(matchSlashes, "")}`;
        result = await got(resourcePath);
        info = JSON.parse(result.body);
    } catch (error) {
        searchError = error;
    }

    return {
        ok: !searchError
        , error: searchError
        , data: info
    };
}







