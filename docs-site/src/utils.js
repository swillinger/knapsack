/**
 * @returns {{ id: number, name: string, body: string, html_url: string }[]}
 * @link https://developer.github.com/v3/repos/releases/#list-releases-for-a-repository
 */
export function getReleases() {
  return window
    .fetch('https://api.github.com/repos/basaltinc/knapsack/releases')
    .then(res => res.json());
}
