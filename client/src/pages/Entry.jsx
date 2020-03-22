import React, {useState} from 'react'

import "../styles/entry.style.css"
import Register from '../components/Entry/register.component'
import Login from '../components/Entry/login.component'
import TabBar from '../components/Entry/entry.tabs.component'

import {AccountCircle, ChromeReaderMode, ChromeReaderModeOutlined, Layers, LayersOutlined} from '@material-ui/icons';

//Display Side by side or stacked with toggle

const Entry = () => {

    const [view, setView] = useState('sideBySide');
    const [stackedStyle, setStackedStyle] = useState("disabled")
    const [sideStyle, setSideStyle] = useState("default")

    const toggleView = () => {
        if(view === 'sideBySide') {
            setView('stacked');
            setSideStyle('disabled')
            setStackedStyle('default')
        }
        else {
            setView('sideBySide');
            setStackedStyle('disabled')
            setSideStyle('default');
        }
    }

    return (
        <div className="entry-outer-container">
            <div className="entry-container">
                <div className="entry-heading-box">
                    <div><AccountCircle fontSize="large" /></div>
                    <span><ChromeReaderMode color={sideStyle} onClick={toggleView} /><Layers color={stackedStyle} onClick={toggleView} /></span>
                    {/*Choose between side by side and stacked*/}
                </div>
                
                {
                    view === 'stacked' ? (
                        <div className="entry-displayStacked-container">
                            <TabBar />
                        </div>) 
                    : 
                    (
                        <div className="entry-displaySide-container">
                            <Register view={view} />
                            <Login view={view} />
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default Entry;