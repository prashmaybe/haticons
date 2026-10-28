/**
 * Haticons Icon Categories and Classification Engine
 */

const BRAND_EXACT = new Set([
  'ad-block-plus', 'adobe', 'allo', 'amazon', 'amd', 'android', 'angellist', 'angular', 'appboxlab', 
  'apple', 'applemusic', 'archlinux', 'artstation', 'asana', 'at-and-t', 'atlassian', 'atom', 'aurelia', 
  'autotask', 'aws', 'azurepipelines', 'basecamp', 'behance', 'bing', 'bitbucket', 'bitly', 'blackberry', 
  'blender', 'book-my-show', 'bootstrap', 'bower', 'cakephp', 'campaignmonitor', 'chrome', 'cloudflare', 
  'coffeescript', 'conda-forge', 'coop', 'creative-cloud', 'css3', 'csswizardry', 'dailymotion', 'debian', 
  'dell', 'deno', 'dependabot', 'digg', 'digitalocean', 'dihadiwala', 'dream11', 'dribbble', 'drive', 
  'dropbox', 'duo', 'ebay', 'eclipseide', 'edge', 'elastic-cloud', 'eventbrite', 'evernote', 'everplaces', 
  'f-secure', 'facebook', 'favro', 'fedora', 'filezilla', 'finder', 'firefox', 'flutter', 'git', 'github', 
  'gitlab', 'gmail', 'gnu', 'gnusocial', 'google', 'google-assistant', 'google-plus', 'googlehangoutschat', 
  'grafana', 'gravatar', 'grofers', 'hackaday', 'hackster', 'hangout', 'haticons', 'hootsuite', 'html5', 
  'hubspot', 'icloud', 'iconjar', 'indane', 'inkscape', 'instagram', 'intel', 'internetexplorer', 'invision', 
  'ionic', 'jabber', 'javascript', 'jenkins', 'kadam', 'kaios', 'keybase', 'kibana', 'klout', 'kotlin', 
  'laravel', 'laravelhorizon', 'launchpad', 'letterboxd', 'letterboxd1', 'line', 'linewebtoon', 'linkedin', 
  'linuxmint', 'lucifer', 'magento', 'magisk', 'mailchimp', 'mailru', 'mastodon', 'mathworks', 'mediafire', 
  'medium', 'messenger', 'meteor', 'microblog', 'microgenetics', 'microsoft', 'microsoft-access', 
  'microsoft-one-note', 'microsoft-outlook', 'microsoft-power-point', 'microsoft-word', 'microsoftexcel', 
  'mixcloud', 'mysql', 'netflix', 'npm', 'odnoklassniki', 'ojook', 'ola-cabs', 'opensuse', 'pacman', 
  'pakpak', 'periscope', 'php', 'picasa', 'plangrid', 'play-station', 'player-dot-me', 'plugin', 'plurk', 
  'pocket', 'powershell', 'prismic', 'probot', 'processwire', 'producthunt', 'programmerindia', 'protonmail', 
  'python', 'reason', 'redbubble', 'reddit', 'redhat', 'redux', 'riot', 'ruby', 'runkeeper', 'rust', 
  'salesforce', 'samsung', 'sass', 'sega', 'shazam', 'shopify', 'sinaweibo', 'skyliner', 'skype', 'slack', 
  'soundcloud', 'sourceforge', 'spanchat', 'spotify', 'statamic', 'staticman', 'steam', 'steemit', 'stylus', 
  'superuser', 'support', 'suru', 'swarm', 'swift', 'swiggy', 'symfony', 'teamviewer', 'ted', 'teespring', 
  'tencentqq', 'tiktok', 'tinder-icon', 'todoist', 'toggl', 'tor', 'treehouse', 'trello', 'tumblr', 'tux', 
  'twilio', 'twitch', 'twitter', 'twitter-font', 'typescript', 'typo3', 'uber', 'uber-driver', 'uber-freight', 
  'ubuntu', 'udacity', 'udemy', 'unity', 'upwork', 'viadeo', 'viber-icon', 'vim', 'vimeo', 'vine', 
  'visualstudiocode', 'vk', 'vlcmediaplayer', 'vue-js', 'webstorm', 'wechat', 'whatsapp', 'wheniwork', 
  'wholensole', 'wikipedia', 'windows', 'wix', 'wordpress', 'xbox', 'xcode', 'xing', 'yammer', 'yandex', 
  'yarn', 'yash-raj', 'ycombinator', 'youtube-play', 'zendesk', 'zerply', 'zillow', 'zomato', 'zorin'
]);

