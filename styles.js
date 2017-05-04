const React = require('react-native')
const {StyleSheet} = React

var styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor:'#eaecef'
	},
	screenContainer: {
		flex:10,
		flexDirection: 'column',
		backgroundColor: '#eaecef',
	},
	navContainer:{
		flex:1,
		flexDirection: 'column'
	},
	navbar: {
		flex:1,
		alignItems: 'center',
		backgroundColor: '#483D8B',
		borderColor: 'transparent',
		borderWidth: 1,
		justifyContent: 'space-around',
		flexDirection: 'row'
	},
	titleBar: {
		flexDirection: 'row',
		backgroundColor: '#483D8B',
		height: 65,
		alignItems: 'center',
		justifyContent: 'center',
	},
	titleBarText: {
		fontSize: 15,
		fontWeight: 'bold',
		color: 'white',
		alignItems: 'center',
	},
	primaryButton: {
		padding: 15,
		marginTop: 40,
		backgroundColor: '#1C86EE',
		alignItems: 'center',
		justifyContent: 'center',
	},
	primaryButtonText: {
		color: 'white',
		textAlign: 'center',
		fontSize: 16
	},
	xButton: {
    fontSize: 30,
    fontWeight:'bold',
    color: 'black'
	},
 	toolbar: {
	   	height: 56,
	    backgroundColor: '#e9eaed',
	},
	textInput: {
    backgroundColor: 'rgba(255,255,255,0.2)',
		fontSize: 16,
		color: 'rgba(255,255,255,0.7)',
		paddingHorizontal: 10,
    height: 40,
    alignItems: 'center',
    justifyContent: 'space-around',
		marginBottom: 20,
	},
	image: {
		width: 100,
		height: 100,
	},
})


	module.exports = styles
