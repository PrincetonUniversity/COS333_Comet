import * as firebase from 'firebase';
import React, {Component} from 'react';

const firebaseConfig = {
	apiKey: "AIzaSyBJlIj1OFylWYL1mfULHG3oA0sNkHCs-Tc",
	authDomain: "comet-943bb.firebaseapp.com",
	databaseURL: "https://comet-943bb.firebaseio.com",
	storageBucket: "comet-943bb.appspot.com",
};

const Firebase = firebase.initializeApp(firebaseConfig);

module.exports = Firebase;
