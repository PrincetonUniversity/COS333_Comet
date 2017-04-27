const React = require('react-native')
const {StyleSheet} = React

var styles = StyleSheet.create({
	screenContainer: {
		flex:10,
		flexDirection: 'column',
		backgroundColor: 'white',
	},
	navContainer:{
		flex:1,
		flexDirection: 'column'
	},
	navbar: {
		flex:1,
		alignItems: 'center',
		backgroundColor: '#c6d6ef',
		borderColor: 'transparent',
		borderWidth: 1,
		justifyContent: 'space-around',
		flexDirection: 'row'
	},
	titleBar: {
		flexDirection: 'row',
		backgroundColor: '#eaecef',
		borderColor: 'gray',
		borderBottomWidth: .5,
		height: 55,
		alignItems: 'center',
		justifyContent: 'center',
	},
	titleBarText: {
		fontSize: 15,
		fontWeight: 'bold',
		color: 'black',
		alignItems: 'center',
	},
	xButton: {
	    fontSize: 30,
	    fontWeight:'bold',
	    color: 'black'
  	},

  	// Formatting a Card
  	cardBackground: {
  		flex:1,
  		backgroundColor: 'rgba(0,0,0,0.3)',
  	},
  	cardBody: {
	    flex:1,
	    backgroundColor: 'white',
	    borderColor: '#eaecef',
	    borderWidth: 1,
	    paddingTop: 10,
	    padding: 25,
	    margin: 25,
	},





	/***********/
	container: {
	    flex: 1,
			backgroundColor:'#eff3f9'
	},
 	toolbar: {
	   	height: 56,
	    backgroundColor: '#e9eaed',
	},
	textInput: {
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 1,
    height: 50,
    alignItems: 'center',
    justifyContent: 'space-around',
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
			width: 100,
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
