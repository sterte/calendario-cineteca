import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';
import { closeTab } from '../redux/tabs';

function TabBar() {
    const tabs = useSelector(state => state.tabs.tabs);
    const provider = useSelector(state => state.provider.activeProvider);
    const dispatch = useDispatch();
    const location = useLocation();
    const history = useHistory();

    if (tabs.length === 0) return null;

    const calendarUrl = `/calendar/${provider}`;
    const isCalendarActive = location.pathname.startsWith('/calendar');

    const handleClose = (e, tab) => {
        e.stopPropagation();
        dispatch(closeTab(tab.id));
        if (location.pathname === tab.url) {
            history.push(calendarUrl);
        }
    };

    return (
        <div className="tab-bar">
            <button
                className={`tab-item${isCalendarActive ? ' active' : ''}`}
                onClick={() => history.push(calendarUrl)}
            >
                <span className="fa fa-calendar me-1" />
                Calendario
            </button>
            {tabs.map(tab => {
                const isActive = location.pathname === tab.url;
                const title = tab.title.length > 18 ? tab.title.slice(0, 17) + '…' : tab.title;
                return (
                    <button
                        key={tab.id}
                        className={`tab-item${isActive ? ' active' : ''}`}
                        onClick={() => history.push(tab.url)}
                    >
                        <span className="fa fa-film me-1" />
                        {title}
                        <span
                            className="tab-close"
                            onClick={(e) => handleClose(e, tab)}
                        >✕</span>
                    </button>
                );
            })}
        </div>
    );
}

export default TabBar;
