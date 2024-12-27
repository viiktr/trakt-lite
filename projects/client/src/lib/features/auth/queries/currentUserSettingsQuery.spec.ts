import QueryTestBed from '$test/beds/query/QueryTestBed.svelte';

import { ExtendedUserMappedMock } from '$mocks/data/users/ExtendedUserSettingsMappedMock.ts';
import { waitForQueryResult } from '$test/beds/query/waitForQueryResult.ts';
import { createQuery } from '@tanstack/svelte-query';
import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import { currentUserSettingsQuery } from './currentUserSettingsQuery.ts';

describe('currentUserSettingsQuery', () => {
  it('should query for user profile', async () => {
    render(QueryTestBed, {
      props: {
        queryFactory: () => createQuery(currentUserSettingsQuery()),
        mapper: (response) => response?.data,
      },
    });

    const result = await waitForQueryResult();
    expect(result).to.deep.equal(ExtendedUserMappedMock);
  });
});
