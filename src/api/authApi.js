import axios from 'axios';

const authApi = axios.create({
  baseURL: 'https://identitytoolkit.googleapis.com/v1/accounts',
  params: {
    key: 'AIzaSyBjXMS3PTsgJWGMgY7rwNJjo3JGvvW_ASk',
  }
});

export default authApi;