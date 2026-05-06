import { useState } from 'react'
import { useNotify } from '../store/notifyStore'

const positionValue = (x, y) => `${y}-${x}`

const labelFor = (value) => value[0].toUpperCase() + value.slice(1)

export function NotifyForm() {
    const notify = useNotify()
    const [notyfMessage, setNotyfMessage] = useState('')
    const [notyfDuration, setNotyfDuration] = useState('')
    const [positionX, setPositionX] = useState('left')
    const [positionY, setPositionY] = useState('top')
    const [withRipple, setWithRipple] = useState(true)
    const [dismissible, setDismissible] = useState(false)
    const [notyfType, setNotyfType] = useState('success')

    const handleSubmit = (event) => {
        event.preventDefault()
        const duration = Number.parseInt(notyfDuration, 10) || 3000
        const message = notyfMessage.trim() || 'This is a notification!'

        notify[notyfType]({
            message,
            duration,
            position: positionValue(positionX, positionY),
            ripple: withRipple,
            dismissible,
        })
    }

    return (
        <div className="notyf-card">
            <form id="notificationForm" onSubmit={handleSubmit}>
                <div className="notyf-card-body">
                    <div>
                        <label className="notyf-label" htmlFor="notyf-value">Message</label>
                        <input
                            id="notyf-value"
                            type="text"
                            placeholder="Notification message"
                            className="notyf-input"
                            value={notyfMessage}
                            onChange={(event) => setNotyfMessage(event.target.value)}
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="notyf-label" htmlFor="notyf-number">Duration</label>
                        <input
                            id="notyf-number"
                            type="number"
                            placeholder="1000 (Milliseconds)"
                            className="notyf-input"
                            min="1000"
                            value={notyfDuration}
                            onChange={(event) => setNotyfDuration(event.target.value)}
                        />
                    </div>

                    <fieldset className="notyf-fieldset">
                        <legend>Position - X</legend>
                        <div className="notyf-options">
                            {['left', 'center', 'right'].map((value) => (
                                <label className="notyf-option" key={value}>
                                    <input
                                        type="radio"
                                        name="radio-x"
                                        value={value}
                                        checked={positionX === value}
                                        onChange={(event) => setPositionX(event.target.value)}
                                    />
                                    <span>{labelFor(value)}</span>
                                </label>
                            ))}
                        </div>
                    </fieldset>

                    <fieldset className="notyf-fieldset">
                        <legend>Position - Y</legend>
                        <div className="notyf-options">
                            {['top', 'center', 'bottom'].map((value) => (
                                <label className="notyf-option" key={value}>
                                    <input
                                        type="radio"
                                        name="radio-y"
                                        value={value}
                                        checked={positionY === value}
                                        onChange={(event) => setPositionY(event.target.value)}
                                    />
                                    <span>{labelFor(value)}</span>
                                </label>
                            ))}
                        </div>
                    </fieldset>

                    <fieldset className="notyf-fieldset">
                        <legend>Behavior</legend>
                        <div className="notyf-options notyf-options-column">
                            <label className="notyf-option">
                                <input
                                    id="notyf-ripple"
                                    type="checkbox"
                                    checked={withRipple}
                                    onChange={(event) => setWithRipple(event.target.checked)}
                                />
                                <span>With Ripple effect</span>
                            </label>
                            <label className="notyf-option">
                                <input
                                    id="notyf-dismiss"
                                    type="checkbox"
                                    checked={dismissible}
                                    onChange={(event) => setDismissible(event.target.checked)}
                                />
                                <span>Dismissible</span>
                            </label>
                        </div>
                    </fieldset>

                    <fieldset className="notyf-fieldset">
                        <legend>Type</legend>
                        <div className="notyf-options notyf-type-options">
                            {['success', 'info', 'warning', 'error'].map((value) => (
                                <label className="notyf-option" key={value}>
                                    <input
                                        type="radio"
                                        name="radio-type"
                                        value={value}
                                        checked={notyfType === value}
                                        onChange={(event) => setNotyfType(event.target.value)}
                                    />
                                    <span>{labelFor(value)}</span>
                                </label>
                            ))}
                        </div>
                    </fieldset>

                    <button id="notyf-submit" type="submit" className="notyf-submit">Show Notification</button>
                </div>
            </form>
        </div>
    )
}
