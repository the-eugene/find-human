const fetch = require('node-fetch');

const key = process.env.DOG_API_KEY;
const url = `${process.env.DOG_API_URL}`;


const getAllBreeds = async () =>
  (await (
  await fetch(`${url}/breeds?attach_breed=0`, {
    method: "GET",
    headers: {
      "x-api-key": key
    },
  })
).json());


// returns a list of all breed names
exports.getDogBreeds = async () =>
  (await getAllBreeds()).map(breed => breed.name);


// gets a list of strings for dog temperaments
exports.getDogTemperaments = async () =>
  [...new Set([].concat(
    ...(await getAllBreeds())
      .map(breed => breed.temperament && breed.temperament.split(',')) // map from all info to just temperaments
      .filter(temperament => !!temperament) // get rid of empty temperaments
  ))].sort();


// fetch a dog by breed name
exports.getDogByBreed = async (breed) => {
  if (!breed) {
    return;
  }

  const foundBreed = await (await (
    await fetch(`${url}/breeds/search?q=${breed}`, {
      method: "GET",
      headers: {
        "x-api-key": key
      }
    })
  ).json());

  if (foundBreed && foundBreed[0]) {
    // there should only ever be one breed returned
    return foundBreed[0];
  }

  // breed not found
  return  {};
}


exports.getBreedImageByImageId = async (id) => {
  if (!id) return;

  const dogInfo = await (
    await fetch(`${url}/images/${id}`, {
      method: "GET",
      headers: {
        "x-api-key": key
      },
    })
  ).json();

  if (dogInfo.url) return dogInfo.url;

  return "";
}