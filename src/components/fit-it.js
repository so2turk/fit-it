import { useState } from 'react'

const FitIt = () => {
	const [lines, setLines] = useState([])
	const [line, setLine] = useState('')
	const [warning, setWarning] = useState()
	const [fittedLines, setFittedLines] = useState([])
	const handleLineAdd = (e) => {
		e.preventDefault()

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
		const linesData = getLinesData(lines)
		const sessionLimits = [3 * 60, 4 * 60]

		if (
			Math.floor(linesData[1] / (6 * 60)) !== Math.ceil(linesData[1] / (7 * 60))
		)
			setWarning('Please add more line for correct fit')

		setFittedLines([])
		const weightedAvg = linesData[0] / 1.1

		let order = {
			final: [],
			temp: Array.from({ length: lines.length }, (v, i) => i),
		}

		while (order.temp.length > 0) {
			order = sortLines(order, sessionLimits[0], weightedAvg)
			order = sortLines(order, sessionLimits[1], weightedAvg)
		}

		setFittedLines([...setFinalOrder(order.final, linesData[1])])
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

	function getLinesData(arr) {
		const occurence = calcOccurence(arr)
		let sumOfNumXWeight = 0
		let sumOfWeight = 0

		for (const duration in occurence) {
			sumOfNumXWeight += duration * occurence[duration]
			sumOfWeight += occurence[duration]
		}
		return [sumOfNumXWeight / sumOfWeight, sumOfNumXWeight]
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

	function setFinalOrder(arr, totalMin) {
		const trackNo = Math.ceil(totalMin / (7 * 60))
		let track = 1

		let setted = [{ order: `Track${track}` }]
		let time = new Date('June 3, 2022  09:00:00')

		let fixedEvent = 0
		arr.forEach((a, i) => {
			setted = [
				...setted,
				{
					order: setTalkTime(time),
					title: lines[a].title,
					duration: `${
						lines[a].duration === 5 ? 'lightning' : `${lines[a].duration}min`
					}`,
				},
			]
			time.setHours(time.getHours(), time.getMinutes() + lines[a].duration, 0)

			fixedEvent += lines[a].duration
			if (fixedEvent === 180) {
				setted = [...setted, { order: '12:00PM', title: 'Lunch', duration: 60 }]
				time.setHours(time.getHours(), 60, 0)
			}
			if (
				fixedEvent === 180 + 240 ||
				(fixedEvent > 180 + 180 && i === arr.length - 1)
			) {
				track++
				setted = [
					...setted,
					{ order: '05:00PM', title: 'Networking Event', duration: 60 },
				]
				fixedEvent = 0
				time.setHours(9, 0, 0)
				if (track <= trackNo) {
					setted = [...setted, { order: '' }]
					setted = [...setted, { order: `Track${track}` }]
				}
			}
		})

		return setted
	}

	function setTalkTime(time) {
		let pm = time.getHours() >= 12
		let hour12 = time.getHours() % 12
		if (!hour12) hour12 += 12
		let minute = time.getMinutes()

		return `${hour12 < 10 ? `0${hour12}` : hour12}:${
			minute < 10 ? `0${minute}` : minute
		}${pm ? 'PM' : 'AM'}`
	}

	return (
		<>
			<header>
				<h1 data-testid="title">Fit-It</h1>
			</header>
			<section className="input-field">
				<form className="input-form" onSubmit={handleLineAdd}>
					<input
						data-testid="input"
						type="text"
						value={line}
						onChange={(e) => setLine(e.target.value)}
					/>
					<button
						type="submit"
						className="button add-btn"
						data-testid="add-btn"
					>
						Add
					</button>
					<button
						data-testid="fit-btn"
						className="button fit-btn"
						onClick={() => fitIt()}
					>
						Fit It
					</button>
				</form>
			</section>
			<section className="alert">
				<div style={{ color: 'red', fontWeight: 'bold' }} data-testid="alert">
					{warning}
				</div>
			</section>
			<section className="line-field">
				<div data-testid="add-field">
					{lines.length > 0 &&
						lines.map((line, i) => {
							return (
								<div className="add-field" key={i}>
									<div data-testid={`add-field-title-${i}`}>{line.title}</div>
									<div
										className="duration"
										data-testid={`add-field-duration-${i}`}
									>
										{line.duration}min
									</div>
								</div>
							)
						})}
				</div>
				<div data-testid="fit-field">
					{fittedLines.length > 1 &&
						fittedLines.map((fittedLine, i) => {
							return (
								<div className="fit-field" key={i}>
									{fittedLine.title === 'Networking Event' ||
									fittedLine.title === 'Lunch' ? (
										<>
											<div className="time" data-testid={`fit-field-time-${i}`}>
												{fittedLine.order}
											</div>
											<div data-testid={`fit-field-title-${i}`}>
												{fittedLine.title}
											</div>
										</>
									) : (
										<>
											<div className="time" data-testid={`fit-field-time-${i}`}>
												{fittedLine.order}
											</div>
											<div data-testid={`fit-field-title-${i}`}>
												{fittedLine.title}
											</div>
											<div
												className="duration"
												data-testid={`fit-field-duration-${i}`}
											>
												{fittedLine.duration}
											</div>
										</>
									)}
								</div>
							)
						})}
				</div>
			</section>
		</>
	)
}

export default FitIt
