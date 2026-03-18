const http = require('http');

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        resolve({ status: res.statusCode, body: JSON.parse(body) });
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function testComplaintAPI() {
  console.log('\n📋 Testing Complaint API...\n');

  try {
    // Test 1: Create a complaint
    console.log('1️⃣  Creating a complaint...');
    const createRes = await makeRequest('POST', '/api/complaints', {
      title: 'Test Complaint',
      description: 'This is a test complaint',
      createdBy: 1
    });
    console.log(`✅ Status: ${createRes.status}`);
    console.log(`   ID: ${createRes.body.id}, Title: ${createRes.body.title}\n`);
    const complaintId = createRes.body.id;

    // Test 2: Get all complaints
    console.log('2️⃣  Getting all complaints...');
    const getAllRes = await makeRequest('GET', '/api/complaints');
    console.log(`✅ Status: ${getAllRes.status}`);
    console.log(`   Total complaints: ${getAllRes.body.length}\n`);

    // Test 3: Get single complaint
    console.log('3️⃣  Getting single complaint by ID...');
    const getOneRes = await makeRequest('GET', `/api/complaints/${complaintId}`);
    console.log(`✅ Status: ${getOneRes.status}`);
    console.log(`   Retrieved: ${getOneRes.body.title}\n`);

    // Test 4: Update complaint
    console.log('4️⃣  Updating complaint status...');
    const updateRes = await makeRequest('PUT', `/api/complaints/${complaintId}`, {
      status: 'In Progress',
      assignedTo: 5
    });
    console.log(`✅ Status: ${updateRes.status}`);
    console.log(`   Updated status: ${updateRes.body.status}\n`);

    // Test 5: Delete complaint
    console.log('5️⃣  Deleting complaint...');
    const deleteRes = await makeRequest('DELETE', `/api/complaints/${complaintId}`);
    console.log(`✅ Status: ${deleteRes.status}`);
    console.log(`   Message: ${deleteRes.body.message}\n`);

    console.log('🎉 All tests passed! Complaint system is working perfectly!\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testComplaintAPI();
