const React = require('react-native')
const {StyleSheet} = React

var styles = StyleSheet.create({
	screenContainer: {
		flex:9,
		flexDirection: 'column',
	},
	navContainer:{
		flex:1,
		flexDirection: 'column'
	},
	navbar: {
		flex:1,
		alignItems: 'center',
		backgroundColor: 'powderblue',
		borderColor: 'transparent',
		borderWidth: 1,
		justifyContent: 'space-around',
		flexDirection: 'row'
	},
	eventContainer: {
		flex:1,
		flexDirection: 'row',
		backgroundColor: 'white',
		borderColor: '#d7dbe2',
		borderWidth: 1,
		height: 50,
		alignItems: 'center',
		justifyContent: 'space-around',
	},
	eventText: {
		fontSize: 15,
		alignItems: 'center', 
	},
	titleBar: {
		flexDirection: 'row',
		backgroundColor: '#373451',
		height: 40,
		alignItems: 'center',
		justifyContent: 'space-around',
	},
	titleBarText: {
		fontSize: 15,
		color: 'white',
		alignItems: 'center', 
	},
	eventCard: {
		flex:1,
		backgroundColor: 'white',
		borderColor: 'black',
		borderWidth: 1,
		borderRadius: 10,
		padding: 35,
		margin: 35,
	},
	mapPlaceHolder: {
		alignItems: 'center',
		backgroundColor: 'lightgreen',
		height: 100,
		width: 100,
	},
	/***********/
	container: {
	    alignItems: 'stretch',
	    flex: 1
	},
	body: {
	    flex: 9,
	    flexDirection:'row',
	    alignItems:'center',
	    justifyContent:'center',
	    backgroundColor: '#F5FCFF',
	},
 	toolbar: {
	   	height: 56,
	    backgroundColor: '#e9eaed',
	},
	textInput: {
	    height: 40,
	    width: 200,
	    borderColor: 'black',
	    borderWidth: .5
	},
	 transparentButton: {
	    marginTop: 10,
	    padding: 15
	  },
	  transparentButtonText: {
	    color: '#0485A9',
	    textAlign: 'center',
	    fontSize: 16
	  },
	  primaryButton: {
	    margin: 10,
	    padding: 15,
	    backgroundColor: '#d7dbe2',
	  },
	  primaryButtonText: {
	    color: 'black',
	    textAlign: 'center',
	    fontSize: 15
	  },
	  image: {
	    width: 100,
	    height: 100
	  },
	 /***/
})


	module.exports = styles