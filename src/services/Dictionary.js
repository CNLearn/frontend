import axios from "axios";

const fastApiClient = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: false,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  }
});

export default {
  getWord(simplified) {
    return fastApiClient.get(`/words/simplified/${simplified}`);
  },
  getCharacter(character) {
    return fastApiClient.get(`/characters/simplified/${character}`);
  }
};
