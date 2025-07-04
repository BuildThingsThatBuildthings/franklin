import React from 'react';
import { render } from '@testing-library/react-native';
import { HomeScreen } from '../HomeScreen';

// Mock the stores
jest.mock('../../stores/roleStore', () => ({
  useRoleStore: () => ({
    roles: [
      { id: '1', name: 'Father', outcomes: [] },
      { id: '2', name: 'Professional', outcomes: [] },
    ],
  }),
}));

jest.mock('../../stores/microStepStore', () => ({
  useMicroStepStore: () => ({
    getTodaySteps: () => [
      {
        id: '1',
        description: 'Send fun text to daughter',
        status: 'planned',
        roleName: 'Father',
        type: 'do',
      },
    ],
  }),
}));

describe('HomeScreen', () => {
  it('renders the current date', () => {
    const { getByText } = render(<HomeScreen />);
    // Should show day of week
    expect(getByText(/Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday/)).toBeTruthy();
  });

  it('displays user roles', () => {
    const { getByText } = render(<HomeScreen />);
    expect(getByText('Father')).toBeTruthy();
    expect(getByText('Professional')).toBeTruthy();
  });

  it('shows today\'s micro-steps', () => {
    const { getByText } = render(<HomeScreen />);
    expect(getByText('Send fun text to daughter')).toBeTruthy();
  });
});