const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

module.exports = async (req, res) => {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).end();

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  if (!body.token) return res.status(400).json({ error: 'Missing token' });

  const name = String(body.name || '').trim().slice(0, 30) || null;

  const { error } = await supabase
    .from('fcm_tokens')
    .upsert({ token: body.token, name }, { onConflict: 'token' });

  if (error) return res.status(500).json({ error: error.message });
  return res.status(201).json({ ok: true });
};
