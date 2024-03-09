import './componentStyles.css'

export function ProviderButton({ providerName, loginFunc, userData, logoPath }) {
  const myAltText = `${providerName} Provider`;

  if (userData.address == null) {
    return (
      <div className='provider-element' onClick={loginFunc}>
        <img
          src={logoPath}
          className='provider-logo'
          alt={myAltText} />
        <div>{providerName}</div>
      </div >
    );
  } else {
    return null;
  }
}