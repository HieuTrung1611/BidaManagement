const fs = require('fs');

async function run() {
  const file = fs.readFileSync('frontend/public/image/main.png');
  const formData = new FormData();
  formData.append('file', new Blob([file]), 'main.png');

  try {
    const res = await fetch('http://localhost:8080/face/embedding', {
      method: 'POST',
      body: formData
    });
    console.log("Status:", res.status);
    console.log("Response:", await res.text());
  } catch (err) {
    console.error("Error:", err);
  }
}

run();
