import { fireEvent, render, screen } from '@testing-library/react'
import FitIt from '../fit-it'

import testData from '../../test-data.json'

const setup = () => render(<FitIt />)

it('should have a title', () => {
	setup()
	expect(screen.getByTestId('title').textContent).toBe('Fit-It')
})

it('should have an input field', () => {
	setup()
	expect(screen.getByTestId('input').value).toBe('')
})

it('should have an add button', () => {
	setup()
	expect(screen.getByTestId('add-btn').textContent).toBe('Add')
})

it('should have an evaluate button', () => {
	setup()
	expect(screen.getByTestId('fit-btn').textContent).toBe('Fit It')
})

it('should change input value', () => {
	setup()
	const inputEl = screen.getByTestId('input')

	fireEvent.change(inputEl, {
		target: {
			value: 'fit-it',
		},
	})
	expect(inputEl.value).toBe('fit-it')
})

it("should have an added items' field", () => {
	setup()
	expect(screen.getByTestId('add-field').textContent).toBe('')
})

it("should change added items' field", () => {
	setup()
	const inputEl = screen.getByTestId('input')
	const addButtonEl = screen.getByTestId('add-btn')

	fireEvent.change(inputEl, {
		target: {
			value: 'fit-it',
		},
	})
	fireEvent.click(addButtonEl)

	// test updated
	// expect(screen.getByTestId('add-field').textContent).toBe('fit-it')
	expect(screen.getByTestId('alert').textContent).toBe(
		'Title and duration should be provided'
	)
})

it('should separate input as title and duration', () => {
	setup()
	const inputEl = screen.getByTestId('input')
	const addButtonEl = screen.getByTestId('add-btn')

	fireEvent.change(inputEl, {
		target: {
			value: 'Test Driven Development 30min',
		},
	})
	fireEvent.click(addButtonEl)

	expect(screen.getByTestId('add-field-title-0').textContent).toBe(
		'Test Driven Development'
	)
	expect(screen.getByTestId('add-field-duration-0').textContent).toBe('30min')
})

it('should warn user with invalid (title contains number) input', () => {
	setup()
	const inputEl = screen.getByTestId('input')
	const addButtonEl = screen.getByTestId('add-btn')

	fireEvent.change(inputEl, {
		target: {
			value: 'Test 7 Development 30min',
		},
	})
	fireEvent.click(addButtonEl)

	expect(screen.getByTestId('alert').textContent).toBe(
		'Title should not contain number(s)'
	)

	fireEvent.change(inputEl, {
		target: {
			value: 'Test Diriven Development 7 30min',
		},
	})
	fireEvent.click(addButtonEl)

	expect(screen.getByTestId('alert').textContent).toBe(
		'Title should not contain number(s)'
	)
})

it('should warn user with invalid (wrong duration format) input', () => {
	setup()
	const inputEl = screen.getByTestId('input')
	const addButtonEl = screen.getByTestId('add-btn')

	fireEvent.change(inputEl, {
		target: {
			value: 'Test Driven Development lightning7',
		},
	})
	fireEvent.click(addButtonEl)

	expect(screen.getByTestId('alert').textContent).toBe(
		"Duration should be given in minuntes (as 30min) or 'lightning' (= 5min)"
	)

	fireEvent.change(inputEl, {
		target: {
			value: 'Test Diriven Development m30min',
		},
	})
	fireEvent.click(addButtonEl)

	expect(screen.getByTestId('alert').textContent).toBe(
		"Duration should be given in minuntes (as 30min) or 'lightning' (= 5min)"
	)
})

it("should have an fitted items' field", () => {
	setup()

	expect(screen.getByTestId('fit-field').textContent).toBe('')
})

it("should change fitted item' field", () => {
	setup()
	const inputEl = screen.getByTestId('input')
	const addButtonEl = screen.getByTestId('add-btn')
	const fitButtonEl = screen.getByTestId('fit-btn')

	fireEvent.change(inputEl, {
		target: {
			value: 'Test Driven Development 30min',
		},
	})
	fireEvent.click(addButtonEl)

	expect(screen.getByTestId('add-field-title-0').textContent).toBe(
		'Test Driven Development'
	)
	expect(screen.getByTestId('add-field-duration-0').textContent).toBe('30min')
	expect(screen.getByTestId('fit-field').textContent).toBe('')

	fireEvent.click(fitButtonEl)

	expect(screen.getByTestId('fit-field-title-0').textContent).toBe(
		'Test Driven Development'
	)
	expect(screen.getByTestId('fit-field-duration-0').textContent).toBe('30min')
})

it('should change the add-field for multiple data entries', () => {
	setup()
	const inputEl = screen.getByTestId('input')
	const addButtonEl = screen.getByTestId('add-btn')
	const fitButtonEl = screen.getByTestId('fit-btn')

	testData.SPEECHS.map((line, i) => {
		fireEvent.change(inputEl, {
			target: {
				value: `${line.title} ${line.duration}min`,
			},
		})
		fireEvent.click(addButtonEl)

		expect(screen.getByTestId(`add-field-title-${i}`).textContent).toBe(
			`${line.title}`
		)
		expect(screen.getByTestId(`add-field-duration-${i}`).textContent).toBe(
			`${line.duration}min`
		)
		expect(screen.getByTestId('fit-field').textContent).toBe('')
	})
})

it('should change the fit-field for multiple data entries', () => {
	setup()
	const inputEl = screen.getByTestId('input')
	const addButtonEl = screen.getByTestId('add-btn')
	const fitButtonEl = screen.getByTestId('fit-btn')

	testData.SPEECHS.map((line, i) => {
		fireEvent.change(inputEl, {
			target: {
				value: `${line.title} ${line.duration}min`,
			},
		})
		fireEvent.click(addButtonEl)
	})

	fireEvent.click(fitButtonEl)

	testData.SPEECHS.map((line, i) => {
		expect(screen.getByTestId(`fit-field`).textContent).toMatch(`${line.title}`)
		expect(screen.getByTestId(`fit-field`).textContent).toMatch(
			`${line.duration}min`
		)
	})
})

function getOrder(text) {
	setup()
	const el = screen.getAllByText(text)
	const testId = /fit-field-title-[0-9]+/
	const numbers = /([a-z]|-)/g

	const order = parseInt(
		el[1].outerHTML.match(testId)[0].replaceAll(numbers, '')
	)

	return order
}

it('should fit the given data into 3hr in the morning and 3-4hr in the afternoon', () => {
	setup()
	const inputEl = screen.getByTestId('input')
	const addButtonEl = screen.getByTestId('add-btn')
	const fitButtonEl = screen.getByTestId('fit-btn')

	testData.SPEECHS.map((line, i) => {
		fireEvent.change(inputEl, {
			target: {
				value: `${line.title} ${line.duration}min`,
			},
		})
		fireEvent.click(addButtonEl)
	})

	fireEvent.click(fitButtonEl)

	let order = {}
	testData.SPEECHS.forEach((line) => {
		order[getOrder(line.title)] = line.duration
	})
	console.log(order)
	let maxKey = 0

	for (const key in order) {
		maxKey = maxKey < parseInt(key) ? parseInt(key) : maxKey
	}

	let sums = [0]
	let j = 0

	for (let i = 0; i <= maxKey; i++) {
		if (order[i]) sums[j] += order[i]
		else {
			sums.push(0)
			j++
		}
	}

	sums.forEach((sum, i) => {
		if (i % 2 === 0) expect(sum).toBe(3 * 60)
		else {
			expect(sum).toBeGreaterThan(3 * 60)
			expect(sum).toBeLessThanOrEqual(4 * 60)
		}
	})
})
