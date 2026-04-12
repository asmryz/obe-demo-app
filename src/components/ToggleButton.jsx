import React from 'react'

export const ToggleButton = ({ checked, onToggle, onLabel = 'On', offLabel = 'Off', scale = 1 }) => {
    return (
        <button
            type="button"
            aria-pressed={checked}
            onClick={onToggle}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                border: 0,
                background: 'transparent',
                padding: '0',
                margin: '8px 0 12px',
                cursor: 'pointer',
                transform: `scale(${scale})`,
                transformOrigin: 'left center'
            }}
        >
            <span
                style={{
                    position: 'relative',
                    width: '44px',
                    height: '24px',
                    borderRadius: '9999px',
                    backgroundColor: checked ? '#2563eb' : '#9ca3af',
                    transition: 'background-color 0.2s ease'
                }}
            >
                <span
                    style={{
                        position: 'absolute',
                        top: '2px',
                        left: checked ? '22px' : '2px',
                        width: '20px',
                        height: '20px',
                        borderRadius: '9999px',
                        backgroundColor: '#ffffff',
                        transition: 'left 0.2s ease'
                    }}
                />
            </span>
            <span style={{ fontWeight: 600, color: '#111827' }}>
                {checked ? onLabel : offLabel}
            </span>
        </button>
    )
}
