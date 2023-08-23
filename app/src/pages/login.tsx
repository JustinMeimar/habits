import React, { useState } from 'react';
import "@/app/globals.css";
import { useRouter } from 'next/navigation';

const LoginPage: React.FC = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [warningMessage, setWarningMessage] = useState<string>('');

    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('http://127.0.0.1:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();
            if (response.ok) {
              router.push("/home")
            } else {
              setWarningMessage(data.message);
            }
        } catch (error) {
            console.error('There was an error logging in:', error);
        }
    };

  	return (
		<div className="container h-100">
			<div className="row h-60 justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
				<div className="col-6">
				<div className="login-title">Welcome to Habits.</div>
				<br></br>
				{warningMessage && <div className="alert alert-warning">{warningMessage}</div>}
				<div className="card">    
					<div className="card-body">
					<form onSubmit={handleLogin}>
						<div className="mb-3">
						<label htmlFor="username" className="form-label">Username:</label>
						<input type="text" className="form-control" 
								id="username" name="username" required 
								onChange={e => setUsername(e.target.value)}        
						/>
						</div>
						<div className="mb-3">
						<label htmlFor="password" className="form-label">Password:</label>
						<input type="password" className="form-control" 
								id="password" name="password" required  
								onChange={e => setPassword(e.target.value)}        
						/>
						</div>
						<button type="submit" className="btn btn-primary btn-block">Login</button>
					</form>
					</div>
				</div>
				</div>
			</div>
		</div>
	);
};

export default LoginPage;