const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    fontSize:'24px',
    gap:'3rem',
}

const starContainerStyle = {
    display: 'flex',
    gap:'4px'
    
}
const textStyle = {
    lineHeigth: '0',
    margin:'0'
}
const star = {
    width: '48px',
    height: '48px',
    display: 'block',
    cursor:'pointer'
}

export default function Stars({maxLength=5}) {
    return <div style={containerStyle}>
        <div style={starContainerStyle}>
        {Array.from({ length: maxLength }, (_, i) => <Star key={i+1}/>)}
        </div>
            <p style={textStyle}>5</p>
    </div>
}

function Star() {
    return <span role="button" style={star}>
        <svg
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
  viewBox="0 0 24 24"
  stroke="#fff"
>
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="{2}"
    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
  />
</svg>
    </span>
}