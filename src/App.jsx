import React, { useState, useEffect } from "react";
import GitHubCalendar from "react-github-calendar";
import "./App.css";

const App = () => {
  const username = "jaysus-dev";
  const [recentCommits, setRecentCommits] = useState([]);

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    const intervals = [
      { label: "years", seconds: 31536000 },
      { label: "months", seconds: 2592000 },
      { label: "days", seconds: 86400 },
      { label: "hours", seconds: 3600 },
      { label: "minutes", seconds: 60 },
    ];
    for (const { label, seconds: sec } of intervals) {
      const count = Math.floor(seconds / sec);
      if (count >= 1) return `${count} ${label} ago`;
    }
    return "Just now";
  };

  const fetchCommits = async () => {
    try {
      const repoResponse = await fetch(
        `https://api.github.com/users/${username}/repos?sort=updated&per_page=2`
      );
      const repos = await repoResponse.json();

      const commitData = await Promise.all(
        repos.map(async (repo) => {
          const commitResponse = await fetch(
            `https://api.github.com/repos/${username}/${repo.name}/commits`
          );
          const commits = await commitResponse.json();
          return commits[0]
            ? {
                repoName: repo.name,
                commitMessage: commits[0].commit.message,
                commitDate: timeAgo(commits[0].commit.author.date),
                commitUrl: commits[0].html_url,
              }
            : null;
        })
      );

      setRecentCommits(commitData.filter(Boolean));
    } catch (error) {
      console.error("Error fetching commits:", error);
    }
  };

  useEffect(() => {
    fetchCommits();
  }, []);

  return (
    <div className="git">
      <div className="github__container">
        <div className="github__wrapper">
          <GitHubCalendar
            username={username}
            color="hsl(120, 100%, 50%)"
            colorScheme="dark"
            blockSize={10}
            blockMargin={4}
            fontSize={12}
            showWeekdayLabels
            showMonthLabels
            year={new Date().getFullYear()}
            transformData={(data) => data}
            style={{
              border: "0.1px solid #ccc",
              borderRadius: "8px",
              padding: "16px",
            }}
          />
        </div>
      </div>

      <div className="contributions__top">
        <div className="contributions__header">
          <h3>Contribution Activity</h3>
          <span>
            <i>Note: this is a new GitHub</i>
          </span>
        </div>
        <div className="contributions__bottom">
          <ul>
            {recentCommits.length ? (
              recentCommits.map(
                ({ repoName, commitMessage, commitDate, commitUrl }, index) => (
                  <div key={index} className="contributions__container grid">
                    <div className="contributions__wrapper">
                      <li>
                        <strong>Repo:</strong> {repoName}
                      </li>
                      <li>
                        <strong>Committed:</strong> {commitDate}
                      </li>
                    </div>
                    <div className="recent">
                      <li>
                        <a
                          href={commitUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {commitMessage}
                        </a>
                      </li>
                    </div>
                  </div>
                )
              )
            ) : (
              <li>Loading recent commits...</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default App;
