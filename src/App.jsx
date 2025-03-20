import React, { useState } from "react";
import "./App.css";
import { useEffect } from "react";
import GitHubCalendar from "react-github-calendar";
import axios from "axios";

function App() {
  const username = "DevJaysz";
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchContributions = async () => {
      try {
        const response = await axios.get(
          `https://api.github.com/users/${username}/events`
        );
        const contributions = response.data
          .filter(
            (event) =>
              event.type === "PushEvent" || event.type === "PullRequestEvent"
          )
          .slice(0, 2)
          .map((event) => ({
            type: event.type,
            repo: event.repo.name,
            date: new Date(event.created_at).toLocaleDateString(),
            message: event.payload.commits
              ? event.payload.commits[0].message
              : event.payload.pull_request.title,
          }));
        setContributions(contributions);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContributions();
  }, [username]);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

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
            showWeekdayLabels={true}
            showMonthLabels={true}
            year={new Date().getFullYear()}
            transformData={(data) => data}
            style={{
              border: ".1px solid #ccc",
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
            <i>note: this is a new github </i>
          </span>
        </div>
        <div className="contributions__bottom">
          {contributions.length > 0 ? (
            <ul>
              {contributions.map((contribution, index) => (
                <div className="contributions__container grid" key={index}>
                  <div className="contributions__wrapper">
                    <li>{contribution.repo}</li>
                    <li>{getTimeSince(contribution.date)}</li>
                  </div>
                  <div className="recent">
                    {contribution.type === "PushEvent"
                      ? "Commit"
                      : "Pull Request"}
                    : {contribution.message}
                  </div>
                </div>
              ))}
            </ul>
          ) : (
            <p>No recent contributions found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
