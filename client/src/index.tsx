import React, { FC, StrictMode } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { render } from 'react-dom'
import "./styles.scss"
import Home from './home';
import Chat from './chat';
import "tippy.js/dist/tippy.css"


const Main: FC = () => (
    <BrowserRouter>
        <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/:room" exact component={Chat} />
        </Switch>
    </BrowserRouter>
)

render(<StrictMode> <Main /> </StrictMode>, document.getElementById("root"))