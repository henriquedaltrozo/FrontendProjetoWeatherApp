import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

class UserService {
  async register(data) {
    return axios.post('http://10.0.2.2:3000/user/register', data, {
      timeout: 5000,
      headers: {Accept: 'application/json'},
    });
  }

  async login(data) {
    return axios
      .post('http://10.0.2.2:3000/user/login', data, {
        timeout: 5000,
        headers: {Accept: 'application/json'},
      })
      .then(response => {
        AsyncStorage.setItem('TOKEN', response.data.access_token);
        return response;
      });
  }

  async loginComToken() {
    const token = await AsyncStorage.getItem('TOKEN');
    if (!token) {
      throw new Error('Token não encontrado no armazenamento.');
    }

    return axios
      .post(
        'http://10.0.2.2:3000/user/login-token',
        {token},
        {
          timeout: 5000,
          headers: {Accept: 'application/json'},
        },
      )
      .then(response => {
        if (response.data.access_token) {
          AsyncStorage.setItem('TOKEN', response.data.access_token);
          return response;
        } else {
          return Promise.reject(response);
        }
      });
  }

  async update(data) {
    const token = await AsyncStorage.getItem('TOKEN');
    return axios.put('http://10.0.2.2:3000/user/update', data, {
      timeout: 5000,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getData() {
    const token = await AsyncStorage.getItem('TOKEN');
    if (!token) {
      throw new Error('Token não encontrado no armazenamento.');
    }

    return axios.get('http://10.0.2.2:3000/user/data', {
      timeout: 5000,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

const userService = new UserService();
export default userService;
