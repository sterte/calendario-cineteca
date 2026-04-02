import React, { useState } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { GoogleCalendar, ICalendar, OutlookCalendar, YahooCalendar } from 'datebook';

const PROVIDER_COLORS = {
    ccb:      { bg: '#ffabad', border: '#ffc7c8', text: '#000' },
    popup:    { bg: '#9f1c24', border: '#c2323b', text: '#fff' },
    galliera: { bg: '#722636', border: '#9a3f50', text: '#fff' },
};
const DEFAULT_COLORS = { bg: '#f99e00', border: '#fccd00', text: '#000' };

function AddToCalendarDropdown({ name, startDate, startTime, endDate, endTime, location, description, provider, preferredCalendar }) {
    const [open, setOpen] = useState(false);
    const colors = PROVIDER_COLORS[provider] || DEFAULT_COLORS;

    const config = {
        title: name,
        location,
        description,
        start: new Date(`${startDate}T${startTime}`),
        end: new Date(`${endDate}T${endTime}`),
        timezone: 'Europe/Rome',
    };

    const openUrl = (url) => window.open(url, '_blank', 'noopener,noreferrer');
    const downloadIcs = () => new ICalendar(config).download();

    const ACTIONS = {
        'Google':      () => openUrl(new GoogleCalendar(config).render()),
        'Apple':       downloadIcs,
        'Outlook.com': () => openUrl(new OutlookCalendar(config).render()),
        'Yahoo':       () => openUrl(new YahooCalendar(config).render()),
        'iCal':        downloadIcs,
    };

    const buttonStyle = {
        backgroundColor: colors.bg,
        borderColor: colors.border,
        color: colors.text,
        borderRadius: '20px',
        padding: '6px 14px',
        boxShadow: 'none',
    };

    const icon = <i className="fa fa-calendar-plus" style={{ marginRight: '6px' }} />;

    // Direct action if user has a preferred calendar
    if (preferredCalendar && ACTIONS[preferredCalendar]) {
        return (
            <button className="btn" style={buttonStyle} onClick={ACTIONS[preferredCalendar]}>
                {icon}Aggiungi al calendario
            </button>
        );
    }

    const options = [
        { label: 'Google Calendar', key: 'Google' },
        { label: 'Apple Calendar',  key: 'Apple' },
        { label: 'Outlook.com',     key: 'Outlook.com' },
        { label: 'Yahoo Calendar',  key: 'Yahoo' },
        { label: 'iCal (.ics)',     key: 'iCal' },
    ];

    return (
        <Dropdown isOpen={open} toggle={() => setOpen(o => !o)}>
            <DropdownToggle style={buttonStyle}>
                {icon}Aggiungi al calendario
            </DropdownToggle>
            <DropdownMenu>
                {options.map(o => (
                    <DropdownItem key={o.key} onClick={ACTIONS[o.key]}>{o.label}</DropdownItem>
                ))}
            </DropdownMenu>
        </Dropdown>
    );
}

export default AddToCalendarDropdown;
