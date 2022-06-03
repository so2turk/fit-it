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
						"Duration should be given in minuntes (as 30min) or 'lightning' (= 5min)",
				}
			} else if (duration === 'lightning') duration = 5
			else duration = parseInt(duration.replace('min', ''))

			return { title, duration }
		}

		return { alert: 'Title and duration should be provided' }
	}

	function fitIt() {
		setFittedLines([])
		const weightedAvg = calcWeightedAvg(lines) / 1.1
		const sessionLimits = [3 * 60, 4 * 60]
		let order = {
			final: [],
			temp: Array.from({ length: lines.length }, (v, i) => i),
		}

		while (order.temp.length > 0) {
			order = sortLines(order, sessionLimits[0], weightedAvg)
			order = sortLines(order, sessionLimits[1], weightedAvg)
		}

		let fixedEvent = 0
		for (const a of order.final) {
			setFittedLines((prev) => [
				...prev,
				{ title: lines[a].title, duration: lines[a].duration },
			])

			fixedEvent += lines[a].duration
			if (fixedEvent === 180) {
				setFittedLines((prev) => [...prev, { title: 'Lunch', duration: 60 }])
			}
			if (fixedEvent === 180 + 240) {
				setFittedLines((prev) => [
					...prev,
					{ title: 'Networking Event', duration: 60 },
				])
				fixedEvent = 0
			}
		}
		setFittedLines((prev) => [
			...prev,
			{ title: 'Networking Event', duration: 60 },
		])
	}

	function sortLines(initialOrder, sessionLimit, weightedAvg) {
		let sessionOrder = [...initialOrder.final]
		let sessionTempOrder = [...initialOrder.temp]
		let session = 0
		let raund = 0
		let random
		let order

		while (session < sessionLimit && sessionTempOrder.length > 0) {
			raund++

			random = Math.floor(Math.random() * sessionTempOrder.length)
			order = sessionTempOrder[random]

			if (session + lines[order].duration <= sessionLimit) {
				session += lines[order].duration
				sessionOrder.push(order)
				sessionTempOrder.splice(random, 1)
			}

			if (raund > sessionLimit / weightedAvg) {
				sessionOrder = initialOrder.final.slice()
				sessionTempOrder = initialOrder.temp.slice()
				session = 0
				raund = 0
			}
		}

		return { final: sessionOrder, temp: sessionTempOrder }
	}

	function calcWeightedAvg(arr) {
		const occurence = calcOccurence(arr)
		let sumOfNumXWeight = 0
		let sumOfWeight = 0

		for (const duration in occurence) {
			sumOfNumXWeight += duration * occurence[duration]
			sumOfWeight += occurence[duration]
		}
		return sumOfNumXWeight / sumOfWeight
	}

	function calcOccurence(arr) {
		const occurence = {}

		arr.forEach((obj) => {
			if (occurence[obj.duration]) {
				occurence[obj.duration] += 1
			} else {
				occurence[obj.duration] = 1
			}
		})
		return occurence
	}

	return (
		<>
			<h1 data-testid="title">Fit-It</h1>
			<div data-testid="add-field">
				{lines.length > 0 &&
					lines.map((line, i) => {
						return (
							<div key={i}>
								<div data-testid={`add-field-title-${i}`}>{line.title}</div>
								<div data-testid={`add-field-duration-${i}`}>
									{line.duration}min
								</div>
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
								<div data-testid={`fit-field-title-${i}`}>
									{fittedLine.title}
								</div>
								<div data-testid={`fit-field-duration-${i}`}>
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
