// Taken from https://hub.jetbrains.com/api/rest/avatar/default?username=Jet%20Brains&dpr=2&size=56

export const avatarDataUri = `data:image/svg+xml,${encodeURIComponent(`
<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
            <stop stop-color="#D50F6B" offset="0"/>
            <stop stop-color="#E73AE8" offset="1"/>
        </linearGradient>
    </defs>
    <g>
        <rect fill="url(#gradient)"
              x="0" y="0" width="40" height="40"
              rx="3" ry="3"/>
        <text x="5" y="19"
              font-family="Arial, Helvetica, sans-serif"
              font-size="15px"
              letter-spacing="1"
              fill="#FFFFFF">
            <tspan>JB</tspan>
            <tspan x="6" y="28">_</tspan>
        </text>
    </g>
</svg>
`)}`;
