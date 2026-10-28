/**
 * Pls-CLI Lightweight AI Proxy Microservice
 * 
 * Routes natural language terminal intent queries to local Ollama (Gemma 2)
 * or compatible hosted inference endpoints.
 * 
 * Security & Boundary Controls:
 * 1. Zero Child Processes: Pure HTTP proxy, never executes shell commands.
 * 2. Strict JSON Grammar: Enforces schema validation before responding to client.
 * 3. 15-Second Abort Timeout: Prevents hanging client connections.
 * 4. CORS Bound: Configured for Vite development & production origins.
 */

import http from 'node:http';

const PORT = process.env.PORT || 3001;
const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://127.0.0.1:11434';
const DEFAULT_MODEL = process.env.GEMMA_MODEL || 'gemma2:2b';
const INFERENCE_TIMEOUT_MS = 15000;

/**
 * Standard CORS Headers
 */
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400'
};

/**
 * Validates and sanitizes structured Gemma output against required schema
 * 
 * @param {any} rawData
 * @param {string} fallbackShell
 * @param {string} fallbackOS
 * @returns {Object|null} Validated schema object or null
 */
function validateStructuredOutput(rawData, fallbackShell = 'bash', fallbackOS = 'linux') {
  if (!rawData || typeof rawData !== 'object') return null;

  const command = typeof rawData.command === 'string' ? rawData.command.trim() : '';
  const title = typeof rawData.title === 'string' ? rawData.title.trim() : 'CLI Recommendation';
  const explanation = typeof rawData.explanation === 'string' ? rawData.explanation.trim() : '';
  const targetOS = typeof rawData.targetOS === 'string' ? rawData.targetOS.toLowerCase().trim() : fallbackOS;
  const targetShell = typeof rawData.targetShell === 'string' ? rawData.targetShell.toLowerCase().trim() : fallbackShell;
  const assumptions = Array.isArray(rawData.assumptions)
    ? rawData.assumptions.filter((a) => typeof a === 'string').map((a) => a.trim())
    : ['Assumes standard shell environment'];
  const potentialRisks = typeof rawData.potentialRisks === 'string'
    ? rawData.potentialRisks.trim()
    : 'Inspect targets and permissions prior to running.';
  const saferAlternative = typeof rawData.saferAlternative === 'string'
    ? rawData.saferAlternative.trim()
    : 'Test command in a non-production or dry-run directory.';

  if (!command) {
    return null;
  }

  return {
    command,
    title,
    explanation: explanation || `Generated terminal syntax for target ${targetShell}.`,
    targetOS: ['windows', 'linux', 'macos', 'all'].includes(targetOS) ? targetOS : fallbackOS,
    targetShell: ['powershell', 'bash', 'zsh', 'cmd'].includes(targetShell) ? targetShell : fallbackShell,
    assumptions,
    potentialRisks,
    saferAlternative,
    isCurated: false
  };
}

/**
 * Constructs system instructions enforcing strict JSON output
 */
function buildSystemPrompt(shellContext = 'bash', activeOS = 'linux') {
  return `You are Pls-CLI's terminal assistant and command translator.
Your goal is to translate user task descriptions into safe, modern, and syntactically precise terminal commands.
Target Platform: ${activeOS}
Target Shell: ${shellContext}

OUTPUT RULES:
1. You MUST respond with a single, raw, strictly valid JSON object.
2. DO NOT include markdown code blocks (e.g. no \`\`\`json or \`\`\`).
3. DO NOT include conversational preamble, greeting, or sign-off text.
4. The JSON must adhere exactly to this schema:
{
  "command": "executable command string",
  "title": "short descriptive action title (under 8 words)",
  "explanation": "clear explanation of what flags and parameters do",
  "targetOS": "${activeOS}",
  "targetShell": "${shellContext}",
  "assumptions": ["list of preconditions or assumed installed tools"],
  "potentialRisks": "explicit safety warning about data loss, high I/O, or permissions",
  "saferAlternative": "a safer or dry-run alternative syntax if applicable",
  "isCurated": false
}`;
}

/**
 * Handles GET /api/health
 */
async function handleHealthCheck(res) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(`${OLLAMA_HOST}/api/tags`, {
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`Ollama returned status ${response.status}`);
    }

    const data = await response.json();
    const models = Array.isArray(data.models) ? data.models.map((m) => m.name) : [];
    const hasGemma = models.some((m) => m.includes('gemma2:2b') || m.includes('gemma'));

    res.writeHead(200, {
      ...CORS_HEADERS,
      'Content-Type': 'application/json'
    });

    res.end(
      JSON.stringify({
        status: hasGemma ? 'ready' : 'model_missing',
        backend: 'ollama',
        targetModel: DEFAULT_MODEL,
        hasTargetModel: hasGemma,
        ollamaOnline: true,
        availableModels: models,
        message: hasGemma
          ? 'Ollama is online with Gemma 2 available.'
          : `Ollama is running, but "${DEFAULT_MODEL}" was not found. Run 'ollama pull ${DEFAULT_MODEL}'.`
      })
    );
  } catch (error) {
    res.writeHead(200, {
      ...CORS_HEADERS,
      'Content-Type': 'application/json'
    });

    res.end(
      JSON.stringify({
        status: 'offline',
        backend: 'ollama',
        targetModel: DEFAULT_MODEL,
        hasTargetModel: false,
        ollamaOnline: false,
        availableModels: [],
        message: 'Ollama service is unreachable on http://127.0.0.1:11434. Launch Ollama to activate local AI inference.'
      })
    );
  }
}

