# TRANSLATOR SWAPI

Este es un pequeño demo que muestra como traducir los `resources` de la api de starwars `https://swapi.py4e.com/` y hacer un despliegue en AWS lambda usando serverless framework.


## Despliegue en AWS LAMBDA con serverless framework

_Antes de hacer el deploy puedes revisar el archivo `serverless.yml` para hacer los cambios que quieras como nombres o regiones._

- En la carpeta del proyecto ejecuta el comando `serverless deploy`. Debes tener instalado el CLI del serverless framework y las credenciales del AWS.

Si todo funciona correctamente veras en la consola algo como esto:  

```sh
Serverless: Running "serverless" installed locally (in service node_modules)
Serverless: Packaging service...
Serverless: Excluding development dependencies...
Serverless: Excluding development dependencies...
Serverless: Uploading CloudFormation file to S3...
Serverless: Uploading artifacts...
Serverless: Uploading service candidate.zip file to S3 (56.6 KB)...
Serverless: Uploading service npm_got.zip file to S3 (417.35 KB)... 
Serverless: Validating template...
Serverless: Updating Stack...
Serverless: Checking Stack update progress...
..........................................................................................................................................
Serverless: Stack update finished...
Service Information 
service: candidate  
stage: dev
region: us-east-1   
stack: candidate-dev
resources: 44
api keys:
  None
endpoints:
  GET - https://8ec5rufx84.execute-api.us-east-1.amazonaws.com/dev/vehiculos
  GET - https://8ec5rufx84.execute-api.us-east-1.amazonaws.com/dev/vehiculos/{idVehiculo}
  GET - https://8ec5rufx84.execute-api.us-east-1.amazonaws.com/dev/vehiculos
  GET - https://8ec5rufx84.execute-api.us-east-1.amazonaws.com/dev/vehiculos/{idVehiculo}
  GET - https://8ec5rufx84.execute-api.us-east-1.amazonaws.com/dev/peliculas/{idPelicula}
  GET - https://8ec5rufx84.execute-api.us-east-1.amazonaws.com/dev/personajes
  GET - https://8ec5rufx84.execute-api.us-east-1.amazonaws.com/dev/personajes/{idPersonajs}
  GET - https://8ec5rufx84.execute-api.us-east-1.amazonaws.com/dev/planetas
  GET - https://8ec5rufx84.execute-api.us-east-1.amazonaws.com/dev/planetas/{idPlaneta}
  GET - https://8ec5rufx84.execute-api.us-east-1.amazonaws.com/dev/especies
  GET - https://8ec5rufx84.execute-api.us-east-1.amazonaws.com/dev/especies/{idEspecie}
  GET - https://8ec5rufx84.execute-api.us-east-1.amazonaws.com/dev/naves
  GET - https://8ec5rufx84.execute-api.us-east-1.amazonaws.com/dev/naves/{idNave}
  GET - https://8ec5rufx84.execute-api.us-east-1.amazonaws.com/dev/vehiculos
  GET - https://8ec5rufx84.execute-api.us-east-1.amazonaws.com/dev/vehiculos/{idVehiculo}
functions:
  translatorswapi: candidate-dev-translatorswapi
layers:
  npm_got: arn:aws:lambda:us-east-1:714659037129:layer:npm_got:1
```

## Eliminar el proyecto de AWS LAMBDA  

EN la carpeta del proyecto ejecuta `serverless remove`  

## Probando la API

Cuando hagas el deploy puedes usar cualquiera de los endpoints para consumir la API, no tiene CORS asi que se puede probar desde el navegador.

Los endpoint son el equivalente a los endpoints de la API de SWAPI:  

```
/peliculas  --->  /films  
/personajes --->  /people  
/planetas   --->  /planets  
/especies   --->  /species  
/naves      --->  /starship  
/vehiculos  --->  /vehicle  
```

Se puede buscar por el index: `/especies`  
Buscar un recurso en particular: `/especies/6`  
O hacer busquedas por el nombre: `/especies/?buscar=tat`  
Para paginar usa el parametro `pagina`  
O hacer busquedas por el nombre: `/especies/?buscar=tat&pagina=2`  

## Respuesta de la API

La API responde dentro de un wrapper `{ok, error, data}`  

Suponiendo que la URL del proyecto es `https://spo4ff1asc.execute-api.us-east-2.amazonaws.com/default`, se puede buscar un planeta asi:  
`https://spo4ff1asc.execute-api.us-east-2.amazonaws.com/default/default/planetas/4`  

