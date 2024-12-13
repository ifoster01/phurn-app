import axios from 'axios';
import { API_CONFIG } from './config';

export const apiClient = axios.create(API_CONFIG);