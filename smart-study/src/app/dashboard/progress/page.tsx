import { weeklyData, achievements, subjects } from "../../../../data/index";

const ProgressPage = () => {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Progress Overview</h1>
        <p className="text-muted-foreground">
          Track your learning journey and celebrate your achievements
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center space-x-2">
            <svg
              className="h-5 w-5 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="font-semibold">Total Study Time</h3>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold">2h</div>
            <p className="text-xs text-muted-foreground">+0.5h this week</p>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center space-x-2">
            <svg
              className="h-5 w-5 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="font-semibold">Lessons Completed</h3>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">+1 this week</p>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center space-x-2">
            <svg
              className="h-5 w-5 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <h3 className="font-semibold">Current Streak</h3>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold">1 days</div>
            <p className="text-xs text-muted-foreground">Personal best!</p>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center space-x-2">
            <svg
              className="h-5 w-5 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            <h3 className="font-semibold">AI Interactions</h3>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold">10</div>
            <p className="text-xs text-muted-foreground">Questions asked</p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Weekly Activity */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Weekly Activity</h2>
            <div className="space-y-4">
              {weeklyData.map((day, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-12 text-sm font-medium">{day.day}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(day.hours / 5) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-muted-foreground w-12">
                        {day.hours}h
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {day.completed} lessons completed
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Subject Progress */}
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Subject Progress</h2>
            <div className="space-y-4">
              {subjects.map((subject, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{subject.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {subject.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${subject.color}`}
                      style={{ width: `${subject.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Achievements */}
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Achievements</h2>
            <div className="space-y-3">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`p-3 rounded-lg border ${
                    achievement.earned
                      ? "bg-primary/5 border-primary/20"
                      : "bg-muted/50"
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm">
                        {achievement.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mb-2">
                        {achievement.description}
                      </p>
                      {achievement.earned ? (
                        <p className="text-xs text-primary font-medium">
                          Earned on {achievement.date}
                        </p>
                      ) : (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Progress</span>
                            <span>{achievement.progress}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-1">
                            <div
                              className="bg-primary h-1 rounded-full"
                              style={{ width: `${achievement.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Learning Goals */}
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">This Month's Goals</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Study 40 hours</span>
                  <span>2/40h</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: "5%" }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Complete 50 lessons</span>
                  <span>2/50</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: "4%" }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Maintain 20-day streak</span>
                  <span>1/20 days</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: "5%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;