La respuesta, si todo sale bien, sera:  
```json
{
  "ok": true,
  "error": false,
  "data": {
    "nombre": "Hoth",
    "periodo_de_rotacion": "23",
    "periodo_orbital": "549",
    "diametro": "7200",
    "clima": "frozen",
    "gravedad": "1.1 standard",
    "terreno": "tundra, ice caves, mountain ranges",
    "agua_en_la_superficie": "100",
    "poblacion": "unknown",
    "residentes": [],
    "peliculas": [
      "https://swapi.py4e.com/api/films/2/"
    ],
    "creado": "2014-12-10T11:39:13.934000Z",
    "editado": "2014-12-20T20:58:18.423000Z",
    "url": "https://swapi.py4e.com/api/planets/4/"
  }
}
```

---


# Como funciona

El proyecto se compone de varias partes:  

#### `/translator`

Una pequeña libreria que tiene los metodos para traducir los distintos tipos de datos  
```js
const translator = require("./translator");

const payload = {
	"name": "Hoth",
	"rotation_period": "23",
	"orbital_period": "549",
	"diameter": "7200",
	"climate": "frozen",
	"gravity": "1.1 standard",
	"terrain": "tundra, ice caves, mountain ranges",
	"surface_water": "100",
	"population": "unknown",
	"residents": [],
	"films": [
		"https://swapi.py4e.com/api/films/2/"
	],
	"created": "2014-12-10T11:39:13.934000Z",
	"edited": "2014-12-20T20:58:18.423000Z",
	"url": "https://swapi.py4e.com/api/planets/4/"
};
```

```js
translator.translatePayload("es", payload);
```
retorna:
```json
{
  "ok": true,
  "error": false,
  "data": {
    "nombre": "Hoth",
    "periodo_de_rotacion": "23",
    "periodo_orbital": "549",
    "diametro": "7200",
    "clima": "frozen",
    "gravedad": "1.1 standard",
    "terreno": "tundra, ice caves, mountain ranges",
    "agua_en_la_superficie": "100",
    "poblacion": "unknown",
    "residentes": [],
    "peliculas": [
      "https://swapi.py4e.com/api/films/2/"
    ],
    "creado": "2014-12-10T11:39:13.934000Z",
    "editado": "2014-12-20T20:58:18.423000Z",
    "url": "https://swapi.py4e.com/api/planets/4/"
  }
}
```

```js
translator.translatePayloadRE("es", JSON.stringify(payload));
```
Retorna
```json
"{\"ok\":true,\"error\":false,\"data\":{\"nombre\":\"Hoth\",\"periodo_de_rotacion\":\"23\",\"periodo_orbital\":\"549\",\"diametro\":\"7200\",\"clima\":\"frozen\",\"gravedad\":\"1.1 standard\",\"terreno\":\"tundra, ice caves, mountain ranges\",\"agua_en_la_superficie\":\"100\",\"poblacion\":\"unknown\",\"residentes\":[],\"peliculas\":[\"https://swapi.py4e.com/api/films/2/\"],\"creado\":\"2014-12-10T11:39:13.934000Z\",\"editado\":\"2014-12-20T20:58:18.423000Z\",\"url\":\"https://swapi.py4e.com/api/planets/4/\"}}"
```
Fijate que `translatePayloadRE` recibe su segundo argumento como una cadena y devuelve una cadena, `translatePayloadRE` no se usa en el codigo, pero se deja como muestra de otro metodo para traducir los nombres de las propiedades (aunque este metodo no diferencia propiedades de valores y traducira todo lo que encuentre), internamente genera una expresion regular a diferencia de `translatePayload` que opera sobreobjectos y traduce recursivamente en caso de ser necesario (como cuando se hacen busquedas con `?buscar=TEXTO`).  


```js
translator.translateWord("es", "name"); // retorna "nombre"
```
```js
translator.translateWord("en", "search"); // retorna "buscar"
```
```js
translator.translatePath("en","especies", {buscar:"klo"}); // retorna "species/?search=klo"
```

Los archivos de configuracion de este modulo son:

- `en_props_translations.json` tiene las traducciones de español a ingles que se usan en el demo.  
- `es_props_translations.json`  tiene las traducciones de ingles a español que se usan en el demo.

Cada uno de estos archivos contiene un objecto con las claves como las palabras que se va a traducir y el valor como la traduccion.  

`en_props_translations.json`(para traducir del español al ingles)    
```json
{
    "peliculas":"films" ,
    "personajes":"people" ,
    "planetas":"planets" ,
    "especies":"species" ,
    "naves":"starships",
    "vehiculos":"vehicles",
    "buscar":"search",
    "pagina":"page"
}
```

