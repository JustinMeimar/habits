import React, { useState } from 'react';
import "../app/globals.css";
import { useRouter } from 'next/navigation';

const RegisterPage: React.FC = () => {

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [warningMessage, setWarningMessage] = useState<string>("");


    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('http://127.0.0.1:5000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage(data.message);
                router.push("/login");
            } else if (response.status === 409) {
                setWarningMessage(data.message);
            } else {
                setWarningMessage(data.message);
            }


        } catch (error) {
            console.error('There was an error registering:', error);
        }
    };

    
    return (
        <div className="container h-100">
            <div className="row h-60 justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                <div className="col-6">
                    <div className="login-title">Register for Habits.</div>
                    <br></br>
                    {successMessage && <div className="alert alert-success">{successMessage}</div>}
                    {warningMessage && <div className="alert alert-warning">{warningMessage}</div>}
                    <div className="card">
                        <div className="card-body">
                            <form onSubmit={handleRegister}>
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
                                <button type="submit" className="btn btn-primary btn-block">Register</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;