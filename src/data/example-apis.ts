import { ApiRequest } from '../types';

export interface ApiCategory {
  name: string;
  description: string;
  apis: ApiRequest[];
}

export const exampleApis: ApiCategory[] = [
  {
    name: 'Weather & Location',
    description: 'Real-world weather and geolocation APIs',
    apis: [
      {
        id: 'openweather',
        name: 'OpenWeather Current',
        method: 'GET',
        url: 'https://api.openweathermap.org/data/2.5/weather',
        description: 'Get current weather data for a location',
        params: [
          {
            id: 'q',
            key: 'q',
            value: 'London',
            enabled: true,
          },
          {
            id: 'units',
            key: 'units',
            value: 'metric',
            enabled: true,
          },
          {
            id: 'appid',
            key: 'appid',
            value: 'demo',
            enabled: true,
          },
        ],
        headers: [],
        body: '',
      },
      {
        id: 'ipapi',
        name: 'IP Geolocation',
        method: 'GET',
        url: 'https://ipapi.co/json/',
        description: 'Get location data from IP address',
        params: [],
        headers: [],
        body: '',
      }
    ],
  },
  {
    name: 'Data Management',
    description: 'Test different HTTP methods with JSONPlaceholder',
    apis: [
      {
        id: 'create-post',
        name: 'Create Post',
        method: 'POST',
        url: 'https://jsonplaceholder.typicode.com/posts',
        description: 'Create a new post entry',
        params: [],
        headers: [
          {
            id: 'content-type',
            key: 'Content-Type',
            value: 'application/json',
            enabled: true,
          },
        ],
        body: JSON.stringify({
          title: 'New Post',
          body: 'This is a test post',
          userId: 1,
        }, null, 2),
      },
      {
        id: 'update-post',
        name: 'Update Post',
        method: 'PUT',
        url: 'https://jsonplaceholder.typicode.com/posts/1',
        description: 'Update an existing post',
        params: [],
        headers: [
          {
            id: 'content-type',
            key: 'Content-Type',
            value: 'application/json',
            enabled: true,
          },
        ],
        body: JSON.stringify({
          id: 1,
          title: 'Updated Post',
          body: 'This post has been updated',
          userId: 1,
        }, null, 2),
      }
    ],
  },
  {
    name: 'Financial Data',
    description: 'APIs for financial and market data',
    apis: [
      {
        id: 'exchange-rates',
        name: 'Exchange Rates',
        method: 'GET',
        url: 'https://api.exchangerate-api.com/v4/latest/USD',
        description: 'Get latest currency exchange rates',
        params: [],
        headers: [],
        body: '',
      },
      {
        id: 'crypto-prices',
        name: 'Cryptocurrency Prices',
        method: 'GET',
        url: 'https://api.coingecko.com/api/v3/simple/price',
        description: 'Get cryptocurrency prices',
        params: [
          {
            id: 'ids',
            key: 'ids',
            value: 'bitcoin,ethereum',
            enabled: true,
          },
          {
            id: 'vs_currencies',
            key: 'vs_currencies',
            value: 'usd',
            enabled: true,
          }
        ],
        headers: [],
        body: '',
      }
    ],
  }
];