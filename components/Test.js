const Ayah = ({ ayah }) => {
  const { enWords, trWords, arWords } = React.useContext(GlobalContext);
  const { surah, ayah: ayahNum, position } = ayah;
  const enText = enWords[position];
  const trText = trWords[position];
  const arText = arWords[position];

  return (
    <div key={ayahNum} className="ayah">
      <p>
        {surah}:{ayahNum}
      </p>
      <p>English: {enText}</p>
      <p>Turkish: {trText}</p>
      <p>Arabic: {arText}</p>
    </div>
  );
};

const AyahList = () => {
    const { ayahData } = React.useContext(GlobalContext);
  return (
    <div>
      {Object.values(ayahData).map((ayah) => (
        <Ayah ayah={ayah} />
      ))}
    </div>
  );
};
