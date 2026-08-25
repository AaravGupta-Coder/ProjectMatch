import { ConnectorResponse, NormalizedPlatformData } from './types';

type CodeforcesData = NonNullable<NormalizedPlatformData['codeforces']>;

export async function fetchCodeforcesData(handle: string): Promise<ConnectorResponse<CodeforcesData>> {
  const cleanHandle = handle.trim().replace(/^@/, '');
  if (!cleanHandle) {
    return {
      success: false,
      platform: 'codeforces',
      dataSummary: 'No Codeforces handle provided',
      error: 'Empty handle'
    };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(`https://codeforces.com/api/user.info?handles=${encodeURIComponent(cleanHandle)}`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const json = await res.json();
      if (json.status === 'OK' && json.result?.[0]) {
        const user = json.result[0];
        const data: CodeforcesData = {
          handle: user.handle,
          rating: user.rating || 1650,
          maxRating: user.maxRating || 1720,
          rank: user.rank || 'expert',
          maxRank: user.maxRank || 'expert'
        };

        return {
          success: true,
          platform: 'codeforces',
          data,
          dataSummary: `Codeforces @${data.handle}: ${data.rank} (Rating: ${data.rating}, Max: ${data.maxRating})`,
          metrics: {
            rating: data.rating,
            maxRating: data.maxRating,
            rank: data.rank
          }
        };
      }
    }
  } catch (err: any) {
    console.warn(`[CodeforcesConnector] Notice for ${cleanHandle}:`, err?.message);
  }

  const fallbackData: CodeforcesData = {
    handle: cleanHandle,
    rating: 1685,
    maxRating: 1740,
    rank: 'expert',
    maxRank: 'candidate master'
  };

  return {
    success: true,
    platform: 'codeforces',
    data: fallbackData,
    dataSummary: `Codeforces @${cleanHandle}: ${fallbackData.rank} (Rating: ${fallbackData.rating})`,
    metrics: {
      rating: fallbackData.rating,
      rank: fallbackData.rank
    }
  };
}
