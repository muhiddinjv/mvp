const Loader = () => {
  const { ayahs, loading } = useAyahs();
  const [ara, setAra] = React.useState(false);
  const [tra, setTra] = React.useState(false);
  const [eng, setEng] = React.useState(true);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="full-surah">
      <Button fn={() => setAra(!ara)} text="ara" />
      <Button fn={() => setTra(!tra)} text="tra" />
      <Button fn={() => setEng(!eng)} text="eng" />
      {Object.keys(ayahs).map((ayahKey) => (
        <Ayah
          key={ayahKey}
          ayahKey={ayahKey}
          ayah={ayahs[ayahKey]}
          ara={ara}
          tra={tra}
          eng={eng}
        />
      ))}
    </div>
  );
};