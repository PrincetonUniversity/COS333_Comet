import * as firebase from 'firebase';
import React, {Component} from 'react';

const firebaseConfig = {
	apiKey: "AIzaSyAli8NAL2znj8XMlFtWR83E0NG41KFWnUY",
	authDomain: "comet-e4c47.firebaseapp.com",
	databaseURL: "https://comet-e4c47.firebaseio.com",
	storageBucket: "comet-e4c47.appspot.com",
};

const Firebase = firebase.initializeApp(firebaseConfig);

module.exports = Firebase;