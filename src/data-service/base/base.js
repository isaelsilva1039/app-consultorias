
import axios from 'axios';
import { API_URL } from '../../constants/base';

export const connectApi = axios.create({
  baseURL: API_URL,
});