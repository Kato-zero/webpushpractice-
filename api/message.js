const admin = require('firebase-admin');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
  });
}

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
  const sender = String(body.sender || '').trim().slice(0, 30);
  const text = String(body.body || '').trim().slice(0, 500);
  if (!sender || !text) return res.status(400).json({ error: 'Need sender and body' });

  // Save the message. Realtime will push it to every open tab.
  const { data: message, error } = await supabase
    .from('messages')
    .insert({ sender, body: text })
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });

  // Push to every device except the sender's
  const { data: rows, error: tokenError } = await supabase
    .from('fcm_tokens')
    .select('token')
    .neq('name', sender);
  if (tokenError) return res.status(500).json({ error: tokenError.message });

  const tokens = rows.map(r => r.token);
  const preview = text.length > 100 ? text.slice(0, 100) + '…' : text;
  let pushesSent = 0;

  for (let i = 0; i < tokens.length; i += 500) {
    const batch = tokens.slice(i, i + 500);
    const result = await admin.messaging().sendEachForMulticast({
      tokens: batch,
      notification: { title: sender, body: preview },
      webpush: { fcmOptions: { link: process.env.PAGES_URL || '/' } }
    });
    pushesSent += result.successCount;

    const dead = [];
    result.responses.forEach((r, idx) => {
      if (!r.success && r.error && (
        r.error.code === 'messaging/registration-token-not-registered' ||
        r.error.code === 'messaging/invalid-registration-token')) {
        dead.push(batch[idx]);
      }
    });
    if (dead.length) {
      await supabase.from('fcm_tokens').delete().in('token', dead);
    }
  }

  return res.status(201).json({ message, pushesSent });
};
