function Surahs() {
  const { theme } = useTheme("dark");

  return (
    <div className={`${ theme === "dark" ? "bg-gray-800 text-slate-300" : "bg-gray-100 text-slate-800"} flex h-screen w-screen items-center justify-center`}>
        <Link href="/36" className="border px-4 py-2 rounded">Start</Link>
    </div>
  );
}
