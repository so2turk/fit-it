import { useState } from 'react'

const FitIt = () => {
	const [lines, setLines] = useState([])
	const [line, setLine] = useState('')

	const handleLineAdd = () => {
		setLines((prev) => [...prev, line])
		setLine('')
	}

	return (
		<>
			<h1 data-testid="title">Fit-It</h1>
			<div data-testid="add-field">
				{lines.length > 0 &&
					lines.map((line, i) => {
						return <div key={i}>{line}</div>
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
