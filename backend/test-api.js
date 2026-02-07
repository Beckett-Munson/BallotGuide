#!/usr/bin/env node

const http = require('http');

const API_BASE = 'http://localhost:3002';

function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, API_BASE);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(data);
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }

    req.end();
  });
}

async function runTests() {
  console.log('🧪 Testing Ballot Annotator API\n');

  try {
    // Test 1: Health check
    console.log('1️⃣  Testing health endpoint...');
    const health = await makeRequest('GET', '/api/health');
    console.log('✅ Server is healthy:', health.status);
    console.log('   Services:', health.services);
    console.log();

    // Test 2: List policies
    console.log('2️⃣  Testing list policies...');
    const policies = await makeRequest('GET', '/api/policies');
    console.log(`✅ Found ${policies.policies.length} policies`);
    policies.policies.forEach(p => {
      console.log(`   - ${p.id}: ${p.title}`);
    });
    console.log();

    if (policies.policies.length === 0) {
      console.log('⚠️  No policies found. Run: npm run ingest data/seed_policies.json');
      return;
    }

    // Test 3: Generate annotation
    console.log('3️⃣  Testing annotation generation...');
    const policyId = policies.policies[0].id;
    const annotationResult = await makeRequest('POST', '/api/annotate', {
      policyId,
      demographics: {
        age: 28,
        occupation: 'teacher',
        income: 'moderate',
        zipCode: '94110',
      },
    });

    if (annotationResult.error) {
      console.log('❌ Annotation failed:', annotationResult.error);
    } else {
      console.log('✅ Annotation generated in', annotationResult.processingTimeMs, 'ms');
      console.log('   Tags:', annotationResult.annotation.tags.join(', '));
      console.log('   How this affects user:', annotationResult.annotation.howThisAffectsUser.substring(0, 80) + '...');
      console.log('   Links:', annotationResult.annotation.links.length);
    }
    console.log();

    // Test 4: Chat
    console.log('4️⃣  Testing chat endpoint...');
    const chatResult = await makeRequest('POST', '/api/chat', {
      policyId,
      messages: [
        { role: 'user', content: 'Can you explain this in simple terms?' },
      ],
    });

    if (chatResult.error) {
      console.log('❌ Chat failed:', chatResult.error);
    } else {
      console.log('✅ Chat response generated in', chatResult.processingTimeMs, 'ms');
      console.log('   Response:', chatResult.message.substring(0, 100) + '...');
      console.log('   Context sources:', chatResult.context.length);
    }
    console.log();

    // Test 5: Search
    console.log('5️⃣  Testing search endpoint...');
    const searchResult = await makeRequest('GET', '/api/policies/search?q=housing');
    console.log(`✅ Found ${searchResult.policies.length} policies matching "housing"`);
    console.log();

    console.log('🎉 All tests passed!\n');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\nMake sure the server is running: npm run dev');
    process.exit(1);
  }
}

runTests();
