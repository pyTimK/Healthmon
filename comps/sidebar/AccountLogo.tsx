interface Props {
  selected?: boolean;
  size?: number;
}

const AccountLogo: React.FC<Props> = ({ selected = false, size = 24 }) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      xmlnsXlink='http://www.w3.org/1999/xlink'
      width={size}
      height={size}
      viewBox='0 0 18 18'>
      <defs>
        <rect id='account-rect-1' width='18' height='18' x='0' y='0' />
        <mask id='account-mask-2' maskContentUnits='userSpaceOnUse' maskUnits='userSpaceOnUse'>
          <rect width='18' height='18' x='0' y='0' fill='black' />
          <use fill='white' xlinkHref='#account-rect-1' />
        </mask>
        <path
          id='account-path-4'
          fillRule='evenodd'
          d='M11.25 6c0-1.24500084-1.00500107-2.25-2.25-2.25-1.24500084 0-2.25 1.00499916-2.25 2.25 0 1.24499893 1.00499916 2.25 2.25 2.25 1.24499893 0 2.25-1.00500107 2.25-2.25zM4.5 11.9849987c.96750069 1.45499993 2.625 2.41500092 4.5 2.41500092s3.53250122-.960001 4.5-2.41500092c-.02249908-1.4925003-3.0074997-2.30999946-4.5-2.30999946-1.5 0-4.47750092.81749916-4.5 2.30999946z'
        />
        <mask id='account-mask-5' x='0' y='0' maskContentUnits='userSpaceOnUse' maskUnits='userSpaceOnUse'>
          <rect width='18' height='18' x='0' y='0' fill='white' />
          <use fill='black' xlinkHref='#account-path-4' />
        </mask>
      </defs>
      <g>
        <use fill='none' xlinkHref='#account-rect-1' />
        <g mask='url(#account-mask-2)'>
          <path fill='none' d='M0 0h18v18H0V0z' />
          <use
            fillOpacity='0'
            stroke={selected ? "rgb(236, 111, 126)" : "rgb(245,245,245)"}
            strokeLinecap='butt'
            strokeLinejoin='miter'
            strokeWidth='2'
            mask='url(#account-mask-5)'
            xlinkHref='#account-path-4'
          />
        </g>
      </g>
    </svg>
  );
};

export default AccountLogo;
