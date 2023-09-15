import axios from 'axios';

const journalApi = axios.create({
  baseURL: 'https://vue-demos-aedb2-default-rtdb.firebaseio.com',
});

export default journalApi;