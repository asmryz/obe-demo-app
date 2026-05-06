import { useState, useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useNotifyStore } from '../store/notifyStore'

// ─── Icons ───────────────────────────────────────────────────────────────────

const icons = {
    success: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.75 12.25l2.85 2.85 5.85-6.2" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    error: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.5 8.5l-7 7M8.5 8.5l7 7" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" />
        </svg>
    ),
    warning: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 7.75v5.25" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" />
            <circle cx="12" cy="16.75" r="1.2" fill="currentColor" />
        </svg>
    ),
    info: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="8" r="1.25" fill="currentColor" />
            <path d="M12 11v5" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" />
        </svg>
    ),
}

const typeStyles = {
    success: {
        background: '#22c55e',
        accent: '#22c55e',
    },
    error: {
        accent: '#ef4444',
        background: '#ef4444',
    },
    warning: {
        accent: '#f59e0b',
        background: '#f59e0b',
    },
    info: {
        accent: '#3b82f6',
        background: '#3b82f6',
    },
}

// ─── Keyframe injection ───────────────────────────────────────────────────────

const STYLE_ID = 'notify-keyframes'

function injectKeyframes() {
    if (document.getElementById(STYLE_ID)) return
    const style = document.createElement('style')
    style.id = STYLE_ID
    style.textContent = `
        @keyframes notify-slide-in-right {
            from { transform: translateX(110%); opacity: 0; }
            to   { transform: translateX(0);    opacity: 1; }
        }
        @keyframes notify-slide-out-right {
            from { transform: translateX(0);    opacity: 1; max-height: 120px; margin-bottom: 8px; }
            to   { transform: translateX(110%); opacity: 0; max-height: 0;    margin-bottom: 0;   }
        }
        @keyframes notify-slide-in-left {
            from { transform: translateX(-110%); opacity: 0; }
            to   { transform: translateX(0);     opacity: 1; }
        }
        @keyframes notify-slide-out-left {
            from { transform: translateX(0);     opacity: 1; max-height: 120px; margin-bottom: 8px; }
            to   { transform: translateX(-110%); opacity: 0; max-height: 0;    margin-bottom: 0;   }
        }
        @keyframes notify-slide-in-center {
            from { transform: translateY(-12px); opacity: 0; }
            to   { transform: translateY(0);     opacity: 1; }
        }
        @keyframes notify-slide-out-center {
            from { opacity: 1; max-height: 120px; margin-bottom: 8px; }
            to   { opacity: 0; max-height: 0;    margin-bottom: 0;   }
        }
        @keyframes notify-progress {
            from { width: 100%; }
            to   { width: 0%; }
        }
        @keyframes notify-ripple {
            from { transform: scale(0); opacity: 0.42; }
            to   { transform: scale(16); opacity: 0; }
        }
    `
    document.head.appendChild(style)
}

// ─── Position helpers ─────────────────────────────────────────────────────────

const ALL_POSITIONS = [
    'top-left','top-center','top-right',
    'center-left','center-center','center-right',
    'bottom-left','bottom-center','bottom-right',
]

function getSlideDir(position) {
    if (position.endsWith('center')) return 'center'
    if (position.endsWith('left')) return 'left'
    return 'right'
}

function getContainerStyle(position) {
    const base = {
        position: 'fixed',
        zIndex: 9999,
        display: 'flex',
        pointerEvents: 'none',
    }
    switch (position) {
        case 'top-left':        return { ...base, top: '24px',    left:  '24px',  flexDirection: 'column',         alignItems: 'flex-start' }
        case 'top-center':      return { ...base, top: '24px',    left:  '50%',   flexDirection: 'column',         alignItems: 'center',    transform: 'translateX(-50%)' }
        case 'top-right':       return { ...base, top: '24px',    right: '24px',  flexDirection: 'column',         alignItems: 'flex-end'   }
        case 'center-left':     return { ...base, top: '50%',     left:  '24px',  flexDirection: 'column',         alignItems: 'flex-start', transform: 'translateY(-50%)' }
        case 'center-center':   return { ...base, top: '50%',     left:  '50%',   flexDirection: 'column',         alignItems: 'center',    transform: 'translate(-50%, -50%)' }
        case 'center-right':    return { ...base, top: '50%',     right: '24px',  flexDirection: 'column',         alignItems: 'flex-end',   transform: 'translateY(-50%)' }
        case 'bottom-left':     return { ...base, bottom: '24px', left:  '24px',  flexDirection: 'column-reverse', alignItems: 'flex-start' }
        case 'bottom-center':   return { ...base, bottom: '24px', left:  '50%',   flexDirection: 'column-reverse', alignItems: 'center',    transform: 'translateX(-50%)' }
        default:                return { ...base, bottom: '24px', right: '24px',  flexDirection: 'column-reverse', alignItems: 'flex-end'   } // bottom-right
    }
}

