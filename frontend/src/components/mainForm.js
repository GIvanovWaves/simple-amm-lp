import './componentStyles.css'

export function MainForm({ config }) {
  const link = `${config.explorer}/addresses/${config.dApp}`

  return (
    <div className="main-form">
      <div>
        dApp: <a href={link} target="_blank">{config.dApp}</a>
      </div>
      <div>
        <input className="form-input" defaultValue={0}></input>
        <input className="form-input" defaultValue={0}></input>
      </div>
    </div >
  );
}