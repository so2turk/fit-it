import { fireEvent, render, screen } from '@testing-library/react'
import FitIt from '../fit-it'

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
	expect(screen.getByTestId('eva-btn').textContent).toBe('Fit It')
})

test('should change input value', () => {
	setup()
	const inputEl = screen.getByTestId('input')

	fireEvent.change(inputEl, {
		target: {
			value: 'fit-it',
		},
	})
	expect(inputEl.value).toBe('fit-it')
})
