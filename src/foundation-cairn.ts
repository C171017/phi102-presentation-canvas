import './foundation-cairn.css';

const supports = [
  {
    corner: 'upper-left',
    stone: 'translate(87 150) scale(.79 .81)',
    mist: 'M84 133 C72 111 111 110 109 95 S120 71 134 61 C109 76 122 86 119 100 S83 118 91 133Z',
  },
  {
    corner: 'upper-right',
    stone: 'translate(238 161) scale(-.85 .84)',
    mist: 'M234 142 C246 118 207 111 203 98 S182 74 158 62 C178 81 184 89 192 106 S233 125 227 143Z',
  },
  {
    corner: 'lower-left',
    stone: 'translate(38 206) scale(-.98 .89)',
    mist: 'M35 180 C19 149 73 137 68 115 S110 87 135 61 C114 95 83 93 82 120 S40 149 44 179Z',
  },
  {
    corner: 'lower-right',
    stone: 'translate(180 240) scale(1.08 .99)',
    mist: 'M173 210 C168 187 203 170 182 145 S136 108 149 68 C127 103 144 127 164 148 S163 191 167 210Z',
  },
];

export function drawCairn(id: string, tips = false) {
  const stoneId = `${id}-stone`;
  const outlineId = `${id}-outline`;
  const mistId = `${id}-mist`;
  const shortenedMist = tips
    ? `<path class="cairn-short-mist" fill="url(#${mistId})"
        d="M35 180 C23 155 51 151 48 130 S46 113 57 103 C52 116 60 121 57 133 S40 162 44 179Z"/>`
    : '';

  return `<defs>
    <image id="${stoneId}" href="/generated/foundationalism/gray-stone.webp" x="-30" y="-42" width="60" height="43"/>
    <filter id="${outlineId}" x="-10%" y="-10%" width="120%" height="120%">
      <feMorphology in="SourceAlpha" operator="dilate" radius="1.3" result="expanded"/>
      <feComposite in="expanded" in2="SourceAlpha" operator="out" result="rim"/>
      <feFlood flood-color="#79736b"/>
      <feComposite in2="rim" operator="in"/>
    </filter>
    <linearGradient id="${mistId}" x1="0" y1="1" x2=".35" y2="0">
      <stop stop-color="#76716a" stop-opacity=".38"/>
      <stop offset=".52" stop-color="#a5a39a" stop-opacity=".24"/>
      <stop offset="1" stop-color="#75736d" stop-opacity=".44"/>
    </linearGradient>
  </defs>
  ${supports.map(({ corner, stone, mist }) =>
    `<g class="cairn-support" data-foundation-corner="${corner}">
      <path class="cairn-active cairn-full-mist" fill="url(#${mistId})" d="${mist}"/>
      ${corner === 'lower-left' ? shortenedMist : ''}
      <g transform="${stone}">
        <ellipse cx="2" cy="0" rx="28" ry="3.5" fill="#504a42" opacity=".12"/>
        <use class="cairn-outline" href="#${stoneId}" filter="url(#${outlineId})"/>
        <use class="cairn-active" href="#${stoneId}"/>
      </g>
    </g>`).join('')}
  <g class="cairn-supported">
    <use href="#${stoneId}" transform="translate(145 80) rotate(-6) scale(1.35 1.43)"/>
  </g>`;
}
