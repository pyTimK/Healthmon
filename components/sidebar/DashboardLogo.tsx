interface Props {
  selected?: boolean;
  size?: number;
}

const DashboardLogo: React.FC<Props> = ({ selected = false, size = 24 }) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      xmlnsXlink='http://www.w3.org/1999/xlink'
      width={size}
      height={size}
      viewBox='0 0 18 18'>
      <defs>
        <rect id='dashboard-rect-1' width='18' height='18' x='0' y='0' />
        <mask id='dashboard-mask-2' maskContentUnits='userSpaceOnUse' maskUnits='userSpaceOnUse'>
          <rect width='18' height='18' x='0' y='0' fill='black' />
          <use fill='white' xlinkHref='#dashboard-rect-1' />
        </mask>
        <path
          id='dashboard-path-4'
          fillRule='evenodd'
          d='M8.25 9.75h-6v-7.5h6v7.5zm1.5-3v-4.5h6v4.5h-6zm0 9h6v-7.5h-6v7.5zm-1.5 0h-6v-4.5h6v4.5z'
        />
        <mask id='dashboard-mask-5' x='0' y='0' maskContentUnits='userSpaceOnUse' maskUnits='userSpaceOnUse'>
          <rect width='18' height='18' x='0' y='0' fill='white' />
          <use fill='black' xlinkHref='#dashboard-path-4' />
        </mask>
      </defs>
      <g>
        <use fill='none' xlinkHref='#dashboard-rect-1' />
        <g mask='url(#dashboard-mask-2)'>
          <path fill='none' d='M0 0h18v18H0V0z' />
          <use
            fillOpacity='0'
            stroke={selected ? "rgb(236, 111, 126)" : "rgb(245,245,245)"}
            strokeLinecap='butt'
            strokeLinejoin='miter'
            strokeWidth='2'
            mask='url(#dashboard-mask-5)'
            xlinkHref='#dashboard-path-4'
          />
        </g>
      </g>
    </svg>
  );
};

export default DashboardLogo;
