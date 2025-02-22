import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import Button from './Button.jsx';

function BtnsHeader({
  theme,
  getPrevChapter,
  getNextChapter,
  cycleWordLimit,
  wordLimit,
  toggleShowSlider,
  showSlider,
  changeLanguage,
  language,
  fontSize,
  enlargeFont,
}) {
  return (
    <div className="flex justify-between w-full tools max-w-96">
      <Button theme={theme} fontSize="2xl" onClick={getPrevChapter} text="<" />
      <Link
        to="/"
        className={`border border-gray-500 hover:bg-gray-700 size-8 rounded flex items-center justify-center text-2xl`}
      >
        ⌂
      </Link>
      <Button theme={theme} onClick={cycleWordLimit} text={wordLimit == 100 ? <>ထ</> : wordLimit} />
      <Button theme={theme} onClick={toggleShowSlider} text={showSlider ? <>&#9734;</> : <>&#9733;</>} />
      <Button theme={theme} onClick={changeLanguage} text={language} />
      <div className="flex items-center font-size">
        <Button theme={theme} onClick={() => enlargeFont(false)} text={<FontAwesomeIcon icon={faMinus} />} />
        <span className="mx-2 text-lg fontSizeDiv">{fontSize}</span>
        <Button theme={theme} onClick={() => enlargeFont(true)} text={<FontAwesomeIcon icon={faPlus} />} />
      </div>
      <Button theme={theme} fontSize="2xl" onClick={getNextChapter} text=">" />
    </div>
  );
}
export default BtnsHeader;
