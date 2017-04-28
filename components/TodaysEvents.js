import React, {Component} from 'react';
import Firebase from './Firebase';
var moment = require('moment');

class TodaysEvents extends Component {

  constructor(props) {
    super(props)
    var userid = Firebase.auth().currentUser.uid
    var eventsRef = Firebase.database().ref()
    this.state = {
      todayEvents: []
    }
    this._renderEvents();
  }

  _renderEvents () {
    var todayEvents = this.state.todayEvents

    eventsRef.child('/users/' + userid + '/').on('value', (snap) => {
      var today = new Date()
      var dayOfWeek = today.getDay()
      var todayDate = moment(today.getFullYear() + today.getMonth() + today.getDate(), "YYYYMMDD")
      snap.forEach((child) => {
        alert(child.val().eventName)
        if (child.key != 'name') {
          var cStartDate = moment(child.val().startDate, 'DD/MM/YYYY')
          var cEndDate = moment(child.val().endDate, 'DD/MM/YYYY')
          var cDays = child.val().day

          // within repeat duration and correct day of week
          if (todayDate >= cStartDate && todayDate <= cEndDate && cDays.includes(dayOfWeek)) {
            todayEvents.push({
              startTime: moment(child.val().startTime, 'h:mm A'),
              _key: child.key
            });
          }
        }
      });
      this.setState({
        todayEvents: todayEvents
      });
    });
  }

  return(
    render(this.state.todayEvents)
  )

}

module.exports = TodaysEvents;
