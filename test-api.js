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
        console.log('Cookies:', cookies);
        
        const statsRes = await fetch('http://localhost:2911/api/statistics/overview', {
            headers: { 'Cookie': cookies }
        });
        const statsData = await statsRes.json();
        console.log('Stats:', JSON.stringify(statsData, null, 2));
    } catch (e) {
        console.error('Error:', e);
    }
}

test();
