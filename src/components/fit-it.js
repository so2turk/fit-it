import { useState } from 'react'

const FitIt = () => {
	const [lines, setLines] = useState([])
	const [line, setLine] = useState('')
	const [warning, setWarning] = useState()
	const [fittedLines, setFittedLines] = useState([])

	const handleLineAdd = () => {
		setWarning()

		const decodedLine = checkLine(line)
		if (decodedLine.alert) {
			setWarning(decodedLine.alert)
			return
		}

		setLines((prev) => [
			...prev,
			{ title: decodedLine.title, duration: decodedLine.duration },
		])
		setLine('')
	}

	function checkLine(line) {
		const lineArr = line.split(' ')
		let duration
		let title

		if (lineArr.length > 1) {
			duration = lineArr[lineArr.length - 1]
			title = lineArr.join(' ').replace(duration, '').trim()

			if (title.match(/[0-9]/))
				return { alert: 'Title should not contain number(s)' }
			if (!duration.match(/^[0-9]+(min)$|^lightning$/)) {
				return {
					alert:
						"Duration should be givin in minuntes (as 30min) or 'lightning' (= 5min)",
				}
			} else if (duration === 'lightning') duration = '5'
			else duration = duration.replace('min', '')

			return { title, duration }
		}

		return { alert: 'Title and duration should be provided' }
	}

	function fitIt() {
		setFittedLines([...lines])
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
								<div data-testid="add-field-duration">{line.duration}min</div>
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
			<button data-testid="fit-btn" onClick={() => fitIt()}>
				Fit It
			</button>
			<div style={{ color: 'red', fontWeight: 'bold' }} data-testid="alert">
				{warning}
			</div>
			<div data-testid="fit-field">
				{fittedLines.length > 0 &&
					fittedLines.map((fittedLine, i) => {
						return (
							<div key={i}>
								<div data-testid="fit-field-title">{fittedLine.title}</div>
								<div data-testid="fit-field-duration">
									{fittedLine.duration}min
								</div>
							</div>
						)
					})}
			</div>
		</>
	)
}

export default FitIt
