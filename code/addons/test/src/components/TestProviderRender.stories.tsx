import React from 'react';

import type { TestProviderConfig, TestProviderState } from 'storybook/internal/core-events';
import { ManagerContext } from 'storybook/internal/manager-api';
import { styled } from 'storybook/internal/theming';
import { Addon_TypesEnum } from 'storybook/internal/types';

import type { Meta, StoryObj } from '@storybook/react';
import { fn, within } from '@storybook/test';

import type { Config, Details } from '../constants';
import { TestProviderRender } from './TestProviderRender';

type Story = StoryObj<typeof TestProviderRender>;
const managerContext: any = {
  state: {
    testProviders: {
      'test-provider-id': {
        id: 'test-provider-id',
        name: 'Test Provider',
        type: Addon_TypesEnum.experimental_TEST_PROVIDER,
      },
    },
  },
  api: {
    getDocsUrl: fn().mockName('api::getDocsUrl'),
    emit: fn().mockName('api::emit'),
    updateTestProviderState: fn().mockName('api::updateTestProviderState'),
  },
};

const config: TestProviderConfig = {
  id: 'test-provider-id',
  name: 'Test Provider',
  type: Addon_TypesEnum.experimental_TEST_PROVIDER,
  runnable: true,
  watchable: true,
};

const baseState: TestProviderState<Details, Config> = {
  cancellable: true,
  cancelling: false,
  crashed: false,
  error: null,
  failed: false,
  running: false,
  watching: false,
  config: {
    a11y: false,
    coverage: false,
  },
  details: {
    testResults: [
      {
        endTime: 0,
        startTime: 0,
        status: 'passed',
        message: 'All tests passed',
        results: [
          {
            storyId: 'story-id',
            status: 'success',
            duration: 100,
            testRunId: 'test-run-id',
          },
        ],
      },
    ],
  },
};

const Content = styled.div({
  padding: '12px 6px',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
});

export default {
  title: 'TestProviderRender',
  component: TestProviderRender,
  args: {
    state: {
      ...config,
      ...baseState,
    },
    api: managerContext.api,
  },
  decorators: [
    (StoryFn) => (
      <Content>
        <StoryFn />
      </Content>
    ),
    (StoryFn) => (
      <ManagerContext.Provider value={managerContext}>
        <StoryFn />
      </ManagerContext.Provider>
    ),
  ],
} as Meta<typeof TestProviderRender>;

export const Default: Story = {
  args: {
    state: {
      ...config,
      ...baseState,
    },
  },
};

export const Running: Story = {
  args: {
    state: {
      ...config,
      ...baseState,
      running: true,
    },
  },
};

export const EnableA11y: Story = {
  args: {
    state: {
      ...config,
      ...baseState,
      details: {
        testResults: [],
      },
      config: {
        a11y: true,
        coverage: false,
      },
    },
  },
};

export const EnableEditing: Story = {
  args: {
    state: {
      ...config,
      ...baseState,
      config: {
        a11y: true,
        coverage: false,
      },
      details: {
        testResults: [],
      },
    },
  },

  play: async ({ canvasElement }) => {
    const screen = within(canvasElement);

    screen.getByLabelText('Edit').click();
  },
};
