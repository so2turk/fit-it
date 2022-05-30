import { useState } from 'react'

const FitIt = () => {
	const [lines, setLines] = useState([])
	const [line, setLine] = useState('')

	const handleLineAdd = () => {
		const title = handleTitle(line)
		let duration = handleDuration(line, title)

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
		</>
	)
}

export default FitIt
