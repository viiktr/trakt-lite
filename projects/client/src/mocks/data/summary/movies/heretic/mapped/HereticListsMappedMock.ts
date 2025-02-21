import type { MediaListSummary } from '$lib/requests/models/MediaListSummary.ts';
import { UserProfileHarryMappedMock } from '$mocks/data/users/mapped/UserProfileHarryMappedMock.ts';

export const HereticListsMappedMock: MediaListSummary[] = [
  {
    'description': 'This list contains Heretic',
    'id': 1234,
    'name': 'Heretics only',
    'slug': 'heretics-only',
    'user': UserProfileHarryMappedMock,
    'count': 1,
  },
];
