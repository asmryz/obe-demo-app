import React from 'react'
import { useStore } from '../store';
import Table from './Table';
import RecapSheet from './RecapSheet';

function Dashboard() {
    const { signedIn } = useStore();
    return (
        <>
            <h2>Dashboard</h2>
            {/* <Link to="/posts">Posts (private)</Link> ( */}
            {signedIn ? "accessible" : "not accessible"}
            <RecapSheet />
        </>
    );
}

export default Dashboard