const CATEGORY_META = {
  brands: { name: 'Brands & Social', description: 'Logos, tech stacks, social networks and services' },
  commerce: { name: 'Commerce & Payments', description: 'Shopping carts, bags, cards, and payment services' },
  communication: { name: 'Communication', description: 'Chat bubbles, mail, envelopes, and messaging' },
  devices: { name: 'Devices & Hardware', description: 'Monitors, phones, chips, storage, and appliances' },
  directional: { name: 'Directional & Arrows', description: 'Navigation chevrons, arrows, directions, and turns' },
  editor: { name: 'Editor & Formatting', description: 'Text alignment, lists, pens, markers, and tools' },
  feedback: { name: 'Feedback & Status', description: 'Alerts, checks, close, questions, and verification' },
  files: { name: 'Files & Folders', description: 'Documents, folders, archives, and attachments' },
  interface: { name: 'UI & Interface', description: 'Menus, controls, ratings, sliders, and general UI icons' },
  media: { name: 'Media & Audio', description: 'Play, pause, volume, cameras, music, and multimedia' },
  navigation: { name: 'Navigation & Places', description: 'Maps, pins, locations, cars, and vehicles' },
  security: { name: 'Security & Access', description: 'Locks, unlocks, keys, privacy, and restrictions' },
  time: { name: 'Time & Calendar', description: 'Clocks, dates, calendars, and alarms' },
  users: { name: 'Users & People', description: 'User avatars, teams, roles, and profiles' }
};

function classifyIcon(cls) {
  const c = cls.replace(/^hi-/, '');
  if (BRAND_EXACT.has(c)) return 'brands';
  if (['credit-card', 'credit-card1', 'cart', 'fill-bag', 'empty-bag', 'fat-bag', 'bean-bag', 'wallet', 'master-card', 'visa', 'paypal', 'paytm', 'applepay', 'googlepay', 'samsungpay', 'bitcoin', 'maestro'].includes(c)) return 'commerce';
  if (/arrow|chevron|turn-|next|previous/.test(c)) return 'directional';
  if (/play|music|camera|mic|volume|speaker|mute|video|presentation|game|gaming-console/.test(c)) return 'media';
  if (/file|folder|document|archive|paste|attachment/.test(c)) return 'files';
  if (/align-|list|edit|pencil|quotes|cut|copy|tag|paint-bucket|paintbox|marker/.test(c)) return 'editor';
  if (/monitor|hard-disk|sim_card|landline|phone|electric|power|washing-machine|robot|network/.test(c)) return 'devices';
  if (/chat|message|envelope|mail|paper-plane|speech-bubble|share/.test(c)) return 'communication';
  if (/user|users|profile|doctor|hand-index/.test(c)) return 'users';
  if (/map|location|pin|pinned|nav|compass|bus|car/.test(c)) return 'navigation';
  if (/lock|unlock|key|incognito|ban|block/.test(c)) return 'security';
  if (/clock|time|calendar|date|alarm/.test(c)) return 'time';
  if (/warning|info|help|question|check|cross|close|bell/.test(c)) return 'feedback';
  return 'interface';
}

const ICON_ALIASES = {
  'snapchat': 'spanchat',
  'share-alt': 'share1',
  'credit-card-alt': 'credit-card1',
  'folder-alt': 'folder1',
  'pencil-alt': 'pencil1',
  'star-alt': 'star1',
  'star-outline-alt': 'star-o1',
  'redo-alt': 'redo1',
  'undo-alt': 'undo1',
  'trash-alt': 'trash1',
  'attachment-alt': 'attachment1',
  'zoom-out-alt': 'zoom-out1',
  'zoom-in-alt': 'zoom-in1',
  'bell-alt': 'bell1',
  'search-alt': 'search1',
  'letterboxd-alt': 'letterboxd1',
  'envelope-alt': 'envelope1',
  'paper-plane-alt': 'paper-plane1',
  'user-alt': 'user1',
  'users-alt': 'users1',
  'check-alt': 'check1',
  'camera-alt': 'camera1',
  'flag-alt': 'flag1',
  'info-alt': 'info1',
  'lock-alt': 'lock1',
  'calendar-alt': 'calendar1',
  'time-alt': 'time1'
};

function enrichIcons(rawIcons) {
  const seen = new Set();
  const uniqueIcons = [];
  for (const item of rawIcons) {
    if (!seen.has(item.class)) {
      seen.add(item.class);
      uniqueIcons.push(item);
    }
  }

  const categorized = {};
  Object.keys(CATEGORY_META).forEach(cat => { categorized[cat] = []; });

  const enrichedIcons = uniqueIcons.map(item => {
    const category = classifyIcon(item.class);
    const name = item.class.replace(/^hi-/, '');
    const enriched = {
      ...item,
      name,
      category
    };
    categorized[category].push(enriched);
    return enriched;
  });

  return {
    icons: enrichedIcons,
    categorized,
    categories: CATEGORY_META,
    aliases: ICON_ALIASES
  };
}

module.exports = {
  BRAND_EXACT,
  CATEGORY_META,
  ICON_ALIASES,
  classifyIcon,
  enrichIcons
};