Es un modulo muy simple que hice solo para este demo y esta pensado para traducir las diferentes partes de los recursos. 

Como dato de color, `./translator` se comporta como un `noOP` cuando no tiene la traduccion de una palabra (es decir que devuelve lo que recibe como si no hiciera nada). Esto permite escribir codigo que no debe manejar casos especiales para palabras que no se encentran porque no se considera un error no tener la traduccion.  

#### `swapi.js` 

Un wrapper alrededor de got para hacer las consultas a la api de SWAPI.  
Tiene un solo metodo: `get` que recibe el path del recurso que quieres buscar y devuelve o rechaza una promesa.  
```js
const swapi = require('./swapi');

(async function(){
    try{
        const info = await swapi.get("especies/6")
        console.log(info);
    }catch(error){
        console.log(error);
    }
}());
```

Retorna
```json
{
    "ok":true,
    "error": false,
    "data": {
        "name": "Yoda's species",
        "classification": "mammal",
        "designation": "sentient",
        "average_height": "66",
        "skin_colors": "green, yellow",
        "hair_colors": "brown, white",
        "eye_colors": "brown, green, yellow",
        "average_lifespan": "900",
        "homeworld": "https://swapi.py4e.com/api/planets/28/",
        "language": "Galactic basic",
        "people": [
            "https://swapi.py4e.com/api/people/20/"
        ],
        "films": [
            "https://swapi.py4e.com/api/films/2/",
            "https://swapi.py4e.com/api/films/3/",
            "https://swapi.py4e.com/api/films/4/",
            "https://swapi.py4e.com/api/films/5/",
            "https://swapi.py4e.com/api/films/6/"
        ],
        "created": "2014-12-15T12:27:22.877000Z",
        "edited": "2014-12-20T21:36:42.148000Z",
        "url": "https://swapi.py4e.com/api/species/6/"
    }
}
```

Fijate que el resultado de la busqueda esta envuelto en `{ok, error, data}`  
Esto permite saber rapidametne si hubo un error(`ok == false`), si todo salio bien, pero no hay data (`ok == true data: {}`) y cosas por el estilo.  


### `translate_swapi.js`

Aqui es donde realmente sucede todo, `translate_swapi.js` se apoya de `./translator` y `./swapi.js` para realizar el trabajo del demo.

Este archivo reune la logica de negocio de alto nivel y cominucar al lambda (`index.js`) con los otros 2 modulos.

Se encarga de:
- Obtener la  PATH es español
- Pasarle el PATH a `./translator` para que lo traduzca al ingles
- Pasarle a PATH traducido a `swapi` para que busque en SWAPI
- Pasarle la info obtenida en el punto anterior a `./translator` para que traduzca las propiedades del ingles al español
- Devolver la info traducida

`translate_swapi.js` es quien realmente hace la magia, fijate que en ningun momento se valida el endpoint, de hecho internamente no hay ningun endpoint de la API de SWAPI de definido, porque se considera al endpoint como una abstraccion y simplemente se traducen las palabras que estan en el PATH para luego pasarselo a `swapi` para que intente buscar en la API. Esto significa que internamente no se necesitan definir las rutas de los recursos de la API (`/especies`, `/personajes`, ...) con una sola ruta como `/{proxy+}` seria suficiente, pero se hace solo como una tarea academica (la demo pedia al menos 2 endpoint) y que ver los nombres de las rutas ayuda a recordar cuales son los recursos que se pueden buscar. 

### `index.js`

Este archivo es simplemente el entrypoint de la funcion AWS LAMBDA, sus funciones son pasar el path y el query a `translate_swapi` y devovler el resultado a quien invoca la funcion.  

### `nodejs.zip`

Aqui estan las dependencias del proyecto (solo esta GOT y sus respectivas dependencia), se usa para crear el AWS LAYER de la funcion LAMBDA.

---

# Probar en local

Puedes hacer `npm i` para instalar got localmente y hacer pruebas, como el demo esta desacoplado de AWS LAMBDA (no esta amarrado a esta infraestructura), puede probar haciendo `require('translate_swapi')` y pasandole 2 argumentos: El PATH del recurso y un objeto con los parametros del query.

```js
const translate_swapi = require('translate_swapi');

(async ()=>{
  try{
    const result = await translate_swapi('personajes', {buscar: "Luck"});
    console.log(result);
  }catch(error){
    console.log(error);
  }
}());

```