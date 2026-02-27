import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { setProvider } from '../redux/provider';

const circuits = [
    {
        id: 'cineteca',
        name: 'Cineteca di Bologna',
        logo: '/assets/images/logo-black.png',
        logoStyle: {},
        accent: '#f99e00',
        accentLight: '#fccd00',
    },
    {
        id: 'ccb',
        name: 'Circuito Cinema Bologna',
        logo: '/assets/images/logo-ccb.svg',
        logoStyle: {},
        accent: '#ffabad',
        accentLight: '#ffc7c8',
    },
    {
        id: 'popup',
        name: 'Pop Up Cinema',
        logo: '/assets/images/logo-popup.png',
        logoStyle: {},
        accent: '#9f1c24',
        accentLight: '#c2323b',
    },
];

function CircuitSelect() {
    const dispatch = useDispatch();
    const history = useHistory();

    const choose = (id) => {
        dispatch(setProvider(id));
        history.push('/calendar');
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: '#111',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
        }}>
            <h2 style={{ color: 'white', marginBottom: '2.5rem', fontWeight: 700, letterSpacing: '-0.5px' }}>
                Scegli il circuito
            </h2>
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '2rem',
                justifyContent: 'center',
            }}>
                {circuits.map(c => (
                    <button
                        key={c.id}
                        onClick={() => choose(c.id)}
                        style={{
                            background: '#1a1a1a',
                            border: `3px solid ${c.accent}`,
                            borderRadius: '16px',
                            padding: '2.5rem 3rem',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '1.2rem',
                            width: '240px',
                            transition: 'transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = `0 8px 24px ${c.accent}55`;
                            e.currentTarget.style.background = `${c.accent}18`;
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                            e.currentTarget.style.background = '#1a1a1a';
                        }}
                    >
                        {c.logo
                            ? <img
                                src={c.logo}
                                alt={c.name}
                                height="70"
                                style={{ ...c.logoStyle, filter: 'brightness(0) invert(1)' }}
                            />
                            : <span style={{ color: c.accent, fontWeight: 800, fontSize: '1.4rem', letterSpacing: '1px' }}>
                                {c.name}
                            </span>
                        }
                        <span style={{ color: 'white', fontWeight: 600, fontSize: '1rem', textAlign: 'center' }}>
                            {c.name}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}

export default CircuitSelect;
