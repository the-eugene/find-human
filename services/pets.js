const fetch = require('node-fetch');
const _ = require('lodash');
const config = require('../config')

const key = config.dogApiKey;
const url = `${config.dogApiUrl}`;

class BreedsApi {
  constructor() {
    this.breeds = [];
    this.breedTemperaments = [];

  }

  getAllBreeds = async () => {
    if (this.breeds.length > 0) {
      return this.breeds;
    }

    this.breeds = (await (
      await fetch(`${url}/breeds?attach_breed=0`, {
        method: "GET",
        headers: {
          "x-api-key": key
        },
      })
    ).json());

    //console.log(this.breeds);
    return this.breeds;
  };

  getDogBreeds = async () => (await this.getAllBreeds()).map(breed => breed.name);

  // gets a list of strings for dog temperaments
  getDogTemperaments = async () => {
    if (this.breedTemperaments > 0) {
      return this.breedTemperaments;
    }

    let list = _.uniq((await this.getAllBreeds())
      .map(breed => breed.temperament && breed.temperament.split(',')) // map from all info to just temperaments
      .filter(temperament => !!temperament) // get rid of empty temperaments
    ).sort();


    list.forEach(x => this.breedTemperaments.push(...x));
    this.breedTemperaments = _.uniq(this.breedTemperaments).sort();
    return this.breedTemperaments;
  }
}

exports.BreedsApi = new BreedsApi();


exports.getBreedsByTemperament = async (temperament) => {
  if (!temperament) {
    return [];
  }

  const breeds = await (await (
    await fetch(`${url}/breeds`, {
      method: "GET",
      headers: {
        "x-api-key": key
      }
    })
  ).json());

  if (breeds && breeds.length) {
    // there should only ever be one breed returned
    return breeds
      .filter(breed =>
        breed &&
        breed.temperament &&
        breed.temperament.toLowerCase()
          .includes(temperament.toLowerCase()))
      .map(breed => breed.name);
  }

  return [];
}

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
  return {};
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