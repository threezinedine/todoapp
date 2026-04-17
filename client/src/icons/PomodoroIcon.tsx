export const PomodoroIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		width="24"
		height="24"
	>
		{/* Tomato body */}
		<circle
			cx="12"
			cy="13"
			r="9"
			fill="#E63946"
		/>

		{/* Tomato shine/highlight */}
		<ellipse
			cx="9"
			cy="10"
			rx="4"
			ry="5"
			fill="#F77F88"
			opacity="0.6"
		/>

		{/* Stem/leaves */}
		<path
			d="M 12 4 Q 11 2 10 2"
			stroke="#52B788"
			strokeWidth="1.5"
			fill="none"
		/>
		<path
			d="M 12 4 Q 13 2 14 2"
			stroke="#52B788"
			strokeWidth="1.5"
			fill="none"
		/>
		<path
			d="M 11 3 L 9.5 1.5"
			stroke="#52B788"
			strokeWidth="1"
			fill="none"
		/>
		<path
			d="M 13 3 L 14.5 1.5"
			stroke="#52B788"
			strokeWidth="1"
			fill="none"
		/>

		{/* Clock hand - minute hand */}
		<line
			x1="12"
			y1="13"
			x2="12"
			y2="6"
			stroke="#FFFFFF"
			strokeWidth="1.5"
			strokeLinecap="round"
		/>

		{/* Clock hand - hour hand */}
		<line
			x1="12"
			y1="13"
			x2="15"
			y2="13"
			stroke="#FFFFFF"
			strokeWidth="1.5"
			strokeLinecap="round"
		/>

		{/* Center dot */}
		<circle
			cx="12"
			cy="13"
			r="1.5"
			fill="#FFFFFF"
		/>
	</svg>
)
