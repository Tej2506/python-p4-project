import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Link } from 'react-router-dom';


function Dashboard() {
    const { user_id } = useParams();
    const [username, setUsername] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isEditingUsername, setIsEditingUsername] = useState(false);
    const [isEditingPassword, setIsEditingPassword] = useState(false);
    const history = useHistory();

    useEffect(() => {
        fetch(`http://127.0.0.1:5000/user/dashboard`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        })
        .then((response) => {
            if (response.ok) {
            return response.json();
            } else {
            throw new Error("Failed to fetch user details");
            }
        })
        .then((data) => setUsername(data.username))
        .catch((error) => setMessage(error.message));
    }, []);

    function handleSaveUsername() {
        fetch(`http://127.0.0.1:5000/user/dashboard`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
        credentials: "include",
        })
        .then((response) => response.json())
        .then((data) => setMessage(data.message))
        .catch(() => setMessage("Failed to update username"));
        setIsEditingUsername(false);
    }

    function handleSavePassword() {
        fetch(`http://127.0.0.1:5000/user/dashboard`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            current_password: currentPassword,
            new_password: newPassword,
        }),
        credentials: "include",
        })
        .then((response) => response.json())
        .then((data) => setMessage(data.message))
        .catch(() => setMessage("Failed to update password"));
        setIsEditingPassword(false);
    }

    function handleDeleteAccount() {
        fetch(`http://127.0.0.1:5000/user/dashboard`, {
        method: "DELETE",
        credentials: "include",
        })
        .then((response) => {
            if (response.ok) {
            history.push("/");
            } else {
            throw new Error("Failed to delete account");
            }
        })
        .catch((error) => setMessage(error.message));
    }

    function clearMeassage(){
        setMessage('')
    }


    return (
        <div className="dashboard-page" onMouseMove={clearMeassage}>
            <div className="dashboard-container">
            <h1>Dashboard</h1>
            <div className="dashboard-section">
            <Link to ={`/userprofile/${user_id}`} className="hero-button">Back to Profile</Link>
                <h2>Username</h2>
                {isEditingUsername ? (
                <div>
                    <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="New Username"
                    />
                    <button onClick={handleSaveUsername}>Save</button>
                    <button onClick={() => setIsEditingUsername(false)}>Cancel</button>
                </div>
                ) : (
                <div>
                    <p>{username}</p>
                    <button onClick={() => setIsEditingUsername(true)}>Edit</button>
                </div>
                )}
            </div>
            <div className="dashboard-section">
                <h2>Change Password</h2>
                {isEditingPassword ? (
                <div>
                    <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Current Password"
                    />
                    <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New Password"
                    />
                    <button onClick={handleSavePassword}>Save</button>
                    <button onClick={() => setIsEditingPassword(false)}>Cancel</button>
                </div>
                ) : (
                <button onClick={() => setIsEditingPassword(true)}>Change Password</button>
                )}
            </div>
            <div className="dashboard-section">
                <h2>Delete Account</h2>
                <button onClick={handleDeleteAccount} className="delete-button">
                Delete Account
                </button>
            </div>
            <div className="dashboard-footer">
            </div>
            {message && <p className="message">{message}</p>}
            </div>
        </div>
    );
}

export default Dashboard;
