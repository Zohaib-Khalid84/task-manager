const keyOf = (d) => new Date(d).toDateString();

export default function WeeklyChart({ tasks }) {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d);
  }

  const data = days.map((d) => ({
    label: d.toLocaleDateString(undefined, { weekday: 'short' }),
    created: tasks.filter((t) => keyOf(t.createdAt) === d.toDateString()).length,
    done: tasks.filter((t) => t.completed && keyOf(t.updatedAt) === d.toDateString()).length,
  }));

  const max = Math.max(1, ...data.flatMap((x) => [x.created, x.done]));

  return (
    <>
      <div className="week">
        {data.map((x) => (
          <div className="week-col" key={x.label}>
            <div className="week-bars">
              <div className="wbar created" style={{ height: `${(x.created / max) * 130}px` }} title={`Created: ${x.created}`} />
              <div className="wbar done" style={{ height: `${(x.done / max) * 130}px` }} title={`Completed: ${x.done}`} />
            </div>
            <span className="week-day">{x.label}</span>
          </div>
        ))}
      </div>
      <div className="week-legend">
        <span><span className="dot" style={{ background: 'var(--primary)' }} />Created</span>
        <span><span className="dot green" />Completed</span>
      </div>
    </>
  );
}