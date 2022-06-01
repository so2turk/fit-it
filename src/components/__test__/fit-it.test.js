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
		"Duration should be givin in minuntes (as 30min) or 'lightning' (= 5min)"
	)

	fireEvent.change(inputEl, {
		target: {
			value: 'Test Diriven Development m30min',
		},
	})
	fireEvent.click(addButtonEl)

	expect(screen.getByTestId('alert').textContent).toBe(
		"Duration should be givin in minuntes (as 30min) or 'lightning' (= 5min)"
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

