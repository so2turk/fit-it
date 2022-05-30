import { useState } from 'react'

const FitIt = () => {
	const [lines, setLines] = useState([])
	const [line, setLine] = useState('')
	const [warning, setWarning] = useState()

	const handleLineAdd = () => {
		setWarning()
		const title = handleTitle(line)
		let duration = handleDuration(line, title)

		const alert = lineCheck(title, duration)
		if (alert) {
			setWarning(lineCheck(title, duration))
			return
		}

		setLines((prev) => [...prev, { title, duration }])
		setLine('')
	}

	function handleTitle(line) {
		let duration = /([0-9])\w+$/
		if (line.endsWith('lightning')) duration = 'lightning'
		return line.replace(duration, '').trim()
	}

	function handleDuration(line, text) {
		if (line === 'lightning') return '5'
		return line.replace(text, '').trim()
	}

	function lineCheck(title, duration) {
		if (title.match(/[0-9]/)) return 'Title should not contain number(s)'
		return
	}

	return (
		<>
			<h1 data-testid="title">Fit-It</h1>
			<div data-testid="add-field">
				{lines.length > 0 &&
					lines.map((line, i) => {
						return (
							<div key={i}>
								<div data-testid="add-field-title">{line.title}</div>
								<div data-testid="add-field-duration">{line.duration}</div>
							</div>
						)
					})}
			</div>
			<input
				data-testid="input"
				type="text"
				value={line}
				onChange={(e) => setLine(e.target.value)}
			/>
			<button data-testid="add-btn" onClick={handleLineAdd}>
				Add
			</button>
			<button data-testid="eva-btn">Fit It</button>
			<div style={{ color: 'red', fontWeight: 'bold' }} data-testid="alert">
				{warning}
			</div>
		</>
	)
}

export default FitIt
