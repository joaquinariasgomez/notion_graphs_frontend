import '../../css/CreateGraphBox.css';

export default function CreateGraphStep1({ graphConfiguration, onUpdateGraphConfig, gotoNext, gotoEnd }) {

  const onNextButton = () => {
    if (graphConfiguration.graphType === 'SAVINGS') {
      gotoEnd()
    } else {
      gotoNext()
    }
  }

  return (
    <div className='creategraphbox__stepcontainer'>
      <div className='creategraphbox__stepcontent'>
        hey
      </div>
      <div className='creategraphbox__arrows'>
        <button className='creategraphbox__button next' onClick={onNextButton} disabled={false}>
          Next
        </button>
      </div>
    </div>
  );
}