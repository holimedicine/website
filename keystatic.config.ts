import { config } from '@keystatic/core';
import { collections, navigation, singletons } from './src/keystatic';

export default config({
  storage: {
    kind: 'github',
    repo: 'holimedicine/website',
  },
  ui: {
    brand: { name: 'Holimedicine' },
    navigation,
  },
  singletons,
  collections,
});
