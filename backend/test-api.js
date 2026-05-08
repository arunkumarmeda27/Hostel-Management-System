async function test() {
    try {
        // 1. Login
        const loginRes = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'admin', password: 'admin123' })
        });
        const loginData = await loginRes.json();
        const token = loginData.token;
        console.log("Logged in successfully. Token length:", token.length);

        // 2. GET Students
        const getRes = await fetch('http://localhost:5000/api/students', {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("GET /api/students status:", getRes.status);
        if (getRes.status === 200) {
            const data = await getRes.json();
            console.log("GET success! Count:", data.length);
        } else {
            console.log("GET fail data:", await getRes.text());
        }

        // 3. POST Student
        const postRes = await fetch('http://localhost:5000/api/students', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}` 
            },
            body: JSON.stringify({
                FullName: "Test Student",
                Department: "CS",
                Year: "1",
                PhoneNumber: "1234567890",
                Email: "test" + Date.now() + "@example.com",
                Address: "Test Addr",
                ParentContact: "0987654321",
                RoomID: null
            })
        });
        console.log("POST /api/students status:", postRes.status);
        if (postRes.status === 201) {
            console.log("POST success!", await postRes.json());
        } else {
            console.log("POST fail data:", await postRes.text());
        }

    } catch (error) {
        console.error("Test failed:", error);
    }
}
test();
