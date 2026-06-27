async function test() {
    try {
        const loginRes = await fetch('http://localhost:2911/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: 'pnminh2911',
                password: 'mhien13245'
            })
        });
        const cookies = loginRes.headers.get('set-cookie');
        
        const statsRes = await fetch('http://localhost:2911/api/statistics/overview?branchId=5', {
            headers: { 'Cookie': cookies }
        });
        const data = await statsRes.json();
        console.log('Stats:', JSON.stringify(data.data, null, 2));
    } catch (e) {
        console.error('Error:', e);
    }
}
test();
