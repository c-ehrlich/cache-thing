"use client";

import { Suspense } from "react";

export default function App() {
  return (
    <div className="App">
      <div style={{ marginLeft: "20px" }}>
        <h1>My Posts</h1>
        <Suspense fallback={<h1>Loading...</h1>}>
          <Posts />
        </Suspense>
      </div>
    </div>
  );
}

function waitSync(seconds) {
  const milliseconds = seconds * 1000;
  const startTime = Date.now();
  let currentTime = startTime;
  while (currentTime - startTime < milliseconds) {
    currentTime = Date.now();
  }
}

function fetchPosts() {
  console.log("fetching posts...");
  let result;
  let status = "pending";
  let fetching = fetch("https://jsonplaceholder.typicode.com/posts")
    .then((res) => res.json())
    .then((success) => {
      waitSync(2);
      status = "fulfilled";
      result = success;
    })
    .catch((error) => {
      status = "rejected";
      result = error;
    });

  return () => {
    if (status === "pending") {
      throw fetching;
    } else if (status === "rejected") {
      throw result;
    } else if (status === "fulfilled") {
      console.log("posts fetched!");
      return result;
    }
  };
}

const postsData = fetchPosts();

function Posts() {
  const posts = postsData();
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
      {posts.map((post) => (
        <p key={post.id}>{post.title}</p>
      ))}
    </div>
  );
}