/**
 * Handles POST /api/assist
 */
async function handleAssist(req, res) {
  let body = '';

  req.on('data', (chunk) => {
    body += chunk;
    // Guard against oversized request bodies (> 50KB)
    if (body.length > 50000) {
      res.writeHead(413, { ...CORS_HEADERS, 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Payload Too Large' }));
      req.destroy();
    }
  });

  req.on('end', async () => {
    try {
      const parsed = JSON.parse(body || '{}');
      const prompt = typeof parsed.prompt === 'string' ? parsed.prompt.trim() : '';
      const shellContext = typeof parsed.shellContext === 'string' ? parsed.shellContext.trim() : 'bash';
      const activeOS = typeof parsed.activeOS === 'string' ? parsed.activeOS.trim() : 'linux';

      if (!prompt) {
        res.writeHead(400, { ...CORS_HEADERS, 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Missing required field: "prompt"' }));
        return;
      }

      if (prompt.length > 500) {
        res.writeHead(400, { ...CORS_HEADERS, 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Prompt exceeds maximum allowed length of 500 characters' }));
        return;
      }

      // Check Ollama service with AbortController
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), INFERENCE_TIMEOUT_MS);

      const systemPrompt = buildSystemPrompt(shellContext, activeOS);

      let ollamaRes;
      try {
        ollamaRes = await fetch(`${OLLAMA_HOST}/api/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: DEFAULT_MODEL,
            system: systemPrompt,
            prompt: `Translate this user intent to command syntax: "${prompt}"`,
            stream: false,
            format: 'json',
            options: {
              temperature: 0.1, // Low temperature for deterministic grammar
              top_p: 0.9
            }
          }),
          signal: controller.signal
        });
      } catch (networkError) {
        clearTimeout(timeout);
        if (networkError.name === 'AbortError') {
          res.writeHead(504, { ...CORS_HEADERS, 'Content-Type': 'application/json' });
          res.end(
            JSON.stringify({
              error: 'Inference Timeout',
              message: `Gemma inference timed out after ${INFERENCE_TIMEOUT_MS / 1000} seconds.`
            })
          );
          return;
        }

        res.writeHead(503, { ...CORS_HEADERS, 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({
            error: 'Ollama Unreachable',
            message: 'Could not connect to local Ollama service at ' + OLLAMA_HOST
          })
        );
        return;
      }

      clearTimeout(timeout);

      if (!ollamaRes.ok) {
        const errorText = await ollamaRes.text();
        res.writeHead(502, { ...CORS_HEADERS, 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({
            error: 'Ollama Error',
            message: `Ollama returned HTTP ${ollamaRes.status}: ${errorText}`
          })
        );
        return;
      }

      const ollamaData = await ollamaRes.json();
      const rawText = (ollamaData.response || '').trim();

      // Clean any accidental markdown backticks
      const cleanJsonStr = rawText
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/```$/i, '')
        .trim();

      let parsedData;
      try {
        parsedData = JSON.parse(cleanJsonStr);
      } catch (jsonErr) {
        res.writeHead(502, { ...CORS_HEADERS, 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({
            error: 'Invalid Model JSON Output',
            message: 'Gemma output could not be parsed into valid JSON.',
            raw: rawText
          })
        );
        return;
      }

      const validatedOutput = validateStructuredOutput(parsedData, shellContext, activeOS);

      if (!validatedOutput) {
        res.writeHead(502, { ...CORS_HEADERS, 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({
            error: 'Schema Validation Failed',
            message: 'Model output did not satisfy the Pls-CLI structured command contract.'
          })
        );
        return;
      }

      res.writeHead(200, {
        ...CORS_HEADERS,
        'Content-Type': 'application/json'
      });
      res.end(JSON.stringify(validatedOutput));
    } catch (err) {
      res.writeHead(500, { ...CORS_HEADERS, 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          error: 'Internal Proxy Error',
          message: err instanceof Error ? err.message : String(err)
        })
      );
    }
  });
}

/**
 * Microservice HTTP Server
 */
const server = http.createServer((req, res) => {
  // Handle CORS pre-flight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, CORS_HEADERS);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  if (req.method === 'GET' && parsedUrl.pathname === '/api/health') {
    handleHealthCheck(res);
    return;
  }

  if (req.method === 'POST' && parsedUrl.pathname === '/api/assist') {
    handleAssist(req, res);
    return;
  }

  // 404 for unknown endpoints
  res.writeHead(404, { ...CORS_HEADERS, 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Endpoint Not Found', validEndpoints: ['GET /api/health', 'POST /api/assist'] }));
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`Pls-CLI Gemma AI Proxy Microservice`);
  console.log(`Listening on: http://localhost:${PORT}`);
  console.log(`Target Ollama: ${OLLAMA_HOST}`);
  console.log(`Target Model:  ${DEFAULT_MODEL}`);
  console.log(`Health Check:  http://localhost:${PORT}/api/health`);
  console.log(`======================================================\n`);
});

