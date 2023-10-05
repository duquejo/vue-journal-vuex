import axios from 'axios';

const authApi = axios.create({
  baseURL: 'https://abc.xyz',
  params: {
    key: 'abc123',
  }
});

export default authApi;
