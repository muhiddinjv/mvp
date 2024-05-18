const Route = ({ children, path }) => {
  // isolate the user's current path
  const [currentPath, setCurrentPath] = React.useState(
    window.location.pathname
  );

  React.useEffect(() => {
    // change handler
    const onPathChange = () => {
      // update the currentPath when it changes *after* render
      setCurrentPath(window.location.pathname);
    };
    // turn on event listener and its handler ⬆
    window.addEventListener("popstate", onPathChange);
    // 🧼 anonymous cleanup function
    return () => {
      window.removeEventListener("popstate", onPathChange);
    };
  }, []);

  return currentPath === path ? children : null;
};
