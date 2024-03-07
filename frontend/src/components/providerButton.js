import './componentStyles.css'

export function ProviderButton({ providerName, loginFunc, userData }) {
  const myAltText = `${providerName} Provider`;

  if (userData.address == null) {
    return (
      <div className='provider-element' onClick={loginFunc}>
        <img className='provider-logo' alt={myAltText}></img>
        <div>{providerName}</div>
      </div >
    );
  } else {
    return null;
  }
}