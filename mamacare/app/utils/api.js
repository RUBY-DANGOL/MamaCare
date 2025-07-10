// utils/api.js
export async function getRecommendations(weight, height, region, foods) {
  const res = await fetch('http://<YOUR_BACKEND_URL>/recommend', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      weight, height, region, foods
    })
  });
  return res.json();
}
