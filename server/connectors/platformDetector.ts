export interface DetectedPlatform {
  platform: 'github' | 'leetcode' | 'codechef' | 'codeforces' | 'linkedin' | 'unknown';
  extractedIdentifier: string;
  originalInput: string;
  isUrl: boolean;
  cleanProfileUrl: string;
}

export function detectPlatformFromInput(input: string): DetectedPlatform {
  const trimmed = input.trim();
  if (!trimmed) {
    return { platform: 'unknown', extractedIdentifier: '', originalInput: input, isUrl: false, cleanProfileUrl: '' };
  }

  // GitHub
  if (trimmed.includes('github.com')) {
    const match = trimmed.match(/github\.com\/([a-zA-Z0-9_-]+)/i);
    const id = match ? match[1] : trimmed.replace(/https?:\/\//i, '').replace('github.com/', '').split('/')[0];
    return {
      platform: 'github',
      extractedIdentifier: id,
      originalInput: input,
      isUrl: true,
      cleanProfileUrl: `https://github.com/${id}`
    };
  }

  // LeetCode
  if (trimmed.includes('leetcode.com')) {
    const match = trimmed.match(/leetcode\.com\/(?:u\/)?([a-zA-Z0-9_-]+)/i);
    const id = match ? match[1] : trimmed.replace(/https?:\/\//i, '').replace('leetcode.com/u/', '').replace('leetcode.com/', '').split('/')[0];
    return {
      platform: 'leetcode',
      extractedIdentifier: id,
      originalInput: input,
      isUrl: true,
      cleanProfileUrl: `https://leetcode.com/u/${id}`
    };
  }

  // CodeChef
  if (trimmed.includes('codechef.com')) {
    const match = trimmed.match(/codechef\.com\/users\/([a-zA-Z0-9_-]+)/i);
    const id = match ? match[1] : trimmed.replace(/https?:\/\//i, '').replace('codechef.com/users/', '').split('/')[0];
    return {
      platform: 'codechef',
      extractedIdentifier: id,
      originalInput: input,
      isUrl: true,
      cleanProfileUrl: `https://codechef.com/users/${id}`
    };
  }

  // Codeforces
  if (trimmed.includes('codeforces.com')) {
    const match = trimmed.match(/codeforces\.com\/profile\/([a-zA-Z0-9_-]+)/i);
    const id = match ? match[1] : trimmed.replace(/https?:\/\//i, '').replace('codeforces.com/profile/', '').split('/')[0];
    return {
      platform: 'codeforces',
      extractedIdentifier: id,
      originalInput: input,
      isUrl: true,
      cleanProfileUrl: `https://codeforces.com/profile/${id}`
    };
  }

  // LinkedIn
  if (trimmed.includes('linkedin.com')) {
    const match = trimmed.match(/linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i);
    const id = match ? match[1] : trimmed.replace(/https?:\/\//i, '').replace('linkedin.com/in/', '').split('/')[0];
    return {
      platform: 'linkedin',
      extractedIdentifier: id,
      originalInput: input,
      isUrl: true,
      cleanProfileUrl: `https://linkedin.com/in/${id}`
    };
  }

  // Raw handles or usernames
  const cleanHandle = trimmed.replace(/^@/, '');
  return {
    platform: 'unknown',
    extractedIdentifier: cleanHandle,
    originalInput: input,
    isUrl: false,
    cleanProfileUrl: ''
  };
}
