import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Layout from "./components/layout";
import Chart from './components/chart';
import Track from './components/Track';
import Home from "./components/home";
import Voting from "./components/voting";
import VotingAll from "./components/voting/alltokens";
import Audit from './components/audit';
import Dex from './components/dex';

import './App.css';
import './assets/css/main.css';

import './assets/css/sub-main.css';

function App() {
  return (
    <>
      <Router>
        <Layout>
          <Switch>
            <Route path="/track" component={Track} />
            <Route path="/voting" component={Voting} />
            <Route path="/voting-all" component={VotingAll} />
            <Route path="/chart" component={Chart} />
            <Route path="/audit" component={Audit} />
            <Route path="/dex" component={Dex} />
            <Route exact path="*" component={Home} />
          </Switch>
        </Layout>
      </Router>
    </>
  );
}

export default App;