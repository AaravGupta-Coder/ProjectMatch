export interface NormalizedPlatformData {
  github?: {
    username: string;
    name?: string;
    publicRepos: number;
    followers: number;
    languages: Record<string, number>; // language -> repo count or byte weight
    topRepos: Array<{
      name: string;
      description: string;
      language: string;
      stars: number;
      forks: number;
      updatedAt: string;
    }>;
    totalStars: number;
    estimatedCommits: number;
    accountCreatedAt: string;
  };
  leetcode?: {
    username: string;
    totalSolved: number;
    easySolved: number;
    mediumSolved: number;
    hardSolved: number;
    acceptanceRate: number;
    ranking: number;
    contestRating?: number;
    contestGlobalRanking?: number;
    badges: string[];
  };
  codechef?: {
    handle: string;
    stars: string;
    currentRating: number;
    highestRating: number;
    globalRank?: number;
    countryRank?: number;
    division?: string;
  };
  codeforces?: {
    handle: string;
    rating: number;
    maxRating: number;
    rank: string;
    maxRank: string;
  };
  resume?: {
    rawText: string;
    extractedLanguages: string[];
    extractedFrameworks: string[];
    extractedProjects: Array<{
      title: string;
      tech: string;
      impact?: string;
    }>;
    extractedEducation?: string;
    extractedAchievements: string[];
  };
  linkedin?: {
    url: string;
    protectedStatus: 'linked_and_unscraped';
    policyNote: string;
  };
}

export interface ConnectorResponse<T> {
  success: boolean;
  platform: 'github' | 'leetcode' | 'codechef' | 'codeforces' | 'resume' | 'linkedin';
  data?: T;
  error?: string;
  dataSummary: string;
  metrics?: Record<string, any>;
}
