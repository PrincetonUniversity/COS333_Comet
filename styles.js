const React = require('react-native')
const {StyleSheet} = React

var styles = StyleSheet.create({
	screenContainer: {
		flex:9,
		flexDirection: 'column'
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
	    borderColor: 'red',
	    borderWidth: 1
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
	    backgroundColor: '#529ecc'
	  },
	  primaryButtonText: {
	    color: '#FFF',
	    textAlign: 'center',
	    fontSize: 18
	  },
	  image: {
	    width: 100,
	    height: 100
	  }
	})


	module.exports = styles