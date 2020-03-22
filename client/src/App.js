import React from 'react';

import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import UserStore from './stores/UserStore'
import ChatStore from './stores/ChatStore'
import Entry from './pages/Entry';
import PersonalProfile from './pages/PersonalProfile';
import NavBar from './components/navbar.component.jsx';
import FriendsList from './pages/FriendsList';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import Chat from './pages/Chat';
import AuthenticatedComponent from './components/AuthenticatedComponent';

function App() {
  return (
    <>
      <UserStore>
        <Router>
          <NavBar />
          <Switch>
            <Route exact path="/" component={Entry} />
            <AuthenticatedComponent>
              <Route path="/user-profile" component={PersonalProfile} />
              <Route path="/friends-list" component={FriendsList} />
              <Route path="/notifications" component={Notifications} />
              <Route path="/user-settings" component={Settings} />
              <ChatStore>
                <Route path="/chat" component={Chat} />
              </ChatStore>
            </AuthenticatedComponent>
          </Switch>
        </Router>
      </UserStore>
    </>    
  );
}

export default App;
