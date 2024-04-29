function Test() {
const [expanded, setExpanded] = React.useState(false)
  return (
    <div className="divide-y divide-slate-200 mx-5">
        <button className="flex items-center justify-between font-semibold py-2" onClick={() => setExpanded(!expanded)}>
            <span>What are the advantages of your service?</span>
            <svg className="fill-indigo-500 shrink-0 ml-8" width="16" height="16">
                <rect y="7" width="16" height="2" rx="1" className="transform origin-center transition duration-200 ease-out" />
                <rect y="7" width="16" height="2" rx="1" className={`transform origin-center ${!expanded && 'rotate-90'} transition duration-200 ease-out`}  />
            </svg>
        </button>
        <div className={`grid text-sm text-slate-600 overflow-hidden transition-all duration-300 ease-in-out ${expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
            <p className="overflow-hidden pb-3">
                If you go over your organisations or user limit, a member of the team will reach out about bespoke pricing. In the meantime, our collaborative features won't appear in accounts or users that are over the 100-account or 1,000-user limit.
            </p>
        </div>
    </div>
  );
}