/** Only accept public Google Forms respondent links, never editor URLs. */
export function googleFormLinks(value) {
  if (!value || typeof value !== 'string') return null;
  try {
    const url = new URL(value.trim());
    if (
      url.protocol !== 'https:' ||
      url.hostname !== 'docs.google.com' ||
      url.username ||
      url.password ||
      url.port
    )
      return null;
    if (!/^\/forms\/d\/(?:e\/)?[a-zA-Z0-9_-]+\/viewform\/?$/.test(url.pathname)) return null;
    const publicUrl = new URL(url);
    publicUrl.searchParams.delete('embedded');
    const embedUrl = new URL(publicUrl);
    embedUrl.searchParams.set('embedded', 'true');
    return { publicUrl: publicUrl.toString(), embedUrl: embedUrl.toString() };
  } catch {
    return null;
  }
}

export function consultationNotes(data, tier) {
  const fields = [
    ['Name', 'name'],
    ['Email', 'email'],
    ['Phone number', 'phone'],
    ['Wedding or event date', 'date'],
    ['What I have done so far', 'progress'],
    ['The support I am looking for', 'support'],
    ['Budget', 'budget'],
  ];
  return [
    'LydsEvents — My consultation notes',
    'These notes are saved for you. They have not been sent to LydsEvents.',
    '',
    ...(tier ? [`Interested in: ${tier}`, ''] : []),
    ...fields.map(([label, key]) => `${label}: ${String(data.get(key) ?? '').trim()}`),
  ].join('\n');
}
