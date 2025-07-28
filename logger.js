// src/utils/logger.js

export async function Log(stack, level, pkg, message) {
  const body = {
    stack: stack.toLowerCase(),
    level: level.toLowerCase(),
    package: pkg.toLowerCase(),
    message,
  };

  try {
    const res = await fetch("http://20.244.56.144/evaluation-service/logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const data = await res.json();
    console.log("Log created:", data);
  } catch (err) {
    console.error("Logging failed:", err);
  }
} 