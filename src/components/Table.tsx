import React, { useEffect, useState } from "react"
import { getProjectDetailsFromApi } from "../api/api"
import "./Table.css"

interface TableProps {}

interface ProjectDetails {
    "s.no": number;
    "amt.pledged": number;
    "blurb": string;
    "by": string;
    "country": string;
    "currency": string;
    "end.time": string;
    "location": string;
    "percentage.funded": number;
    "num.backers": string;
    "state": string;
    "title": string;
    "type": string;
    "url": string;
}

const Table: React.FC<TableProps> = () => {
    const [projectDetails, setProjectDetails] = useState<ProjectDetails[] | []>([])

    useEffect(() => {
        const fetchProjectDetails = async () => {
            try {
                const apiData = await getProjectDetailsFromApi()
                setProjectDetails(apiData)
            } catch (error) {
                console.error("Failed to fetch project details:", error)
            }
        }

        fetchProjectDetails()
    }, [])

    const renderProjectDetails = projectDetails.map(item => {
        return (
            <tr key={item["s.no"]}>
                <td>{item["s.no"]}</td>
                <td>{item["percentage.funded"]}</td>
                <td>{item["amt.pledged"]}</td>
            </tr>
        )
    })

    return (
        <div className="table-container">
            <h2>Project Details</h2>
            <table className="styled-table">
                <thead>
                    <tr>
                        <th>S.No.</th>
                        <th>Percentage funded</th>
                        <th>Amount pledged</th>
                    </tr>
                </thead>
                <tbody>
                    {renderProjectDetails}
                </tbody>
            </table>
        </div>
    )
}

export default Table