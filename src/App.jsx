
import { useState, useEffect } from 'react';
import './App.css';

const initialTasks = [
  { id: 1, task: 'Complete Java assignment', subject: 'Java', time: '09:00', date: '', completed: false },
  { id: 2, task: 'Revise Data Analytics notes', subject: 'Analytics', time: '11:00', date: '', completed: false },
  { id: 3, task: 'Practice React components', subject: 'Web Development', time: '14:00', date: '', completed: true },
];

function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('studyTasks')) || initialTasks;
    } catch {
      return initialTasks;
    }
  });

  const [taskName, setTaskName] = useState('');
  const [subject, setSubject] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  useEffect(() => {
    localStorage.setItem('studyTasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e) => {
    e.preventDefault();
    if (!taskName.trim() || !subject.trim()) return;

    setTasks([...tasks, {
      id: Date.now(),
      task: taskName.trim(),
      subject: subject.trim(),
      date,
      time,
      completed: false,
    }]);

    setTaskName('');
    setSubject('');
    setDate('');
    setTime('');
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const completed = tasks.filter(t => t.completed).length;
  const pending = tasks.length - completed;
  const progress = tasks.length
    ? Math.round(completed / tasks.length * 100)
    : 0;

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const schedule = [...tasks]
    .filter(t => !t.completed)
    .sort((a, b) => (a.time || '99:99').localeCompare(b.time || '99:99'))
    .slice(0, 4);

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">✦</div>
          <div>
            <h2>StudyMate</h2>
            <span>SMART STUDY PLANNER</span>
          </div>
        </div>

        <p className="menu-label">WORKSPACE</p>
        <nav>
          <a className="nav-link active" href="#dashboard">▦ <span>Dashboard</span></a>
          <a className="nav-link" href="#tasks">☑ <span>My Tasks</span></a>
          <a className="nav-link" href="#schedule">◷ <span>Study Schedule</span></a>
          <a className="nav-link" href="#progress">▥ <span>My Progress</span></a>
          <a className="nav-link" href="#add-task">＋ <span>Add a Task</span></a>
        </nav>

        <div className="sidebar-bottom">
          <div className="focus-icon">✧</div>
          <h3>Stay focused!</h3>
          <p>Every small step takes you closer to your goals.</p>
          <div className="mini-progress"><span /></div>
        </div>

        <div className="profile">
          <div className="avatar">S</div>
          <div><strong>Student</strong><small>Keep learning ✨</small></div>
        </div>
      </aside>

      <main className="main" id="dashboard">
        <header className="topbar">
          <div>
            <p className="eyebrow">YOUR PERSONAL LEARNING SPACE</p>
            <h1>Good morning, Student <span>👋</span></h1>
            <p className="subheading">Ready to make today count? Let's get started.</p>
          </div>
          <div className="date-pill"><span>▦</span> {today}</div>
        </header>

        <section className="hero">
          <div className="hero-content">
            <span className="hero-tag">✦ YOUR DAILY MOTIVATION</span>
            <h2>Make today a<br />great study day.</h2>
            <p>Small steps every day lead to<br />big results. You've got this!</p>
            <a className="hero-button" href="#add-task">Plan my day <span>→</span></a>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="art-circle circle-one" />
            <div className="art-circle circle-two" />
            <div className="book book-back" />
            <div className="book book-middle" />
            <div className="book book-front"><span>✦</span></div>
            <div className="art-cap">🎓</div>
            <div className="art-star star-one">✦</div>
            <div className="art-star star-two">✧</div>
          </div>
        </section>

        <section className="stats">
          <div className="stat-card">
            <div className="stat-top"><span>Total tasks</span><div className="stat-icon purple">▤</div></div>
            <h3>{tasks.length}</h3>
            <p>Your learning checklist</p>
          </div>
          <div className="stat-card">
            <div className="stat-top"><span>Completed</span><div className="stat-icon green">✓</div></div>
            <h3>{completed}</h3>
            <p>Great work so far!</p>
          </div>
          <div className="stat-card">
            <div className="stat-top"><span>Still to do</span><div className="stat-icon orange">◷</div></div>
            <h3>{pending}</h3>
            <p>One step at a time</p>
          </div>
        </section>

        <div className="content-grid">
          <section className="panel schedule-panel" id="schedule">
            <div className="section-heading">
              <div><h2>Today's schedule</h2><p>Your next study sessions</p></div>
              <span className="section-symbol">◷</span>
            </div>
            {schedule.length ? (
              <div className="schedule-list">
                {schedule.map((t, i) => (
                  <div className="schedule-row" key={t.id}>
                    <div className="schedule-time">{t.time || '--:--'}</div>
                    <div className={`schedule-dot dot-${i % 3}`} />
                    <div className="schedule-info">
                      <strong>{t.task}</strong>
                      <span>{t.subject}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">Your schedule is clear. Add a task to plan your next session.</div>
            )}
            <a href="#add-task" className="text-link">+ Add study session</a>
          </section>

          <section className="panel progress-panel" id="progress">
            <div className="section-heading">
              <div><h2>Your progress</h2><p>Keep up the good work</p></div>
              <span className="section-symbol">↗</span>
            </div>
            <div className="progress-center">
              <div className="progress-ring" style={{ '--progress': `${progress * 3.6}deg` }}>
                <div className="ring-inner">
                  <strong>{progress}%</strong>
                  <span>completed</span>
                </div>
              </div>
            </div>
            <p className="progress-message">
              {progress === 100 && tasks.length > 0
                ? 'Amazing! All tasks completed!'
                : progress >= 50
                ? "You're doing great. Keep going!"
                : 'Every completed task is a win.'}
            </p>
            <div className="progress-summary">
              <span><i className="legend-dot" /> Completed <strong>{completed}</strong></span>
              <span><i className="legend-dot pending-dot" /> Pending <strong>{pending}</strong></span>
            </div>
          </section>
        </div>

        <section className="panel tasks-panel" id="tasks">
          <div className="section-heading">
            <div><h2>Upcoming tasks</h2><p>Stay organised and on track</p></div>
            <a className="small-button" href="#add-task">+ New task</a>
          </div>

          {tasks.length === 0 ? (
            <div className="empty-state">No tasks yet. Add your first task below!</div>
          ) : (
            <div className="task-list">
              {tasks.map(t => (
                <div className={`task-row ${t.completed ? 'task-done' : ''}`} key={t.id}>
                  <input
                    type="checkbox"
                    checked={t.completed}
                    onChange={() => toggleTask(t.id)}
                    aria-label={`Complete ${t.task}`}
                  />
                  <div className="task-description">
                    <strong>{t.task}</strong>
                    <span>{t.subject}</span>
                  </div>
                  <span className="task-date">{t.date || 'No deadline'}</span>
                  <span className={`status ${t.completed ? 'status-done' : 'status-pending'}`}>
                    {t.completed ? 'Completed' : 'In progress'}
                  </span>
                  <button className="delete-button" onClick={() => deleteTask(t.id)} aria-label={`Delete ${t.task}`}>×</button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="panel add-panel" id="add-task">
          <div className="section-heading">
            <div><h2>Create a study task</h2><p>Make a plan and turn it into progress.</p></div>
            <span className="section-symbol">＋</span>
          </div>
          <form onSubmit={addTask}>
            <div className="form-field">
              <label>Task name</label>
              <input value={taskName} onChange={e => setTaskName(e.target.value)} placeholder="e.g. Prepare for Java exam" required />
            </div>
            <div className="form-field">
              <label>Subject</label>
              <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="e.g. Java Programming" required />
            </div>
            <div className="form-field">
              <label>Study date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} />
            </div>
            <div className="form-field">
              <label>Study time</label>
              <input type="time" value={time} onChange={e => setTime(e.target.value)} />
            </div>
            <button type="submit" className="submit-button">＋ Create task</button>
          </form>
        </section>

        <footer>Made with care for your learning journey <span>✦</span></footer>
      </main>
    </div>
  );
}

export default App;
