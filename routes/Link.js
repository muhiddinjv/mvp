const Link = ({ href, className = "link", children }) => {
  // custom click handler
  const onClick = (e) => {
    // if ctrl or meta key are held on click, allow default behavior of opening link in new tab
    if (e.metaKey || e.ctrlKey) {
      return;
    }
    e.preventDefault();
    window.history.pushState({}, "", href);
    // explicitly create and emit popstate event
    const navEvent = new PopStateEvent("popstate");
    window.dispatchEvent(navEvent);
  };

  return (
    <a onClick={onClick} href={href} className={className}>
      {children}
    </a>
  );
};