// ─── Single Toast ─────────────────────────────────────────────────────────────

function Toast({ id, type = 'info', title, message, duration = 4000, ripple = true, dismissible = false, slideDir = 'right', onRemove }) {
    const [exiting, setExiting] = useState(false)
    const timerRef = useRef(null)

    const dismiss = useCallback(() => {
        setExiting(true)
        setTimeout(() => onRemove(id), 350)
    }, [id, onRemove])

    useEffect(() => {
        injectKeyframes()
        if (duration > 0) {
            timerRef.current = setTimeout(dismiss, duration)
        }
        return () => clearTimeout(timerRef.current)
    }, [dismiss, duration])

    const s = typeStyles[type] || typeStyles.info
    const animIn  = `notify-slide-in-${slideDir} 0.3s ease`
    const animOut = `notify-slide-out-${slideDir} 0.35s ease forwards`

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                background: s.background,
                border: 0,
                color: '#ffffff',
                borderRadius: '8px',
                padding: dismissible ? '12px 12px 12px 14px' : '12px 18px 12px 14px',
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.16), 0 4px 6px -4px rgba(0,0,0,0.16)',
                minWidth: '280px',
                maxWidth: '360px',
                position: 'relative',
                overflow: 'hidden',
                animation: exiting ? animOut : animIn,
                marginBottom: '8px',
                cursor: 'default',
            }}
        >
            {ripple && (
                <span
                    aria-hidden="true"
                    style={{
                        position: 'absolute',
                        right: '-4px',
                        top: '-4px',
                        width: '24px',
                        height: '24px',
                        borderRadius: '999px',
                        background: 'rgba(255, 255, 255, 0.38)',
                        animation: 'notify-ripple 0.7s ease-out forwards',
                    }}
                />
            )}
            {/* Icon */}
            <span style={{
                flexShrink: 0,
                width: '28px',
                height: '28px',
                borderRadius: '999px',
                background: '#ffffff',
                color: s.accent,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                zIndex: 1,
            }}>{icons[type]}</span>

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
                {title && (
                    <p style={{
                        margin: '0 0 2px',
                        fontWeight: 600,
                        fontSize: '14px',
                        color: '#ffffff',
                        lineHeight: 1.3,
                    }}>
                        {title}
                    </p>
                )}
                {message && (
                    <p style={{
                        margin: 0,
                        fontSize: '16px',
                        color: '#ffffff',
                        lineHeight: 1.4,
                        wordBreak: 'break-word',
                    }}>
                        {message}
                    </p>
                )}
            </div>

            {/* Close button */}
            {dismissible && (
                <button
                    onClick={dismiss}
                    style={{
                        flexShrink: 0,
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '2px',
                        color: '#ffffff',
                        lineHeight: 1,
                        opacity: 0.85,
                        marginTop: '1px',
                        position: 'relative',
                        zIndex: 1,
                    }}
                    aria-label="Dismiss"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                </button>
            )}

            {/* Progress bar */}
            {duration > 0 && (
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    height: '3px',
                    background: 'rgba(255, 255, 255, 0.55)',
                    animation: `notify-progress ${duration}ms linear forwards`,
                }} />
            )}
        </div>
    )
}

// ─── Container ────────────────────────────────────────────────────────────────

function NotifyContainer({ toasts, onRemove, position = 'bottom-right' }) {
    const isTop = position.startsWith('top') || position.startsWith('center')
    const slideDir = getSlideDir(position)
    const displayToasts = isTop ? [...toasts].reverse() : toasts

    return createPortal(
        <div style={getContainerStyle(position)}>
            {displayToasts.map((t) => (
                <div key={t.id} style={{ pointerEvents: 'auto' }}>
                    <Toast {...t} slideDir={slideDir} onRemove={onRemove} />
                </div>
            ))}
        </div>,
        document.body
    )
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function NotifyProvider({ children, position: defaultPosition = 'bottom-right' }) {
    const setDefaultPosition = useNotifyStore((s) => s.setDefaultPosition)
    const toasts = useNotifyStore((s) => s.toasts)
    const remove = useNotifyStore((s) => s.remove)

    useEffect(() => {
        setDefaultPosition(defaultPosition)
    }, [defaultPosition, setDefaultPosition])

    const grouped = ALL_POSITIONS.reduce((acc, pos) => {
        acc[pos] = toasts.filter((t) => (t.position ?? defaultPosition) === pos)
        return acc
    }, {})

    return (
        <>
            {children}
            {ALL_POSITIONS.map((pos) =>
                grouped[pos].length > 0
                    ? <NotifyContainer key={pos} position={pos} toasts={grouped[pos]} onRemove={remove} />
                    : null
            )}
        </>
    )
}
