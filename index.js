/** @format */
import 'babel-polyfill';

import {AppRegistry} from 'react-native';
import globals from "./globals";
import App from './App';
import {name as appName} from './app.json';
import 'core-js/es6/symbol';

import 'core-js/fn/symbol/iterator';

import "core-js/es6/set";
import "core-js/es6/weak-set";

var WeakSet = require('weakset');


AppRegistry.registerComponent(appName, () => App);
