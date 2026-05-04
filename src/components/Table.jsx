const rows = [
    { id: 1, name: 'John Doe', occupation: 'Software Engineer', company: 'ABC Technologies', location: 'United States', lastActive: '2022-03-10' },
    { id: 2, name: 'Jane Smith', occupation: 'Data Analyst', company: 'XYZ Corporation', location: 'Canada', lastActive: '2022-03-09' },
    { id: 3, name: 'Michael Johnson', occupation: 'Marketing Manager', company: 'Global Marketing Inc.', location: 'United Kingdom', lastActive: '2022-03-08' },
    { id: 4, name: 'Emily Brown', occupation: 'Graphic Designer', company: 'Creative Solutions Ltd.', location: 'Australia', lastActive: '2022-03-07' },
    { id: 5, name: 'David Wilson', occupation: 'Financial Analyst', company: 'FinanceX', location: 'Germany', lastActive: '2022-03-06' },
    { id: 6, name: 'Alice Johnson', occupation: 'Project Manager', company: 'Project Solutions LLC', location: 'France', lastActive: '2022-03-05' },
    { id: 7, name: 'Robert Lee', occupation: 'Software Developer', company: 'Tech Innovations', location: 'China', lastActive: '2022-03-04' },
    { id: 8, name: 'Sarah Adams', occupation: 'Human Resources Manager', company: 'HR Solutions Ltd.', location: 'Spain', lastActive: '2022-03-03' },
    { id: 9, name: 'James Wilson', occupation: 'Business Analyst', company: 'Global Enterprises', location: 'United States', lastActive: '2022-03-02' },
    { id: 10, name: 'Mary Brown', occupation: 'Marketing Coordinator', company: 'Marketing Solutions Inc.', location: 'Canada', lastActive: '2022-03-01' },
    { id: 11, name: 'Chris Evans', occupation: 'DevOps Engineer', company: 'CloudBase Systems', location: 'United States', lastActive: '2022-02-28' },
    { id: 12, name: 'Laura Martinez', occupation: 'UX Designer', company: 'Design Studio Co.', location: 'Canada', lastActive: '2022-02-27' },
    { id: 13, name: 'Kevin Park', occupation: 'Backend Developer', company: 'ServerLogic Inc.', location: 'South Korea', lastActive: '2022-02-26' },
    { id: 14, name: 'Sophia Turner', occupation: 'Content Strategist', company: 'MediaWave Ltd.', location: 'United Kingdom', lastActive: '2022-02-25' },
    { id: 15, name: 'Daniel Garcia', occupation: 'Data Scientist', company: 'Insight Analytics', location: 'United States', lastActive: '2022-02-24' },
    { id: 16, name: 'Olivia White', occupation: 'Product Manager', company: 'ProductForge LLC', location: 'Canada', lastActive: '2022-02-23' },
    { id: 17, name: 'Ethan Clark', occupation: 'Security Analyst', company: 'CyberShield Corp.', location: 'Australia', lastActive: '2022-02-22' },
    { id: 18, name: 'Mia Robinson', occupation: 'Frontend Developer', company: 'PixelCraft Studio', location: 'France', lastActive: '2022-02-21' },
    { id: 19, name: 'Liam Harris', occupation: 'Systems Architect', company: 'Nexus IT Solutions', location: 'United States', lastActive: '2022-02-20' },
    { id: 20, name: 'Emma Thompson', occupation: 'QA Engineer', company: 'TestPro Labs', location: 'Canada', lastActive: '2022-02-19' },
]

export default function Table() {
    return (
        <div className="bg-base-200/20 border-neutral/10 rounded-box not-prose flex w-full flex-[1_0_0] flex-wrap gap-3 border p-3 sm:p-6">
            <table className="table-xs table scroll-tbody w-full">
                <caption className="text-base-content text-left text-lg font-semibold rtl:text-right">
                    Users Info
                    <p className="text-base-content/80 mt-1 text-sm font-normal">
                        Browse a list of user information such as name, email, status, date & more.
                    </p>
                </caption>
                <thead>
                    <tr>
                        <th className="w-10">#</th>
                        <th>Name</th>
                        <th className="w-48">Occupation</th>
                        <th>Company</th>
                        <th>Location</th>
                        <th>Last Active</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map(row => (
                        <tr key={row.id}>
                            <th className="w-10">{row.id}</th>
                            <td>{row.name}</td>
                            <td className="w-48">{row.occupation}</td>
                            <td>{row.company}</td>
                            <td className={row.location === 'Canada' ? 'text-red-500' : row.location === 'United States' ? 'text-green-500' : ''}>{row.location}</td>
                            <td>{row.lastActive}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
