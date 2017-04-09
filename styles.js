const React = require('react-native')
const {StyleSheet} = React

var styles = StyleSheet.create({
	container: {
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
})


module.exports = styles