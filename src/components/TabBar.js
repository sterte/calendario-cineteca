import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';
import { closeTab, setCurrentTab } from '../redux/tabs';


function TabBar() {
    const tabs = useSelector(state => state.tabs);
    const provider = useSelector(state => state.provider.activeProvider);
    const dispatch = useDispatch();
    const location = useLocation();
    const history = useHistory();

    const calendarUrl = `/calendar/${provider}`;
    const activeTabIndex = tabs.selectedTabIndex;
    const isCalendarActive = activeTabIndex === 0;

    const handleClose = (e, tab) => {
        e.stopPropagation();
        dispatch(closeTab(tab.id)); // also adjusts selectedTabIndex internally
        if (location.pathname === tab.url) {
            history.push(calendarUrl);
        }
    };

    return (
        <div className="tab-bar">
            <button
                className={`tab-item${isCalendarActive ? ' active' : ''}`}
                onClick={() => {dispatch(setCurrentTab(0)); history.push(calendarUrl);}}
            >
                <span className="fa fa-calendar me-1" />
                Calendario
            </button>
            {tabs.tabs.map((tab, index) => {
                const isActive = activeTabIndex === index + 1;
                const title = tab.title.length > 18 ? tab.title.slice(0, 17) + '…' : tab.title;
                return (
                    <button
                        key={tab.id}
                        className={`tab-item${isActive ? ' active' : ''}`}
                        onClick={() => {dispatch(setCurrentTab(index + 1)); history.push(tab.url);}}
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
